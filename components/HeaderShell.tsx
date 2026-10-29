"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

// Bosh sahifada yuqorida turganda header shaffof va oq matnli (hero ustida),
// skroll qilinganda oddiy oq fonga o'tadi.
export function HeaderShell({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = isHome && !scrolled;
  return (
    <header
      data-dark={dark}
      className={`group no-print sticky top-0 z-40 transition-colors duration-500 ${
        dark ? "border-b border-transparent bg-transparent" : "border-b border-brand-100 bg-cream/85 shadow-sm backdrop-blur-xl"
      }`}
    >
      {children}
    </header>
  );
}
