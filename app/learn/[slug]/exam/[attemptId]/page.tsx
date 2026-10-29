import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { parseOptions } from "@/lib/learning";
import { formatBand, bandLevel } from "@/lib/band";
import { submitExam } from "@/app/actions";
import { FeedbackForm } from "./FeedbackForm";

export default async function ExamAttemptPage({ params, searchParams }: PageProps<"/learn/[slug]/exam/[attemptId]">) {
  const { slug, attemptId } = await params;
  const { fb } = await searchParams;
  const user = await requireUser();
  const attempt = await db.examAttempt.findUnique({ where: { id: attemptId }, include: { course: true } });
  if (!attempt || attempt.userId !== user.id || attempt.course.slug !== slug) notFound();

  const slots: { questionId: string; answer: number }[] = JSON.parse(attempt.answers);
  const questions = await db.question.findMany({ where: { id: { in: slots.map((s) => s.questionId) } } });
  const byId = new Map(questions.map((q) => [q.id, q]));
  const finished = !!attempt.finishedAt;
  const certificate = finished
    ? await db.certificate.findUnique({ where: { userId_courseId: { userId: user.id, courseId: attempt.courseId } } })
    : null;
  const feedback = certificate
    ? await db.feedback.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: attempt.courseId } },
        select: { rating: true, comment: true },
      })
    : null;

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold text-brand-900">
        {finished ? "Imtihon natijasi" : "Yakuniy imtihon"}
      </h1>

      {finished && (
        <div className={`mt-6 rounded-3xl p-6 text-center ${attempt.passed ? "bg-emerald-50" : "bg-red-50"}`}>
          <p className="text-sm font-bold uppercase tracking-wider text-ink/60">Sizning ballingiz</p>
          <p className={`font-serif text-6xl font-bold ${attempt.passed ? "text-emerald-700" : "text-red-600"}`}>
            {formatBand(attempt.band ?? 0)}
          </p>
          <p className="mt-1 text-ink/70">
            {attempt.correct} / {attempt.total} to&apos;g&apos;ri javob · {bandLevel(attempt.band ?? 0)}
          </p>
          {attempt.passed && certificate ? (
            <>
              {fb === "ok" ? (
                <p className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-4 text-sm font-semibold text-emerald-700">🙏 Rahmat! Fikringiz qabul qilindi.</p>
              ) : (
                <FeedbackForm courseId={attempt.courseId} back={`/learn/${slug}/exam/${attempt.id}`} initial={feedback ?? undefined} />
              )}
              <Link href={`/certificates/${certificate.number}`} className="mt-5 inline-block rounded-full bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-700">
                🎓 Sertifikatni ko&apos;rish
              </Link>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-red-700">
                O&apos;tish uchun kamida {formatBand(attempt.course.passingBand)} ball kerak. Darslarni takrorlab, qayta urinib ko&apos;ring.
              </p>
              <Link href={`/learn/${slug}/exam`} className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white">
                Imtihon sahifasiga qaytish
              </Link>
            </div>
          )}
        </div>
      )}

      <form action={submitExam} className="mt-8 space-y-5">
        <input type="hidden" name="attemptId" value={attempt.id} />
        {slots.map((s, i) => {
          const q = byId.get(s.questionId);
          if (!q) return null;
          const opts = parseOptions(q.options);
          return (
            <fieldset key={q.id} className="rounded-2xl border border-brand-100 p-5">
              <legend className="sr-only">{q.text}</legend>
              <p className="font-bold">
                {i + 1}. {q.text}
              </p>
              <div className="mt-3 space-y-2">
                {opts.map((o, oi) => {
                  const chosen = s.answer === oi;
                  // natijada faqat foydalanuvchi javobi to'g'ri/noto'g'riligi ko'rsatiladi
                  const tone = finished
                    ? chosen
                      ? q.correct === oi
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-red-300 bg-red-50"
                      : "border-brand-50 opacity-70"
                    : "border-brand-100 hover:border-brand-300";
                  return (
                    <label key={oi} className={`flex items-start gap-3 rounded-xl border p-3 ${finished ? "" : "cursor-pointer"} ${tone}`}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={oi}
                        disabled={finished}
                        defaultChecked={chosen}
                        className="mt-1 accent-brand-600"
                      />
                      <span>{o}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        {!finished && (
          <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl bg-brand-800 p-4 text-white shadow-xl">
            <p className="text-sm">Barcha savollarga javob berganingizni tekshiring.</p>
            <button className="shrink-0 rounded-full bg-gold-300 px-6 py-2.5 font-bold text-ink hover:bg-gold-100">Yakunlash</button>
          </div>
        )}
      </form>
    </div>
  );
}
