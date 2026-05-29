import { useEffect, useState } from "react";
import { Link } from "wouter";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";
const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";
const LOGO = `${CDN}/star_ai_logo_1_73172f49.png`;
const HERO_BG_DESKTOP = `${CDN}/hero-bg-new-desktop_2f8a8ccf.webp`;
const HERO_BG_MOBILE = `${CDN}/hero-bg-new-mobile_ebac0b77.webp`;

const DOCTORS = [
  { name: "Dr. Cho Si-hyeong", title: "Medical Director", specialty: "Dermatology Specialist · M.D., Ph.D.", img: `${CDN2}/01_5e3176cb.png`, careers: ["Residency, Pusan National University Hospital", "Former Professor, Inje University Dermatology", "Official Thermage FLX Medical Advisor", "Member, Korean Dermatological Association"] },
  { name: "Dr. Woo Hye-jin", title: "Physician", specialty: "Dermatology Specialist", img: `${CDN2}/0211_8cfcf452.png`, careers: ["Pusan National University School of Medicine", "Residency, Pusan National University Hospital", "Member, Korean Dermatological Association", "Member, Korean Laser Society"] },
  { name: "Dr. Lee Gi-wook", title: "Physician", specialty: "Dermatology Specialist", img: `${CDN2}/03_46691618.png`, careers: ["Inje University School of Medicine", "Residency, Inje University Hospital", "Member, Korean Dermatological Association", "Member, Korean Aesthetic Dermatology & Laser Society"] },
];

const TREATMENTS = [
  { name: "Ultherapy Prime", slug: "ulthera", desc: "HIFU ultrasound energy lifts the SMAS layer without surgery. The gold standard for non-invasive facial lifting. Star Dermatology is an official Ultherapy Prime certified clinic.", tags: ["Non-invasive", "SMAS Lifting", "No Downtime"], img: `${CDN2}/울쎄라_7f6c3083.jpg` },
  { name: "Thermage FLX", slug: "thermage", desc: "4th-generation radiofrequency skin tightening. Stimulates deep collagen regeneration for firmer, younger-looking skin. Dr. Cho is an official Thermage medical advisor.", tags: ["RF Energy", "Collagen Boost", "Single Session"], img: `${CDN2}/울써마지리프팅_17bc44ff.png` },
  { name: "Under-Eye Fat Repositioning", slug: "under-eye-fat", desc: "Redistributes under-eye fat to correct dark circles and hollows. Natural results without incisions. Over 4,000 procedures performed.", tags: ["No Incision", "4,000+ Cases", "Natural Results"], img: `${CDN}/treat-eyelid-new-6Qge5k6ndWTS5nFXDZSXRF.webp` },
];

const FACILITY_IMGS = [
  { src: `${CDN}/gKokBoh3bDWm_b8ea202e.jpg`, alt: "Star Dermatology reception" },
  { src: `${CDN}/3PticSr0g4jr_e69d1049.jpg`, alt: "Consultation room" },
  { src: `${CDN}/7IUeNj7YG383_91ad3b5b.jpg`, alt: "Treatment room" },
  { src: `${CDN}/BZDyHWjrUcLj_3f4c9c8d.jpg`, alt: "Laser equipment room" },
];

const REVIEWS = [
  { name: "Kim**", treatment: "Under-Eye Fat Repositioning", text: "My dark circles were really bad, but one month after the procedure my eyes look so much brighter. The result is natural and I'm very satisfied!" },
  { name: "Lee**", treatment: "Pico Laser", text: "I had a lot of pigmentation and after 3 sessions it improved significantly. My skin tone has brightened too." },
  { name: "Park**", treatment: "Ultherapy Prime", text: "The lifting effect is excellent. Natural results and short recovery time — highly recommend." },
];

export default function LandingEN() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "Busan Star Dermatology | Ultherapy · Thermage FLX · Under-Eye Surgery | Seomyeon";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "Star Dermatology in Busan Seomyeon. Board-certified dermatologist with 20+ years experience. Ultherapy Prime, Thermage FLX, Under-Eye Fat Repositioning, Pico Laser and 50+ premium treatments. Foreign patients welcome — English consultation available." },
      { name: "keywords", content: "Busan dermatology, Seomyeon skin clinic, Ultherapy Busan, Thermage Busan, under-eye surgery Korea, pico laser Busan, Korean skin clinic, Star Dermatology, Busan aesthetic clinic, English dermatology Korea" },
      { property: "og:title", content: "Busan Star Dermatology | Ultherapy · Thermage FLX · Under-Eye Surgery" },
      { property: "og:description", content: "Board-certified dermatologist in Busan Seomyeon. 20+ years experience, 4,000+ under-eye procedures, 50+ premium laser devices. Foreign patients welcome." },
      { property: "og:url", content: "https://star-pibu.com/en" },
      { property: "og:locale", content: "en_US" },
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
    const jsonLd = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "Star Dermatology", "url": "https://star-pibu.com/en", "description": "Board-certified dermatology clinic in Busan Seomyeon.", "telephone": "+82-51-818-2300", "address": { "@type": "PostalAddress", "streetAddress": "74 Seomyeon-ro, ION City Building 4F", "addressLocality": "Busanjin-gu", "addressRegion": "Busan", "postalCode": "47189", "addressCountry": "KR" }, "geo": { "@type": "GeoCoordinates", "latitude": 35.1579, "longitude": 129.0597 }, "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "19:00" }, { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:30", "closes": "15:00" }], "medicalSpecialty": "Dermatology", "inLanguage": "en" };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="en-medical"]');
    if (!scriptEl) { scriptEl = document.createElement("script"); scriptEl.setAttribute("type", "application/ld+json"); scriptEl.setAttribute("data-ld", "en-medical"); document.head.appendChild(scriptEl); }
    scriptEl.textContent = JSON.stringify(jsonLd);
    return () => { document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술"; };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Header ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1a1a2e]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/en">
            <img src={LOGO} alt="Star Dermatology" className="h-10 w-auto" loading="eager" fetchPriority="high" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white">
            <a href="#treatments" className="hover:text-[#c9a84c] transition">Treatments</a>
            <a href="#doctors" className="hover:text-[#c9a84c] transition">Doctors</a>
            <a href="#facility" className="hover:text-[#c9a84c] transition">Facility</a>
            <a href="#access" className="hover:text-[#c9a84c] transition">Access</a>
          </nav>
          <div className="flex items-center gap-1 text-xs">
            <Link href="/" className="text-white/60 hover:text-white px-2 py-1">KO</Link>
            <span className="text-[#c9a84c] font-bold border border-[#c9a84c] px-2 py-1 rounded">EN</span>
            <Link href="/ja" className="text-white/60 hover:text-white px-2 py-1">JA</Link>
            <Link href="/zh" className="text-white/60 hover:text-white px-2 py-1">ZH</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <picture className="absolute inset-0">
          <source media="(max-width: 768px)" srcSet={HERO_BG_MOBILE} type="image/webp" />
          <img src={HERO_BG_DESKTOP} alt="Star Dermatology clinic interior" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a2e]/50 to-[#1a1a2e]/80" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6">
          <img src={LOGO} alt="Star Dermatology logo" className="h-24 w-auto mx-auto mb-6" loading="eager" />
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">Busan · Seomyeon · Since 2006</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">Star<br />Dermatology</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-2">Busan's Premier Skin Clinic</p>
          <p className="text-gray-300 mb-10">Board-Certified Dermatologist · Ultherapy · Thermage · Under-Eye Surgery</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-4 px-8 rounded-full hover:bg-[#b8973b] transition text-lg">📞 051-818-2300</a>
            <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-400 transition text-lg">💬 KakaoTalk</a>
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
          {[{ num: "20+", label: "Years of Experience", sub: "Est. 2006" }, { num: "4,000+", label: "Under-Eye Procedures", sub: "Proven Results" }, { num: "50+", label: "Premium Laser Devices", sub: "Latest Technology" }].map((s) => (
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
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">About Us</p>
            <h2 className="text-4xl font-bold mb-6 leading-tight">Where Expertise<br />Meets Excellence</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Located at the heart of Busan's Seomyeon district, Star Dermatology has been delivering premium skin care since 2006. Our board-certified dermatologist personally conducts every consultation, ensuring each patient receives a customized treatment plan.</p>
            <p className="text-gray-600 leading-relaxed mb-6">With over 50 state-of-the-art laser devices and 20+ years of clinical expertise, we offer a comprehensive range of treatments. Foreign patients are warmly welcomed with English consultation available.</p>
            <div className="flex flex-wrap gap-3">
              {["Official Ultherapy Prime Clinic", "Thermage Medical Advisor", "4,000+ Under-Eye Cases"].map((badge) => (
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
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Treatments</p>
          <h2 className="text-4xl font-bold text-center mb-12">Signature Procedures</h2>
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
                  <Link href={`/treatments/${t.slug}`} className="text-[#c9a84c] text-sm font-semibold hover:underline">Learn More →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Our Team</p>
          <h2 className="text-4xl font-bold text-center mb-12">Board-Certified Dermatologists</h2>
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
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Facility</p>
          <h2 className="text-4xl font-bold text-center text-white mb-12">Our Clinic</h2>
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
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">For International Patients</p>
          <h2 className="text-4xl font-bold text-center mb-4">Visiting from Abroad?</h2>
          <p className="text-gray-500 text-center mb-12">Star Dermatology warmly welcomes international patients. English consultation is available — no worries.</p>
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[{ step: "01", title: "Book", desc: "Contact us via KakaoTalk or phone. English-speaking staff available." }, { step: "02", title: "Visit", desc: "3-min walk from Seomyeon Station exits 5 & 7. ION City Building 4F." }, { step: "03", title: "Consult", desc: "Board-certified doctor evaluates your skin and recommends the best treatment." }, { step: "04", title: "Aftercare", desc: "Detailed aftercare instructions provided. Online follow-up available after returning home." }].map((s) => (
              <div key={s.step} className="bg-[#f8f6f0] rounded-2xl p-5">
                <p className="text-[#c9a84c] text-3xl font-bold mb-2">{s.step}</p>
                <p className="font-bold text-[#1a1a2e] mb-1">{s.title}</p>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#f8f6f0] rounded-2xl p-5"><h3 className="font-bold text-[#1a1a2e] mb-2">Payment</h3><p className="text-gray-600">Credit cards accepted (Visa, Mastercard, Amex). Korean Won cash also accepted.</p></div>
            <div className="bg-[#f8f6f0] rounded-2xl p-5"><h3 className="font-bold text-[#1a1a2e] mb-2">Getting Here</h3><p className="text-gray-600">Subway: Seomyeon Station (Line 1 & 2), Exit 5 or 7, 3-min walk.<br />Address: ION City Building 4F, 74 Seomyeon-ro, Busanjin-gu, Busan</p></div>
          </div>
        </div>
      </section>

      {/* ── Hours ── */}
      <section id="access" className="bg-[#f8f6f0] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Hours</p>
          <h2 className="text-3xl font-bold mb-8">Opening Hours</h2>
          <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
            {[{ day: "Mon – Fri", time: "10:00 – 19:00" }, { day: "Saturday", time: "09:30 – 15:00" }, { day: "Sunday & Holidays", time: "Closed" }].map((r) => (
              <div key={r.day} className={`flex justify-between py-3 border-b border-gray-100 last:border-0 ${r.day === "Sunday & Holidays" ? "text-gray-400" : ""}`}>
                <span className="font-medium">{r.day}</span><span>{r.time}</span>
              </div>
            ))}
            <p className="text-sm text-gray-400 mt-3">Lunch break 13:00–14:00 on weekdays · No lunch break on Saturdays</p>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2 text-center">Reviews</p>
          <h2 className="text-4xl font-bold text-center mb-2">Patient Testimonials</h2>
          <p className="text-center text-gray-400 mb-10">⭐ 4.9 / 5.0 · Based on Naver Reviews</p>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-[#f8f6f0] rounded-2xl p-6 hover:shadow-md transition">
                <p className="text-yellow-400 text-xl mb-3">★★★★★</p>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed italic">"{r.text}"</p>
                <p className="text-[#c9a84c] text-xs font-semibold">{r.treatment}</p>
                <p className="text-gray-400 text-xs">{r.name} · Naver</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a2e] py-20 px-6 text-center text-white">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Book Now</p>
        <h2 className="text-4xl font-bold mb-3">Start Your Skin Journey</h2>
        <p className="text-gray-300 mb-10 max-w-xl mx-auto">International patients welcome. Our English-speaking staff will guide you through every step.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+82518182300" className="bg-[#c9a84c] text-black font-bold py-4 px-10 rounded-full hover:bg-[#b8973b] transition text-lg">📞 051-818-2300</a>
          <a href="https://pf.kakao.com/_HNyGC" target="_blank" rel="noopener noreferrer" className="bg-[#FEE500] text-black font-bold py-4 px-10 rounded-full hover:bg-yellow-400 transition text-lg">💬 KakaoTalk Consult</a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-6 text-center text-sm">
        <img src={LOGO} alt="Star Dermatology" className="h-10 w-auto mx-auto mb-4 opacity-70" loading="lazy" />
        <p className="font-semibold text-white mb-1">Star Dermatology</p>
        <p>ION City Building 2F · 4F, 74 Seomyeon-ro, Busanjin-gu, Busan, Korea</p>
        <p className="mt-1">Tel: 051-818-2300 · Email: starpibu@naver.com</p>
        <p className="mt-2 text-xs">Business Reg. No.: 605-24-84306 · © Star Dermatology. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <Link href="/" className="hover:text-white">한국어</Link>
          <span className="text-[#c9a84c] font-semibold">English</span>
          <Link href="/ja" className="hover:text-white">日本語</Link>
          <Link href="/zh" className="hover:text-white">中文</Link>
        </div>
      </footer>
    </div>
  );
}
