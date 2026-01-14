"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function MotionOrchestrator() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isImmersive = pathname.startsWith("/immersive");

  useEffect(() => {
    if (isImmersive) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 1.2,
      touchInertiaExponent: 32,
      wheelMultiplier: 1.1,
      normalizeWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: isHome ? "horizontal" : "vertical",
      gestureOrientation: isHome ? "both" : "vertical",
    });

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    const root = document.documentElement;
    root.dataset.scrollAxis = isHome ? "horizontal" : "vertical";

    lenis.on("scroll", ({ progress, velocity, direction, scroll, limit }) => {
      const percent = limit === 0 ? 0 : progress * 100;
      root.style.setProperty("--scroll-progress", `${percent.toFixed(2)}%`);
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--scroll-offset", `${scroll.toFixed(2)}px`);
      root.dataset.scrollDir =
        direction > 0 ? (isHome ? "forward" : "down") : isHome ? "back" : "up";
      ScrollTrigger.update();
    });

    const handleAnchor = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href") ?? "";
      const isHash = href.startsWith("#") || href.startsWith("/#");
      if (!isHash) return;
      if (href.startsWith("/#") && window.location.pathname !== "/") return;
      const hash = href.replace("/#", "#");
      const element = document.querySelector(hash);
      if (!element) return;
      event.preventDefault();
      lenis.scrollTo(element, {
        offset: isHome ? -140 : -80,
        duration: 1.15,
        lerp: 0.08,
      });
    };

    const anchorLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[href*=\"#\"]")
    );
    anchorLinks.forEach((link) => {
      link.addEventListener("click", handleAnchor);
    });

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    const handleResize = () => lenis.resize();
    window.addEventListener("resize", handleResize);

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchor);
      });
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      root.removeAttribute("data-scroll-dir");
      root.removeAttribute("data-scroll-axis");
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-velocity");
      root.style.removeProperty("--scroll-offset");
    };
  }, [isHome, isImmersive]);

  useEffect(() => {
    if (isImmersive) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const revealTargets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    revealTargets.forEach((target) => {
      gsap.fromTo(
        target,
        { opacity: 0, x: isHome ? 60 : 0, y: isHome ? 0 : 40 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: target,
            start: isHome ? "left 75%" : "top 80%",
            horizontal: isHome,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isHome, isImmersive]);

  useEffect(() => {
    if (isImmersive) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;

    const split = new SplitType(hero, { types: "lines,words" });
    gsap.from(split.words, {
      yPercent: 90,
      opacity: 0,
      duration: 0.9,
      stagger: 0.02,
      ease: "power3.out",
      delay: 0.15,
    });

    return () => {
      split.revert();
    };
  }, [isImmersive, pathname]);

  return null;
}
