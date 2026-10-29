import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatBand } from "@/lib/band";
import { formatDate } from "@/lib/format";
import { logout } from "@/app/actions";

export const metadata: Metadata = { title: "Shaxsiy kabinet" };

export default async function Dashboard() {
  const user = await requireUser("/dashboard");
  const [enrollments, certificates, done] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { course: { include: { modules: { include: { _count: { select: { lessons: true } } } } } } },
    }),
    db.certificate.findMany({ where: { userId: user.id }, include: { course: true }, orderBy: { issuedAt: "desc" } }),
    db.lessonProgress.findMany({ where: { userId: user.id }, select: { lesson: { select: { module: { select: { courseId: true } } } } } }),
  ]);
  const doneByCourse = new Map<string, number>();
  for (const d of done) {
    const id = d.lesson.module.courseId;
    doneByCourse.set(id, (doneByCourse.get(id) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/60">Xush kelibsiz,</p>
          <h1 className="font-serif text-3xl font-bold text-brand-900">{user.fullName || user.firstName}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/profile" className="rounded-full border border-brand-200 bg-white px-5 py-2 text-sm font-bold hover:bg-brand-50">
            Profil
          </Link>
          <form action={logout}>
            <button className="rounded-full px-5 py-2 text-sm font-bold text-ink/60 hover:bg-brand-50">Chiqish</button>
          </form>
        </div>
      </div>

      {!user.fullName && (
        <Link href="/dashboard/profile" className="mt-6 block rounded-2xl bg-gold-50 p-4 text-sm font-bold text-gold-700 hover:bg-gold-100">
          ✍️ Sertifikat olish uchun profilingizda to&apos;liq F.I.Sh.ni kiriting →
        </Link>
      )}

      <h2 className="mt-10 font-serif text-2xl font-bold">Mening kurslarim</h2>
      {enrollments.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-brand-200 p-10 text-center">
          <p className="text-ink/70">Hali birorta kursga yozilmagansiz.</p>
          <Link href="/courses" className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white">
            Kurs tanlash
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {enrollments.map((e) => {
            const total = e.course.modules.reduce((s, m) => s + m._count.lessons, 0);
            const d = doneByCourse.get(e.courseId) ?? 0;
            const pct = total ? Math.round((d / total) * 100) : 0;
            return (
              <Link key={e.id} href={`/learn/${e.course.slug}`} className="flex gap-4 rounded-3xl border border-brand-100 bg-white p-5 hover:shadow-md">
                <span className="text-4xl">{e.course.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold">{e.course.title}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-50">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink/60">
                    {e.status === "COMPLETED" ? "🎓 Tamomlangan" : `${d} / ${total} dars · ${pct}%`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <h2 className="mt-10 font-serif text-2xl font-bold">Sertifikatlarim</h2>
      {certificates.length === 0 ? (
        <p className="mt-3 text-ink/60">Kursni tamomlab, yakuniy imtihondan o&apos;tganingizda sertifikat shu yerda paydo bo&apos;ladi.</p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {certificates.map((c) => (
            <Link key={c.id} href={`/certificates/${c.number}`} className="rounded-3xl border-2 border-gold-300 bg-white p-5 hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{c.number}</p>
              <p className="mt-1 font-bold">{c.course.title}</p>
              <p className="mt-2 font-serif text-3xl font-bold text-gold-700">{formatBand(c.band)}</p>
              <p className="text-xs text-ink/60">{formatDate(c.issuedAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
