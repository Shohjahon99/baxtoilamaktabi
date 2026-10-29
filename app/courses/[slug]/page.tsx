import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCourseWithLessons, flatLessons, getProgress } from "@/lib/learning";
import { priceLabel } from "@/lib/format";
import { Markdown } from "@/components/Markdown";
import { courseColor } from "@/components/CourseCard";
import { enroll } from "@/app/actions";

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">) {
  const course = await getCourseWithLessons((await params).slug);
  return { title: course?.title ?? "Kurs" };
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const [course, user] = await Promise.all([getCourseWithLessons(slug), getCurrentUser()]);
  if (!course) notFound();

  const lessons = flatLessons(course);
  const progress = user ? await getProgress(user.id, course.id) : null;
  const enrolled = !!progress?.enrollment;
  const published = course.status === "PUBLISHED" && lessons.length > 0;
  const totalMinutes = lessons.reduce((s, l) => s + l.minutes, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className={`relative isolate overflow-hidden rounded-[2rem] p-8 md:p-12 ${course.image ? "bg-brand-900 text-white" : `bg-gradient-to-br ${courseColor(course.color)}`}`}>
        {course.image && (
          <>
            <Image src={`${course.image}?auto=format&fit=crop&w=1600&q=75`} alt="" fill priority sizes="100vw" className="kenburns -z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/95 via-brand-900/75 to-brand-900/30" />
          </>
        )}
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-80">{course.audience}</p>
            <h1 className="mt-2 font-serif text-4xl font-bold md:text-6xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-lg opacity-80">{course.shortDesc}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              {[`📚 ${lessons.length} ta dars`, `⏱ ~${Math.max(1, Math.round(totalMinutes / 60))} soat`, "📝 Yakuniy imtihon", "🎓 Sertifikat"].map((t) => (
                <span key={t} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{t}</span>
              ))}
            </div>
          </div>
          <div className="w-full rounded-3xl bg-white p-6 text-ink shadow-xl md:w-72">
            <p className="text-sm text-ink/60">Kurs narxi</p>
            <p className="font-serif text-3xl font-bold text-brand-700">{priceLabel(course.price)}</p>
            {!published ? (
              <p className="mt-4 rounded-xl bg-gold-50 p-3 text-center text-sm font-bold text-gold-700">Tez kunda ochiladi</p>
            ) : enrolled ? (
              <Link href={`/learn/${course.slug}`} className="mt-4 block rounded-full bg-brand-600 py-3 text-center font-bold text-white hover:bg-brand-700">
                {progress?.certificate ? "Kursni ko'rish" : "O'qishni davom ettirish"}
              </Link>
            ) : (
              <form action={enroll} className="mt-4">
                <input type="hidden" name="courseId" value={course.id} />
                <button className="w-full rounded-full bg-brand-600 py-3 font-bold text-white hover:bg-brand-700">
                  {course.price === 0 ? "Bepul boshlash" : "Sotib olish va boshlash"}
                </button>
              </form>
            )}
            {progress && enrolled && (
              <p className="mt-3 text-center text-xs text-ink/60">
                {progress.doneIds.size} / {lessons.length} dars tugatildi
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="font-serif text-2xl font-bold text-brand-900">Kurs haqida</h2>
          <div className="mt-2">
            <Markdown>{course.description}</Markdown>
          </div>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-brand-900">Dastur</h2>
          <div className="mt-4 space-y-4">
            {course.modules.map((m, mi) => (
              <div key={m.id} className="rounded-2xl border border-brand-100 bg-white p-4">
                <p className="font-bold">
                  {mi + 1}-modul. {m.title}
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {m.lessons.map((l) => {
                    const open = enrolled || l.isPreview;
                    return (
                      <li key={l.id} className="flex items-center justify-between gap-2">
                        {open && published ? (
                          <Link href={`/learn/${course.slug}/${l.id}`} className="text-brand-700 hover:underline">
                            {progress?.doneIds.has(l.id) ? "✅" : "▸"} {l.title}
                          </Link>
                        ) : (
                          <span className="text-ink/70">🔒 {l.title}</span>
                        )}
                        <span className="shrink-0 text-xs text-ink/50">
                          {l.isPreview && !enrolled ? "ochiq dars · " : ""}
                          {l.minutes} daq
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {course.modules.length === 0 && <p className="text-sm text-ink/60">Dastur tayyorlanmoqda.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
