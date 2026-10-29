import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, REGIONS } from "@/lib/format";
import { PageHeader, Table, inputCls } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Foydalanuvchilar" };

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const { q, region } = await searchParams;
  const term = typeof q === "string" ? q.trim() : "";
  const reg = typeof region === "string" ? region : "";

  const where = {
    ...(term
      ? {
          OR: [
            { fullName: { contains: term, mode: "insensitive" as const } },
            { firstName: { contains: term, mode: "insensitive" as const } },
            { phone: { contains: term } },
            { username: { contains: term, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(reg ? { region: reg } : {}),
  };
  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { _count: { select: { enrollments: true, certificates: true } } },
    }),
    db.user.count({ where }),
  ]);

  return (
    <>
      <PageHeader title="Foydalanuvchilar" subtitle={`Topildi: ${total} ta${total > 300 ? " (oxirgi 300 tasi ko'rsatilgan)" : ""}`} />
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={term} placeholder="Ism, telefon yoki @username" className={`${inputCls} max-w-xs`} />
        <select name="region" defaultValue={reg} className={`${inputCls} max-w-xs`}>
          <option value="">Barcha hududlar</option>
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button className="rounded-xl bg-slate-900 px-4 text-sm font-medium text-white">Qidirish</button>
      </form>
      <Table head={["F.I.Sh.", "Telefon", "Telegram", "Hudud", "Kurslar", "Sertifikat", "Ro'yxatdan o'tgan"]} empty={users.length === 0}>
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50">
            <td className="px-4 py-3">
              <Link href={`/admin/users/${u.id}`} className="font-medium hover:text-brand-600">{u.fullName || u.firstName}</Link>
            </td>
            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{u.phone ?? "—"}</td>
            <td className="px-4 py-3 text-slate-500">{u.username ? `@${u.username}` : "—"}</td>
            <td className="px-4 py-3 text-slate-500">{u.region ?? "—"}</td>
            <td className="px-4 py-3">{u._count.enrollments}</td>
            <td className="px-4 py-3">{u._count.certificates}</td>
            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{formatDate(u.createdAt)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
