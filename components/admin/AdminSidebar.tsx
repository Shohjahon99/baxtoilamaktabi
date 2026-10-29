"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminLogout } from "@/app/admin/actions";

const icon = (d: string) => (
  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: icon("M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z") },
  { href: "/admin/courses", label: "Kurslar", icon: icon("M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5") },
  { href: "/admin/users", label: "Foydalanuvchilar", icon: icon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75") },
  { href: "/admin/payments", label: "To'lovlar", icon: icon("M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20") },
  { href: "/admin/certificates", label: "Sertifikatlar", icon: icon("M12 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12M8.5 13 7 22l5-3 5 3-1.5-9") },
  { href: "/admin/feedbacks", label: "Fitbeklar", icon: icon("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 10h.01M12 10h.01M16 10h.01") },
  { href: "/admin/click", label: "Click sozlama", icon: icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 5a10 10 0 0 1 0 14M5 5a10 10 0 0 0 0 14") },
  { href: "/admin/settings", label: "Sozlamalar", icon: icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1") },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobil: yuqori panel */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white md:hidden">
        <span className="font-bold">Baxt oila · Admin</span>
        <button onClick={() => setOpen(!open)} className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-800">
          {open ? "Yopish" : "Menyu"}
        </button>
      </div>
      <aside className={`${open ? "block" : "hidden"} w-full shrink-0 bg-slate-900 text-white md:flex md:min-h-screen md:w-60 md:flex-col`}>
        <div className="hidden items-center gap-3 border-b border-slate-700 p-4 md:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-lg">❤</span>
          <div>
            <p className="text-sm font-bold leading-tight">Baxt oila Admin</p>
            <p className="text-[10px] leading-none text-slate-400">IT Center Surxon</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname.startsWith(item.href) ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-700 p-4 text-sm">
          <a href="/" target="_blank" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
            ↗ Saytni ochish
          </a>
          <form action={adminLogout}>
            <button className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">⎋ Chiqish</button>
          </form>
        </div>
      </aside>
    </>
  );
}
