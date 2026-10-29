"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
    >
      🖨 Yuklab olish / chop etish (PDF)
    </button>
  );
}
