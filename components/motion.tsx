"use client";

// Sayt bo'ylab ishlatiladigan animatsiya bloklari (motion kutubxonasi asosida).
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// Ko'rinish maydoniga kirganda pastdan chiqib keladi
export function Reveal({ children, delay = 0, y = 32, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// Raqamni 0 dan qiymatgacha sanab chiqadi
export function CountUp({ to, duration = 2, decimals = 0, suffix = "", className = "" }: { to: number; duration?: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  const [text, setText] = useState(format(0, decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: "easeOut", onUpdate: (v) => setText(format(v, decimals)) });
    return () => controls.stop();
  }, [inView, to, duration, decimals, value]);

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}

function format(v: number, decimals: number) {
  return v.toLocaleString("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace(/,/g, ".");
}

// Sarlavhadagi almashinib turuvchi so'z
export function RotatingWord({ words, className = "" }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className={`relative inline-grid align-bottom ${className}`}>
      {/* eng uzun so'z joyni band qiladi, sakrash bo'lmaydi */}
      <span className="invisible col-start-1 row-start-1">{words.reduce((a, b) => (a.length > b.length ? a : b))}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[i]}
          className="col-start-1 row-start-1"
          initial={{ y: "70%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Sekin suzib yuruvchi element (hero rasmlari uchun)
export function Float({ children, delay = 0, distance = 14, className = "" }: { children: ReactNode; delay?: number; distance?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: [0, -distance, 0] }}
      transition={
        reduce
          ? { duration: 0.6 }
          : { opacity: { duration: 0.9, delay }, scale: { duration: 0.9, delay, ease }, y: { duration: 6, delay, repeat: Infinity, ease: "easeInOut" } }
      }
    >
      {children}
    </motion.div>
  );
}

// Skroll bo'yicha sekin siljiydigan fon (parallax)
export function Parallax({ children, offset = 80, className = "" }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-[calc(100%+160px)] -mt-20">
        {children}
      </motion.div>
    </div>
  );
}

// Ko'rinishga kirganda o'sib chiqadigan ustun (diagramma uchun)
export function GrowBar({ percent, delay = 0, className = "" }: { percent: number; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ height: 0 }}
      whileInView={{ height: `${percent}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease }}
    />
  );
}

// Ko'rinishga kirganda eniga o'sadigan chiziq (gorizontal diagramma uchun)
export function GrowWidth({ percent, delay = 0, className = "" }: { percent: number; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ width: 0 }}
      whileInView={{ width: `${percent}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease }}
    />
  );
}

// Kartochka: sichqoncha bilan biroz qiyshayadi (3D tilt)
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onMouseLeave={() => {
        animate(rx, 0, { duration: 0.5 });
        animate(ry, 0, { duration: 0.5 });
      }}
    >
      {children}
    </motion.div>
  );
}
