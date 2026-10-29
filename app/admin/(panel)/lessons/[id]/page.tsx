import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { QuestionBuilder } from "@/components/admin/QuestionBuilder";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Card, Notice, PageHeader, inputCls } from "@/components/admin/ui";
import { deleteLesson, saveLesson } from "@/app/admin/actions";

export const metadata = { title: "Darsni tahrirlash" };

export default async function EditLessonPage({ params, searchParams }: PageProps<"/admin/lessons/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const lesson = await db.lesson.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } }, module: { include: { course: true } } },
  });
  if (!lesson) notFound();
  const course = lesson.module.course;

  return (
    <>
      <PageHeader
        title={lesson.title}
        subtitle={`${course.title} · ${lesson.module.title}`}
        back={{ href: `/admin/courses/${course.id}/lessons`, label: "Darslar" }}
        action={
          <a href={`/learn/${course.slug}/${lesson.id}`} target="_blank" className="text-sm text-brand-600 hover:underline">Saytda ko&apos;rish ↗</a>
        }
      />
      {saved && <Notice tone="green">✅ Dars saqlandi</Notice>}

      <form action={saveLesson}>
        <input type="hidden" name="id" value={lesson.id} />
        <Card className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Dars nomi</span>
            <input name="title" defaultValue={lesson.title} required className={inputCls} />
          </label>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <label className="block space-y-1">
              <span className="text-sm font-semibold">Video (YouTube havolasi, ixtiyoriy)</span>
              <input name="videoUrl" defaultValue={lesson.videoUrl ?? ""} placeholder="https://youtu.be/..." className={inputCls} />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-semibold">Davomiyligi (daqiqa)</span>
              <input name="minutes" type="number" min={1} defaultValue={lesson.minutes} className={inputCls} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="isPreview" defaultChecked={lesson.isPreview} className="h-4 w-4 accent-brand-600" />
            Ochiq dars — kursga yozilmaganlar ham ko&apos;ra oladi
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Dars matni (Markdown)</span>
            <span className="block text-xs text-slate-400">## Sarlavha · **qalin** · - ro&apos;yxat · 1. raqamli · &gt; iqtibos · | jadval |</span>
            <textarea name="content" defaultValue={lesson.content} rows={24} className={`${inputCls} font-mono text-[13px] leading-relaxed`} />
          </label>
          <button className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">💾 Darsni saqlash</button>
        </Card>
      </form>

      <h2 className="mb-1 mt-10 text-lg font-bold">Dars testi</h2>
      <p className="mb-4 text-sm text-slate-500">Dars tugatilgan hisoblanishi uchun o&apos;quvchi kamida 60% to&apos;g&apos;ri javob berishi kerak. Test bo&apos;lmasa «Darsni tugatdim» tugmasi chiqadi.</p>
      <QuestionBuilder
        target={{ lessonId: lesson.id }}
        initial={lesson.questions.map((q) => ({ id: q.id, text: q.text, options: JSON.parse(q.options), correct: q.correct, explanation: q.explanation ?? "" }))}
      />

      <Card className="mt-10 border-red-100">
        <form action={deleteLesson} className="flex flex-wrap items-center justify-between gap-3">
          <input type="hidden" name="id" value={lesson.id} />
          <p className="text-sm text-slate-500">Dars, uning testi va o&apos;quvchilarning shu dars bo&apos;yicha progressi o&apos;chadi.</p>
          <ConfirmButton message="Darsni o'chirasizmi?" className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            🗑 Darsni o&apos;chirish
          </ConfirmButton>
        </form>
      </Card>
    </>
  );
}
