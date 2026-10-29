import type { Metadata } from "next";
import { Nunito, Lora } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HideOnAdmin } from "@/components/HideOnAdmin";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin", "latin-ext", "cyrillic"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "latin-ext", "cyrillic"] });

export const metadata: Metadata = {
  title: { default: "Baxt oila online maktabi", template: "%s — Baxt oila" },
  description:
    "Turmush qurish arafasidagi yoshlar, bo'lajak ota-onalar va o'smirlar uchun onlayn oila maktabi. Kurslarni o'qing, imtihon topshiring va sertifikat oling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${nunito.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main className="flex-1">{children}</main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
      </body>
    </html>
  );
}
