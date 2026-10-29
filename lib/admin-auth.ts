import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { getSetting, setSetting } from "./settings";
import { sessionSecret } from "./session";

// Admin panel platformadan alohida: o'z login/paroli va alohida cookie'si bor.
// Boshlang'ich login/parol .env dagi ADMIN_LOGIN / ADMIN_PASSWORD dan olinadi,
// paneldan o'zgartirilgach bazada (scrypt xeshi) saqlanadi.

const COOKIE = "bo_admin";
const MAX_AGE = 60 * 60 * 12; // 12 soat
const key = () => new TextEncoder().encode(`${sessionSecret()}:admin`);

function hash(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyHash(password: string, stored: string) {
  const [salt, h] = stored.split(":");
  if (!salt || !h) return false;
  const a = Buffer.from(h, "hex");
  const b = scryptSync(password, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function getCredentials() {
  const login = (await getSetting("admin_login")) ?? process.env.ADMIN_LOGIN ?? "";
  const stored = await getSetting("admin_password_hash");
  return { login, stored };
}

// Parol o'zgarsa eski sessiyalar bekor bo'lishi uchun tokenga parol versiyasi qo'shiladi
async function passwordVersion() {
  const { stored } = await getCredentials();
  return stored ? stored.slice(0, 12) : "env";
}

export async function checkAdminPassword(login: string, password: string) {
  const creds = await getCredentials();
  if (!creds.login || login !== creds.login) return false;
  if (creds.stored) return verifyHash(password, creds.stored);
  const envPassword = process.env.ADMIN_PASSWORD ?? "";
  return envPassword.length > 0 && password === envPassword;
}

// Muhim amallardan oldin (Click kalitlari, parol almashtirish) joriy parolni qayta tekshirish
export async function verifyCurrentPassword(password: string) {
  const { login } = await getCredentials();
  return checkAdminPassword(login, password);
}

export async function getAdminLogin() {
  return (await getCredentials()).login;
}

export async function changeAdminCredentials(login: string, password: string) {
  await setSetting("admin_login", login);
  await setSetting("admin_password_hash", hash(password));
}

export async function createAdminSession() {
  const token = await new SignJWT({ adm: true, pv: await passwordVersion() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload.adm === true && payload.pv === (await passwordVersion());
  } catch {
    return false;
  }
}

// Har bir admin sahifasi va server action boshida chaqiriladi
export async function requireAdminSession() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE);
}

// Oddiy brute-force himoyasi: IP bo'yicha 10 daqiqada 5 ta noto'g'ri urinish
const attempts = new Map<string, { count: number; until: number }>();

export async function loginRateLimited() {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.until > now && rec.count >= 5) return { blocked: true, ip };
  return { blocked: false, ip };
}

export function registerFailedLogin(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.until < now) attempts.set(ip, { count: 1, until: now + 10 * 60 * 1000 });
  else rec.count++;
}
