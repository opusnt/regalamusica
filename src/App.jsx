import { useEffect } from "react";
import LandingHero from "./components/LandingHero.jsx";
import {
  B2BSection,
  BeforeAfterSection,
  ExamplesSection,
  FAQSection,
  GuaranteeSection,
  HowItWorksSection,
  OccasionsSection,
  PricingSection,
  SiteFooter,
  TrustSection,
} from "./components/LandingSections.jsx";
import SongWizard from "./components/SongWizard.jsx";
import {
  AdminOrdersPage,
  AdminOrderDetailPage,
  CancelledPage,
  CheckoutPage,
  GiftPage,
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
      <BeforeAfterSection />
      <PricingSection />
      <TrustSection />
      <GuaranteeSection />
      <B2BSection />
      <FAQSection />
      <SiteFooter />
    </main>
  );
}

export default function App() {
  const { pathname } = window.location;

  if (pathname === "/crear" || pathname === "/create-song") return <SongWizard />;
  if (pathname === "/checkout") return <CheckoutPage />;
  if (pathname === "/success") return <SuccessPage />;
  if (pathname === "/cancelled") return <CancelledPage />;
  if (pathname.startsWith("/admin/orders/")) return <AdminOrderDetailPage />;
  if (pathname === "/admin/orders") return <AdminOrdersPage />;
  if (pathname.startsWith("/order/")) return <OrderDetailPage />;
  if (pathname.startsWith("/regalo/")) return <GiftPage />;

  return <HomePage />;
}
