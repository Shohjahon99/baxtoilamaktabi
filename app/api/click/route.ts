// Click SHOP API: bitta URL ham Prepare (action=0), ham Complete (action=1) uchun.
// Click kabinetida Prepare URL va Complete URL ikkalasiga ham shu manzil yoziladi: {APP_URL}/api/click
import { db } from "@/lib/db";
import { markPaid, md5 } from "@/lib/payments";
import { getClickConfig } from "@/lib/settings";

type Params = Record<string, string>;

function reply(p: Params, error: number, error_note: string, extra: Record<string, unknown> = {}) {
  return Response.json({
    click_trans_id: Number(p.click_trans_id),
    merchant_trans_id: p.merchant_trans_id,
    error,
    error_note,
    ...extra,
  });
}

export async function POST(request: Request) {
  const p = Object.fromEntries((await request.formData()).entries()) as Params;
  const click = await getClickConfig();
  const secret = click.secretKey;
  const action = Number(p.action);

  const expected =
    action === 0
      ? md5(`${p.click_trans_id}${p.service_id}${secret}${p.merchant_trans_id}${p.amount}${p.action}${p.sign_time}`)
      : md5(`${p.click_trans_id}${p.service_id}${secret}${p.merchant_trans_id}${p.merchant_prepare_id}${p.amount}${p.action}${p.sign_time}`);

  if (!secret || p.sign_string !== expected) return reply(p, -1, "SIGN CHECK FAILED");
  if (p.service_id !== click.serviceId) return reply(p, -1, "SIGN CHECK FAILED");
  if (action !== 0 && action !== 1) return reply(p, -3, "Action not found");

  const payment = await db.payment.findUnique({ where: { id: p.merchant_trans_id } });
  if (!payment) return reply(p, -5, "User does not exist");
  if (Math.abs(Number(p.amount) - payment.amount) > 0.01) return reply(p, -2, "Incorrect parameter amount");
  if (payment.status === "PAID") return reply(p, -4, "Already paid");
  if (payment.status === "CANCELLED") return reply(p, -9, "Transaction cancelled");

  if (action === 0) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "PREPARED", clickTransId: p.click_trans_id } });
    return reply(p, 0, "Success", { merchant_prepare_id: Number(p.click_trans_id) });
  }

  // Complete
  if (payment.clickTransId !== p.click_trans_id || p.merchant_prepare_id !== p.click_trans_id) {
    return reply(p, -6, "Transaction does not exist");
  }
  if (Number(p.error) < 0) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } });
    return reply(p, -9, "Transaction cancelled");
  }
  await markPaid(payment.id, p.click_trans_id);
  return reply(p, 0, "Success", { merchant_confirm_id: Number(p.click_trans_id) });
}
