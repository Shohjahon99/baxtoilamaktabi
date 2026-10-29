import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCourseWithLessons, flatLessons, getProgress } from "@/lib/learning";

// Kursga kirganda birinchi tugatilmagan darsga yo'naltiradi
export default async function LearnIndex({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const user = await requireUser(`/learn/${slug}`);
  const course = await getCourseWithLessons(slug);
  if (!course) notFound();
  const { enrollment, doneIds } = await getProgress(user.id, course.id);
  if (!enrollment) redirect(`/courses/${slug}`);

  const lessons = flatLessons(course);
  if (lessons.length === 0) redirect(`/courses/${slug}`);
  const next = lessons.find((l) => !doneIds.has(l.id));
  redirect(next ? `/learn/${slug}/${next.id}` : `/learn/${slug}/exam`);
}
