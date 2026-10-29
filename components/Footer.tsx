import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="no-print mt-20 border-t border-brand-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-ink/70">
            «Oila — kichik Vatan». Mustahkam oila uchun zarur bilimlarni uydan chiqmasdan o&apos;rganing.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-bold">Platforma</p>
          <ul className="space-y-1 text-ink/70">
            <li><Link href="/courses" className="hover:text-brand-600">Kurslar</Link></li>
            <li><Link href="/verify" className="hover:text-brand-600">Sertifikatni tekshirish</Link></li>
            <li><Link href="/dashboard" className="hover:text-brand-600">Shaxsiy kabinet</Link></li>
          </ul>
        </div>
        <div className="text-sm text-ink/70">
          <p className="mb-2 font-bold text-ink">Aloqa</p>
          <p>«IT CENTER SURXON» MChJ</p>
          <p>Surxondaryo viloyati</p>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-ink/50">© {new Date().getFullYear()} Baxt oila online maktabi</p>
    </footer>
  );
}
