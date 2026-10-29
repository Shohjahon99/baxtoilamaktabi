import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CourseForm } from "@/components/admin/CourseForm";
import { CourseTabs } from "@/components/admin/CourseTabs";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Card, Notice, PageHeader } from "@/components/admin/ui";
import { deleteCourse } from "@/app/admin/actions";

async function getCourse(id: string) {
  return db.course.findUnique({
    where: { id },
    include: {
      modules: { select: { _count: { select: { lessons: true } } } },
      _count: { select: { examQuestions: true, enrollments: true } },
    },
  });
}

export async function generateMetadata({ params }: PageProps<"/admin/courses/[id]">) {
  return { title: (await getCourse((await params).id))?.title ?? "Kurs" };
}

export default async function EditCoursePage({ params, searchParams }: PageProps<"/admin/courses/[id]">) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const course = await getCourse(id);
  if (!course) notFound();
  const lessons = course.modules.reduce((s, m) => s + m._count.lessons, 0);

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={
          <a href={`/courses/${course.slug}`} target="_blank" className="text-brand-600 hover:underline">
            Saytda ko&apos;rish ↗
          </a>
        }
        back={{ href: "/admin/courses", label: "Kurslar" }}
      />
      <CourseTabs id={course.id} active="info" counts={{ lessons, exam: course._count.examQuestions }} />
      {saved && <Notice tone="green">✅ Saqlandi</Notice>}
      {error === "slug" && <Notice tone="red">Bunday manzil (slug) bilan boshqa kurs bor.</Notice>}
      {error === "has-students" && (
        <Notice tone="red">Bu kursda o&apos;quvchilar bor — o&apos;chirib bo&apos;lmaydi. Uni «Qoralama» holatiga o&apos;tkazing.</Notice>
      )}
      <CourseForm course={course} />

      <Card className="mt-8 border-red-100">
        <p className="font-semibold text-red-700">Kursni o&apos;chirish</p>
        <p className="mt-1 text-sm text-slate-500">
          Barcha modul, dars va savollar o&apos;chadi. O&apos;quvchisi bor kursni o&apos;chirib bo&apos;lmaydi ({course._count.enrollments} ta o&apos;quvchi).
        </p>
        <form action={deleteCourse} className="mt-3">
          <input type="hidden" name="id" value={course.id} />
          <ConfirmButton message={`«${course.title}» kursini butunlay o'chirasizmi?`} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            🗑 Kursni o&apos;chirish
          </ConfirmButton>
        </form>
      </Card>
    </>
  );
}
