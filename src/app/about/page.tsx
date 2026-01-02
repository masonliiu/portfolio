"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const [slideStage, setSlideStage] = useState<"idle" | "enter-from" | "enter">(
    "idle"
  );
  const [isLeaving, setIsLeaving] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromHome = sessionStorage.getItem("transition-from-home");
    if (!fromHome) return;
    sessionStorage.removeItem("transition-from-home");
    setSlideStage("enter-from");
    requestAnimationFrame(() => {
      setSlideStage("enter");
    });
    const timeout = setTimeout(() => {
      setSlideStage("idle");
    }, 700);
    return () => clearTimeout(timeout);
  }, []);

  const handleBack = async () => {
    if (prefersReducedMotion) {
      sessionStorage.setItem("transition-from-about", "1");
      router.push("/");
      return;
    }
    await scrollToTopSmooth();
    setIsLeaving(true);
    sessionStorage.setItem("transition-from-about", "1");
    setTimeout(() => {
      router.push("/");
    }, 700);
  };

  const slideClass =
    slideStage === "enter-from"
      ? "page-slide enter-from-top"
      : slideStage === "enter"
        ? "page-slide enter-active"
        : isLeaving
          ? "page-slide leave-to-top"
          : "page-slide";

  return (
    <div className="page-shell max-w-5xl">
      <div className="scroll-blur" />
      <div className={slideClass}>
        <div className="terminal-title">About</div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">About Me</h1>

        <section className="mt-6 space-y-4 text-base text-[var(--color-subtext0)]">
          <p>
            Hey! I&apos;m Mason Liu — a CS student at UTD focused on full-stack
            development and game development. I like building systems that feel
            clean, fast, and thoughtful to use.
          </p>
          <p>
            My recent work includes Mase Labs Collective, Soundborn, a JVM memory
            arena experiment, and utility tools like a bionic reading extension.
            I&apos;m especially interested in product polish, interactive tooling,
            and platform-style projects.
          </p>
          <p>
            Outside of software, I spend time exploring photography, game design,
            and new creative workflows. If you want to collaborate or chat, feel
            free to reach out.
          </p>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
          <a href="mailto:liumasn@gmail.com">
            Email
          </a>
          <span className="text-[var(--color-surface1)]">|</span>
          <a
            href="https://github.com/masonliiu"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <span className="text-[var(--color-surface1)]">|</span>
          <a
            href="https://www.linkedin.com/in/masonliiu/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>

        <button
          type="button"
          className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] clickable"
          onClick={handleBack}
        >
          Back home
        </button>
      </div>
    </div>
  );
}
