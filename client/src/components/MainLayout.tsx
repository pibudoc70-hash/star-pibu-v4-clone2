import Header from "./Header";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";
import WelcomePopup from "./WelcomePopup";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCTA />
      <WelcomePopup />
    </div>
  );
}
