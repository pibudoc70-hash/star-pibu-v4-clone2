/**
 * Equipment2 Page - 시술·장비소개2 (관리자 등록 시술 프로그램)
 * 별도 페이지에서 관리자가 등록한 시술을 표시하고 관리할 수 있는 페이지
 */
import { useEffect } from "react";
import Header from "@/components/Header";
import TreatmentsEquipmentSectionV2 from "@/components/TreatmentsEquipmentSectionV2";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Equipment2() {
  // 페이지 제목 설정 (SEO 최적화)
  useEffect(() => {
    document.title = "시술·장비소개 | 부산 스타피부과 울쎄라 써마지 리프팅 색소질환 레이저";
    
    // 메타 설명 동적 설정
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '부산 스타피부과의 다양한 시술과 장비를 소개합니다. 울쎄라, 써마지 리프팅, 색소질환 치료, 레이저 시술 등 최신 의료 장비와 프리미엄 시술 프로그램을 제공합니다.');
    }
    
    // 메타 키워드 동적 설정
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', '부산피부과, 울쎄라, 써마지, 리프팅, 색소질환, 레이저치료, 피부시술, 장비소개, 부산리프팅, 피부관리');
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        {/* Treatments + Equipment Section 2 - DB 연동 (관리자 등록) */}
        <TreatmentsEquipmentSectionV2 />

        {/* Location & Contact - 오시는 길 */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </div>
  );
}
