"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function TelegramLogin({ next }: { next: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "waiting" | "error">("idle");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  async function start() {
    setError("");
    // oynani darhol ochamiz (aks holda brauzer popup'ni bloklaydi), keyin manzilini beramiz
    const win = window.open("", "_blank");
    const res = await fetch("/api/auth/telegram/start", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      win?.close();
      setState("error");
      setError(data.error ?? "Xatolik yuz berdi");
      return;
    }
    if (win) win.location.href = data.url;
    else window.location.href = data.url;
    setState("waiting");

    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(async () => {
      const r = await fetch("/api/auth/telegram/poll", { method: "POST" });
      const d = await r.json();
      if (d.status === "OK") {
        clearInterval(timer.current!);
        router.push(next);
        router.refresh();
      } else if (d.status === "EXPIRED") {
        clearInterval(timer.current!);
        setState("error");
        setError("Vaqt tugadi. Qaytadan urinib ko'ring.");
      }
    }, 2000);
  }

  return (
    <div>
      <button
        onClick={start}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-[#229ED9] py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-[#1c8cc2]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
        Telegram orqali kirish
      </button>
      {state === "waiting" && (
        <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900">
          <p className="font-bold">⏳ Telegram botda tasdiqlashni kutyapmiz...</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Ochilgan botda <b>«Start»</b> tugmasini bosing</li>
            <li>Birinchi marta bo&apos;lsa, telefon raqamingizni yuboring</li>
            <li><b>«Kirishni tasdiqlash»</b> tugmasini bosing</li>
          </ol>
          <p className="mt-2 text-sky-900/70">Tasdiqlangach, bu sahifa o&apos;zi ochiladi.</p>
        </div>
      )}
      {state === "error" && <p className="mt-3 text-center text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
}
