"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// Taqdimot: har bir bola — bitta to'liq ekranli slayd.
// Boshqaruv: ← → ↑ ↓ / Space / PageUp-PageDown, Home/End, F — to'liq ekran.
export function Deck({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = useCallback((i: number) => {
    const el = ref.current?.children[Math.max(0, Math.min(slides.length - 1, i))] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth" });
  }, [slides.length]);

  // qaysi slayd ko'rinib turganini kuzatamiz
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      // ekran markazidan o'tgan slayd — joriy (telefonda slayd ekrandan uzun bo'lsa ham ishlaydi)
      { root, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    Array.from(root.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(active + 1); }
      else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(active - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go, slides.length]);

  return (
    <div className="relative">
      <div ref={ref} className="h-[100svh] overflow-y-auto overflow-x-hidden scroll-smooth md:snap-y md:snap-mandatory">
        {slides.map((s, i) => (
          <section key={i} data-index={i} className="relative flex min-h-[100svh] snap-start snap-always items-center overflow-hidden">
            {s}
          </section>
        ))}
      </div>

      {/* o'ng tomondagi nuqtalar */}
      <nav className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex" aria-label="Slaydlar">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`${i + 1}-slayd`}
            className={`h-2.5 rounded-full shadow ring-1 ring-black/10 transition-all duration-300 ${i === active ? "w-6 bg-gold-500" : "w-2.5 bg-white/60 hover:bg-white"}`}
          />
        ))}
      </nav>

      {/* pastki panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="h-1 bg-black/10">
          <div className="h-full bg-gradient-to-r from-brand-500 to-gold-300 transition-all duration-500" style={{ width: `${((active + 1) / slides.length) * 100}%` }} />
        </div>
      </div>
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
        <button onClick={() => go(active - 1)} className="px-1 hover:text-gold-300" aria-label="Oldingi">↑</button>
        <span className="tabular-nums">{active + 1} / {slides.length}</span>
        <button onClick={() => go(active + 1)} className="px-1 hover:text-gold-300" aria-label="Keyingi">↓</button>
        <span className="hidden text-white/50 sm:inline">· F — to&apos;liq ekran</span>
      </div>
    </div>
  );
}
