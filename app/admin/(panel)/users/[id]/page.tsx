import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, formatSum } from "@/lib/format";
import { formatBand } from "@/lib/band";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, PageHeader, PAYMENT_STATUS, inputCls } from "@/components/admin/ui";
import { grantEnrollment, revokeEnrollment } from "@/app/admin/actions";

export const metadata = { title: "Foydalanuvchi" };

export default async function UserPage({ params }: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    include: {
      enrollments: { include: { course: { include: { modules: { select: { _count: { select: { lessons: true } } } } } } }, orderBy: { createdAt: "desc" } },
      certificates: { include: { course: true } },
      payments: { include: { course: true }, orderBy: { createdAt: "desc" } },
      examAttempts: { where: { finishedAt: { not: null } }, include: { course: true }, orderBy: { startedAt: "desc" }, take: 10 },
      progress: { select: { lesson: { select: { module: { select: { courseId: true } } } } } },
    },
  });
  if (!user) notFound();

  const courses = await db.course.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } });
  const enrolledIds = new Set(user.enrollments.map((e) => e.courseId));
  const doneBy = new Map<string, number>();
  for (const p of user.progress) doneBy.set(p.lesson.module.courseId, (doneBy.get(p.lesson.module.courseId) ?? 0) + 1);

  const info = [
    ["Telefon", user.phone ?? "—"],
    ["Telegram", user.username ? `@${user.username}` : user.telegramId?.startsWith("dev-") ? "test foydalanuvchi" : user.telegramId ?? "—"],
    ["Hudud", user.region ?? "—"],
    ["Tug'ilgan yil", user.birthYear ?? "—"],
    ["Ro'yxatdan o'tgan", formatDate(user.createdAt)],
  ];

  return (
    <>
      <PageHeader title={user.fullName || user.firstName} subtitle={user.fullName ? user.firstName : "F.I.Sh. kiritilmagan"} back={{ href: "/admin/users", label: "Foydalanuvchilar" }} />
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <dl className="space-y-3 text-sm">
            {info.map(([k, v]) => (
              <div key={String(k)} className="flex justify-between gap-4">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="font-semibold">Kurslari</p>
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {user.enrollments.map((e) => {
                const total = e.course.modules.reduce((s, m) => s + m._count.lessons, 0);
                const done = doneBy.get(e.courseId) ?? 0;
                return (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5">
                    <span className="flex-1 font-medium">{e.course.title}</span>
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-brand-500" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-16 text-xs text-slate-500">{done}/{total} dars</span>
                    <Badge tone={e.status === "COMPLETED" ? "green" : "blue"}>{e.status === "COMPLETED" ? "Tamomlagan" : "O'qimoqda"}</Badge>
                    <form action={revokeEnrollment}>
                      <input type="hidden" name="id" value={e.id} />
                      <ConfirmButton message="Kursdan chiqarasizmi? Progress saqlanib qoladi." className="text-xs text-red-500 hover:underline">chiqarish</ConfirmButton>
                    </form>
                  </li>
                );
              })}
            </ul>
            {user.enrollments.length === 0 && <p className="py-3 text-sm text-slate-400">Hech qaysi kursga yozilmagan</p>}
            <form action={grantEnrollment} className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
              <input type="hidden" name="userId" value={user.id} />
              <select name="courseId" required className={inputCls}>
                {courses.filter((c) => !enrolledIds.has(c.id)).map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <button className="shrink-0 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">+ Kursni ochib berish</button>
            </form>
            <p className="mt-2 text-xs text-slate-400">To&apos;lovsiz qo&apos;lda ochish (masalan, naqd to&apos;lov yoki grant).</p>
          </Card>

          <Card>
            <p className="font-semibold">Sertifikatlar va imtihonlar</p>
            <ul className="mt-3 space-y-1 text-sm">
              {user.certificates.map((c) => (
                <li key={c.id}>
                  🏆 <a href={`/certificates/${c.number}`} target="_blank" className="font-mono text-brand-600 hover:underline">{c.number}</a> — {c.course.title}, <b>{formatBand(c.band)}</b>
                </li>
              ))}
              {user.examAttempts.map((a) => (
                <li key={a.id} className="text-slate-500">
                  📝 {formatDate(a.startedAt)} — {a.course.title}: {formatBand(a.band ?? 0)} ({a.correct}/{a.total}) {a.passed ? "✓" : "✗"}
                </li>
              ))}
            </ul>
            {user.certificates.length + user.examAttempts.length === 0 && <p className="py-2 text-sm text-slate-400">Hali yo&apos;q</p>}
          </Card>

          <Card>
            <p className="font-semibold">To&apos;lovlari</p>
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {user.payments.map((p) => (
                <li key={p.id} className="flex justify-between gap-3 py-2">
                  <span>{p.course.title}</span>
                  <span className="flex items-center gap-2">
                    {formatSum(p.amount)} <Badge tone={PAYMENT_STATUS[p.status]?.tone}>{PAYMENT_STATUS[p.status]?.label ?? p.status}</Badge>
                  </span>
                </li>
              ))}
            </ul>
            {user.payments.length === 0 && <p className="py-2 text-sm text-slate-400">To&apos;lov yo&apos;q</p>}
            <Link href="/admin/payments" className="mt-2 inline-block text-xs text-brand-600 hover:underline">Barcha to&apos;lovlar →</Link>
          </Card>
        </div>
      </div>
    </>
  );
}
