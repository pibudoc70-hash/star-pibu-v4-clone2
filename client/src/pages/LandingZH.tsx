import { useEffect, useState } from "react";
import { Link } from "wouter";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";
const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";
const LOGO = `${CDN}/star_ai_logo_1_73172f49.png`;
const HERO_BG_DESKTOP = `${CDN}/hero-bg-new-desktop_2f8a8ccf.webp`;
const HERO_BG_MOBILE = `${CDN}/hero-bg-new-mobile_ebac0b77.webp`;

const DOCTORS = [
  { name: "赵时亨 院长", title: "院长", specialty: "皮肤科专科医师 · 医学博士", img: `${CDN2}/01_5e3176cb.png`, careers: ["釜山大学医院 皮肤科 专科医师", "仁济大学 皮肤科 前教授", "热玛吉FLX 官方医疗顾问", "大韩皮肤科学会 正式会员"] },
  { name: "禹惠珍 医生", title: "诊疗医", specialty: "皮肤科专科医师", img: `${CDN2}/0211_8cfcf452.png`, careers: ["釜山大学医学院 毕业", "釜山大学医院 皮肤科 专科医师", "大韩皮肤科学会 正式会员", "大韩激光学会 正式会员"] },
  { name: "李基旭 医生", title: "诊疗医", specialty: "皮肤科专科医师", img: `${CDN2}/03_46691618.png`, careers: ["仁济大学医学院 毕业", "仁济大学医院 皮肤科 专科医师", "大韩皮肤科学会 正式会员", "大韩美容皮肤激光学会 正式会员"] },
];

const TREATMENTS = [
  { name: "超声刀 Prime", slug: "ulthera", desc: "利用HIFU超声波能量，无需手术即可提升SMAS层。非侵入性面部提升的黄金标准。Star皮肤科是超声刀Prime官方认证诊所。", tags: ["非侵入", "SMAS提升", "无恢复期"], img: `${CDN2}/울쎄라_7f6c3083.jpg` },
  { name: "热玛吉 FLX", slug: "thermage", desc: "第四代射频紧肤技术。促进深层胶原蛋白再生，打造紧致年轻肌肤。赵院长是热玛吉官方医疗顾问。", tags: ["射频能量", "胶原蛋白增生", "一次见效"], img: `${CDN2}/울써마지리프팅_17bc44ff.png` },
  { name: "眼袋脂肪重置", slug: "under-eye-fat", desc: "重新分配眼袋脂肪，改善黑眼圈和泪沟。无需切开，效果自然。4000例以上手术经验。", tags: ["无切开", "4000例以上", "效果自然"], img: `${CDN}/treat-eyelid-new-6Qge5k6ndWTS5nFXDZSXRF.webp` },
];

const FACILITY_IMGS = [
  { src: `${CDN}/gKokBoh3bDWm_b8ea202e.jpg`, alt: "Star皮肤科 前台" },
  { src: `${CDN}/3PticSr0g4jr_e69d1049.jpg`, alt: "诊室" },
  { src: `${CDN}/7IUeNj7YG383_91ad3b5b.jpg`, alt: "治疗室" },
  { src: `${CDN}/BZDyHWjrUcLj_3f4c9c8d.jpg`, alt: "激光设备室" },
];

const REVIEWS = [
  { name: "金**", treatment: "眼袋脂肪重置", text: "黑眼圈很严重，手术后一个月眼部明显亮了很多。效果自然，非常满意！" },
  { name: "李**", treatment: "皮秒激光", text: "色斑很多，经过3次治疗明显改善了。肤色也变亮了，效果超出预期。" },
  { name: "朴**", treatment: "超声刀 Prime", text: "提升效果非常好，效果自然，恢复期也很短，强烈推荐！" },
];

export default function LandingZH() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "釜山Star皮肤科 | 超声刀·热玛吉FLX·眼袋脂肪重置 | 西面";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "釜山西面Star皮肤科。皮肤科专科医师，拥有20年以上临床经验。提供超声刀Prime、热玛吉FLX、眼袋脂肪重置、皮秒激光等50余种高端项目。欢迎外国患者，提供中文咨询服务。" },
      { name: "keywords", content: "釜山皮肤科, 西面皮肤科, 超声刀釜山, 热玛吉釜山, 眼袋脂肪重置韩国, 皮秒激光釜山, 韩国皮肤科, Star皮肤科, 釜山美容皮肤科, 中文皮肤科" },
      { property: "og:title", content: "釜山Star皮肤科 | 超声刀·热玛吉·眼袋脂肪重置" },
      { property: "og:description", content: "釜山西面皮肤科专科医院。20年以上经验，眼袋手术4000例以上，50余种高端激光设备。欢迎外国患者，提供中文服务。" },
      { property: "og:url", content: "https://star-pibu.com/zh" },
      { property: "og:locale", content: "zh_CN" },
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
    const jsonLd = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "Star皮肤科", "url": "https://star-pibu.com/zh", "description": "釜山西面皮肤科专科诊所。", "telephone": "+82-51-818-2300", "address": { "@type": "PostalAddress", "streetAddress": "서면로 74, ION시티 4층", "addressLocality": "釜山镇区", "addressRegion": "釜山", "postalCode": "47189", "addressCountry": "KR" }, "geo": { "@type": "GeoCoordinates", "latitude": 35.1579, "longitude": 129.0597 }, "medicalSpecialty": "Dermatology", "inLanguage": "zh" };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="zh-medical"]');
    if (!scriptEl) { scriptEl = document.createElement("script"); scriptEl.setAttribute("type", "application/ld+json"); scriptEl.setAttribute("data-ld", "zh-medical"); document.head.appendChild(scriptEl); }
    scriptEl.textContent = JSON.stringify(jsonLd);
    return () => { document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술"; };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Header ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1a1a2e]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/zh">
            <img src={LOGO} alt="Star皮肤科" className="h-10 w-auto" loading="eager" fetchPriority="high" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white">
            <a href="#treatments" className="hover:text-[#c9a84c] transition">治疗项目</a>
            <a href="#doctors" className="hover:text-[#c9a84c] transition">医生介绍</a>
            <a href="#facility" className="hover:text-[#c9a84c] transition">院内设施</a>
            <a href="#access" className="hover:text-[#c9a84c] transition">交通指南</a>
          </nav>
          <div className="flex items-center gap-1 text-xs">
            <Link href="/" className="text-white/60 hover:text-white px-2 py-1">KO</Link>
            <Link href="/en" className="text-white/60 hover:text-white px-2 py-1">EN</Link>
            <Link href="/ja" className="text-white/60 hover:text-white px-2 py-1">JA</Link>
            <span className="text-[#c9a84c] font-bold border border-[#c9a84c] px-2 py-1 rounded">ZH</span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <picture className="absolute inset-0">
          <source media="(max-width: 768px)" srcSet={HERO_BG_MOBILE} type="image/webp" />
          <img src={HERO_BG_DESKTOP} alt="Star皮肤科 院内" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a2e]/50 to-[#1a1a2e]/80" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6">
          <img src={LOGO} alt="Star皮肤科 Logo" className="h-24 w-auto mx-auto mb-6" loading="eager" />
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">釜山 · 西面 · 2006年创立</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">Star<br />皮肤科</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-2">釜山高端皮肤科诊所</p>
          <p className="text-gray-300 mb-10">皮肤科专科医师 · 超声刀 · 热玛吉 · 眼袋脂肪重置</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-4 px-8 rounded-full hover:bg-[#b8973b] transition text-lg">📞 051-818-2300</a>
            <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-400 transition text-lg">💬 KakaoTalk咨询</a>
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
          {[{ num: "20年+", label: "诊疗经验", sub: "2006年创立" }, { num: "4,000例+", label: "眼袋手术实绩", sub: "丰富经验" }, { num: "50种+", label: "高端激光设备", sub: "最新技术" }].map((s) => (
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
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">诊所介绍</p>
            <h2 className="text-4xl font-bold mb-6 leading-tight">专业与<br />卓越的融合</h2>
            <p className="text-gray-600 leading-relaxed mb-4">位于釜山西面中心地带的Star皮肤科，自2006年创立以来一直提供高端皮肤护理服务。皮肤科专科医师亲自负责所有诊察，为每位患者制定最优治疗方案。</p>
            <p className="text-gray-600 leading-relaxed mb-6">配备50余种最新激光设备，拥有20年以上临床经验，提供多样化治疗项目。设有中文咨询服务，外国患者可放心就诊。</p>
            <div className="flex flex-wrap gap-3">
              {["超声刀Prime官方认证", "热玛吉医疗顾问", "眼袋手术4000例以上"].map((badge) => (
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
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">治疗项目</p>
          <h2 className="text-4xl font-bold text-center mb-12">代表治疗项目</h2>
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
                  <Link href={`/treatments/${t.slug}`} className="text-[#c9a84c] text-sm font-semibold hover:underline">查看详情 →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">医生介绍</p>
          <h2 className="text-4xl font-bold text-center mb-12">皮肤科专科医师团队</h2>
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
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">院内设施</p>
          <h2 className="text-4xl font-bold text-center text-white mb-12">诊所内部</h2>
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
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">外国患者指南</p>
          <h2 className="text-4xl font-bold text-center mb-4">海外患者就诊指南</h2>
          <p className="text-gray-500 text-center mb-12">Star皮肤科热烈欢迎外国患者。我们提供中文咨询服务，请放心就诊。</p>
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[{ step: "01", title: "预约", desc: "通过KakaoTalk或电话联系我们。中文咨询人员将为您服务。" }, { step: "02", title: "就诊", desc: "西面站5号或7号出口步行3分钟。ION City大厦4楼。" }, { step: "03", title: "诊察", desc: "皮肤科专科医师亲自诊察，为您制定最优治疗方案。" }, { step: "04", title: "术后护理", desc: "提供详细的术后护理说明书。回国后也可进行在线随访。" }].map((s) => (
              <div key={s.step} className="bg-[#f8f6f0] rounded-2xl p-5">
                <p className="text-[#c9a84c] text-3xl font-bold mb-2">{s.step}</p>
                <p className="font-bold text-[#1a1a2e] mb-1">{s.title}</p>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#f8f6f0] rounded-2xl p-5"><h3 className="font-bold text-[#1a1a2e] mb-2">支付方式</h3><p className="text-gray-600">支持信用卡（Visa、Mastercard、Amex）。也可使用韩国元现金支付。</p></div>
            <div className="bg-[#f8f6f0] rounded-2xl p-5"><h3 className="font-bold text-[#1a1a2e] mb-2">交通指南</h3><p className="text-gray-600">地铁：西面站（1号线·2号线）5号或7号出口，步行3分钟<br />地址：釜山广域市 釜山镇区 西面路74 ION City 4楼</p></div>
          </div>
        </div>
      </section>

      {/* ── Hours ── */}
      <section id="access" className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">诊疗时间</p>
          <h2 className="text-3xl font-bold mb-8">诊疗时间表</h2>
          <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
            {[{ day: "周一至周五", time: "10:00 〜 19:00" }, { day: "周六", time: "09:30 〜 15:00" }, { day: "周日·节假日", time: "休诊" }].map((r) => (
              <div key={r.day} className={`flex justify-between py-3 border-b border-gray-100 last:border-0 ${r.day === "周日·节假日" ? "text-gray-400" : ""}`}>
                <span className="font-medium">{r.day}</span><span>{r.time}</span>
              </div>
            ))}
            <p className="text-sm text-gray-400 mt-3">工作日午休 13:00〜14:00 · 周六无午休</p>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">患者评价</p>
          <h2 className="text-4xl font-bold text-center mb-2">患者真实评价</h2>
          <p className="text-center text-gray-400 mb-10">⭐ 4.9 / 5.0 · Naver评价标准</p>
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
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">预约</p>
        <h2 className="text-4xl font-bold mb-3">开启您的美肌之旅</h2>
        <p className="text-gray-300 mb-10 max-w-xl mx-auto">欢迎外国患者。中文咨询人员将为您提供贴心服务。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-4 px-10 rounded-full hover:bg-[#b8973b] transition text-lg">📞 051-818-2300</a>
          <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-4 px-10 rounded-full hover:bg-yellow-400 transition text-lg">💬 KakaoTalk咨询</a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-6 text-center text-sm">
        <img src={LOGO} alt="Star皮肤科" className="h-10 w-auto mx-auto mb-4 opacity-70" loading="lazy" />
        <p className="font-semibold text-white mb-1">Star皮肤科</p>
        <p>ION City大厦 2F·4F, 서면로 74, 부산진구, 부산, 韩国</p>
        <p className="mt-1">Tel: 051-818-2300 · Email: starpibu@naver.com</p>
        <p className="mt-2 text-xs">营业执照号: 605-24-84306 · © Star皮肤科. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <Link href="/" className="hover:text-white">한국어</Link>
          <Link href="/en" className="hover:text-white">English</Link>
          <Link href="/ja" className="hover:text-white">日本語</Link>
          <span className="text-[#c9a84c] font-semibold">中文</span>
        </div>
      </footer>
    </div>
  );
}
