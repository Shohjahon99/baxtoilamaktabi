import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Sertifikatni tekshirish" };

async function verify(formData: FormData) {
  "use server";
  const number = String(formData.get("number") || "").trim().toUpperCase();
  const cert = number ? await db.certificate.findUnique({ where: { number } }) : null;
  redirect(cert ? `/certificates/${cert.number}` : `/verify?notfound=${encodeURIComponent(number)}`);
}

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const { notfound } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-center font-serif text-3xl font-bold text-brand-900">Sertifikatni tekshirish</h1>
      <p className="mt-2 text-center text-ink/70">Sertifikatdagi raqamni kiriting yoki QR-kodni skanerlang.</p>
      <form action={verify} className="mt-8 flex gap-2">
        <input
          name="number"
          required
          defaultValue={typeof notfound === "string" ? notfound : ""}
          placeholder="BO-2026-000001"
          className="flex-1 rounded-full border border-brand-200 bg-white px-5 py-3 font-mono uppercase"
        />
        <button className="rounded-full bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">Tekshirish</button>
      </form>
      {typeof notfound === "string" && (
        <p className="mt-4 rounded-2xl bg-red-50 p-4 text-center font-bold text-red-700">
          ❌ «{notfound}» raqamli sertifikat topilmadi.
        </p>
      )}
    </div>
  );
}
