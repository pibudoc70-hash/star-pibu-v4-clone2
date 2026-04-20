import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Bell, Layers, Users, LogOut,
  Plus, Pencil, Trash2, Eye, EyeOff, Shield, ShieldOff,
  ChevronRight, X, Save, AlertCircle
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLang } from "@/contexts/useLang";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Tab = "overview" | "events" | "popups" | "users";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { t } = useLang();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1b2a]">
        <div className="w-10 h-10 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1b2a] gap-4">
        <p className="text-white/60">관리자 로그인이 필요합니다.</p>
        <a href={getLoginUrl()}
          className="px-6 py-3 bg-[#c9a96e] text-[#0d1b2a] font-bold rounded-full hover:bg-[#e8d5b0] transition-colors">
          로그인
        </a>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1b2a] gap-4">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-white/60">관리자 권한이 없습니다.</p>
        <button onClick={() => navigate("/")}
          className="px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
          홈으로
        </button>
      </div>
    );
  }

  const navItems = [
    { id: "overview" as Tab, label: "대시보드", icon: LayoutDashboard },
    { id: "events" as Tab, label: t.admin.events, icon: Bell },
    { id: "popups" as Tab, label: t.admin.popups, icon: Layers },
    { id: "users" as Tab, label: t.admin.users, icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#0d1b2a]">
      {/* 사이드바 */}
      <aside className="w-56 bg-[#0d1b2a] border-r border-white/10 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <p className="text-[#c9a96e] text-xs font-bold uppercase tracking-widest">Admin</p>
          <p className="text-white font-bold text-sm mt-0.5">스타피부과</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-[#c9a96e]/15 text-[#c9a96e]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-white/70 text-xs font-semibold truncate">{user.name}</p>
            <p className="text-[#c9a96e] text-[10px]">관리자</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-white/70 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut size={14} />
            {t.admin.logout}
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto bg-[#f8f9fc]">
        <div className="p-6">
          {tab === "overview" && <OverviewTab />}
          {tab === "events" && <EventsTab />}
          {tab === "popups" && <PopupsTab />}
          {tab === "users" && <UsersTab />}
        </div>
      </main>
    </div>
  );
}

/* ── Overview ── */
function OverviewTab() {
  const { data: events = [] } = trpc.events.list.useQuery();
  const { data: popups = [] } = trpc.popup.list.useQuery();

  const stats = [
    { label: "전체 이벤트", value: events.length, color: "#1a2744" },
    { label: "활성 팝업", value: popups.filter(p => p.isActive === "1").length, color: "#c9a96e" },
    { label: "총 조회수", value: events.reduce((s, e) => s + (Number(e.views) || 0), 0), color: "#4ecdc4" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a2744] mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-400 mb-1">{s.label}</p>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-[#1a2744] mb-3">최근 이벤트</h2>
        {events.slice(0, 5).map(ev => (
          <div key={ev.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-700 truncate flex-1">{ev.title}</span>
            <span className="text-xs text-gray-400 ml-2">{ev.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Events Tab ── */
function EventsTab() {
  const utils = trpc.useUtils();
  const { data: events = [], isLoading } = trpc.events.list.useQuery();
  const createEvent = trpc.events.create.useMutation({ onSuccess: () => { utils.events.list.invalidate(); toast.success("이벤트가 등록되었습니다."); setForm(null); } });
  const updateEvent = trpc.events.update.useMutation({ onSuccess: () => { utils.events.list.invalidate(); toast.success("수정되었습니다."); setForm(null); } });
  const deleteEvent = trpc.events.delete.useMutation({ onSuccess: () => { utils.events.list.invalidate(); toast.success("삭제되었습니다."); } });

  type EventForm = {
    id?: number;
    title?: string;
    desc?: string;
    content?: string;
    type?: "이벤트" | "공지";
    badge?: string;
    accent?: string;
    accentDark?: string;
    accentBg?: string;
    badgeColor?: string;
    iconBg?: string;
    isFeatured?: "0" | "1";
    hot?: "0" | "1";
    tag?: string;
    date?: string;
  };
  const [form, setForm] = useState<null | EventForm>(null);

  const openCreate = () => setForm({ title: "", desc: "", content: "", type: "이벤트", badge: "", accent: "#1a2744", accentDark: "#0d1b2a", accentBg: "#1a274420", badgeColor: "#1a2744", iconBg: "#1a274420", isFeatured: "0", hot: "0", tag: "", date: new Date().toISOString().slice(0, 10) });
  const openEdit = (ev: typeof events[0]) => setForm({ ...ev, type: (ev.type === "이벤트" || ev.type === "공지") ? ev.type : "이벤트" });

  const handleSave = () => {
    if (!form) return;
    if (!form.title?.trim()) { toast.error("제목을 입력해주세요."); return; }
    const eventType = (form.type === "이벤트" || form.type === "공지") ? form.type as "이벤트" | "공지" : "이벤트" as const;
    const isFeatured = (form.isFeatured === "0" || form.isFeatured === "1") ? form.isFeatured as "0" | "1" : "0" as const;
    const hot = (form.hot === "0" || form.hot === "1") ? form.hot as "0" | "1" : "0" as const;
    if (form.id) {
      updateEvent.mutate({ id: form.id, title: form.title!, desc: form.desc || "", content: form.content || "", type: eventType, badge: form.badge || "", accent: form.accent || "#1a2744", accentDark: form.accentDark || "#0d1b2a", accentBg: form.accentBg || "#1a274420", badgeColor: form.badgeColor || "#1a2744", iconBg: form.iconBg || "#1a274420", isFeatured, hot, tag: form.tag || "" });
    } else {
      createEvent.mutate({ title: form.title!, desc: form.desc || "", content: form.content || "", type: eventType, badge: form.badge || "", accent: form.accent || "#1a2744", accentDark: form.accentDark || "#0d1b2a", accentBg: form.accentBg || "#1a274420", badgeColor: form.badgeColor || "#1a2744", iconBg: form.iconBg || "#1a274420", isFeatured, hot, tag: form.tag || "", date: form.date || new Date().toISOString().slice(0, 10), category: "이벤트" as const });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#1a2744]">이벤트 관리</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#1a2744] text-white text-sm font-bold rounded-full hover:bg-[#243560] transition-colors">
          <Plus size={15} /> 이벤트 등록
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">제목</th>
                <th className="text-left px-3 py-3 text-gray-400 font-medium hidden md:table-cell">유형</th>
                <th className="text-left px-3 py-3 text-gray-400 font-medium hidden md:table-cell">날짜</th>
                <th className="text-left px-3 py-3 text-gray-400 font-medium hidden md:table-cell">조회</th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {ev.hot === "1" && <span className="text-xs text-red-400">🔥</span>}
                      {ev.isFeatured === "1" && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#c9a96e]/15 text-[#c9a96e] rounded">추천</span>}
                      <span className="font-medium text-gray-700 truncate max-w-[200px]">{ev.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400 hidden md:table-cell">{ev.type}</td>
                  <td className="px-3 py-3 text-gray-400 hidden md:table-cell">{ev.date}</td>
                  <td className="px-3 py-3 text-gray-400 hidden md:table-cell">{ev.views}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(ev)} className="p-1.5 text-gray-400 hover:text-[#1a2744] transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm("삭제하시겠습니까?")) deleteEvent.mutate({ id: ev.id }); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Bell size={32} className="mx-auto mb-2 opacity-30" />
              <p>등록된 이벤트가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 이벤트 폼 모달 */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setForm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-black text-[#1a2744]">{form.id ? "이벤트 수정" : "이벤트 등록"}</h2>
              <button onClick={() => setForm(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">제목 *</label>
                <input value={form.title || ""} onChange={e => setForm(f => f ? { ...f, title: e.target.value } : f)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e]" placeholder="이벤트 제목" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">유형</label>
                <select value={form.type || "이벤트"} onChange={e => setForm(f => f ? { ...f, type: (e.target.value === "이벤트" || e.target.value === "공지") ? e.target.value as "이벤트" | "공지" : "이벤트" } : f)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e]">
                  {["이벤트", "공지사항", "신규시술", "기타"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">배지 텍스트</label>
                <input value={form.badge || ""} onChange={e => setForm(f => f ? { ...f, badge: e.target.value } : f)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e]" placeholder="예: 이벤트, NEW, HOT" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">요약 설명</label>
                <textarea value={form.desc || ""} onChange={e => setForm(f => f ? { ...f, desc: e.target.value } : f)} rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e] resize-none" placeholder="짧은 설명" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">본문 내용</label>
                <textarea value={form.content || ""} onChange={e => setForm(f => f ? { ...f, content: e.target.value } : f)} rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e] resize-none" placeholder="상세 내용" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">카드 색상</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.accent || "#1a2744"} onChange={e => setForm(f => f ? { ...f, accent: e.target.value, accentDark: e.target.value + "cc" } : f)}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer" />
                    <span className="text-xs text-gray-400">{form.accent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured === "1"} onChange={e => setForm(f => f ? { ...f, isFeatured: e.target.checked ? "1" : "0" } : f)} className="rounded" />
                    추천 이벤트
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={form.hot === "1"} onChange={e => setForm(f => f ? { ...f, hot: e.target.checked ? "1" : "0" } : f)} className="rounded" />
                    HOT
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setForm(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={createEvent.isPending || updateEvent.isPending}
                className="flex-1 py-2.5 bg-[#1a2744] text-white text-sm font-bold rounded-lg hover:bg-[#243560] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={14} /> {form.id ? "수정 저장" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Popups Tab ── */
function PopupsTab() {
  const utils = trpc.useUtils();
  const { data: popups = [], isLoading } = trpc.popup.list.useQuery();
  const createPopup = trpc.popup.create.useMutation({ onSuccess: () => { utils.popup.list.invalidate(); toast.success("팝업이 등록되었습니다."); setForm(null); } });
  const updatePopup = trpc.popup.update.useMutation({ onSuccess: () => { utils.popup.list.invalidate(); toast.success("수정되었습니다."); setForm(null); } });
  const deletePopup = trpc.popup.delete.useMutation({ onSuccess: () => { utils.popup.list.invalidate(); toast.success("삭제되었습니다."); } });
  const togglePopup = trpc.popup.update.useMutation({ onSuccess: () => utils.popup.list.invalidate() });

  const [form, setForm] = useState<null | Partial<typeof popups[0] & { id?: number }>>(null);

  const openCreate = () => setForm({ title: "", subtitle: "", desc: "", badge: "이벤트", tab: "이벤트", accent: "#1a2744", accentLight: "#1a274420", note: "", priceItems: "[]", isActive: "1" });
  const openEdit = (p: typeof popups[0]) => setForm({ ...p });

  const handleSave = () => {
    if (!form) return;
    if (!form.title?.trim()) { toast.error("제목을 입력해주세요."); return; }
    const payload = { title: form.title!, subtitle: form.subtitle || "", desc: form.desc || "", badge: form.badge || "", tab: form.tab || form.title!, accent: form.accent || "#1a2744", accentLight: form.accentLight || "#1a274420", note: form.note || "", priceItems: form.priceItems || "[]", isActive: form.isActive || "1" };
    if (form.id) updatePopup.mutate({ id: form.id, ...payload });
    else createPopup.mutate(payload);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#1a2744]">팝업 관리</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#1a2744] text-white text-sm font-bold rounded-full hover:bg-[#243560] transition-colors">
          <Plus size={15} /> 팝업 등록
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {popups.map(p => (
            <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: p.accent }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a2744] truncate">{p.title}</p>
                <p className="text-xs text-gray-400 truncate">{p.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePopup.mutate({ id: p.id })}
                  className={`p-1.5 rounded-lg transition-colors ${p.isActive === "1" ? "text-green-500 hover:bg-green-50" : "text-gray-300 hover:bg-gray-50"}`}>
                  {p.isActive === "1" ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-[#1a2744] transition-colors"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm("삭제하시겠습니까?")) deletePopup.mutate({ id: p.id }); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {popups.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">
              <Layers size={32} className="mx-auto mb-2 opacity-30" />
              <p>등록된 팝업이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setForm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-black text-[#1a2744]">{form.id ? "팝업 수정" : "팝업 등록"}</h2>
              <button onClick={() => setForm(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">제목 *</label>
                <input value={form.title || ""} onChange={e => setForm(f => f ? { ...f, title: e.target.value } : f)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e]" placeholder="팝업 제목" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">부제목</label>
                <input value={form.subtitle || ""} onChange={e => setForm(f => f ? { ...f, subtitle: e.target.value } : f)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e]" placeholder="부제목 (선택)" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">배지 텍스트</label>
                <input value={form.badge || ""} onChange={e => setForm(f => f ? { ...f, badge: e.target.value } : f)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e]" placeholder="예: 이벤트, 공지" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">설명</label>
                <textarea value={form.desc || ""} onChange={e => setForm(f => f ? { ...f, desc: e.target.value } : f)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">가격 항목 (JSON)</label>
                <textarea value={form.priceItems || "[]"} onChange={e => setForm(f => f ? { ...f, priceItems: e.target.value } : f)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-[#c9a96e] resize-none"
                  placeholder='[{"label":"시술명","original":"정가","price":"이벤트가"}]' />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">색상</label>
                  <input type="color" value={form.accent || "#1a2744"} onChange={e => setForm(f => f ? { ...f, accent: e.target.value } : f)}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mt-4">
                  <input type="checkbox" checked={form.isActive === "1"} onChange={e => setForm(f => f ? { ...f, isActive: e.target.checked ? "1" : "0" } : f)} className="rounded" />
                  활성화
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setForm(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={createPopup.isPending || updatePopup.isPending}
                className="flex-1 py-2.5 bg-[#1a2744] text-white text-sm font-bold rounded-lg hover:bg-[#243560] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={14} /> {form.id ? "수정 저장" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Users Tab ── */
function UsersTab() {
  const utils = trpc.useUtils();
  const { data: users = [], isLoading } = trpc.admin.users.useQuery();
  const changeRole = trpc.admin.updateRole.useMutation({
    onSuccess: () => {
      utils.admin.users.invalidate();
      toast.success("권한이 변경되었습니다.");
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a2744] mb-6">사용자 관리</h1>
      <div className="bg-[#0d1b2a] rounded-2xl p-4 mb-4 text-sm text-white/60">
        <p className="text-[#c9a96e] font-bold mb-1">관리자 권한 변경 안내</p>
        <p>사용자의 role을 admin으로 변경하면 관리자 대시보드 접근 권한이 부여됩니다. 신중하게 변경해 주세요.</p>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">사용자</th>
                <th className="text-left px-3 py-3 text-gray-400 font-medium hidden md:table-cell">이메일</th>
                <th className="text-left px-3 py-3 text-gray-400 font-medium">권한</th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">권한 변경</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: { id: number; name: string | null; email: string | null; role: string; openId: string }) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(u.name || "?").charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">{u.name || "이름 없음"}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400 hidden md:table-cell">{u.email || "-"}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-[#c9a96e]/15 text-[#c9a96e]" : "bg-gray-100 text-gray-500"}`}>
                      {u.role === "admin" ? "관리자" : "일반"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const newRole = u.role === "admin" ? "user" : "admin";
                          if (confirm(`${u.name || "이 사용자"}의 권한을 '${newRole === "admin" ? "관리자" : "일반"}'로 변경하시겠습니까?`)) {
                            changeRole.mutate({ id: u.id, role: newRole as "admin" | "user" });
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                          u.role === "admin"
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : "bg-[#1a2744]/10 text-[#1a2744] hover:bg-[#1a2744]/20"
                        }`}
                      >
                        {u.role === "admin" ? <><ShieldOff size={12} /> 권한 해제</> : <><Shield size={12} /> 관리자 지정</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p>등록된 사용자가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
