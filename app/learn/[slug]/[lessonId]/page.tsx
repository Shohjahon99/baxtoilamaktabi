import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getCourseWithLessons, flatLessons, getProgress, parseOptions, LESSON_PASS_PERCENT } from "@/lib/learning";
import { Markdown } from "@/components/Markdown";
import { submitLessonQuiz } from "@/app/actions";

function youtubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]/[lessonId]">) {
  const lesson = await db.lesson.findUnique({ where: { id: (await params).lessonId }, select: { title: true } });
  return { title: lesson?.title ?? "Dars" };
}

export default async function LessonPage({ params, searchParams }: PageProps<"/learn/[slug]/[lessonId]">) {
  const { slug, lessonId } = await params;
  const { a } = await searchParams;
  const user = await requireUser(`/learn/${slug}/${lessonId}`);
  const course = await getCourseWithLessons(slug);
  if (!course) notFound();

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { questions: { orderBy: { order: "asc" } }, module: true },
  });
  if (!lesson || lesson.module.courseId !== course.id) notFound();

  const { enrollment, doneIds } = await getProgress(user.id, course.id);
  if (!enrollment && !lesson.isPreview) redirect(`/courses/${slug}`);

  const lessons = flatLessons(course);
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const done = doneIds.has(lesson.id);

  // test natijasi (yuborilgandan keyin ?a=0,2,1 ko'rinishida qaytadi)
  const submitted = typeof a === "string" ? a.split(",").map(Number) : null;
  const correctCount = submitted ? lesson.questions.filter((q, i) => submitted[i] === q.correct).length : 0;
  const percent = submitted && lesson.questions.length ? Math.round((correctCount / lesson.questions.length) * 100) : 0;
  const video = lesson.videoUrl ? youtubeEmbed(lesson.videoUrl) : null;

  return (
    <article className="rounded-3xl border border-brand-100 bg-white p-6 md:p-10">
      <p className="text-sm font-bold text-brand-500">
        {idx + 1}-dars · {lesson.minutes} daqiqa {done && <span className="ml-2 text-emerald-600">✅ tugatilgan</span>}
      </p>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-900 md:text-4xl">{lesson.title}</h1>

      {video && (
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe src={video} className="h-full w-full" allowFullScreen title={lesson.title} />
        </div>
      )}

      <div className="mt-4 max-w-3xl text-[17px]">
        <Markdown>{lesson.content}</Markdown>
      </div>

      {!enrollment && (
        <div className="mt-10 rounded-2xl bg-gold-50 p-6 text-center">
          <p className="font-bold">Bu ochiq dars. Qolgan darslar va sertifikat uchun kursga yoziling.</p>
          <Link href={`/courses/${slug}`} className="mt-3 inline-block rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white">
            Kursga yozilish
          </Link>
        </div>
      )}

      {enrollment && (
        <section id="test" className="mt-12 scroll-mt-24 rounded-3xl bg-brand-50/60 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-bold text-brand-900">
            {lesson.questions.length ? "Darsni mustahkamlash testi" : "Darsni yakunlash"}
          </h2>

          {submitted && (
            <div
              className={`mt-4 rounded-2xl p-4 font-bold ${
                percent >= LESSON_PASS_PERCENT ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}
            >
              {percent >= LESSON_PASS_PERCENT
                ? `Barakalla! ${correctCount} / ${lesson.questions.length} to'g'ri. Dars tugatildi.`
                : `${correctCount} / ${lesson.questions.length} to'g'ri. O'tish uchun kamida ${LESSON_PASS_PERCENT}% kerak — darsni qayta o'qib, yana urinib ko'ring.`}
            </div>
          )}

          <form action={submitLessonQuiz} className="mt-6 space-y-6">
            <input type="hidden" name="lessonId" value={lesson.id} />
            {lesson.questions.map((q, qi) => {
              const opts = parseOptions(q.options);
              return (
                <fieldset key={q.id} className="rounded-2xl bg-white p-5">
                  <legend className="sr-only">{q.text}</legend>
                  <p className="font-bold">
                    {qi + 1}. {q.text}
                  </p>
                  <div className="mt-3 space-y-2">
                    {opts.map((o, oi) => {
                      const chosen = submitted?.[qi] === oi;
                      const isRight = q.correct === oi;
                      const tone = submitted
                        ? isRight
                          ? "border-emerald-400 bg-emerald-50"
                          : chosen
                            ? "border-red-300 bg-red-50"
                            : "border-brand-100"
                        : "border-brand-100 hover:border-brand-300";
                      return (
                        <label key={oi} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${tone}`}>
                          <input type="radio" name={`q_${q.id}`} value={oi} required defaultChecked={chosen} className="mt-1 accent-brand-600" />
                          <span>{o}</span>
                        </label>
                      );
                    })}
                  </div>
                  {submitted && q.explanation && <p className="mt-3 text-sm text-ink/70">💡 {q.explanation}</p>}
                </fieldset>
              );
            })}
            <button className="rounded-full bg-brand-600 px-8 py-3 font-bold text-white hover:bg-brand-700">
              {lesson.questions.length ? (submitted ? "Qayta topshirish" : "Javoblarni tekshirish") : "Darsni tugatdim"}
            </button>
          </form>
        </section>
      )}

      <div className="no-print mt-10 flex justify-between gap-4 border-t border-brand-100 pt-6 text-sm font-bold">
        {prev ? (
          <Link href={`/learn/${slug}/${prev.id}`} className="text-brand-700 hover:underline">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link href={`/learn/${slug}/${next.id}`} className="text-right text-brand-700 hover:underline">{next.title} →</Link>
        ) : enrollment ? (
          <Link href={`/learn/${slug}/exam`} className="text-gold-700 hover:underline">Yakuniy imtihon →</Link>
        ) : <span />}
      </div>
    </article>
  );
}
