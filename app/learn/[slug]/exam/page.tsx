import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getCourseWithLessons, flatLessons, getProgress, EXAM_ATTEMPTS_PER_DAY } from "@/lib/learning";
import { formatBand } from "@/lib/band";
import { formatDate } from "@/lib/format";
import { startExam } from "@/app/actions";

export default async function ExamIntro({ params, searchParams }: PageProps<"/learn/[slug]/exam">) {
  const { slug } = await params;
  const { limit } = await searchParams;
  const user = await requireUser(`/learn/${slug}/exam`);
  const course = await getCourseWithLessons(slug);
  if (!course) notFound();
  const { enrollment, doneIds, certificate } = await getProgress(user.id, course.id);
  if (!enrollment) redirect(`/courses/${slug}`);

  const lessons = flatLessons(course);
  const remaining = lessons.filter((l) => !doneIds.has(l.id));
  const attempts = await db.examAttempt.findMany({
    where: { userId: user.id, courseId: course.id, finishedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    take: 10,
  });
  const needsName = !user.fullName;
  const questionCount = Math.min(course.examSize, course._count.examQuestions);

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold text-brand-900">📝 Yakuniy imtihon</h1>
      <p className="mt-2 text-ink/70">«{course.title}» kursi bo&apos;yicha bilimingizni tekshiring.</p>

      {certificate && (
        <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
          <p className="font-bold text-emerald-800">
            🎓 Siz bu kursni {formatBand(certificate.band)} ball bilan tamomlagansiz.
          </p>
          <Link href={`/certificates/${certificate.number}`} className="mt-2 inline-block font-bold text-emerald-700 underline">
            Sertifikatni ko&apos;rish →
          </Link>
          <p className="mt-2 text-sm text-emerald-800/70">Natijani yaxshilash uchun qayta topshirishingiz mumkin.</p>
        </div>
      )}

      <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
        <li className="rounded-2xl bg-brand-50 p-4"><b className="block text-2xl">{questionCount}</b>ta savol</li>
        <li className="rounded-2xl bg-brand-50 p-4"><b className="block text-2xl">{formatBand(course.passingBand)}</b>o&apos;tish bali (9 dan)</li>
        <li className="rounded-2xl bg-brand-50 p-4"><b className="block text-2xl">{EXAM_ATTEMPTS_PER_DAY}</b>ta urinish / sutka</li>
      </ul>

      {remaining.length > 0 ? (
        <div className="mt-8 rounded-2xl bg-gold-50 p-5">
          <p className="font-bold text-gold-700">Imtihon barcha darslar tugatilgandan so&apos;ng ochiladi.</p>
          <p className="mt-1 text-sm">Qolgan darslar: {remaining.length} ta.</p>
          <Link href={`/learn/${slug}/${remaining[0].id}`} className="mt-3 inline-block rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white">
            Davom etish
          </Link>
        </div>
      ) : questionCount === 0 ? (
        <p className="mt-8 rounded-2xl bg-gold-50 p-5 font-bold text-gold-700">Imtihon savollari tayyorlanmoqda.</p>
      ) : needsName ? (
        <div className="mt-8 rounded-2xl bg-gold-50 p-5">
          <p className="font-bold text-gold-700">Sertifikatga yoziladigan F.I.Sh.ni kiriting</p>
          <p className="mt-1 text-sm">Imtihondan oldin profilingizda to&apos;liq ism-familiyangizni to&apos;ldiring.</p>
          <Link
            href={`/dashboard/profile?next=${encodeURIComponent(`/learn/${slug}/exam`)}`}
            className="mt-3 inline-block rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white"
          >
            Profilni to&apos;ldirish
          </Link>
        </div>
      ) : (
        <form action={startExam} className="mt-8">
          <input type="hidden" name="courseId" value={course.id} />
          {limit && (
            <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
              Sutkalik urinishlar tugadi. Ertaga qayta urinib ko&apos;ring.
            </p>
          )}
          <p className="mb-4 text-sm text-ink/70">
            Sertifikatda yoziladi: <b>{user.fullName}</b>{" "}
            <Link href={`/dashboard/profile?next=${encodeURIComponent(`/learn/${slug}/exam`)}`} className="text-brand-600 underline">o&apos;zgartirish</Link>
          </p>
          <button className="rounded-full bg-brand-600 px-8 py-3 font-bold text-white hover:bg-brand-700">Imtihonni boshlash</button>
        </form>
      )}

      {attempts.length > 0 && (
        <div className="mt-10">
          <h2 className="font-bold">Oldingi urinishlar</h2>
          <ul className="mt-3 divide-y divide-brand-50 text-sm">
            {attempts.map((t) => (
              <li key={t.id} className="flex justify-between py-2">
                <Link href={`/learn/${slug}/exam/${t.id}`} className="hover:underline">{formatDate(t.startedAt)}</Link>
                <span className={t.passed ? "font-bold text-emerald-700" : "text-red-600"}>
                  {formatBand(t.band ?? 0)} · {t.correct}/{t.total} {t.passed ? "✓" : "✗"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
