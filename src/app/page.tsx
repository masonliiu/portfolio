"use client";

import { useMemo } from "react";
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

  const handleMoreAbout = async () => {
    if (prefersReducedMotion) {
      router.push("/about");
      return;
    }
    await scrollToTopSmooth();
    const startTransition = (document as unknown as { startViewTransition?: (callback: () => void) => void })
      .startViewTransition;
    if (startTransition) {
      startTransition(() => router.push("/about"));
    } else {
      router.push("/about");
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundEffect />
      <div className="scroll-blur" />
      <main className="page-shell relative z-10 flex flex-col gap-12">
        <Hero onMoreAbout={handleMoreAbout} />

        <FeaturedProjects />

        <section className="grid gap-8 md:grid-cols-4 lg:grid-cols-6">
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
      </main>
      <Footer />
    </div>
  );
}
