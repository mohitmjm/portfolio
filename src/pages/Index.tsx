import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ScrollProgressRail } from "@/components/ui/ScrollProgressRail";
import { PersonaChatbot } from "@/components/chatbot/PersonaChatbot";

const BackgroundScene = lazy(() =>
  import("@/components/three/BackgroundScene").then((m) => ({ default: m.BackgroundScene })),
);

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Mohit Mohatkar | AI Developer, Cybersecurity Intern & Full Stack Engineer</title>
        <meta name="description" content="Cinematic portfolio of Mohit Mohatkar — AI/ML, cybersecurity, automation and full-stack projects, including the Smart HR Portal case study and an in-browser Python compiler." />
        <link rel="canonical" href="https://mohitmohatkar.in/" />
      </Helmet>

      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-gradient-hero" />}>
        <BackgroundScene />
      </Suspense>

      <Navbar />
      <ScrollProgressRail />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <ContactSection />
      </main>

      <Footer />
      <PersonaChatbot />
    </>
  );
};

export default Index;
