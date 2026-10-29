import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CourseTabs } from "@/components/admin/CourseTabs";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, PageHeader, inputCls } from "@/components/admin/ui";
import { addLesson, addModule, deleteModule, moveItem, renameModule } from "@/app/admin/actions";

export const metadata = { title: "Darslar" };

function MoveButtons({ kind, id }: { kind: "module" | "lesson"; id: string }) {
  return (
    <span className="inline-flex">
      {[-1, 1].map((dir) => (
        <form key={dir} action={moveItem}>
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="dir" value={dir} />
          <button className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100" title={dir < 0 ? "Yuqoriga" : "Pastga"}>
            {dir < 0 ? "↑" : "↓"}
          </button>
        </form>
      ))}
    </span>
  );
}

export default async function LessonsPage({ params }: PageProps<"/admin/courses/[id]/lessons">) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, include: { _count: { select: { questions: true } } } } },
      },
      _count: { select: { examQuestions: true } },
    },
  });
  if (!course) notFound();
  const lessonCount = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <>
      <PageHeader title={course.title} subtitle="Modullar, darslar va har bir dars testi" back={{ href: "/admin/courses", label: "Kurslar" }} />
      <CourseTabs id={course.id} active="lessons" counts={{ lessons: lessonCount, exam: course._count.examQuestions }} />

      <div className="space-y-5">
        {course.modules.map((m, mi) => (
          <Card key={m.id} className="!p-0">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
              <span className="text-sm font-bold text-slate-400">{mi + 1}-modul</span>
              <form action={renameModule} className="flex flex-1 gap-2">
                <input type="hidden" name="id" value={m.id} />
                <input name="title" defaultValue={m.title} className={`${inputCls} !py-1.5 font-semibold`} />
                <button className="shrink-0 rounded-lg border border-slate-200 px-3 text-xs hover:bg-slate-50">Saqlash</button>
              </form>
              <MoveButtons kind="module" id={m.id} />
              {m.lessons.length === 0 && (
                <form action={deleteModule}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton message="Modulni o'chirasizmi?" className="rounded-lg px-2 py-1 text-red-400 hover:bg-red-50">✕</ConfirmButton>
                </form>
              )}
            </div>
            <ul className="divide-y divide-slate-50">
              {m.lessons.map((l, li) => (
                <li key={l.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="w-6 text-xs text-slate-400">{li + 1}.</span>
                  <Link href={`/admin/lessons/${l.id}`} className="flex-1 font-medium hover:text-brand-600">{l.title}</Link>
                  {l.isPreview && <Badge tone="blue">ochiq dars</Badge>}
                  {!l.content.trim() && <Badge tone="red">matn yo&apos;q</Badge>}
                  <Badge tone={l._count.questions ? "green" : "amber"}>{l._count.questions} ta test</Badge>
                  <span className="text-xs text-slate-400">{l.minutes} daq</span>
                  <MoveButtons kind="lesson" id={l.id} />
                  <Link href={`/admin/lessons/${l.id}`} className="rounded-lg border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50">✏️ Tahrirlash</Link>
                </li>
              ))}
            </ul>
            <form action={addLesson} className="flex gap-2 border-t border-slate-100 p-3">
              <input type="hidden" name="moduleId" value={m.id} />
              <input name="title" placeholder="Yangi dars nomi" className={`${inputCls} !py-2`} />
              <button className="shrink-0 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700">+ Dars</button>
            </form>
          </Card>
        ))}

        <Card className="border-dashed">
          <form action={addModule} className="flex gap-2">
            <input type="hidden" name="courseId" value={course.id} />
            <input name="title" placeholder="Yangi modul nomi (masalan: Oila psixologiyasi)" required className={inputCls} />
            <button className="shrink-0 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">+ Modul qo&apos;shish</button>
          </form>
        </Card>
      </div>
    </>
  );
}
