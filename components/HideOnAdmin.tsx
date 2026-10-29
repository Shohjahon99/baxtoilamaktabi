"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Admin panel va taqdimotning o'z ko'rinishi bor — platforma header/footer'i u yerda chiqmaydi
const OWN_LAYOUT = ["/admin", "/taqdimot"];

export function HideOnAdmin({ children }: { children: ReactNode }) {
  const path = usePathname();
  return OWN_LAYOUT.some((p) => path.startsWith(p)) ? null : children;
}
