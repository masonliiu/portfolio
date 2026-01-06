"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Scene from "./Scene";
import type { PanelKey } from "./data";
import { IMMERSIVE_SNAPSHOT_KEY } from "./transition";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export default function ImmersiveExperience() {
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [transitionImage, setTransitionImage] = useState<string | null>(null);
  const [transitionActive, setTransitionActive] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const markInteracted = () => setHasInteracted(true);
    window.addEventListener("pointerdown", markInteracted, { once: true });
    return () => window.removeEventListener("pointerdown", markInteracted);
  }, []);

  useEffect(() => {
    document.body.classList.add("immersive-mode");
    document.documentElement.classList.add("immersive-mode");
    return () => {
      document.body.classList.remove("immersive-mode");
      document.documentElement.classList.remove("immersive-mode");
    };
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(IMMERSIVE_SNAPSHOT_KEY);
    if (stored) {
      setTransitionImage(stored);
      setTransitionActive(true);
    }
  }, []);

  const handleTransitionEnd = useCallback(() => {
    setTransitionActive(false);
    sessionStorage.removeItem(IMMERSIVE_SNAPSHOT_KEY);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <Scene
        activePanel={activePanel}
        onSelect={(panel) => setActivePanel(panel)}
        reducedMotion={prefersReducedMotion}
        transitionImage={transitionImage}
        transitionActive={transitionActive}
        onTransitionEnd={handleTransitionEnd}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_52%,_rgba(0,0,0,0.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 opacity-80">
          <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-white/80" />
          <div className="absolute left-1/2 bottom-0 h-2 w-px -translate-x-1/2 bg-white/80" />
          <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-white/80" />
          <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-white/80" />
        </div>
        <div className="pointer-events-auto absolute left-6 top-6 max-w-xs rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-300">
          Immersive Mode
        </div>
        {!hasInteracted && (
          <div className="pointer-events-auto absolute left-6 bottom-6 max-w-xs rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-xs text-slate-200">
            Click to lock and look around. Line up the crosshair with a glowing
            object, then click. Press Escape to return to the couch.
          </div>
        )}
        <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-3">
          {activePanel && (
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60"
            >
              Return to couch
            </button>
          )}
          <Link
            href="/"
            className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60"
          >
            Exit immersive
          </Link>
        </div>
      </div>
    </div>
  );
}
