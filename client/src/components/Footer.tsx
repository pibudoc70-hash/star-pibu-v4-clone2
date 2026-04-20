import { Phone, MessageCircle, Calendar } from "lucide-react";
import { useLang } from "@/contexts/useLang";
import { langCodes, Lang } from "@/lib/i18n";
import StarLogo from "./StarLogo";

const KAKAO_URL = "https://pf.kakao.com/_xkxnxmxj";
const NAVER_URL = "https://booking.naver.com/booking/13/bizes/1166145";
const PHONE = "051-818-2300";

export default function Footer() {
  const { t, lang, setLang } = useLang();
  const langs: Lang[] = ["ko", "en", "ja", "zh"];

  return (
    <footer className="bg-[#0d1b2a] text-white/70 border-t border-white/10">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 로고 & 병원 정보 */}
          <div className="space-y-4">
            <StarLogo />
            <div className="text-sm space-y-1.5 mt-4">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">STAR Dermatologic Clinic</p>
              <p className="text-sm">{t.footer.address}</p>
              <p className="text-sm">{t.footer.hours}</p>
              <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 text-sm hover:text-[#c9a96e] transition-colors">
                <Phone size={13} /> {PHONE}
              </a>
            </div>
          </div>

          {/* 바로가기 링크 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-[#FEE500] transition-colors">
                <MessageCircle size={14} /> {t.cta.kakao}
              </a>
              <a href={NAVER_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-[#03C75A] transition-colors">
                <Calendar size={14} /> {t.cta.naver}
              </a>
              <a href="/privacy" className="text-sm hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="/non-covered" className="text-sm hover:text-white transition-colors">{t.footer.nonCovered}</a>
            </div>
          </div>

          {/* 언어 전환 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Language</h4>
            <div className="flex flex-wrap gap-2">
              {langs.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    lang === l
                      ? "bg-[#c9a96e] border-[#c9a96e] text-[#0d1b2a]"
                      : "border-white/20 text-white/60 hover:border-[#c9a96e] hover:text-[#c9a96e]"
                  }`}
                >
                  {langCodes[l]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white/70 transition-colors">{t.footer.privacy}</a>
            <a href="/non-covered" className="hover:text-white/70 transition-colors">{t.footer.nonCovered}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
