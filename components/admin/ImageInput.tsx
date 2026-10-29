"use client";

import { useState } from "react";
import { inputCls } from "./ui";

// Rasm: URL kiritish yoki kompyuterdan yuklash (/api/admin/upload)
export function ImageInput({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) setUrl(data.url);
    else setError(data.error ?? "Yuklashda xato");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://... yoki rasm yuklang" className={inputCls} />
        <label className="shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium hover:bg-slate-100">
          {busy ? "Yuklanmoqda..." : "📁 Yuklash"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url.startsWith("https://images.unsplash.com") ? `${url}?auto=format&fit=crop&w=600&q=60` : url} alt="" className="h-36 w-64 rounded-xl border object-cover" />
      )}
    </div>
  );
}
