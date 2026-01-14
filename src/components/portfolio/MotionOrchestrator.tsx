"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function MotionOrchestrator() {
  const pathname = usePathname();
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
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 1.15,
      touchInertiaExponent: 32,
      wheelMultiplier: 1.05,
      normalizeWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    const root = document.documentElement;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    lenis.on("scroll", ({ progress, velocity, direction, scroll, limit }) => {
      const percent = limit === 0 ? 0 : progress * 100;
      root.style.setProperty("--scroll-progress", `${percent.toFixed(2)}%`);
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--scroll-offset", `${scroll.toFixed(2)}px`);
      root.dataset.scrollDir = direction > 0 ? "down" : "up";
      ScrollTrigger.update();
    });

    const initialHash = window.location.hash;
    if (initialHash) {
      const target = document.querySelector(initialHash);
      if (target) {
        lenis.scrollTo(target, { offset: -120, immediate: true });
      }
    } else {
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

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
      lenis.scrollTo(element, { offset: -120, duration: 1.1, lerp: 0.08 });
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
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-velocity");
      root.style.removeProperty("--scroll-offset");
    };
  }, [isImmersive, pathname]);

  useEffect(() => {
    if (isImmersive) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const revealTargets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const triggers: ScrollTrigger[] = [];
    revealTargets.forEach((target) => {
      const tween = gsap.fromTo(
        target,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: target,
            start: "top 80%",
          },
        }
      );
      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [isImmersive, pathname]);

  useEffect(() => {
    if (isImmersive) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const fillTargets = gsap.utils.toArray<HTMLElement>("[data-fill]");
    const triggers: ScrollTrigger[] = [];
    fillTargets.forEach((target) => {
      target.style.setProperty("--fill-progress", "0%");
      const trigger = ScrollTrigger.create({
        trigger: target,
        start: "top 85%",
        end: "top 25%",
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

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [isImmersive, pathname]);

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
