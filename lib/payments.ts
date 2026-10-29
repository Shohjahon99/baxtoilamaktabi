import { createHash } from "crypto";
import { db } from "./db";
import { notifyUser } from "./telegram";
import { formatSum } from "./format";
import { getClickConfig, type ClickConfig } from "./settings";

// Click kalitlari admin paneldagi «Click sozlama» dan (bo'lmasa .env dan) olinadi
export const clickConfigured = async () => {
  const c = await getClickConfig();
  return !!(c.serviceId && c.merchantId && c.secretKey);
};

export function clickPayUrl(config: ClickConfig, paymentId: string, amount: number) {
  const u = new URL("https://my.click.uz/services/pay");
  u.searchParams.set("service_id", config.serviceId);
  u.searchParams.set("merchant_id", config.merchantId);
  u.searchParams.set("amount", String(amount));
  u.searchParams.set("transaction_param", paymentId);
  u.searchParams.set("return_url", `${process.env.APP_URL}/pay/${paymentId}`);
  return u.toString();
}

export const md5 = (s: string) => createHash("md5").update(s).digest("hex");

// To'lov tasdiqlanganda: to'lovni PAID qilish, kursni ochish, Telegram'ga xabar
export async function markPaid(paymentId: string, clickTransId?: string) {
  const payment = await db.payment.update({
    where: { id: paymentId },
    data: { status: "PAID", paidAt: new Date(), ...(clickTransId ? { clickTransId } : {}) },
    include: { course: true, user: true },
  });
  await db.enrollment.upsert({
    where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
    create: { userId: payment.userId, courseId: payment.courseId },
    update: {},
  });
  await notifyUser(
    payment.user.telegramId,
    `✅ To'lov qabul qilindi: ${formatSum(payment.amount)}\n«${payment.course.title}» kursi ochildi: ${process.env.APP_URL}/learn/${payment.course.slug}`
  );
  return payment;
}
