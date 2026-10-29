import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "./Logo";
import { HeaderShell } from "./HeaderShell";

const navLink =
  "rounded-full px-3 py-2 transition sm:px-4 hover:bg-brand-50 group-data-[dark=true]:text-white group-data-[dark=true]:hover:bg-white/10";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <HeaderShell>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-bold">
          <Link href="/courses" className={navLink}>Kurslar</Link>
          <Link href="/#oila-statistika" className={`hidden md:block ${navLink}`}>Nega muhim?</Link>
          <Link href="/verify" className={`hidden sm:block ${navLink}`}>Sertifikatni tekshirish</Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="ml-1 shrink-0 rounded-full bg-brand-600 px-4 py-2.5 text-white sm:px-5 shadow-lg shadow-brand-600/25 transition hover:scale-105 hover:bg-brand-700 group-data-[dark=true]:bg-white group-data-[dark=true]:text-brand-800"
          >
            {user ? "Kabinet" : "Kirish"}
          </Link>
        </nav>
      </div>
    </HeaderShell>
  );
}
