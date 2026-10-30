import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const COOKIE = "bo_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 kun

// Sessiya kaliti: .env dagi SESSION_SECRET (kamida 32 belgi), bo'lmasa birinchi so'rovda
// tasodifiy kalit yaratilib bazada saqlanadi — Vercel'da qo'lda kiritish shart emas.
let cached: string | null = null;

export async function sessionSecret() {
  if (cached) return cached;
  const env = process.env.SESSION_SECRET ?? "";
  if (env.length >= 32) return (cached = env);
  const create = () =>
    db.setting.upsert({
      where: { key: "session_secret" },
      create: { key: "session_secret", value: randomBytes(32).toString("hex") },
      update: {},
    });
  // ikki so'rov bir vaqtda yaratmoqchi bo'lsa, ikkinchisi mavjudini o'qiydi
  const row = await create().catch(create);
  return (cached = row.value);
}
const key = async () => new TextEncoder().encode(await sessionSecret());

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(await key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await key());
    return typeof payload.uid === "string" ? payload.uid : null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
