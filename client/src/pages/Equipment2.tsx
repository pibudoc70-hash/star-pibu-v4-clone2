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
    document.title = "시술·장비소개2 | 스타피부과";
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
