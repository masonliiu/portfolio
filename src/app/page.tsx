"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import BackgroundEffect from "@/components/portfolio/BackgroundEffect";
import Hero from "@/components/portfolio/Hero";
import FeaturedProjects from "@/components/portfolio/FeaturedProjects";
import ThemePanel from "@/components/portfolio/ThemePanel";
import ConnectForm from "@/components/portfolio/ConnectForm";
import LocationCard from "@/components/portfolio/LocationCard";
import ClickCounter from "@/components/portfolio/ClickCounter";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";
import Footer from "@/components/portfolio/Footer";
import AboutContent from "@/components/portfolio/AboutContent";

export default function Home() {
  const router = useRouter();
  const portraitRef = useRef<HTMLDivElement>(null);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [portraitStyle, setPortraitStyle] = useState<CSSProperties>();
  const [isPortraitFixed, setIsPortraitFixed] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const scrollToTopSmooth = () =>
    new Promise<void>((resolve) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      if (window.scrollY <= 1) {
        resolve();
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      const start = performance.now();
      const tick = () => {
        if (window.scrollY <= 1 || performance.now() - start > 900) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

  const lockPortrait = () => {
    const rect = portraitRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPortraitStyle({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setIsPortraitFixed(true);
  };

  const handleMoreAbout = async () => {
    if (prefersReducedMotion) {
      router.push("/about");
      return;
    }
    await scrollToTopSmooth();
    lockPortrait();
    setIsLeaving(true);
    setIsOverlayActive(true);
    setTimeout(() => {
      router.push("/about");
    }, 700);
  };

  const slideClass = isLeaving ? "home-slide leave-to-bottom" : "home-slide";

  return (
    <div className="relative min-h-screen">
      <BackgroundEffect />
      <div className="scroll-blur" />
      <main className="page-shell relative z-10 flex flex-col gap-12">
        <div className={slideClass}>
          <Hero
            onMoreAbout={handleMoreAbout}
            portraitRef={portraitRef}
            portraitStyle={portraitStyle}
            isPortraitFixed={isPortraitFixed}
          />

          <FeaturedProjects />

          <section className="grid gap-6 md:grid-cols-4 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <ThemePanel />
            </div>
            <div className="lg:col-span-2">
              <ConnectForm />
            </div>
            <div className="lg:col-span-2">
              <LocationCard />
            </div>
            <div className="lg:col-span-6">
              <ClickCounter />
            </div>
            <div className="lg:col-span-6">
              <GitHubActivity />
            </div>
            <div className="lg:col-span-6">
              <ContributionGraph />
            </div>
          </section>
        </div>
        <div className={`about-overlay ${isOverlayActive ? "is-active" : ""}`}>
          <div className="about-overlay__inner">
            <AboutContent />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
