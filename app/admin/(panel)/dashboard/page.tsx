import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatSum, formatDate } from "@/lib/format";
import { formatBand } from "@/lib/band";
import { Badge, Card, PageHeader, PAYMENT_STATUS } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Dashboard" };

const DAYS = 14;

export default async function DashboardPage() {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (DAYS - 1));

  const [students, courses, published, enrollments, paid, certs, newUsers, recentPayments, recentCerts, topCourses] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.course.count({ where: { status: "PUBLISHED" } }),
    db.enrollment.count(),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: true }),
    db.certificate.count(),
    db.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.payment.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: true, course: true } }),
    db.certificate.findMany({ take: 6, orderBy: { issuedAt: "desc" }, include: { course: true } }),
    db.course.findMany({
      orderBy: { enrollments: { _count: "desc" } },
      take: 5,
      include: { _count: { select: { enrollments: true, certificates: true } } },
    }),
  ]);

  // so'nggi 14 kunlik ro'yxatdan o'tishlar
  const perDay = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    return { d, n: 0 };
  });
  for (const u of newUsers) {
    const idx = Math.floor((u.createdAt.getTime() - since.getTime()) / 86_400_000);
    if (perDay[idx]) perDay[idx].n++;
  }
  const maxDay = Math.max(1, ...perDay.map((p) => p.n));

  const stats = [
    { label: "Foydalanuvchilar", value: students, icon: "👥" },
    { label: "Kurslar", value: `${published} / ${courses}`, icon: "📚", hint: "nashr etilgan / jami" },
    { label: "Kursga yozilishlar", value: enrollments, icon: "📝" },
    { label: "To'lovlar", value: paid._count, icon: "💳" },
    { label: "Sertifikatlar", value: certs, icon: "🏆" },
    { label: "Jami daromad", value: formatSum(paid._sum.amount ?? 0), icon: "💰" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Platformaning umumiy holati" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="!p-4">
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{s.icon}</span> {s.label}
            </p>
            <p className="mt-2 text-xl font-bold">{s.value}</p>
            {s.hint && <p className="text-[11px] text-slate-400">{s.hint}</p>}
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="font-semibold">Yangi foydalanuvchilar — so&apos;nggi {DAYS} kun</p>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {perDay.map((p) => (
              <div key={p.d.toISOString()} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100">{p.n}</span>
                <div className="w-full rounded-t-md bg-brand-500/80 transition group-hover:bg-brand-600" style={{ height: `${(p.n / maxDay) * 100}%`, minHeight: p.n ? 4 : 2 }} />
                <span className="text-[10px] text-slate-400">{p.d.getDate()}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="font-semibold">Eng ommabop kurslar</p>
          <ul className="mt-4 space-y-3 text-sm">
            {topCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3">
                <Link href={`/admin/courses/${c.id}`} className="truncate hover:text-brand-600">{c.title}</Link>
                <span className="shrink-0 text-xs text-slate-500">
                  {c._count.enrollments} o&apos;quvchi · {c._count.certificates} sert.
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-semibold">So&apos;nggi to&apos;lovlar</p>
            <Link href="/admin/payments" className="text-sm text-brand-600 hover:underline">Barchasi →</Link>
          </div>
          <table className="mt-3 w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {recentPayments.map((p) => (
                <tr key={p.id}>
                  <td className="py-2">{p.user.fullName || p.user.firstName}</td>
                  <td className="py-2 text-slate-500">{p.course.title}</td>
                  <td className="py-2 text-right">{formatSum(p.amount)}</td>
                  <td className="py-2 pl-2 text-right"><Badge tone={PAYMENT_STATUS[p.status]?.tone}>{PAYMENT_STATUS[p.status]?.label ?? p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentPayments.length === 0 && <p className="py-4 text-center text-sm text-slate-400">Hali to&apos;lov yo&apos;q</p>}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-semibold">So&apos;nggi sertifikatlar</p>
            <Link href="/admin/certificates" className="text-sm text-brand-600 hover:underline">Barchasi →</Link>
          </div>
          <table className="mt-3 w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {recentCerts.map((c) => (
                <tr key={c.id}>
                  <td className="py-2">{c.fullName}</td>
                  <td className="py-2 text-slate-500">{c.course.title}</td>
                  <td className="py-2 font-semibold">{formatBand(c.band)}</td>
                  <td className="py-2 text-right text-xs text-slate-400">{formatDate(c.issuedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentCerts.length === 0 && <p className="py-4 text-center text-sm text-slate-400">Hali sertifikat yo&apos;q</p>}
        </Card>
      </div>
    </>
  );
}
