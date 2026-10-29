"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser, devLoginEnabled } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { percentToBand, formatBand } from "@/lib/band";
import { notifyUser } from "@/lib/telegram";
import { LESSON_PASS_PERCENT, EXAM_ATTEMPTS_PER_DAY, nextCertificateNumber } from "@/lib/learning";

function safeNext(next: FormDataEntryValue | null, fallback = "/dashboard") {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : fallback;
}

// ---------- Kirish ----------

export async function devLogin(formData: FormData) {
  if (!devLoginEnabled()) throw new Error("Dev kirish o'chirilgan");
  const name = String(formData.get("name") || "Test").trim().slice(0, 40) || "Test";
  const telegramId = `dev-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const user = await db.user.upsert({
    where: { telegramId },
    create: { telegramId, firstName: name, phone: "+998900000000" },
    update: {},
  });
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/");
}

// ---------- Profil ----------

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const fullName = String(formData.get("fullName") || "").trim().replace(/\s+/g, " ").slice(0, 80);
  const birthYear = Number(formData.get("birthYear")) || null;
  const region = String(formData.get("region") || "") || null;
  const next = formData.get("next");
  if (fullName.split(" ").length < 2) {
    redirect(`/dashboard/profile?error=name${typeof next === "string" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }
  await db.user.update({ where: { id: user.id }, data: { fullName, birthYear, region } });
  revalidatePath("/", "layout");
  redirect(safeNext(next));
}

// ---------- Kursga yozilish ----------

export async function enroll(formData: FormData) {
  const courseId = String(formData.get("courseId"));
  const course = await db.course.findUniqueOrThrow({ where: { id: courseId } });
  const user = await requireUser(`/courses/${course.slug}`);
  if (course.status !== "PUBLISHED") redirect(`/courses/${course.slug}`);

  const existing = await db.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } });
  if (existing) redirect(`/learn/${course.slug}`);

  if (course.price > 0) {
    // to'lanmagan eski to'lov bo'lsa, o'shani ishlatamiz
    const pending =
      (await db.payment.findFirst({
        where: { userId: user.id, courseId, status: { in: ["PENDING", "PREPARED"] }, amount: course.price },
      })) ?? (await db.payment.create({ data: { userId: user.id, courseId, amount: course.price } }));
    redirect(`/pay/${pending.id}`);
  }
  await db.enrollment.create({ data: { userId: user.id, courseId } });
  redirect(`/learn/${course.slug}`);
}

async function isEnrolled(userId: string, courseId: string) {
  return !!(await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }));
}

// ---------- Dars testi ----------

export async function submitLessonQuiz(formData: FormData) {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId"));
  const lesson = await db.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    include: { questions: { orderBy: { order: "asc" } }, module: { include: { course: true } } },
  });
  const course = lesson.module.course;
  const enrolled = await isEnrolled(user.id, course.id);
  if (!enrolled && !lesson.isPreview) throw new Error("Kursga yozilmagansiz");

  const answers = lesson.questions.map((q) => {
    const v = formData.get(`q_${q.id}`);
    return v === null ? -1 : Number(v);
  });
  const correct = lesson.questions.filter((q, i) => answers[i] === q.correct).length;
  const percent = lesson.questions.length ? Math.round((correct / lesson.questions.length) * 100) : 100;

  if (enrolled && percent >= LESSON_PASS_PERCENT) {
    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      create: { userId: user.id, lessonId, quizScore: percent },
      update: { quizScore: percent },
    });
  }
  revalidatePath(`/learn/${course.slug}`, "layout");
  redirect(`/learn/${course.slug}/${lessonId}?a=${answers.join(",")}#test`);
}

// ---------- Yakuniy imtihon ----------

export async function startExam(formData: FormData) {
  const user = await requireUser();
  const courseId = String(formData.get("courseId"));
  const course = await db.course.findUniqueOrThrow({
    where: { id: courseId },
    include: {
      modules: { include: { lessons: { select: { id: true } } } },
      examQuestions: { select: { id: true } },
    },
  });
  if (!(await isEnrolled(user.id, courseId))) redirect(`/courses/${course.slug}`);

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const done = await db.lessonProgress.count({ where: { userId: user.id, lessonId: { in: lessonIds } } });
  if (done < lessonIds.length || course.examQuestions.length === 0) redirect(`/learn/${course.slug}/exam`);

  // tugallanmagan urinish bo'lsa, o'shani davom ettiramiz
  const open = await db.examAttempt.findFirst({ where: { userId: user.id, courseId, finishedAt: null } });
  if (open) redirect(`/learn/${course.slug}/exam/${open.id}`);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = await db.examAttempt.count({ where: { userId: user.id, courseId, startedAt: { gte: since } } });
  if (recent >= EXAM_ATTEMPTS_PER_DAY) redirect(`/learn/${course.slug}/exam?limit=1`);

  const ids = shuffle(course.examQuestions.map((q) => q.id)).slice(0, course.examSize);
  const attempt = await db.examAttempt.create({
    data: {
      userId: user.id,
      courseId,
      total: ids.length,
      answers: JSON.stringify(ids.map((questionId) => ({ questionId, answer: -1 }))),
    },
  });
  redirect(`/learn/${course.slug}/exam/${attempt.id}`);
}

export async function submitExam(formData: FormData) {
  const user = await requireUser();
  const attemptId = String(formData.get("attemptId"));
  const attempt = await db.examAttempt.findUniqueOrThrow({ where: { id: attemptId }, include: { course: true } });
  if (attempt.userId !== user.id) throw new Error("Ruxsat yo'q");
  if (attempt.finishedAt) redirect(`/learn/${attempt.course.slug}/exam/${attempt.id}`);

  const slots: { questionId: string; answer: number }[] = JSON.parse(attempt.answers);
  const questions = await db.question.findMany({ where: { id: { in: slots.map((s) => s.questionId) } } });
  const byId = new Map(questions.map((q) => [q.id, q]));

  let correct = 0;
  const answered = slots.map((s) => {
    const v = formData.get(`q_${s.questionId}`);
    const answer = v === null ? -1 : Number(v);
    if (byId.get(s.questionId)?.correct === answer) correct++;
    return { questionId: s.questionId, answer };
  });
  const percent = slots.length ? Math.round((correct / slots.length) * 100) : 0;
  const band = percentToBand(percent);
  const passed = band >= attempt.course.passingBand;

  await db.examAttempt.update({
    where: { id: attempt.id },
    data: { answers: JSON.stringify(answered), correct, band, passed, finishedAt: new Date() },
  });

  if (passed) await issueCertificate(user.id, attempt.course.id, band, percent);
  revalidatePath(`/learn/${attempt.course.slug}`, "layout");
  redirect(`/learn/${attempt.course.slug}/exam/${attempt.id}`);
}

// ---------- Fitbek ----------

export async function submitFeedback(formData: FormData) {
  const user = await requireUser();
  const courseId = String(formData.get("courseId"));
  const rating = Math.round(Number(formData.get("rating")));
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1000) || null;
  const back = String(formData.get("back") ?? "/dashboard");
  if (!(rating >= 1 && rating <= 5)) redirect(`${back}?fb=error`);

  // fitbekni faqat kursni tamomlagan (sertifikat olgan) o'quvchi qoldiradi
  const cert = await db.certificate.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } });
  if (!cert) throw new Error("Kurs tamomlanmagan");

  await db.feedback.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    create: { userId: user.id, courseId, rating, comment },
    update: { rating, comment },
  });
  redirect(`${back.startsWith("/learn/") ? back : "/dashboard"}?fb=ok`);
}

async function issueCertificate(userId: string, courseId: string, band: number, percent: number) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const course = await db.course.findUniqueOrThrow({ where: { id: courseId } });
  const fullName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ");
  const existing = await db.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } });

  if (existing) {
    // qayta topshirib yaxshiroq natija olsa, sertifikat bali yangilanadi
    if (band > existing.band) {
      await db.certificate.update({
        where: { id: existing.id },
        data: { band, percent, fullName, issuedAt: new Date() },
      });
    }
    return;
  }

  let number = "";
  for (let i = 0; ; i++) {
    try {
      const cert = await db.$transaction(async (tx) => {
        const n = await nextCertificateNumber(tx);
        return tx.certificate.create({ data: { number: n, userId, courseId, band, percent, fullName } });
      });
      number = cert.number;
      break;
    } catch (e) {
      // raqam to'qnashuvi (unique) — qayta urinamiz
      if (i >= 4) throw e;
    }
  }
  await db.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
  await notifyUser(
    user.telegramId,
    `🎓 Tabriklaymiz! «${course.title}» kursini muvaffaqiyatli tamomladingiz.\n\nBall: ${formatBand(band)} / 9.0\nSertifikat: ${process.env.APP_URL}/certificates/${number}`
  );
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
