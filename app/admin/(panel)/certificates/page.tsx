import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { formatBand, bandLevel } from "@/lib/band";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader, Table, inputCls } from "@/components/admin/ui";
import { deleteCertificate } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Sertifikatlar" };

export default async function CertificatesPage({ searchParams }: PageProps<"/admin/certificates">) {
  const { q, course } = await searchParams;
  const term = typeof q === "string" ? q.trim() : "";
  const courseId = typeof course === "string" ? course : "";
  const [certs, courses] = await Promise.all([
    db.certificate.findMany({
      where: {
        ...(term ? { OR: [{ number: { contains: term.toUpperCase() } }, { fullName: { contains: term } }] } : {}),
        ...(courseId ? { courseId } : {}),
      },
      orderBy: { issuedAt: "desc" },
      take: 500,
      include: { course: true, user: true },
    }),
    db.course.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);

  return (
    <>
      <PageHeader title="Sertifikatlar" subtitle={`Jami: ${certs.length} ta`} />
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={term} placeholder="Raqam yoki F.I.Sh." className={`${inputCls} max-w-xs`} />
        <select name="course" defaultValue={courseId} className={`${inputCls} max-w-xs`}>
          <option value="">Barcha kurslar</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button className="rounded-xl bg-slate-900 px-4 text-sm font-medium text-white">Qidirish</button>
      </form>
      <Table head={["Raqam", "F.I.Sh.", "Kurs", "Ball", "Daraja", "Sana", ""]} empty={certs.length === 0}>
        {certs.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50">
            <td className="whitespace-nowrap px-4 py-3">
              <a href={`/certificates/${c.number}`} target="_blank" className="font-mono text-xs text-brand-600 hover:underline">{c.number}</a>
            </td>
            <td className="px-4 py-3">
              <Link href={`/admin/users/${c.userId}`} className="hover:text-brand-600">{c.fullName}</Link>
            </td>
            <td className="px-4 py-3 text-slate-500">{c.course.title}</td>
            <td className="px-4 py-3 font-bold">{formatBand(c.band)}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{bandLevel(c.band)} · {c.percent}%</td>
            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{formatDate(c.issuedAt)}</td>
            <td className="px-4 py-3 text-right">
              <form action={deleteCertificate}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton message={`${c.number} sertifikatini bekor qilasizmi? Tekshirish sahifasida «topilmadi» chiqadi.`} className="text-xs text-red-500 hover:underline">
                  bekor qilish
                </ConfirmButton>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
