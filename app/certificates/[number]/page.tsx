import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatBand, bandLevel } from "@/lib/band";
import { formatDate } from "@/lib/format";
import { Logo } from "@/components/Logo";
import { PrintButton } from "./PrintButton";

async function getCert(number: string) {
  return db.certificate.findUnique({ where: { number: number.toUpperCase() }, include: { course: true } });
}

export async function generateMetadata({ params }: PageProps<"/certificates/[number]">) {
  const cert = await getCert((await params).number);
  return { title: cert ? `Sertifikat ${cert.number}` : "Sertifikat topilmadi" };
}

export default async function CertificatePage({ params }: PageProps<"/certificates/[number]">) {
  const { number } = await params;
  const [cert, viewer] = await Promise.all([getCert(number), getCurrentUser()]);
  if (!cert) notFound();

  const url = `${process.env.APP_URL}/certificates/${cert.number}`;
  const qr = await QRCode.toDataURL(url, { margin: 0, width: 220, color: { dark: "#561530", light: "#fffaf6" } });
  const owner = viewer?.id === cert.userId;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 print:p-0">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          ✅ Haqiqiy sertifikat — Baxt oila online maktabi tomonidan berilgan
        </p>
        {owner && <PrintButton />}
      </div>

      {/* A4 landscape nisbati */}
      <div className="relative aspect-[297/210] w-full overflow-hidden rounded-xl bg-cream shadow-2xl print:rounded-none print:shadow-none">
        <div className="absolute inset-[2.5%] rounded-lg border-[6px] border-double border-gold-500" />
        <div className="absolute inset-[4%] rounded border border-gold-300" />
        <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[35%] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[50%] w-[35%] rounded-full bg-gold-100/80 blur-3xl" />

        <div className="relative flex h-full flex-col items-center justify-between px-[8%] py-[6%] text-center">
          <div className="flex flex-col items-center">
            <Logo className="scale-90 sm:scale-110" />
            <p className="mt-[2%] font-serif text-[clamp(1.25rem,4.2vw,3rem)] font-bold uppercase tracking-[0.2em] text-brand-800">
              Sertifikat
            </p>
            <p className="text-[clamp(0.6rem,1.3vw,0.95rem)] uppercase tracking-[0.3em] text-gold-700">
              kursni muvaffaqiyatli tamomlaganligi haqida
            </p>
          </div>

          <div>
            <p className="text-[clamp(0.65rem,1.4vw,1rem)] text-ink/60">Ushbu sertifikat</p>
            <p className="my-[1%] font-serif text-[clamp(1.25rem,4vw,2.9rem)] font-bold text-ink">{cert.fullName}</p>
            <p className="mx-auto max-w-[80%] text-[clamp(0.65rem,1.5vw,1.05rem)] text-ink/70">
              «{cert.course.title}» kursini to&apos;liq o&apos;qib, yakuniy imtihonni muvaffaqiyatli topshirganligini tasdiqlaydi.
            </p>
          </div>

          <div className="grid w-full grid-cols-3 items-end">
            <div className="text-left text-[clamp(0.55rem,1.15vw,0.85rem)] text-ink/70">
              <p>Berilgan sana</p>
              <p className="font-bold text-ink">{formatDate(cert.issuedAt)}</p>
              <p className="mt-[6%]">Raqami</p>
              <p className="font-mono font-bold text-ink">{cert.number}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex aspect-square w-[clamp(4rem,13vw,9rem)] flex-col items-center justify-center rounded-full border-4 border-gold-500 bg-white shadow-inner">
                <span className="font-serif text-[clamp(1.25rem,4vw,2.75rem)] font-bold leading-none text-gold-700">
                  {formatBand(cert.band)}
                </span>
                <span className="text-[clamp(0.5rem,1vw,0.75rem)] text-ink/60">/ 9.0 ball</span>
              </div>
              <p className="mt-[4%] text-[clamp(0.55rem,1.15vw,0.85rem)] font-bold text-brand-700">{bandLevel(cert.band)}</p>
            </div>
            <div className="flex flex-col items-end text-[clamp(0.5rem,1vw,0.75rem)] text-ink/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR kod" className="w-[clamp(3.5rem,10vw,7rem)]" />
              <p className="mt-1">Tekshirish: QR-kodni skanerlang</p>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mt-6 text-center text-sm text-ink/60">
        Sertifikat haqiqiyligini istalgan vaqtda{" "}
        <Link href="/verify" className="font-bold text-brand-600 underline">tekshirish sahifasida</Link> raqam orqali tasdiqlash mumkin.
      </div>
    </div>
  );
}
