"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  checkAdminPassword,
  changeAdminCredentials,
  createAdminSession,
  destroyAdminSession,
  loginRateLimited,
  registerFailedLogin,
  requireAdminSession,
  verifyCurrentPassword,
  getAdminLogin,
} from "@/lib/admin-auth";
import { setSetting } from "@/lib/settings";
import { markPaid } from "@/lib/payments";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const refresh = () => revalidatePath("/", "layout");

// ---------- Kirish ----------

export async function adminLogin(formData: FormData) {
  const { blocked, ip } = await loginRateLimited();
  if (blocked) redirect("/admin/login?error=blocked");
  if (!(await checkAdminPassword(str(formData, "login"), String(formData.get("password") ?? "")))) {
    registerFailedLogin(ip);
    redirect("/admin/login?error=1");
  }
  await createAdminSession();
  redirect("/admin/dashboard");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

// ---------- Kurslar ----------

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[ʻʼ'`‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function saveCourse(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = slugify(str(formData, "slug") || title);
  if (!title || !slug) redirect(id ? `/admin/courses/${id}?error=title` : "/admin/courses/new?error=title");

  const data = {
    title,
    slug,
    audience: str(formData, "audience"),
    shortDesc: str(formData, "shortDesc"),
    description: str(formData, "description"),
    image: str(formData, "image") || null,
    emoji: str(formData, "emoji") || "📘",
    color: str(formData, "color") || "rose",
    price: Math.max(0, Math.round(Number(formData.get("price")) || 0)),
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    order: Number(formData.get("order")) || 0,
    passingBand: Math.min(9, Math.max(0, Number(formData.get("passingBand")) || 5)),
    examSize: Math.max(1, Math.round(Number(formData.get("examSize")) || 20)),
  };

  const clash = await db.course.findUnique({ where: { slug } });
  if (clash && clash.id !== id) redirect(id ? `/admin/courses/${id}?error=slug` : "/admin/courses/new?error=slug");

  const course = id ? await db.course.update({ where: { id }, data }) : await db.course.create({ data });
  refresh();
  redirect(`/admin/courses/${course.id}?saved=1`);
}

export async function deleteCourse(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  // o'quvchisi bor kursni o'chirish ularning progressi, to'lovi va sertifikatini ham o'chirib yuboradi
  const enrolled = await db.enrollment.count({ where: { courseId: id } });
  if (enrolled > 0) redirect(`/admin/courses/${id}?error=has-students`);
  await db.course.delete({ where: { id } });
  refresh();
  redirect("/admin/courses");
}

// ---------- Modullar ----------

export async function addModule(formData: FormData) {
  await requireAdminSession();
  const courseId = str(formData, "courseId");
  const title = str(formData, "title") || "Yangi modul";
  const last = await db.module.findFirst({ where: { courseId }, orderBy: { order: "desc" } });
  await db.module.create({ data: { courseId, title, order: (last?.order ?? -1) + 1 } });
  refresh();
}

export async function renameModule(formData: FormData) {
  await requireAdminSession();
  await db.module.update({ where: { id: str(formData, "id") }, data: { title: str(formData, "title") || "Modul" } });
  refresh();
}

export async function deleteModule(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const lessons = await db.lesson.count({ where: { moduleId: id } });
  if (lessons > 0) return; // avval darslarni o'chirish kerak
  await db.module.delete({ where: { id } });
  refresh();
}

async function swapOrder(kind: "module" | "lesson", id: string, dir: number) {
  if (kind === "module") {
    const cur = await db.module.findUniqueOrThrow({ where: { id } });
    const sib = await db.module.findFirst({
      where: { courseId: cur.courseId, order: dir < 0 ? { lt: cur.order } : { gt: cur.order } },
      orderBy: { order: dir < 0 ? "desc" : "asc" },
    });
    if (!sib) return;
    await db.$transaction([
      db.module.update({ where: { id: cur.id }, data: { order: sib.order } }),
      db.module.update({ where: { id: sib.id }, data: { order: cur.order } }),
    ]);
  } else {
    const cur = await db.lesson.findUniqueOrThrow({ where: { id } });
    const sib = await db.lesson.findFirst({
      where: { moduleId: cur.moduleId, order: dir < 0 ? { lt: cur.order } : { gt: cur.order } },
      orderBy: { order: dir < 0 ? "desc" : "asc" },
    });
    if (!sib) return;
    await db.$transaction([
      db.lesson.update({ where: { id: cur.id }, data: { order: sib.order } }),
      db.lesson.update({ where: { id: sib.id }, data: { order: cur.order } }),
    ]);
  }
}

export async function moveItem(formData: FormData) {
  await requireAdminSession();
  await swapOrder(str(formData, "kind") === "module" ? "module" : "lesson", str(formData, "id"), Number(formData.get("dir")));
  refresh();
}

// ---------- Darslar ----------

export async function addLesson(formData: FormData) {
  await requireAdminSession();
  const moduleId = str(formData, "moduleId");
  const last = await db.lesson.findFirst({ where: { moduleId }, orderBy: { order: "desc" } });
  const lesson = await db.lesson.create({
    data: { moduleId, title: str(formData, "title") || "Yangi dars", content: "", order: (last?.order ?? -1) + 1 },
  });
  refresh();
  redirect(`/admin/lessons/${lesson.id}`);
}

export async function saveLesson(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  await db.lesson.update({
    where: { id },
    data: {
      title: str(formData, "title") || "Dars",
      content: String(formData.get("content") ?? ""),
      videoUrl: str(formData, "videoUrl") || null,
      minutes: Math.max(1, Number(formData.get("minutes")) || 10),
      isPreview: formData.get("isPreview") === "on",
    },
  });
  refresh();
  redirect(`/admin/lessons/${id}?saved=1`);
}

export async function deleteLesson(formData: FormData) {
  await requireAdminSession();
  const lesson = await db.lesson.delete({ where: { id: str(formData, "id") }, include: { module: true } });
  refresh();
  redirect(`/admin/courses/${lesson.module.courseId}/lessons`);
}

// ---------- Savollar (dars testi va yakuniy imtihon) ----------

export type QuestionInput = { id?: string; text: string; options: string[]; correct: number; explanation?: string };

export async function saveQuestions(target: { lessonId?: string; examCourseId?: string }, questions: QuestionInput[]) {
  await requireAdminSession();
  const where = target.lessonId ? { lessonId: target.lessonId } : { examCourseId: target.examCourseId };
  if (!where.lessonId && !where.examCourseId) throw new Error("Nishon ko'rsatilmagan");

  const clean = questions
    .map((q) => ({ ...q, text: q.text.trim(), options: q.options.map((o) => o.trim()).filter(Boolean) }))
    .filter((q) => q.text && q.options.length >= 2)
    .map((q) => ({ ...q, correct: Math.min(Math.max(0, q.correct), q.options.length - 1) }));

  const existing = await db.question.findMany({ where, select: { id: true } });
  const keep = new Set(clean.map((q) => q.id).filter(Boolean));

  await db.$transaction([
    // olib tashlangan savollar o'chiriladi, qolganlari joyida yangilanadi
    db.question.deleteMany({ where: { ...where, id: { in: existing.map((e) => e.id).filter((id) => !keep.has(id)) } } }),
    ...clean.map((q, i) => {
      const data = { text: q.text, options: JSON.stringify(q.options), correct: q.correct, explanation: q.explanation?.trim() || null, order: i };
      return q.id && existing.some((e) => e.id === q.id)
        ? db.question.update({ where: { id: q.id }, data })
        : db.question.create({ data: { ...data, ...where } });
    }),
  ]);
  refresh();
  // yangi savollar ID olgan — keyingi saqlashda qayta yaratilmasligi uchun klientga qaytaramiz
  const saved = await db.question.findMany({ where, orderBy: { order: "asc" } });
  return saved.map((q) => ({ id: q.id, text: q.text, options: JSON.parse(q.options) as string[], correct: q.correct, explanation: q.explanation ?? "" }));
}

// ---------- Foydalanuvchilar ----------

export async function grantEnrollment(formData: FormData) {
  await requireAdminSession();
  const userId = str(formData, "userId");
  const courseId = str(formData, "courseId");
  await db.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });
  refresh();
}

export async function revokeEnrollment(formData: FormData) {
  await requireAdminSession();
  await db.enrollment.delete({ where: { id: str(formData, "id") } });
  refresh();
}

// ---------- To'lovlar ----------

export async function confirmPayment(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const p = await db.payment.findUniqueOrThrow({ where: { id } });
  if (p.status !== "PAID") await markPaid(id);
  refresh();
}

export async function cancelPayment(formData: FormData) {
  await requireAdminSession();
  await db.payment.updateMany({ where: { id: str(formData, "id"), status: { not: "PAID" } }, data: { status: "CANCELLED" } });
  refresh();
}

// ---------- Sertifikatlar ----------

export async function deleteCertificate(formData: FormData) {
  await requireAdminSession();
  const cert = await db.certificate.delete({ where: { id: str(formData, "id") } });
  await db.enrollment.updateMany({
    where: { userId: cert.userId, courseId: cert.courseId },
    data: { status: "ACTIVE", completedAt: null },
  });
  refresh();
}

// ---------- Fitbeklar ----------

export async function deleteFeedback(formData: FormData) {
  await requireAdminSession();
  await db.feedback.delete({ where: { id: str(formData, "id") } });
  refresh();
}

// ---------- Click va hisob sozlamalari ----------

export async function saveClickSettings(formData: FormData) {
  await requireAdminSession();
  // malakaoshirish'dagi kabi: Click kalitlarini o'zgartirish uchun parol qayta so'raladi
  if (!(await verifyCurrentPassword(String(formData.get("password") ?? "")))) redirect("/admin/click?error=password");
  await setSetting("click_service_id", str(formData, "serviceId"));
  await setSetting("click_merchant_id", str(formData, "merchantId"));
  const secret = str(formData, "secretKey");
  if (secret) await setSetting("click_secret_key", secret);
  redirect("/admin/click?saved=1");
}

export async function changeCredentials(formData: FormData) {
  await requireAdminSession();
  if (!(await verifyCurrentPassword(String(formData.get("currentPassword") ?? "")))) {
    redirect("/admin/settings?error=password");
  }
  const login = str(formData, "login") || (await getAdminLogin());
  const password = String(formData.get("newPassword") ?? "");
  if (password.length < 8 || password !== formData.get("confirmPassword")) redirect("/admin/settings?error=new");
  await changeAdminCredentials(login, password);
  // yangi parol bilan sessiya qayta yaratiladi (eski sessiyalar bekor)
  await createAdminSession();
  redirect("/admin/settings?saved=1");
}
