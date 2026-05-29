import { useEffect } from "react";
import { Link } from "wouter";

/**
 * LandingEN - English SEO Landing Page (/en)
 * All content is hard-coded in English for Google/Yahoo crawling.
 * hreflang alternate tags are set for multilingual SEO.
 */
export default function LandingEN() {
  useEffect(() => {
    document.title = "STAR Dermatology Busan | Ultherapy Thermage Under-Eye Fat Repositioning | Seomyeon";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "STAR Dermatology in Busan Seomyeon — Board-certified dermatologists with 20+ years of experience. Specialists in Ultherapy Prime, Thermage FLX, Under-Eye Fat Repositioning, Pico Laser, and 50+ premium treatments. International patients welcome." },
      { name: "keywords", content: "Busan dermatology, Seomyeon skin clinic, Ultherapy Busan, Thermage Busan, under-eye fat repositioning, pico laser Busan, Korean dermatologist, STAR Dermatology, skin lifting Busan, foreign patient dermatology Korea" },
      { property: "og:title", content: "STAR Dermatology Busan | Ultherapy · Thermage · Under-Eye Fat Repositioning" },
      { property: "og:description", content: "Board-certified dermatologists in Busan Seomyeon. 20+ years experience, 4,000+ under-eye procedures, 50+ premium laser devices. International patients welcome." },
      { property: "og:url", content: "https://star-pibu.com/en" },
      { property: "og:locale", content: "en_US" },
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
      "name": "STAR Dermatology Clinic",
      "alternateName": "스타피부과",
      "url": "https://star-pibu.com/en",
      "logo": "https://star-pibu.com/logo.png",
      "description": "Board-certified dermatology clinic in Busan Seomyeon specializing in Ultherapy, Thermage FLX, Under-Eye Fat Repositioning, and premium laser treatments.",
      "telephone": "+82-51-818-2300",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "74 Seomyeon-ro, ION City Building 4F",
        "addressLocality": "Busanjin-gu",
        "addressRegion": "Busan",
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
        { "@type": "MedicalProcedure", "name": "Ultherapy Prime", "description": "HIFU ultrasound SMAS lifting treatment" },
        { "@type": "MedicalProcedure", "name": "Thermage FLX", "description": "4th generation RF skin tightening treatment" },
        { "@type": "MedicalProcedure", "name": "Under-Eye Fat Repositioning", "description": "Non-incision under-eye rejuvenation surgery" },
        { "@type": "MedicalProcedure", "name": "Pico Laser", "description": "Picosecond laser for pigmentation and tattoo removal" }
      ],
      "inLanguage": "en",
      "knowsLanguage": ["Korean", "English", "Japanese", "Chinese"]
    };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="en-medical"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-ld", "en-medical");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ── Language Navigation ── */}
      <nav className="bg-[#1a1a2e] text-white py-2 px-4 text-sm flex justify-between items-center">
        <span className="font-semibold tracking-wide">STAR DERMATOLOGY</span>
        <div className="flex gap-3">
          <Link href="/" className="opacity-60 hover:opacity-100">KO</Link>
          <span className="font-bold border-b border-white">EN</span>
          <Link href="/ja" className="opacity-60 hover:opacity-100">JA</Link>
          <Link href="/zh" className="opacity-60 hover:opacity-100">ZH</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative bg-[#1a1a2e] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] opacity-90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">Busan · Seomyeon · Since 2006</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">STAR Dermatology</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">Busan's Premier Skin Clinic</p>
          <p className="text-gray-400 mb-8">Board-Certified Dermatologists · Ultherapy · Thermage · Under-Eye Fat Repositioning</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b8973b] transition">
              📞 Call: 051-818-2300
            </a>
            <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
              💬 KakaoTalk Consultation
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#f8f6f0] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { num: "20+", label: "Years of Experience", sub: "Est. 2006" },
            { num: "4,000+", label: "Under-Eye Procedures", sub: "Proven results" },
            { num: "50+", label: "Premium Laser Devices", sub: "State-of-the-art" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-[#c9a84c]">{s.num}</p>
              <p className="font-semibold text-gray-800 mt-1">{s.label}</p>
              <p className="text-sm text-gray-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">About Us</p>
        <h2 className="text-3xl font-bold mb-4">Welcome to STAR Dermatology</h2>
        <p className="text-gray-600 leading-relaxed">
          Since our founding in 2006, STAR Dermatology in Busan's Seomyeon district has provided personalized 1:1 consultations led directly by board-certified dermatologists. With over 50 original laser devices and specialists with 20+ years of experience, we deliver outstanding results tailored to each patient. We warmly welcome international patients and offer consultations in English, Japanese, and Chinese.
        </p>
      </section>

      {/* ── Featured Treatments ── */}
      <section className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Treatments</p>
          <h2 className="text-3xl font-bold text-center mb-10">Signature Treatments</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ultherapy Prime",
                slug: "ulthera",
                desc: "HIFU ultrasound energy lifts the SMAS layer without surgery. The gold standard for non-invasive facial lifting. STAR Dermatology is an official Ultherapy Prime clinic.",
                tags: ["Non-invasive", "SMAS Lifting", "No Downtime"],
              },
              {
                name: "Thermage FLX",
                slug: "thermage",
                desc: "4th-generation RF skin tightening. Stimulates deep collagen regeneration for firmer, younger-looking skin. Dr. Cho Si-hyung is an official Thermage advisor.",
                tags: ["RF Energy", "Collagen Boost", "1 Session"],
              },
              {
                name: "Under-Eye Fat Repositioning",
                slug: "under-eye-fat",
                desc: "Repositions under-eye fat to eliminate dark circles and hollows. Natural results without incisions. Over 4,000 procedures performed.",
                tags: ["No Incision", "4,000+ Cases", "Natural Results"],
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
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Our Doctors</p>
        <h2 className="text-3xl font-bold text-center mb-10">Meet Our Specialists</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Dr. Cho Si-hyung",
              title: "Director",
              specialty: "Board-Certified Dermatologist · MD, PhD",
              careers: [
                "Residency at Pusan National University Hospital",
                "Former Professor, Inje University Dermatology",
                "Official Thermage Advisor",
                "Member, Korean Dermatological Association",
              ],
            },
            {
              name: "Dr. Woo Hye-jin",
              title: "Specialist",
              specialty: "Board-Certified Dermatologist",
              careers: [
                "MD, Pusan National University",
                "Residency at Pusan National University Hospital",
                "Member, Korean Dermatological Association",
                "Member, Korean Laser Society",
              ],
            },
            {
              name: "Dr. Lee Ki-wook",
              title: "Specialist",
              specialty: "Board-Certified Dermatologist",
              careers: [
                "MD, Inje University",
                "Residency at Inje University Hospital",
                "Member, Korean Dermatological Association",
                "Member, Korean Society of Aesthetic Dermatology",
              ],
            },
          ].map((d) => (
            <div key={d.name} className="bg-[#f8f6f0] rounded-2xl p-6">
              <div className="w-16 h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {d.name.split(" ")[1]?.[0] || "D"}
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

      {/* ── Foreign Patient Guide ── */}
      <section className="bg-[#1a1a2e] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">International Patients</p>
          <h2 className="text-3xl font-bold text-center mb-4">Foreign Patient Guide</h2>
          <p className="text-gray-300 text-center mb-10">STAR Dermatology welcomes international patients. Consultations available in English, Japanese, and Chinese.</p>
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[
              { step: "01", title: "Book", desc: "Reserve via KakaoTalk or phone. Multilingual consultations available." },
              { step: "02", title: "Visit", desc: "3-min walk from Seomyeon Station Exit 5 or 7. ION City Building, 4th Floor." },
              { step: "03", title: "Consult & Treat", desc: "Our specialists personally assess your skin and recommend the best treatment." },
              { step: "04", title: "Aftercare", desc: "Detailed post-treatment care instructions. Online follow-up available." },
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
              <h3 className="font-bold mb-2">Payment</h3>
              <p className="text-gray-300">Credit cards accepted (Visa, Mastercard, Amex). Korean Won cash also accepted. Automatic currency conversion at current rates.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Getting Here</h3>
              <p className="text-gray-300">Subway: Seomyeon Station (Line 1 & 2), Exit 5 or 7 — 3-min walk.<br />Address: 74 Seomyeon-ro, Busanjin-gu, Busan (ION City Bldg. 4F)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clinic Hours ── */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Hours</p>
        <h2 className="text-3xl font-bold mb-6">Clinic Hours</h2>
        <div className="bg-[#f8f6f0] rounded-2xl p-6 text-left">
          {[
            { day: "Mon – Fri", time: "10:00 – 19:00" },
            { day: "Saturday", time: "09:30 – 15:00" },
            { day: "Sun & Holidays", time: "Closed" },
          ].map((r) => (
            <div key={r.day} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="font-medium text-gray-700">{r.day}</span>
              <span className="text-gray-600">{r.time}</span>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-3">Weekday lunch break 13:00 – 14:00 · No lunch break on Saturdays</p>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Patient Reviews</p>
          <h2 className="text-3xl font-bold text-center mb-2">What Our Patients Say</h2>
          <p className="text-center text-gray-500 mb-8">⭐ 4.9 / 5.0 · Based on Naver reviews</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Kim**", treatment: "Under-Eye Fat Repositioning", text: "My dark circles were severe, but after the procedure my eyes brightened within a month. Very natural and satisfied!" },
              { name: "Lee**", treatment: "Pico Laser", text: "I had many age spots, and after 3 sessions they improved significantly. My skin tone is also brighter now." },
              { name: "Park**", treatment: "Ultherapy Prime", text: "The lifting effect is excellent. Very natural results with minimal recovery time. Highly satisfied!" },
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
        <h2 className="text-3xl font-bold mb-3">Book Your Consultation</h2>
        <p className="text-gray-300 mb-8">International patients welcome. Multilingual staff available.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b8973b] transition">
            📞 051-818-2300
          </a>
          <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
            💬 KakaoTalk
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
        <p className="font-semibold text-white mb-1">STAR Dermatology Clinic</p>
        <p>ION City Building 2F & 4F, 74 Seomyeon-ro, Busanjin-gu, Busan, Korea</p>
        <p className="mt-1">Tel: 051-818-2300 · Email: starpibu@naver.com</p>
        <p className="mt-2 text-xs">Business Reg. No.: 605-24-84306 · © STAR Dermatology Clinic. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/" className="hover:text-white">한국어</Link>
          <span className="text-white font-semibold">English</span>
          <Link href="/ja" className="hover:text-white">日本語</Link>
          <Link href="/zh" className="hover:text-white">中文</Link>
        </div>
      </footer>
    </div>
  );
}
