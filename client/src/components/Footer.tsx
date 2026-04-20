/**
 * Footer - STAR 피부과
 * 디자인: 다크 네이비 배경, 빠른 링크 + SNS + 법적 정보
 * i18n: useLang으로 한/중/일 전환
 */
import { MessageCircle, Youtube, BookOpen, Instagram, Phone, MapPin, Mail, Printer } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const sns = [
  { icon: MessageCircle, label: "KakaoTalk", href: "https://pf.kakao.com/_HNyGC", color: "#FEE500" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@starpibu", color: "#FF0000" },
  { icon: BookOpen, label: "Naver Blog", href: "https://blog.naver.com/starpibu", color: "#03C75A" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/starpibu", color: "#E1306C" },
];

export default function Footer() {
  const { t, lang } = useLang();

  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    // 현재 홈 페이지인 경우 스크롤, 아닌 경우 홈으로 이동
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.location.href = href === "#home" ? "/" : `/${href}`;
    }
  };

  const quickLinks = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.doctors, href: "#doctors" },
    { label: t.nav.treatments, href: "#treatments" },
    { label: t.nav.facility, href: "#facility" },
    { label: t.nav.contact, href: "#contact" },
    { label: t.nav.foreignGuide, href: "/foreign-guide" },
  ];

  // 주요 시술 목록 (언어별)
  const treatmentItems = t.treatments.categories.flatMap((c) => c.items.slice(0, 2)).slice(0, 10);

  // 라벨
  const labels = {
    quickMenu: lang === "ja" ? "クイックメニュー" : lang === "zh" ? "快速菜单" : "빠른 메뉴",
    mainTreatments: lang === "ja" ? "主な施術" : lang === "zh" ? "主要项目" : "주요 시술",
    contactInfo: lang === "ja" ? "連絡先・アクセス" : lang === "zh" ? "联系方式及位置" : "연락처 및 위치",
    brandDesc: lang === "ja" ? "釜山・西面を代表する皮膚科専門医クリニック" : lang === "zh" ? "釜山西面代表性皮肤科专科医院" : "20년 이상의 피부과 교수출신 전문의가 직접 진료하는 부산 서면 대표 피부과",
    fax: lang === "ja" ? "ファックス" : lang === "zh" ? "传真" : "팩스",
    subwayInfo: lang === "ja" ? "西面駅 5・7番出口 徒歩2分" : lang === "zh" ? "西面站5·7号出口步行2分钟" : "서면역 5·7번 출구 도보 2분",
    nonCovered: lang === "ja" ? "非保険診療案内" : lang === "zh" ? "非医保诊疗指南" : "비급여 진료안내",
    privacy: lang === "ja" ? "個人情報処理方針" : lang === "zh" ? "个人信息处理方针" : "개인정보처리방침",
  };

  return (
    <footer style={{ background: "#1A2744" }}>
      {/* Top Section */}
      <div className="container py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-bold tracking-wider" style={{ color: "#d2ac67" }}>
                STAR DERMATOLOGY
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
              {labels.brandDesc}
            </p>
            {/* SNS */}
            <div className="flex gap-3">
              {sns.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                    aria-label={s.label}
                    title={s.label}
                  >
                    <Icon size={16} className="text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-4 tracking-wider" style={{ color: "#81C7C9" }}>
              {labels.quickMenu}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => {
                      if (l.href.startsWith("/")) {
                        window.location.href = l.href;
                      } else {
                        handleNavClick(l.href);
                      }
                    }}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-sm font-bold mb-4 tracking-wider" style={{ color: "#81C7C9" }}>
              {labels.mainTreatments}
            </h4>
            <ul className="space-y-2">
              {treatmentItems.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleNavClick("#treatments")}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold mb-4 tracking-wider" style={{ color: "#81C7C9" }}>
              {labels.contactInfo}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {t.footer.address}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} style={{ color: "#81C7C9", flexShrink: 0 }} />
                <a
                  href="tel:051-818-2300"
                  className="text-sm font-montserrat font-semibold transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {t.footer.tel}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} style={{ color: "#81C7C9", flexShrink: 0 }} />
                <a
                  href="sms:010-5855-3201"
                  className="text-sm font-montserrat font-semibold transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {lang === "ja" ? "SMS: 010-5855-3201" : lang === "zh" ? "短信: 010-5855-3201" : lang === "en" ? "SMS: 010-5855-3201" : "문자: 010-5855-3201"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Printer size={14} style={{ color: "#81C7C9", flexShrink: 0 }} />
                <span className="text-sm font-montserrat" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {t.footer.fax} ({labels.fax})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} style={{ color: "#81C7C9", flexShrink: 0 }} />
                <a
                  href={`mailto:${t.footer.email}`}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {t.footer.email}
                </a>
              </div>
              {/* Hours summary */}
              <div className="text-xs space-y-1 pt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t.hours.rows.map((row) => (
                  <p key={row.day}>{row.day} {row.time}</p>
                ))}
                <p className="pt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {labels.subwayInfo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t py-6"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-center md:text-left" style={{ color: "rgba(255,255,255,0.35)" }}>
            {lang === "ko"
              ? "스타피부과의원 | 대표: 조시형 | 사업자등록번호: 605-24-84306 | 팩스: 051-818-2310 | 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층(접수·진료), 2층(줄기세포 연구센터)"
              : lang === "ja"
              ? "スター皮膚科医院 | 代表: チョ・シヒョン | 事業者登録番号: 605-24-84306 | FAX: 051-818-2310 | 釜山広域市釜山镇区西面路74 アイオンシティビル4F(受付・診療), 2F(幹細胞研究センター)"
              : lang === "en"
              ? "STAR Dermatology | Director: Cho Si-hyung | Business Reg. No.: 605-24-84306 | Fax: 051-818-2310 | 4F, Ion City Bldg, 74 Seomyeon-ro, Busanjin-gu, Busan"
              : "STAR皮肤科医院 | 代表: 赵时享 | 营业执照号: 605-24-84306 | 传真: 051-818-2310 | 釜山广域市釜山镇区西面路74 爱恩城大厦4楼(接待·诊疗), 2楼(干细胞研究中心)"}
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.hira.or.kr/ra/medi/getHealthCareList.do"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {labels.nonCovered}
            </a>
            <a
              href="/privacy"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {labels.privacy}
            </a>
          </div>
        </div>
        <div className="container mt-2">
          <p className="text-xs text-center md:text-left" style={{ color: "rgba(255,255,255,0.2)" }}>
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
