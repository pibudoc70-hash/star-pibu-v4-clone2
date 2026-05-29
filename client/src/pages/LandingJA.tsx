import { useEffect } from "react";
import { Link } from "wouter";

/**
 * LandingJA - 日本語 SEO ランディングページ (/ja)
 * 全コンテンツを日本語でハードコーディング — Google/Yahoo クローラー対応
 */
export default function LandingJA() {
  useEffect(() => {
    document.title = "スター皮膚科 釜山 | ウルセラピー サーマジ クマ取り | 西面皮膚科";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "釜山・西面のスター皮膚科。皮膚科専門医による20年以上の経験。ウルセラピープライム・サーマジFLX・クマ取り（目の下脂肪再配置）・ピコレーザーなど50種以上のプレミアム施術。外国人患者様歓迎、日本語対応可。" },
      { name: "keywords", content: "釜山皮膚科, 西面皮膚科, ウルセラピー釜山, サーマジ釜山, クマ取り韓国, 目の下脂肪再配置, ピコレーザー釜山, 韓国皮膚科, スター皮膚科, 釜山美容皮膚科, 日本語対応皮膚科" },
      { property: "og:title", content: "スター皮膚科 釜山 | ウルセラピー・サーマジ・クマ取り" },
      { property: "og:description", content: "釜山西面の皮膚科専門医クリニック。経験20年以上、クマ取り4,000件以上、プレミアムレーザー50種以上。日本語対応可。" },
      { property: "og:url", content: "https://star-pibu.com/ja" },
      { property: "og:locale", content: "ja_JP" },
      { name: "robots", content: "index, follow" },
    ];
    metas.forEach(({ name, property, content }) => {
      let el = name
        ? document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
        : document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name) el.setAttribute("name", name);
        if (property) el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    });

    // hreflang tags
    const hreflangs = [
      { hreflang: "ko", href: "https://star-pibu.com/" },
      { hreflang: "en", href: "https://star-pibu.com/en" },
      { hreflang: "ja", href: "https://star-pibu.com/ja" },
      { hreflang: "zh", href: "https://star-pibu.com/zh" },
      { hreflang: "x-default", href: "https://star-pibu.com/" },
    ];
    hreflangs.forEach(({ hreflang, href }) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "alternate");
        el.setAttribute("hreflang", hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    });

    // JSON-LD MedicalBusiness
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "スター皮膚科",
      "alternateName": "STAR Dermatology Clinic",
      "url": "https://star-pibu.com/ja",
      "description": "釜山西面の皮膚科専門医クリニック。ウルセラピー、サーマジFLX、クマ取り（目の下脂肪再配置）、ピコレーザーなどプレミアム施術を提供。",
      "telephone": "+82-51-818-2300",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "西面路74 アイオンシティビル4F",
        "addressLocality": "釜山鎮区",
        "addressRegion": "釜山",
        "postalCode": "47189",
        "addressCountry": "KR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 35.1579,
        "longitude": 129.0597
      },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "19:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:30", "closes": "15:00" }
      ],
      "medicalSpecialty": "Dermatology",
      "availableService": [
        { "@type": "MedicalProcedure", "name": "ウルセラピープライム", "description": "HIFU超音波によるSMAS層リフティング施術" },
        { "@type": "MedicalProcedure", "name": "サーマジFLX", "description": "第4世代高周波スキンタイトニング施術" },
        { "@type": "MedicalProcedure", "name": "目の下脂肪再配置（クマ取り）", "description": "切開なしの目の下若返り手術" },
        { "@type": "MedicalProcedure", "name": "ピコレーザー", "description": "色素沈着・タトゥー除去のためのピコ秒レーザー" }
      ],
      "inLanguage": "ja",
      "knowsLanguage": ["Korean", "English", "Japanese", "Chinese"]
    };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="ja-medical"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-ld", "ja-medical");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ── 言語ナビ ── */}
      <nav className="bg-[#1a1a2e] text-white py-2 px-4 text-sm flex justify-between items-center">
        <span className="font-semibold tracking-wide">STAR DERMATOLOGY</span>
        <div className="flex gap-3">
          <Link href="/" className="opacity-60 hover:opacity-100">KO</Link>
          <Link href="/en" className="opacity-60 hover:opacity-100">EN</Link>
          <span className="font-bold border-b border-white">JA</span>
          <Link href="/zh" className="opacity-60 hover:opacity-100">ZH</Link>
        </div>
      </nav>

      {/* ── ヒーロー ── */}
      <section className="relative bg-[#1a1a2e] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] opacity-90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">釜山・西面 · Since 2006</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">スター皮膚科</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">釜山プレミアム皮膚科クリニック</p>
          <p className="text-gray-400 mb-8">皮膚科専門医 · ウルセラピー · サーマジ · クマ取り（目の下脂肪再配置）</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b8973b] transition">
              📞 051-818-2300
            </a>
            <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
              💬 カカオトーク相談
            </a>
          </div>
        </div>
      </section>

      {/* ── 実績 ── */}
      <section className="bg-[#f8f6f0] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { num: "20年+", label: "皮膚科専門医の経験", sub: "2006年開院" },
            { num: "4,000+", label: "クマ取り施術件数", sub: "実績ある結果" },
            { num: "50+", label: "プレミアムレーザー機器", sub: "最新設備" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-[#c9a84c]">{s.num}</p>
              <p className="font-semibold text-gray-800 mt-1">{s.label}</p>
              <p className="text-sm text-gray-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── クリニック紹介 ── */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">クリニック紹介</p>
        <h2 className="text-3xl font-bold mb-4">スター皮膚科について</h2>
        <p className="text-gray-600 leading-relaxed">
          釜山・西面交差点前に位置するスター皮膚科は、2006年の開院以来、皮膚科専門医が直接担当する1対1のカスタムカウンセリングを提供しています。50種以上のオリジナルレーザー機器と20年以上の経験を持つ専門医が、患者様一人ひとりに最適な施術をお届けします。日本語対応可能ですので、外国人患者様も安心してご来院ください。
        </p>
      </section>

      {/* ── 主要施術 ── */}
      <section className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">施術案内</p>
          <h2 className="text-3xl font-bold text-center mb-10">代表施術のご紹介</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "ウルセラピープライム",
                slug: "ulthera",
                desc: "HIFU超音波エネルギーで手術なしにSMAS層をリフティング。非侵襲的フェイスリフティングのゴールドスタンダード。スター皮膚科は公式ウルセラピープライム認定クリニックです。",
                tags: ["非侵襲", "SMASリフティング", "ダウンタイムなし"],
              },
              {
                name: "サーマジFLX",
                slug: "thermage",
                desc: "第4世代高周波スキンタイトニング。深部コラーゲン再生を促進し、ハリのある若々しい肌へ。チョ・シヒョン院長はサーマジ公式アドバイザーです。",
                tags: ["高周波エネルギー", "コラーゲン増生", "1回施術"],
              },
              {
                name: "クマ取り（目の下脂肪再配置）",
                slug: "under-eye-fat",
                desc: "目の下の脂肪を再配置してクマやくぼみを改善。切開なしで自然な仕上がり。4,000件以上の施術実績。",
                tags: ["切開なし", "4,000件以上", "自然な仕上がり"],
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-2 text-[#1a1a2e]">{t.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{t.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {t.tags.map((tag) => (
                    <span key={tag} className="bg-[#f0ebe0] text-[#8a6d3b] text-xs font-medium px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <Link href={`/treatments/${t.slug}`} className="text-[#c9a84c] text-sm font-semibold hover:underline">
                  詳しく見る →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 医師紹介 ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">医師紹介</p>
        <h2 className="text-3xl font-bold text-center mb-10">皮膚科専門医のご紹介</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "チョ・シヒョン 院長",
              title: "院長",
              specialty: "皮膚科専門医 · 医学博士",
              careers: [
                "釜山大学病院 皮膚科 研修",
                "仁済大学 皮膚科 教授歴任",
                "サーマジ公式アドバイザー",
                "大韓皮膚科学会 正会員",
              ],
            },
            {
              name: "ウ・ヘジン 医師",
              title: "医師",
              specialty: "皮膚科専門医",
              careers: [
                "釜山大学医学部 卒業",
                "釜山大学病院 皮膚科 研修",
                "大韓皮膚科学会 正会員",
                "大韓レーザー学会 正会員",
              ],
            },
            {
              name: "イ・ギウク 医師",
              title: "医師",
              specialty: "皮膚科専門医",
              careers: [
                "仁済大学医学部 卒業",
                "仁済大学病院 皮膚科 研修",
                "大韓皮膚科学会 正会員",
                "大韓美容皮膚·レーザー学会 正会員",
              ],
            },
          ].map((d) => (
            <div key={d.name} className="bg-[#f8f6f0] rounded-2xl p-6">
              <div className="w-16 h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {d.name[0]}
              </div>
              <h3 className="text-lg font-bold">{d.name}</h3>
              <p className="text-[#c9a84c] text-sm font-medium mb-1">{d.title}</p>
              <p className="text-gray-500 text-xs mb-3">{d.specialty}</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {d.careers.map((c) => <li key={c} className="flex gap-1"><span className="text-[#c9a84c]">·</span>{c}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 外国人患者様へ ── */}
      <section className="bg-[#1a1a2e] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">外国人患者様へ</p>
          <h2 className="text-3xl font-bold text-center mb-4">外国人患者様ガイド</h2>
          <p className="text-gray-300 text-center mb-10">スター皮膚科は外国人患者様を歓迎いたします。日本語対応はOTOMO釜山（otomo-busan.com）をご利用ください。</p>
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[
              { step: "01", title: "ご予約", desc: "カカオトークまたはお電話でご予約ください。日本語対応可能です。" },
              { step: "02", title: "ご来院", desc: "西面駅5・7番出口から徒歩3分。アイオンシティビル4階です。" },
              { step: "03", title: "カウンセリング・施術", desc: "専門医が直接お肌の状態を診断し、最適な施術をご提案いたします。" },
              { step: "04", title: "アフターケア", desc: "施術後のケア方法をご案内。帰国後もオンライン相談が可能です。" },
            ].map((s) => (
              <div key={s.step} className="bg-white/10 rounded-xl p-4">
                <p className="text-[#c9a84c] text-2xl font-bold mb-2">{s.step}</p>
                <p className="font-semibold mb-1">{s.title}</p>
                <p className="text-gray-300 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">お支払い</h3>
              <p className="text-gray-300">クレジットカード（Visa、Mastercard、Amex）対応。韓国ウォン現金払いも可能。自動的に現在のレートで両替されます。</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">アクセス</h3>
              <p className="text-gray-300">地下鉄：西面駅（1・2号線）5番・7番出口から徒歩3分。<br />住所：釜山鎮区西面路74 アイオンシティビル4F</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 診療時間 ── */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">診療時間</p>
        <h2 className="text-3xl font-bold mb-6">診療案内</h2>
        <div className="bg-[#f8f6f0] rounded-2xl p-6 text-left">
          {[
            { day: "平日（月〜金）", time: "10:00 – 19:00" },
            { day: "土曜日", time: "09:30 – 15:00" },
            { day: "日・祝日", time: "休診" },
          ].map((r) => (
            <div key={r.day} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="font-medium text-gray-700">{r.day}</span>
              <span className="text-gray-600">{r.time}</span>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-3">平日昼休み 13:00 – 14:00 · 土曜日は昼休みなし</p>
        </div>
      </section>

      {/* ── 患者様の声 ── */}
      <section className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">患者様の声</p>
          <h2 className="text-3xl font-bold text-center mb-2">患者様のレビュー</h2>
          <p className="text-center text-gray-500 mb-8">⭐ 4.9 / 5.0 · Naverレビュー基準</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Kim**", treatment: "クマ取り（目の下脂肪再配置）", text: "ひどいクマに悩んでいましたが、施術後1ヶ月で目元がぱっと明るくなりました。自然な仕上がりで大満足です！" },
              { name: "Lee**", treatment: "ピコレーザー", text: "シミが多かったのですが、3回の施術で大幅に改善されました。肌のトーンも明るくなりました。" },
              { name: "Park**", treatment: "ウルセラピープライム", text: "リフティング効果が素晴らしいです。自然な仕上がりでダウンタイムも短く、大変満足しています！" },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-yellow-400 mb-2">★★★★★</p>
                <p className="text-gray-700 text-sm mb-3 italic">「{r.text}」</p>
                <p className="text-[#c9a84c] text-xs font-semibold">{r.treatment}</p>
                <p className="text-gray-400 text-xs">{r.name} · Naver</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 text-center bg-[#1a1a2e] text-white">
        <h2 className="text-3xl font-bold mb-3">カウンセリングのご予約</h2>
        <p className="text-gray-300 mb-8">外国人患者様歓迎。日本語対応可能なスタッフがご案内いたします。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b8973b] transition">
            📞 051-818-2300
          </a>
          <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
            💬 カカオトーク
          </a>
        </div>
      </section>

      {/* ── フッター ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
        <p className="font-semibold text-white mb-1">スター皮膚科</p>
        <p>釜山広域市釜山鎮区西面路74 アイオンシティビル 2・4階</p>
        <p className="mt-1">Tel: 051-818-2300 · Email: starpibu@naver.com</p>
        <p className="mt-2 text-xs">事業者登録番号：605-24-84306 · © スター皮膚科. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/" className="hover:text-white">한국어</Link>
          <Link href="/en" className="hover:text-white">English</Link>
          <span className="text-white font-semibold">日本語</span>
          <Link href="/zh" className="hover:text-white">中文</Link>
        </div>
      </footer>
    </div>
  );
}
