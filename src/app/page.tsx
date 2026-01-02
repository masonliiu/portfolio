"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

export default function Home() {
  const router = useRouter();
  const portraitRef = useRef<HTMLDivElement>(null);
  const [slideStage, setSlideStage] = useState<"idle" | "enter-from" | "enter">(
    "idle"
  );
  const [isLeaving, setIsLeaving] = useState(false);
  const [portraitPhase, setPortraitPhase] = useState<
    "idle" | "to-about" | "from-about-prep" | "from-about"
  >("idle");
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromAbout = sessionStorage.getItem("transition-from-about");
    if (!fromAbout) return;
    sessionStorage.removeItem("transition-from-about");
    lockPortrait();
    setPortraitPhase("from-about-prep");
    setSlideStage("enter-from");
    requestAnimationFrame(() => {
      setSlideStage("enter");
      setPortraitPhase("from-about");
    });
    const timeout = setTimeout(() => {
      setSlideStage("idle");
      setPortraitPhase("idle");
      setIsPortraitFixed(false);
    }, 700);
    return () => clearTimeout(timeout);
  }, []);

  const handleMoreAbout = async () => {
    if (prefersReducedMotion) {
      sessionStorage.setItem("transition-from-home", "1");
      router.push("/about");
      return;
    }
    await scrollToTopSmooth();
    lockPortrait();
    setPortraitPhase("to-about");
    setIsLeaving(true);
    sessionStorage.setItem("transition-from-home", "1");
    setTimeout(() => {
      router.push("/about");
    }, 700);
  };

  const slideClass =
    slideStage === "enter-from"
      ? "home-slide enter-from-bottom"
      : slideStage === "enter"
        ? "home-slide enter-active"
        : isLeaving
          ? "home-slide leave-to-bottom"
          : "home-slide";

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
            portraitPhase={portraitPhase}
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
      </main>
      <Footer />
    </div>
  );
}
