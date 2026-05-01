import Hero from "./components/Hero.jsx";
import StorySection from "./components/StorySection.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import DemoSection from "./components/DemoSection.jsx";
import SocialProof from "./components/SocialProof.jsx";
import ExperienceSelector from "./components/ExperienceSelector.jsx";
import ChatForm from "./components/ChatForm.jsx";
import FinalCTA from "./components/FinalCTA.jsx";

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-night text-soft">
      <Hero />
      <StorySection />
      <HowItWorks />
      <DemoSection />
      <SocialProof />
      <ExperienceSelector />
      <ChatForm />
      <FinalCTA />
    </main>
  );
}
