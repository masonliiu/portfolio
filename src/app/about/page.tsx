"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import AboutContent from "@/components/portfolio/AboutContent";

export default function AboutPage() {
  const router = useRouter();

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleBack = () => {
    if (prefersReducedMotion) {
      router.push("/");
      return;
    }
    const startTransition = (document as unknown as { startViewTransition?: (callback: () => void) => void })
      .startViewTransition;
    if (startTransition) {
      try {
        startTransition(() => router.push("/"));
        return;
      } catch {
        // fall through
      }
    }
    router.push("/");
  };

  return (
    <div className="page-shell max-w-5xl">
      <div className="scroll-blur" />
      <AboutContent />
      <button
        type="button"
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] clickable"
        onClick={handleBack}
      >
        Back home
      </button>
    </div>
  );
}
