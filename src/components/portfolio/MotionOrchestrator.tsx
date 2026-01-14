"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function MotionOrchestrator() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    const root = document.documentElement;
    lenis.on("scroll", ({ progress, velocity, direction }) => {
      root.style.setProperty(
        "--scroll-progress",
        `${(progress * 30).toFixed(2)}%`
      );
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.dataset.scrollDir = direction > 0 ? "down" : "up";
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
      lenis.scrollTo(element, { offset: -80, duration: 1.2 });
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
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchor);
      });
      gsap.ticker.remove(ticker);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      root.removeAttribute("data-scroll-dir");
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-velocity");
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const revealTargets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    revealTargets.forEach((target) => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: target,
            start: "top 80%",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;
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
      delay: 0.2,
    });

    return () => {
      split.revert();
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-horizontal]")
    );

    const refreshHandlers = new Map<HTMLElement, () => void>();

    sections.forEach((section) => {
      const track = section.querySelector<HTMLElement>("[data-horizontal-track]");
      if (!track) return;
      const refresh = () => {
        const totalWidth = track.scrollWidth;
        const viewportWidth = section.clientWidth;
        const distance = Math.max(totalWidth - viewportWidth, 0);
        if (distance <= 0) {
          return;
        }
        const prevId = track.dataset.scrollId;
        if (prevId) {
          ScrollTrigger.getById(prevId)?.kill();
        }
        if (distance <= 0) {
          gsap.set(track, { x: 0 });
          return;
        }
        const id = `horizontal-${Math.random().toString(36).slice(2)}`;
        track.dataset.scrollId = id;
        gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            id,
            trigger: section,
            start: "top top",
            end: `+=${distance + viewportWidth}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });
      };

      refresh();
      const handler = () => refresh();
      refreshHandlers.set(section, handler);
      ScrollTrigger.addEventListener("refreshInit", handler);
    });

    ScrollTrigger.refresh();

    return () => {
      refreshHandlers.forEach((handler) => {
        ScrollTrigger.removeEventListener("refreshInit", handler);
      });
      sections.forEach((section) => {
        const track = section.querySelector<HTMLElement>("[data-horizontal-track]");
        if (!track) return;
        const prevId = track.dataset.scrollId;
        if (prevId) {
          ScrollTrigger.getById(prevId)?.kill();
          delete track.dataset.scrollId;
        }
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  return null;
}
