"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Scene from "./Scene";
import type { PanelKey } from "./data";

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
    document.body.classList.add("immersive-mode");
    document.documentElement.classList.add("immersive-mode");
    return () => {
      document.body.classList.remove("immersive-mode");
      document.documentElement.classList.remove("immersive-mode");
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white">
      <Scene
        activePanel={activePanel}
        onSelect={(panel) => setActivePanel(panel)}
        reducedMotion={prefersReducedMotion}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-6 top-6 max-w-xs rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-300">
          Immersive Mode
        </div>
        <div className="pointer-events-auto absolute left-6 bottom-6 max-w-sm rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
          Click to lock your cursor and look around. Click glowing objects to
          move. Press Escape to return to the couch.
        </div>
        <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setActivePanel(null)}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60"
          >
            Return to couch
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60"
          >
            Exit immersive
          </Link>
        </div>
      </div>
    </div>
  );
}
