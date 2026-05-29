/**
 * FloatingCTA - 하단 고정 CTA + 언어 전환 버튼 통합
 * 디자인: 우측 하단 세로 배열 (전화→카카오→네이버→구분선→언어 버튼)
 * - 데스크톱: 우측 하단 고정 플로팅 버튼 세로 스택
 * - 모바일: 하단 바(전화·카카오·네이버) + 좌측 하단 언어 버튼
 * - 언어 버튼: 국기 이모지 대신 EN/JP/CN/KO 텍스트 코드 표시
 * - safe-area-inset-bottom 적용으로 iPhone 홈 인디케이터 영역 침범 방지
 */
import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { Lang, langCodes } from "@/lib/i18n";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const WECHAT_ID = "star2006beauty";
  const KAKAO_URL = "https://pf.kakao.com/_HNyGC";
  const LINE_URL = "https://line.me/ti/p/~star2006derm";
  const JA_LINE_URL = "https://lin.ee/tyuRdUc";
  const NAVER_URL = "https://booking.naver.com/booking/13/bizes/209080";
  const reserveUrl = lang === "zh" ? LINE_URL : lang === "ja" ? JA_LINE_URL : NAVER_URL;
  const chatUrl = lang === "zh" ? "#" : KAKAO_URL;

  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };

  const labels = {
    call:      lang === "ja" ? "電話"         : lang === "zh" ? "电话"          : lang === "en" ? "Call"    : "전화",
    kakao:     lang === "ja" ? "カカオ"        : lang === "zh" ? "WeChat"         : lang === "en" ? "Kakao"   : "카카오",
    map:       lang === "ja" ? "LINE予約"    : lang === "zh" ? "LINE"           : lang === "en" ? "Book"    : "예약",
    callAria:  lang === "ja" ? "電話相談"      : lang === "zh" ? "电话咨询"      : lang === "en" ? "Call Us" : "전화 상담",
    kakaoAria: lang === "ja" ? "カカオトーク"  : lang === "zh" ? "WeChat咨询" : lang === "en" ? "KakaoTalk" : "카카오톡 상담",
    mapAria:   lang === "ja" ? "LINE予約"    : lang === "zh" ? "LINE咨询"       : lang === "en" ? "Naver Booking" : "네이버 예약",
    chatBg:    lang === "zh" ? "#07C160" : "#FEE500",
    chatColor: lang === "zh" ? "white" : "#1F2937",
  };

  // 현재 언어 제외한 전환 옵션 (EN/JP/CN/KO 텍스트 코드 사용)
  const langOptions: { lang: Lang; code: string; label: string }[] = [
    { lang: "ko", code: langCodes.ko, label: "한국어" },
    { lang: "en", code: langCodes.en, label: "English" },
    { lang: "ja", code: langCodes.ja, label: "日本語" },
    { lang: "zh", code: langCodes.zh, label: "中文" },
  ].filter((o) => o.lang !== lang) as { lang: Lang; code: string; label: string }[];

  return (
    <>
      {/* ── 모바일 하단 바 ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          background: "white",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
        }}
      >
        <div className="flex">
          <a
            href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
              color: "white",
              borderRight: "1px solid rgba(255,255,255,0.3)",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              minHeight: "52px",
            }}
          >
            <Phone size={18} />
            {labels.call}
          </a>
          <a
            href={chatUrl}
            target={lang === "zh" ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-xs font-semibold relative"
            style={{
              background: labels.chatBg,
              color: labels.chatColor,
              minHeight: "52px",
            }}
          >
            <MessageCircle size={18} />
            {wechatCopied ? (lang === "zh" ? "已复制!" : labels.kakao) : labels.kakao}
            {wechatCopied && lang === "zh" && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                ID: {WECHAT_ID}
              </span>
            )}
          </a>
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-xs font-semibold text-white"
            style={{
              background: lang === "zh" ? "#06C755" : "#03C75A",
              minHeight: "52px",
            }}
          >
            <Calendar size={18} />
            {labels.map}
          </a>
        </div>
      </div>

      {/* ── 모바일 언어 버튼 (항상 표시, 하단 바 위 배치) ── */}
      <div
        className="fixed left-4 z-40 md:hidden flex flex-col gap-2"
        style={{
          bottom: visible
            ? "calc(52px + max(env(safe-area-inset-bottom), 0px) + 0.75rem)"
            : "calc(max(env(safe-area-inset-bottom), 0px) + 1.5rem)",
          transition: "bottom 0.3s ease",
        }}
      >
        {langOptions.map((o) => (
          <button
            key={o.lang}
            onClick={() => setLang(o.lang)}
            title={o.label}
            aria-label={o.label}
            className="flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              border: "1.5px solid rgba(74,111,165,0.15)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "#1a2a4a",
              cursor: "pointer",
            }}
          >
            {o.code}
          </button>
        ))}
      </div>

      {/* ── 데스크톱 플로팅 버튼 (우측 하단, 세로 스택) ── */}
      <div className="fixed right-4 bottom-8 z-40 hidden md:flex flex-col gap-3">
        {/* 전화·카카오·네이버: 스크롤 후 표시 */}
        <div
          className="flex flex-col gap-3 transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(80px)",
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          {/* 전화 - 금색 그라디언트 */}
          <a
            href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
              boxShadow: "0 4px 16px rgba(201,168,76,0.45), 0 2px 8px rgba(0,0,0,0.15)",
            }}
            aria-label={labels.callAria}
            title={lang === "ko" ? "051-818-2300" : "+82-51-818-2300"}
          >
            <Phone size={22} className="text-white" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
          </a>

          {/* 카카오 / WeChat */}
          <div className="relative">
            <a
              href={chatUrl}
              target={lang === "zh" ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={handleWechatClick}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
              style={{ background: labels.chatBg }}
              aria-label={labels.kakaoAria}
              title={labels.kakaoAria}
            >
              <MessageCircle size={22} style={{ color: labels.chatColor }} />
            </a>
            {wechatCopied && lang === "zh" && (
              <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                已复制 WeChat ID<br />
                <span className="font-bold">{WECHAT_ID}</span>
              </div>
            )}
          </div>

          {/* 네이버 예약 / LINE */}
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            style={{ background: lang === "zh" ? "#06C755" : "#03C75A" }}
            aria-label={labels.mapAria}
            title={labels.mapAria}
          >
            <Calendar size={22} className="text-white" />
          </a>

          {/* 구분선 - 금색 */}
          <div
            className="mx-auto"
            style={{
              width: "2px",
              height: "20px",
              background: "linear-gradient(180deg, transparent, #C9A84C, transparent)",
              borderRadius: "1px",
            }}
          />
        </div>

        {/* 언어 버튼: 항상 표시 (EN/JP/CN/KO 텍스트 코드) */}
        {langOptions.map((o) => (
          <button
            key={o.lang}
            onClick={() => setLang(o.lang)}
            title={o.label}
            aria-label={o.label}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(160deg, #ffffff 0%, #faf8f3 100%), linear-gradient(135deg, #F5D78E, #C9A84C, #B8892A)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow: "0 2px 10px rgba(201,168,76,0.25)",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: "#7a5c1e",
              cursor: "pointer",
            }}
          >
            {o.code}
          </button>
        ))}
      </div>
    </>
  );
}
