"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Admin panelning o'z layout'i bor — platforma header/footer'i u yerda chiqmaydi
export function HideOnAdmin({ children }: { children: ReactNode }) {
  return usePathname().startsWith("/admin") ? null : children;
}
