import { useEffect } from "react";
import LandingHero from "./components/LandingHero.jsx";
import {
  ExamplesSection,
  FAQSection,
  HowItWorksSection,
  OccasionsSection,
  PricingSection,
  SiteFooter,
  TrustSection,
} from "./components/LandingSections.jsx";
import SongWizard from "./components/SongWizard.jsx";
import {
  AdminOrdersPage,
  CancelledPage,
  OrderDetailPage,
  SuccessPage,
} from "./components/OrderPages.jsx";
import { analyticsEvents, trackEvent } from "./lib/analytics.js";

function HomePage() {
  useEffect(() => {
    trackEvent(analyticsEvents.viewHome);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-night text-soft">
      <LandingHero />
      <HowItWorksSection />
      <OccasionsSection />
      <ExamplesSection />
      <PricingSection />
      <TrustSection />
      <FAQSection />
      <SiteFooter />
    </main>
  );
}

export default function App() {
  const { pathname } = window.location;

  if (pathname === "/checkout") return <SongWizard />;
  if (pathname === "/success") return <SuccessPage />;
  if (pathname === "/cancelled") return <CancelledPage />;
  if (pathname === "/admin/orders") return <AdminOrdersPage />;
  if (pathname.startsWith("/order/")) return <OrderDetailPage />;

  return <HomePage />;
}
