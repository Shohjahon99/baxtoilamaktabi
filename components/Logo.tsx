export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-10 w-10 drop-shadow-sm" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d23e70" />
            <stop offset="1" stopColor="#7a1d3f" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#logo-g)" />
        <path d="M20 29s-8.5-5.2-8.5-11a4.6 4.6 0 0 1 8.5-2.5 4.6 4.6 0 0 1 8.5 2.5c0 5.8-8.5 11-8.5 11Z" fill="#fff" />
        <path d="M14 31.5h12" stroke="#e9c46a" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="leading-tight">
        <span className="block font-serif text-lg font-bold text-brand-800 transition-colors group-data-[dark=true]:text-white">Baxt oila</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-brand-500 transition-colors group-data-[dark=true]:text-gold-300">
          online maktabi
        </span>
      </span>
    </span>
  );
}
