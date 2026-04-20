export default function StarLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12"
          fill="#c9a96e"
          stroke="#c9a96e"
          strokeWidth="0.5"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-bold tracking-[0.25em] text-[#c9a96e] uppercase">Star</span>
        <span className="text-[10px] font-medium tracking-[0.15em] text-white/80 uppercase">Dermatology</span>
      </div>
    </div>
  );
}
