import { useEffect, useState } from "react";
import { Link } from "wouter";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";
const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";
const LOGO = `${CDN}/star_ai_logo_1_73172f49.png`;
const HERO_BG_DESKTOP = `${CDN}/hero-bg-new-desktop_2f8a8ccf.webp`;
const HERO_BG_MOBILE = `${CDN}/hero-bg-new-mobile_ebac0b77.webp`;

const DOCTORS = [
  { name: "趙時亨 院長", title: "院長", specialty: "皮膚科専門医 · 医学博士", img: `${CDN2}/01_5e3176cb.png`, careers: ["釜山大学病院 皮膚科 専攻医", "仁済大学 皮膚科 前教授", "サーマジFLX 公式医療アドバイザー", "大韓皮膚科学会 正会員"] },
  { name: "禹惠珍 先生", title: "診療医", specialty: "皮膚科専門医", img: `${CDN2}/0211_8cfcf452.png`, careers: ["釜山大学医学部 卒業", "釜山大学病院 皮膚科 専攻医", "大韓皮膚科学会 正会員", "大韓レーザー学会 正会員"] },
  { name: "李基旭 先生", title: "診療医", specialty: "皮膚科専門医", img: `${CDN2}/03_46691618.png`, careers: ["仁済大学医学部 卒業", "仁済大学病院 皮膚科 専攻医", "大韓皮膚科学会 正会員", "大韓美容皮膚レーザー学会 正会員"] },
];

const TREATMENTS = [
  { name: "ウルセラピー プライム", slug: "ulthera", desc: "HIFU超音波エネルギーで外科手術なしにSMAS層を引き上げます。非侵襲的フェイスリフティングのゴールドスタンダード。スター皮膚科はウルセラピープライム公式認定クリニックです。", tags: ["非侵襲", "SMASリフティング", "ダウンタイムなし"], img: `${CDN2}/울쎄라_7f6c3083.jpg` },
  { name: "サーマジ FLX", slug: "thermage", desc: "第4世代高周波スキンタイトニング。深部コラーゲン再生を促進し、ハリのある若々しい肌へ。趙院長はサーマジ公式医療アドバイザーです。", tags: ["RFエネルギー", "コラーゲン増生", "1回施術"], img: `${CDN2}/울써마지리프팅_17bc44ff.png` },
  { name: "目の下脂肪再配置", slug: "under-eye-fat", desc: "目の下の脂肪を再配置してクマとくぼみを改善。切開なしで自然な仕上がり。4,000件以上の施術実績。", tags: ["切開なし", "4,000件以上", "自然な仕上がり"], img: `${CDN}/treat-eyelid-new-6Qge5k6ndWTS5nFXDZSXRF.webp` },
];

const FACILITY_IMGS = [
  { src: `${CDN}/gKokBoh3bDWm_b8ea202e.jpg`, alt: "スター皮膚科 受付" },
  { src: `${CDN}/3PticSr0g4jr_e69d1049.jpg`, alt: "診察室" },
  { src: `${CDN}/7IUeNj7YG383_91ad3b5b.jpg`, alt: "施術室" },
  { src: `${CDN}/BZDyHWjrUcLj_3f4c9c8d.jpg`, alt: "レーザー機器室" },
];

const REVIEWS = [
  { name: "金**", treatment: "目の下脂肪再配置", text: "クマがひどかったのですが、施術から1ヶ月で目元がぱっと明るくなりました。自然な仕上がりでとても満足しています！" },
  { name: "李**", treatment: "ピコレーザー", text: "シミが多かったのですが、3回の施術でかなり改善されました。肌のトーンも明るくなって満足です。" },
  { name: "朴**", treatment: "ウルセラピー プライム", text: "リフティング効果が素晴らしいです。自然な仕上がりで回復期間も短くて良かったです。" },
];

export default function LandingJA() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "釜山スター皮膚科 | ウルセラピー・サーマジFLX・目の下脂肪再配置 | 西面";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "釜山西面のスター皮膚科。皮膚科専門医による20年以上の経験。ウルセラピープライム、サーマジFLX、目の下脂肪再配置、ピコレーザーなど50種類以上のプレミアム施術。外国人患者様歓迎・日本語対応可能。" },
      { name: "keywords", content: "釜山皮膚科, 西面スキンクリニック, ウルセラピー釜山, サーマジ釜山, 目の下手術韓国, ピコレーザー釜山, 韓国皮膚科, スター皮膚科, 釜山美容クリニック, 日本語対応皮膚科" },
      { property: "og:title", content: "釜山スター皮膚科 | ウルセラピー・サーマジFLX・目の下脂肪再配置" },
      { property: "og:description", content: "釜山西面の皮膚科専門医クリニック。20年以上の経験、4,000件以上の目の下施術、50種類以上のプレミアムレーザー機器。外国人患者様歓迎。" },
      { property: "og:url", content: "https://star-pibu.com/ja" },
      { property: "og:locale", content: "ja_JP" },
      { name: "robots", content: "index, follow" },
    ];
    metas.forEach(({ name, property, content }) => {
      let el = name ? document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`) : document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) { el = document.createElement("meta"); if (name) el.setAttribute("name", name); if (property) el.setAttribute("property", property); document.head.appendChild(el); }
      el.setAttribute("content", content);
    });
    const hreflangs = [{ hreflang: "ko", href: "https://star-pibu.com/" }, { hreflang: "en", href: "https://star-pibu.com/en" }, { hreflang: "ja", href: "https://star-pibu.com/ja" }, { hreflang: "zh", href: "https://star-pibu.com/zh" }, { hreflang: "x-default", href: "https://star-pibu.com/" }];
    hreflangs.forEach(({ hreflang, href }) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", "alternate"); el.setAttribute("hreflang", hreflang); document.head.appendChild(el); }
      el.setAttribute("href", href);
    });
    const jsonLd = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "スター皮膚科", "url": "https://star-pibu.com/ja", "description": "釜山西面の皮膚科専門医クリニック。", "telephone": "+82-51-818-2300", "address": { "@type": "PostalAddress", "streetAddress": "서면로 74, ION시티 4층", "addressLocality": "釜山鎮区", "addressRegion": "釜山", "postalCode": "47189", "addressCountry": "KR" }, "geo": { "@type": "GeoCoordinates", "latitude": 35.1579, "longitude": 129.0597 }, "medicalSpecialty": "Dermatology", "inLanguage": "ja" };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="ja-medical"]');
    if (!scriptEl) { scriptEl = document.createElement("script"); scriptEl.setAttribute("type", "application/ld+json"); scriptEl.setAttribute("data-ld", "ja-medical"); document.head.appendChild(scriptEl); }
    scriptEl.textContent = JSON.stringify(jsonLd);
    return () => { document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술"; };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Header ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1a1a2e]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/ja">
            <img src={LOGO} alt="スター皮膚科" className="h-10 w-auto" loading="eager" fetchPriority="high" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white">
            <a href="#treatments" className="hover:text-[#c9a84c] transition">施術メニュー</a>
            <a href="#doctors" className="hover:text-[#c9a84c] transition">医師紹介</a>
            <a href="#facility" className="hover:text-[#c9a84c] transition">院内施設</a>
            <a href="#access" className="hover:text-[#c9a84c] transition">アクセス</a>
          </nav>
          <div className="flex items-center gap-1 text-xs">
            <Link href="/" className="text-white/60 hover:text-white px-2 py-1">KO</Link>
            <Link href="/en" className="text-white/60 hover:text-white px-2 py-1">EN</Link>
            <span className="text-[#c9a84c] font-bold border border-[#c9a84c] px-2 py-1 rounded">JA</span>
            <Link href="/zh" className="text-white/60 hover:text-white px-2 py-1">ZH</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <picture className="absolute inset-0">
          <source media="(max-width: 768px)" srcSet={HERO_BG_MOBILE} type="image/webp" />
          <img src={HERO_BG_DESKTOP} alt="スター皮膚科 院内" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a2e]/50 to-[#1a1a2e]/80" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6">
          <img src={LOGO} alt="スター皮膚科 ロゴ" className="h-24 w-auto mx-auto mb-6" loading="eager" />
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">釜山 · 西面 · 2006年創業</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">スター<br />皮膚科</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-2">釜山プレミアムスキンクリニック</p>
          <p className="text-gray-300 mb-10">皮膚科専門医 · ウルセラピー · サーマジ · 目の下脂肪再配置</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-4 px-8 rounded-full hover:bg-[#b8973b] transition text-lg">📞 051-818-2300</a>
            <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-400 transition text-lg">💬 カカオトーク</a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs flex flex-col items-center gap-1 animate-bounce">
          <span>SCROLL</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#1a1a2e] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[{ num: "20年+", label: "診療経験", sub: "2006年創業" }, { num: "4,000件+", label: "目の下施術実績", sub: "確かな実績" }, { num: "50種+", label: "プレミアムレーザー機器", sub: "最新技術" }].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-5xl font-bold text-[#c9a84c]">{s.num}</p>
              <p className="font-semibold mt-1">{s.label}</p>
              <p className="text-sm text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">クリニック紹介</p>
            <h2 className="text-4xl font-bold mb-6 leading-tight">専門性と<br />卓越性の融合</h2>
            <p className="text-gray-600 leading-relaxed mb-4">釜山西面の中心に位置するスター皮膚科は、2006年の創業以来プレミアムスキンケアを提供してきました。皮膚科専門医が全ての診察を直接担当し、各患者様に最適な治療プランをご提案します。</p>
            <p className="text-gray-600 leading-relaxed mb-6">50種類以上の最新レーザー機器と20年以上の臨床経験で、幅広い施術メニューをご用意。日本語対応スタッフが在籍しており、外国人患者様も安心してご来院いただけます。</p>
            <div className="flex flex-wrap gap-3">
              {["ウルセラピープライム公式認定", "サーマジ医療アドバイザー", "目の下施術4,000件以上"].map((badge) => (
                <span key={badge} className="bg-[#f0ebe0] text-[#8a6d3b] text-xs font-semibold px-3 py-1.5 rounded-full">{badge}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FACILITY_IMGS.map((f) => (
              <div key={f.src} className="aspect-square overflow-hidden rounded-xl">
                <img src={f.src} alt={f.alt} className="w-full h-full object-cover hover:scale-105 transition duration-500" loading="lazy" width={300} height={300} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Treatments ── */}
      <section id="treatments" className="bg-[#f8f6f0] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">施術メニュー</p>
          <h2 className="text-4xl font-bold text-center mb-12">代表施術</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TREATMENTS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" width={400} height={300} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[#1a1a2e]">{t.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{t.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {t.tags.map((tag) => <span key={tag} className="bg-[#f0ebe0] text-[#8a6d3b] text-xs font-medium px-2 py-1 rounded-full">{tag}</span>)}
                  </div>
                  <Link href={`/treatments/${t.slug}`} className="text-[#c9a84c] text-sm font-semibold hover:underline">詳細を見る →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">医師紹介</p>
          <h2 className="text-4xl font-bold text-center mb-12">皮膚科専門医チーム</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {DOCTORS.map((d) => (
              <div key={d.name} className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-4 border-[#c9a84c]/30 group-hover:border-[#c9a84c] transition">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover object-top" loading="lazy" width={160} height={160} />
                </div>
                <h3 className="text-lg font-bold">{d.name}</h3>
                <p className="text-[#c9a84c] text-sm font-medium mb-1">{d.title}</p>
                <p className="text-gray-500 text-xs mb-3">{d.specialty}</p>
                <ul className="text-xs text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                  {d.careers.map((c) => <li key={c} className="flex gap-1"><span className="text-[#c9a84c] flex-shrink-0">·</span>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facility ── */}
      <section id="facility" className="bg-[#1a1a2e] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">院内施設</p>
          <h2 className="text-4xl font-bold text-center text-white mb-12">クリニック内部</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FACILITY_IMGS.map((f) => (
              <div key={f.src} className="aspect-square overflow-hidden rounded-xl">
                <img src={f.src} alt={f.alt} className="w-full h-full object-cover hover:scale-105 transition duration-500" loading="lazy" width={300} height={300} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Foreign Patient Guide ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">外国人患者様へ</p>
          <h2 className="text-4xl font-bold text-center mb-4">海外からお越しの方へ</h2>
          <p className="text-gray-500 text-center mb-12">スター皮膚科は外国人患者様を温かくお迎えします。日本語対応スタッフが在籍しておりますのでご安心ください。</p>
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[{ step: "01", title: "予約", desc: "カカオトークまたはお電話でご連絡ください。日本語対応スタッフが対応します。" }, { step: "02", title: "来院", desc: "西面駅5番・7番出口から徒歩3分。IONシティビル4階。" }, { step: "03", title: "診察", desc: "皮膚科専門医がお肌を診察し、最適な施術プランをご提案します。" }, { step: "04", title: "アフターケア", desc: "詳細なアフターケア説明書をお渡しします。帰国後のオンラインフォローアップも可能です。" }].map((s) => (
              <div key={s.step} className="bg-[#f8f6f0] rounded-2xl p-5">
                <p className="text-[#c9a84c] text-3xl font-bold mb-2">{s.step}</p>
                <p className="font-bold text-[#1a1a2e] mb-1">{s.title}</p>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#f8f6f0] rounded-2xl p-5"><h3 className="font-bold text-[#1a1a2e] mb-2">お支払い</h3><p className="text-gray-600">クレジットカード（Visa、Mastercard、Amex）対応。韓国ウォン現金も可。</p></div>
            <div className="bg-[#f8f6f0] rounded-2xl p-5"><h3 className="font-bold text-[#1a1a2e] mb-2">アクセス</h3><p className="text-gray-600">地下鉄：西面駅（1号線・2号線）5番または7番出口、徒歩3分<br />住所：釜山広域市 釜山鎮区 西面路74 IONシティ4階</p></div>
          </div>
        </div>
      </section>

      {/* ── Hours ── */}
      <section id="access" className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">診療時間</p>
          <h2 className="text-3xl font-bold mb-8">診療時間のご案内</h2>
          <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
            {[{ day: "月〜金", time: "10:00 〜 19:00" }, { day: "土曜日", time: "09:30 〜 15:00" }, { day: "日曜日・祝日", time: "休診" }].map((r) => (
              <div key={r.day} className={`flex justify-between py-3 border-b border-gray-100 last:border-0 ${r.day === "日曜日・祝日" ? "text-gray-400" : ""}`}>
                <span className="font-medium">{r.day}</span><span>{r.time}</span>
              </div>
            ))}
            <p className="text-sm text-gray-400 mt-3">平日昼休み 13:00〜14:00 · 土曜日は昼休みなし</p>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">患者様の声</p>
          <h2 className="text-4xl font-bold text-center mb-2">患者様レビュー</h2>
          <p className="text-center text-gray-400 mb-10">⭐ 4.9 / 5.0 · Naverレビュー基準</p>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-[#f8f6f0] rounded-2xl p-6 hover:shadow-md transition">
                <p className="text-yellow-400 text-xl mb-3">★★★★★</p>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed italic">「{r.text}」</p>
                <p className="text-[#c9a84c] text-xs font-semibold">{r.treatment}</p>
                <p className="text-gray-400 text-xs">{r.name} · Naver</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a2e] py-20 px-6 text-center text-white">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">ご予約</p>
        <h2 className="text-4xl font-bold mb-3">美肌への第一歩を</h2>
        <p className="text-gray-300 mb-10 max-w-xl mx-auto">外国人患者様歓迎。日本語対応スタッフが丁寧にご案内いたします。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-4 px-10 rounded-full hover:bg-[#b8973b] transition text-lg">📞 051-818-2300</a>
          <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-4 px-10 rounded-full hover:bg-yellow-400 transition text-lg">💬 カカオトーク相談</a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-6 text-center text-sm">
        <img src={LOGO} alt="スター皮膚科" className="h-10 w-auto mx-auto mb-4 opacity-70" loading="lazy" />
        <p className="font-semibold text-white mb-1">スター皮膚科</p>
        <p>IONシティビル 2F・4F, 서면로 74, 부산진구, 부산, 韓国</p>
        <p className="mt-1">Tel: 051-818-2300 · Email: starpibu@naver.com</p>
        <p className="mt-2 text-xs">事業者登録番号: 605-24-84306 · © スター皮膚科. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <Link href="/" className="hover:text-white">한국어</Link>
          <Link href="/en" className="hover:text-white">English</Link>
          <span className="text-[#c9a84c] font-semibold">日本語</span>
          <Link href="/zh" className="hover:text-white">中文</Link>
        </div>
      </footer>
    </div>
  );
}
