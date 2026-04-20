import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data: popups = [] } = trpc.popup.list.useQuery();

  useEffect(() => {
    const closed = sessionStorage.getItem("popup-closed");
    if (!closed && popups.length > 0) {
      setVisible(true);
    }
  }, [popups]);

  const close = (today = false) => {
    if (today) {
      const expires = new Date();
      expires.setHours(23, 59, 59, 999);
      document.cookie = `popup-today=1; expires=${expires.toUTCString()}; path=/`;
    }
    sessionStorage.setItem("popup-closed", "1");
    setVisible(false);
  };

  if (!visible || popups.length === 0) return null;

  const current = popups[activeTab];
  if (!current) return null;

  let priceItems: Array<{ label: string; original?: string; price: string }> = [];
  try { priceItems = JSON.parse(current.priceItems || "[]"); } catch {}

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => close()} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* 탭 헤더 */}
        {popups.length > 1 && (
          <div className="flex border-b border-gray-100">
            {popups.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-3 text-xs font-bold transition-colors ${
                  activeTab === i
                    ? "text-white border-b-2"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={activeTab === i ? { background: current.accent, borderColor: current.accent } : {}}
              >
                {p.tab}
              </button>
            ))}
          </div>
        )}

        {/* 팝업 콘텐츠 */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                style={{ background: current.accentLight, color: current.accent }}
              >
                {current.badge}
              </span>
              <h3 className="text-xl font-black text-[#1a2744]">{current.title}</h3>
              {current.subtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{current.subtitle}</p>
              )}
            </div>
            <button onClick={() => close()} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {current.desc && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{current.desc}</p>
          )}

          {priceItems.length > 0 && (
            <div className="space-y-2 mb-4">
              {priceItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.original && (
                      <span className="text-xs text-gray-400 line-through">{item.original}</span>
                    )}
                    <span className="text-sm font-bold" style={{ color: current.accent }}>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {current.note && (
            <p className="text-xs text-gray-400 mb-4">{current.note}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => close(true)}
              className="flex-1 py-2.5 text-xs text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              오늘 하루 보지 않기
            </button>
            <button
              onClick={() => close()}
              className="flex-1 py-2.5 text-xs font-bold text-white rounded-lg transition-colors"
              style={{ background: current.accent }}
            >
              닫기
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 (여러 팝업) */}
        {popups.length > 1 && (
          <div className="flex items-center justify-center gap-2 pb-3">
            <button onClick={() => setActiveTab(i => Math.max(0, i - 1))} disabled={activeTab === 0}>
              <ChevronLeft size={14} className="text-gray-400" />
            </button>
            <span className="text-xs text-gray-400">{activeTab + 1} / {popups.length}</span>
            <button onClick={() => setActiveTab(i => Math.min(popups.length - 1, i + 1))} disabled={activeTab === popups.length - 1}>
              <ChevronRight size={14} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
