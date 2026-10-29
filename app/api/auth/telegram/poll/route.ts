import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST() {
  const store = await cookies();
  const code = store.get("bo_login")?.value;
  if (!code) return Response.json({ status: "EXPIRED" });

  const token = await db.loginToken.findUnique({ where: { code } });
  if (!token || token.expiresAt < new Date()) return Response.json({ status: "EXPIRED" });
  if (token.status !== "CONFIRMED" || !token.userId) return Response.json({ status: "PENDING" });

  await db.loginToken.update({ where: { id: token.id }, data: { status: "USED" } });
  await createSession(token.userId);
  store.delete("bo_login");
  return Response.json({ status: "OK" });
}
