import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { clickConfigured, clickPayUrl, markPaid } from "@/lib/payments";
import { getClickConfig } from "@/lib/settings";
import { formatSum } from "@/lib/format";

export const metadata: Metadata = { title: "To'lov" };

async function devPay(formData: FormData) {
  "use server";
  if ((await clickConfigured()) || process.env.DEV_LOGIN !== "1") throw new Error("Test to'lov o'chirilgan");
  const user = await requireUser();
  const id = String(formData.get("paymentId"));
  const payment = await db.payment.findUniqueOrThrow({ where: { id } });
  if (payment.userId !== user.id) throw new Error("Ruxsat yo'q");
  const paid = await markPaid(id);
  redirect(`/learn/${paid.course.slug}`);
}

export default async function PayPage({ params }: PageProps<"/pay/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/pay/${id}`);
  const payment = await db.payment.findUnique({ where: { id }, include: { course: true } });
  if (!payment || payment.userId !== user.id) notFound();

  const paid = payment.status === "PAID";
  const click = await getClickConfig();
  const clickReady = !!(click.serviceId && click.merchantId && click.secretKey);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-[2rem] border border-brand-100 bg-white p-8 text-center shadow-sm">
        <p className="text-5xl">{payment.course.emoji}</p>
        <h1 className="mt-3 font-serif text-2xl font-bold">{payment.course.title}</h1>
        <p className="mt-4 text-sm text-ink/60">To&apos;lov summasi</p>
        <p className="font-serif text-4xl font-bold text-brand-700">{formatSum(payment.amount)}</p>

        {paid ? (
          <>
            <p className="mt-6 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">✅ To&apos;lov qabul qilingan. Kurs ochiq!</p>
            <Link href={`/learn/${payment.course.slug}`} className="mt-4 block rounded-full bg-brand-600 py-3 font-bold text-white">
              O&apos;qishni boshlash
            </Link>
          </>
        ) : clickReady ? (
          <>
            <a href={clickPayUrl(click, payment.id, payment.amount)} className="mt-6 block rounded-full bg-[#00a3e0] py-3.5 font-bold text-white hover:bg-[#0090c7]">
              Click orqali to&apos;lash
            </a>
            <p className="mt-3 text-xs text-ink/60">
              To&apos;lovdan so&apos;ng kurs avtomatik ochiladi va Telegram&apos;ga xabar keladi. Bu sahifaga qaytib, yangilang.
            </p>
          </>
        ) : process.env.DEV_LOGIN === "1" ? (
          <form action={devPay} className="mt-6">
            <input type="hidden" name="paymentId" value={payment.id} />
            <button className="w-full rounded-full bg-gold-500 py-3 font-bold text-white hover:bg-gold-700">
              Test to&apos;lov (dev rejim)
            </button>
            <p className="mt-2 text-xs text-ink/60">Click kalitlari .env da yo&apos;q — test to&apos;lov bilan kurs ochiladi.</p>
          </form>
        ) : (
          <p className="mt-6 text-sm text-red-600">To&apos;lov tizimi vaqtincha ishlamayapti.</p>
        )}
      </div>
    </div>
  );
}
