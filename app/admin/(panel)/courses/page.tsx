import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { priceLabel } from "@/lib/format";
import { Badge, PageHeader, Table } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Kurslar" };

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: { select: { _count: { select: { lessons: true } } } },
      _count: { select: { enrollments: true, certificates: true, examQuestions: true } },
    },
  });

  return (
    <>
      <PageHeader
        title="Kurslar"
        subtitle={`Jami: ${courses.length} ta`}
        action={
          <Link href="/admin/courses/new" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            + Yangi kurs
          </Link>
        }
      />
      <Table head={["Nom", "Narx", "Darslar", "Imtihon", "O'quvchilar", "Sertifikat", "Holat", ""]} empty={courses.length === 0}>
        {courses.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50">
            <td className="px-4 py-3">
              <p className="font-medium">{c.emoji} {c.title}</p>
              <p className="text-xs text-slate-400">/courses/{c.slug}</p>
            </td>
            <td className="whitespace-nowrap px-4 py-3">{priceLabel(c.price)}</td>
            <td className="px-4 py-3">{c.modules.reduce((s, m) => s + m._count.lessons, 0)}</td>
            <td className="px-4 py-3">{c._count.examQuestions}</td>
            <td className="px-4 py-3">{c._count.enrollments}</td>
            <td className="px-4 py-3">{c._count.certificates}</td>
            <td className="px-4 py-3">
              <Badge tone={c.status === "PUBLISHED" ? "green" : "amber"}>{c.status === "PUBLISHED" ? "Nashr etilgan" : "Qoralama"}</Badge>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              <Link href={`/admin/courses/${c.id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-100">✏️ Tahrirlash</Link>
              <Link href={`/admin/courses/${c.id}/lessons`} className="ml-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-100">📚 Darslar</Link>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
