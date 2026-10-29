import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CourseTabs } from "@/components/admin/CourseTabs";
import { QuestionBuilder } from "@/components/admin/QuestionBuilder";
import { Notice, PageHeader } from "@/components/admin/ui";
import { formatBand } from "@/lib/band";

export const metadata = { title: "Yakuniy imtihon" };

export default async function ExamPage({ params }: PageProps<"/admin/courses/[id]/exam">) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: {
      examQuestions: { orderBy: { order: "asc" } },
      modules: { select: { _count: { select: { lessons: true } } } },
    },
  });
  if (!course) notFound();
  const n = course.examQuestions.length;

  return (
    <>
      <PageHeader title={course.title} subtitle="Yakuniy imtihon savollar banki" back={{ href: "/admin/courses", label: "Kurslar" }} />
      <CourseTabs id={course.id} active="exam" counts={{ lessons: course.modules.reduce((s, m) => s + m._count.lessons, 0), exam: n }} />
      <Notice tone="amber">
        Har bir urinishda bankdan tasodifiy <b>{Math.min(course.examSize, n)}</b> ta savol beriladi (sozlama: {course.examSize}). O&apos;tish bali —{" "}
        <b>{formatBand(course.passingBand)}</b> / 9. Bank imtihondagi savollar sonidan kamida 1,5 baravar ko&apos;p bo&apos;lsa, har urinish farqli chiqadi.
      </Notice>
      <QuestionBuilder
        target={{ examCourseId: course.id }}
        initial={course.examQuestions.map((q) => ({ id: q.id, text: q.text, options: JSON.parse(q.options), correct: q.correct, explanation: q.explanation ?? "" }))}
      />
    </>
  );
}
