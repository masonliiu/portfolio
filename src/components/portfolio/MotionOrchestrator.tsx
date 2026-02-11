"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function MotionOrchestrator() {
  const pathname = usePathname();
  const isImmersive = pathname.startsWith("/immersive");

  useEffect(() => {
    if (isImmersive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.05,
      smoothWheel: true,
      normalizeWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    const root = document.documentElement;
    const ticker = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ({ progress, velocity, direction, scroll, limit }) => {
      const percent = limit === 0 ? 0 : progress * 100;
      root.style.setProperty("--scroll-progress", `${percent.toFixed(2)}%`);
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--scroll-offset", `${scroll.toFixed(2)}px`);
      root.dataset.scrollDir = direction > 0 ? "down" : "up";
      ScrollTrigger.update();
    });

    const handleResize = () => lenis.resize();

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener("resize", handleResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      root.removeAttribute("data-scroll-dir");
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-velocity");
      root.style.removeProperty("--scroll-offset");
    };
  }, [isImmersive, pathname]);

  useEffect(() => {
    if (isImmersive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const revealTargets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const triggers: ScrollTrigger[] = [];

    revealTargets.forEach((target) => {
      const tween = gsap.fromTo(
        target,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: target,
            start: "top 86%",
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [isImmersive, pathname]);

  useEffect(() => {
    if (isImmersive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const fillTargets = gsap.utils.toArray<HTMLElement>("[data-fill]");
    const triggers: ScrollTrigger[] = [];

    fillTargets.forEach((target) => {
      target.style.setProperty("--fill-progress", "0%");
      const trigger = ScrollTrigger.create({
        trigger: target,
        start: "top 88%",
        end: "top 30%",
        scrub: true,
        onUpdate: (self) => {
          target.style.setProperty(
            "--fill-progress",
            `${Math.round(self.progress * 100)}%`
          );
        },
      });
      triggers.push(trigger);
    });

    ScrollTrigger.refresh();
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [isImmersive, pathname]);

  return null;
}
