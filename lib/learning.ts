import "server-only";
import { db } from "./db";

export const parseOptions = (json: string): string[] => JSON.parse(json);

export async function getCourseWithLessons(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, minutes: true, isPreview: true, order: true },
          },
        },
      },
      _count: { select: { examQuestions: true, enrollments: true } },
    },
  });
}

export type CourseWithLessons = NonNullable<Awaited<ReturnType<typeof getCourseWithLessons>>>;

export const flatLessons = (course: CourseWithLessons) => course.modules.flatMap((m) => m.lessons);

export async function getProgress(userId: string, courseId: string) {
  const [enrollment, done, certificate] = await Promise.all([
    db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }),
    db.lessonProgress.findMany({
      where: { userId, lesson: { module: { courseId } } },
      select: { lessonId: true, quizScore: true },
    }),
    db.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } }),
  ]);
  return { enrollment, doneIds: new Set(done.map((d) => d.lessonId)), certificate };
}

// Darsdan o'tish uchun test natijasi kamida shu foiz bo'lishi kerak
export const LESSON_PASS_PERCENT = 60;
// 24 soat ichida yakuniy imtihonga ruxsat etilgan urinishlar
export const EXAM_ATTEMPTS_PER_DAY = 3;

export async function nextCertificateNumber(tx: Pick<typeof db, "certificate">) {
  const year = new Date().getFullYear();
  const count = await tx.certificate.count({ where: { number: { startsWith: `BO-${year}-` } } });
  return `BO-${year}-${String(count + 1).padStart(6, "0")}`;
}
