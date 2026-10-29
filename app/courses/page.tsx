import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/CourseCard";

export const metadata: Metadata = { title: "Kurslar" };

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { order: "asc" },
    include: { modules: { include: { _count: { select: { lessons: true } } } } },
  });
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-brand-900">Kurslar</h1>
      <p className="mt-2 text-ink/70">Hayotingizning har bir bosqichi uchun alohida kurs.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} lessons={c.modules.reduce((s, m) => s + m._count.lessons, 0)} />
        ))}
      </div>
    </div>
  );
}
