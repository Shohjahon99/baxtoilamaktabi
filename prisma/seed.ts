// Kurslarni bazaga yuklaydi. Qayta ishga tushirish xavfsiz:
// kurs ma'lumotlari yangilanadi, lekin darslari bor kursning kontentiga tegilmaydi
// (aks holda o'quvchilar progressi o'chib ketadi). Kontentni majburan qayta yuklash: SEED_FORCE=1
import { PrismaClient } from "@prisma/client";
import type { CourseData, Q } from "./content/types";
import { idealKuyov } from "./content/ideal-kuyov";
import { outlines } from "./content/outlines";

const db = new PrismaClient();
const force = process.env.SEED_FORCE === "1";

// Kontentda to'g'ri javob ko'pincha bir xil joyda turadi (masalan, doim B).
// Taxmin bilan topib bo'lmasligi uchun variantlar savol matniga bog'liq
// barqaror tartibda aralashtiriladi (qayta seed qilinganda tartib o'zgarmaydi).
function shuffleQuestion(q: Q) {
  let h = 2166136261;
  for (const ch of q.text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    text: q.text,
    options: JSON.stringify(order.map((i) => q.options[i])),
    correct: order.indexOf(q.correct),
    explanation: q.explanation,
  };
}

async function seedCourse(c: CourseData) {
  const info = {
    title: c.title,
    audience: c.audience,
    shortDesc: c.shortDesc,
    description: c.description,
    emoji: c.emoji,
    image: c.image,
    color: c.color,
    order: c.order,
    examSize: c.examSize ?? 20,
  };
  const existing = await db.course.findUnique({ where: { slug: c.slug }, include: { _count: { select: { modules: true } } } });
  // narx va holat admin paneldan boshqariladi — faqat yangi kursda o'rnatiladi
  const course = existing
    ? await db.course.update({ where: { id: existing.id }, data: info })
    : await db.course.create({ data: { ...info, slug: c.slug, price: c.price, status: c.status } });

  if (existing && existing._count.modules > 0 && !force) {
    console.log(`= ${c.slug}: kontent mavjud, o'tkazib yuborildi`);
    return;
  }
  await db.module.deleteMany({ where: { courseId: course.id } });
  await db.question.deleteMany({ where: { examCourseId: course.id } });

  for (const [mi, m] of c.modules.entries()) {
    const mod = await db.module.create({ data: { courseId: course.id, title: m.title, order: mi } });
    for (const [li, l] of m.lessons.entries()) {
      await db.lesson.create({
        data: {
          moduleId: mod.id,
          title: l.title,
          content: l.content,
          minutes: l.minutes,
          isPreview: !!l.isPreview,
          order: li,
          questions: {
            create: l.quiz.map((q, qi) => ({ ...shuffleQuestion(q), order: qi })),
          },
        },
      });
    }
  }
  await db.question.createMany({
    data: c.exam.map((q, qi) => ({ examCourseId: course.id, ...shuffleQuestion(q), order: qi })),
  });
  const lessons = c.modules.reduce((s, m) => s + m.lessons.length, 0);
  console.log(`+ ${c.slug}: ${c.modules.length} modul, ${lessons} dars, ${c.exam.length} imtihon savoli`);
}

async function main() {
  for (const c of [idealKuyov, ...outlines]) await seedCourse(c);
}

main().finally(() => db.$disconnect());
