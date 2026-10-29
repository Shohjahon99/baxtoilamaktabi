"use client";

import type { ReactNode } from "react";

// Forma ichidagi tugma: bosilganda tasdiqlash so'raydi (o'chirish va h.k. uchun)
export function ConfirmButton({ message, children, className = "" }: { message: string; children: ReactNode; className?: string }) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
