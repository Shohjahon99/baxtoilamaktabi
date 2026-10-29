// Admin panel uchun umumiy kichik UI bloklari
import Link from "next/link";
import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: ReactNode; back?: { href: string; label: string }; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="text-sm text-brand-600 hover:underline">
            ← {back.label}
          </Link>
        )}
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "green" | "amber" | "red" | "slate" | "blue" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-sky-50 text-sky-700",
  };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Notice({ tone, children }: { tone: "green" | "red" | "amber"; children: ReactNode }) {
  const tones = { green: "bg-emerald-50 text-emerald-700", red: "bg-red-50 text-red-700", amber: "bg-amber-50 text-amber-800" };
  return <p className={`mb-4 rounded-xl px-4 py-2.5 text-sm font-medium ${tones[tone]}`}>{children}</p>;
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-slate-50 text-left text-slate-500">
          <tr>
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {empty && <p className="p-8 text-center text-slate-400">Hozircha ma&apos;lumot yo&apos;q</p>}
    </div>
  );
}

export const PAYMENT_STATUS: Record<string, { label: string; tone: "green" | "amber" | "red" | "slate" | "blue" }> = {
  PAID: { label: "To'langan", tone: "green" },
  PENDING: { label: "Kutilmoqda", tone: "amber" },
  PREPARED: { label: "Click'da", tone: "blue" },
  CANCELLED: { label: "Bekor qilingan", tone: "red" },
};
