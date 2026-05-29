import { useEffect } from "react";
import { Link } from "wouter";

/**
 * LandingZH - 中文 SEO 落地页 (/zh)
 * 所有内容以中文硬编码 — 适配 Google/百度 爬虫
 */
export default function LandingZH() {
  useEffect(() => {
    document.title = "釜山Star皮肤科 | 超声刀 热玛吉 眼袋脂肪重置 | 西面皮肤科";
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
      "name": "Star皮肤科",
      "alternateName": "STAR Dermatology Clinic",
      "url": "https://star-pibu.com/zh",
      "description": "釜山西面皮肤科专科医院。提供超声刀、热玛吉FLX、眼袋脂肪重置、皮秒激光等高端项目。",
      "telephone": "+82-51-818-2300",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "西面路74 ION City大厦4F",
        "addressLocality": "釜山镇区",
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
        { "@type": "MedicalProcedure", "name": "超声刀Prime", "description": "HIFU超声波SMAS层提升项目" },
        { "@type": "MedicalProcedure", "name": "热玛吉FLX", "description": "第四代射频紧肤项目" },
        { "@type": "MedicalProcedure", "name": "眼袋脂肪重置", "description": "无切口眼部年轻化手术" },
        { "@type": "MedicalProcedure", "name": "皮秒激光", "description": "色素沉着及纹身去除皮秒激光" }
      ],
      "inLanguage": "zh",
      "knowsLanguage": ["Korean", "English", "Japanese", "Chinese"]
    };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="zh-medical"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-ld", "zh-medical");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ── 语言导航 ── */}
      <nav className="bg-[#1a1a2e] text-white py-2 px-4 text-sm flex justify-between items-center">
        <span className="font-semibold tracking-wide">STAR DERMATOLOGY</span>
        <div className="flex gap-3">
          <Link href="/" className="opacity-60 hover:opacity-100">KO</Link>
          <Link href="/en" className="opacity-60 hover:opacity-100">EN</Link>
          <Link href="/ja" className="opacity-60 hover:opacity-100">JA</Link>
          <span className="font-bold border-b border-white">ZH</span>
        </div>
      </nav>

      {/* ── 首屏 ── */}
      <section className="relative bg-[#1a1a2e] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] opacity-90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">釜山·西面 · Since 2006</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Star皮肤科</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">釜山顶级皮肤科医院</p>
          <p className="text-gray-400 mb-8">皮肤科专科医师 · 超声刀 · 热玛吉 · 眼袋脂肪重置</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b8973b] transition">
              📞 051-818-2300
            </a>
            <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
              💬 KakaoTalk咨询
            </a>
          </div>
        </div>
      </section>

      {/* ── 数据 ── */}
      <section className="bg-[#f8f6f0] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { num: "20年+", label: "皮肤科专科医师经验", sub: "2006年开业" },
            { num: "4,000+", label: "眼袋手术案例", sub: "经验丰富" },
            { num: "50+", label: "高端激光设备", sub: "最新设备" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-[#c9a84c]">{s.num}</p>
              <p className="font-semibold text-gray-800 mt-1">{s.label}</p>
              <p className="text-sm text-gray-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 关于我们 ── */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">关于我们</p>
        <h2 className="text-3xl font-bold mb-4">Star皮肤科简介</h2>
        <p className="text-gray-600 leading-relaxed">
          釜山西面交叉路口前的Star皮肤科，自2006年开业以来，始终坚持由皮肤科专科医师亲自进行一对一定制咨询。拥有50余种原装激光设备和20年以上经验的专科医师，为每位患者提供最优化的治疗方案。我们热忱欢迎外国患者，提供中文咨询服务，请放心前来就诊。
        </p>
      </section>

      {/* ── 主要项目 ── */}
      <section className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">项目介绍</p>
          <h2 className="text-3xl font-bold text-center mb-10">招牌项目</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "超声刀Prime",
                slug: "ulthera",
                desc: "HIFU超声波能量无需手术即可提升SMAS层。非侵入性面部提升的黄金标准。Star皮肤科是官方超声刀Prime认证医院。",
                tags: ["非侵入", "SMAS提升", "无需恢复"],
              },
              {
                name: "热玛吉FLX",
                slug: "thermage",
                desc: "第四代射频紧肤。促进深层胶原蛋白再生，使肌肤更紧致年轻。赵时亨院长是热玛吉官方顾问。",
                tags: ["射频能量", "胶原增生", "单次治疗"],
              },
              {
                name: "眼袋脂肪重置",
                slug: "under-eye-fat",
                desc: "重新分布眼下脂肪，改善黑眼圈和凹陷。无切口自然效果。累计4,000例以上手术经验。",
                tags: ["无切口", "4000例以上", "自然效果"],
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
                  了解更多 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 医生介绍 ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">医生介绍</p>
        <h2 className="text-3xl font-bold text-center mb-10">皮肤科专科医师</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "赵时亨 院长",
              title: "院长",
              specialty: "皮肤科专科医师 · 医学博士",
              careers: [
                "釜山大学医院皮肤科住院医师",
                "仁济大学皮肤科教授（前）",
                "热玛吉官方顾问",
                "大韩皮肤科学会正会员",
              ],
            },
            {
              name: "禹慧珍 医师",
              title: "医师",
              specialty: "皮肤科专科医师",
              careers: [
                "釜山大学医学院毕业",
                "釜山大学医院皮肤科住院医师",
                "大韩皮肤科学会正会员",
                "大韩激光学会正会员",
              ],
            },
            {
              name: "李基旭 医师",
              title: "医师",
              specialty: "皮肤科专科医师",
              careers: [
                "仁济大学医学院毕业",
                "仁济大学医院皮肤科住院医师",
                "大韩皮肤科学会正会员",
                "大韩美容皮肤·激光学会正会员",
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

      {/* ── 外国患者指南 ── */}
      <section className="bg-[#1a1a2e] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">外国患者指南</p>
          <h2 className="text-3xl font-bold text-center mb-4">外国患者就诊指南</h2>
          <p className="text-gray-300 text-center mb-10">Star皮肤科热忱欢迎外国患者。提供中文咨询服务，请放心就诊。</p>
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[
              { step: "01", title: "预约", desc: "通过KakaoTalk或电话预约。可提供中文咨询服务。" },
              { step: "02", title: "前往就诊", desc: "西面站5、7号出口步行3分钟。ION City大厦4楼。" },
              { step: "03", title: "咨询·治疗", desc: "专科医师亲自评估皮肤状况，推荐最适合的治疗方案。" },
              { step: "04", title: "术后护理", desc: "提供详细的术后护理指导。回国后也可在线咨询。" },
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
              <h3 className="font-bold mb-2">支付方式</h3>
              <p className="text-gray-300">支持信用卡（Visa、Mastercard、Amex）。也可使用韩元现金支付。自动按当前汇率换算。</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">交通指南</h3>
              <p className="text-gray-300">地铁：西面站（1、2号线）5、7号出口步行3分钟。<br />地址：釜山镇区西面路74 ION City大厦4F</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 诊疗时间 ── */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">诊疗时间</p>
        <h2 className="text-3xl font-bold mb-6">诊疗时间</h2>
        <div className="bg-[#f8f6f0] rounded-2xl p-6 text-left">
          {[
            { day: "周一至周五", time: "10:00 – 19:00" },
            { day: "周六", time: "09:30 – 15:00" },
            { day: "周日及节假日", time: "休诊" },
          ].map((r) => (
            <div key={r.day} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="font-medium text-gray-700">{r.day}</span>
              <span className="text-gray-600">{r.time}</span>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-3">工作日午休 13:00 – 14:00 · 周六不休息</p>
        </div>
      </section>

      {/* ── 患者评价 ── */}
      <section className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">患者评价</p>
          <h2 className="text-3xl font-bold text-center mb-2">患者真实评价</h2>
          <p className="text-center text-gray-500 mb-8">⭐ 4.9 / 5.0 · 基于Naver评价</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Kim**", treatment: "眼袋脂肪重置", text: "黑眼圈非常严重，手术后一个月眼部明显变亮。效果自然，非常满意！" },
              { name: "Lee**", treatment: "皮秒激光", text: "斑点很多，经过3次治疗后明显改善。肤色也变得更亮了。" },
              { name: "Park**", treatment: "超声刀Prime", text: "提升效果非常好。效果自然，恢复期短，非常满意！" },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-yellow-400 mb-2">★★★★★</p>
                <p className="text-gray-700 text-sm mb-3 italic">"{r.text}"</p>
                <p className="text-[#c9a84c] text-xs font-semibold">{r.treatment}</p>
                <p className="text-gray-400 text-xs">{r.name} · Naver</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 text-center bg-[#1a1a2e] text-white">
        <h2 className="text-3xl font-bold mb-3">预约咨询</h2>
        <p className="text-gray-300 mb-8">欢迎外国患者。提供中文服务的工作人员将为您提供帮助。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b8973b] transition">
            📞 051-818-2300
          </a>
          <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
            💬 KakaoTalk
          </a>
        </div>
      </section>

      {/* ── 页脚 ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
        <p className="font-semibold text-white mb-1">Star皮肤科</p>
        <p>釜山广域市釜山镇区西面路74 ION City大厦 2·4楼</p>
        <p className="mt-1">Tel: 051-818-2300 · Email: starpibu@naver.com</p>
        <p className="mt-2 text-xs">营业执照号：605-24-84306 · © Star皮肤科. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/" className="hover:text-white">한국어</Link>
          <Link href="/en" className="hover:text-white">English</Link>
          <Link href="/ja" className="hover:text-white">日本語</Link>
          <span className="text-white font-semibold">中文</span>
        </div>
      </footer>
    </div>
  );
}
