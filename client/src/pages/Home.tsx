import MainLayout from "@/components/MainLayout";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import DoctorsSection from "@/components/DoctorsSection";
import TreatmentsSection from "@/components/TreatmentsSection";
import FacilitySection from "@/components/FacilitySection";
import ReviewsSection from "@/components/ReviewsSection";
import WelcomePopup from "@/components/WelcomePopup";

export default function Home() {
  return (
    <MainLayout>
      <WelcomePopup />
      <HeroSection />
      <EventsSection />
      <DoctorsSection />
      <TreatmentsSection />
      <FacilitySection />
      <ReviewsSection />
    </MainLayout>
  );
}
