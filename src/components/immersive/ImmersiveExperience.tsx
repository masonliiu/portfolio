"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Scene from "./Scene";
import Panels from "./Panels";
import { hotspots, type PanelKey } from "./data";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              Immersive Mode
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Cinematic room scene
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Hover hotspots to explore. Click to open a panel, or use the list
              for keyboard access.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
          >
            Exit immersive mode
          </Link>
        </header>

        {isDesktop ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black"
            >
              <Scene
                activePanel={activePanel}
                onSelect={(panel) => setActivePanel(panel)}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_55%)]" />
              <div className="pointer-events-none absolute left-6 top-6 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/80">
                Room prototype
              </div>
            </motion.div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Hotspots
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActivePanel(spot.panelKey)}
                      className={`rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${
                        activePanel === spot.panelKey
                          ? "border-white/60 bg-white/15 text-white"
                          : "border-white/10 text-slate-200 hover:border-white/40"
                      }`}
                    >
                      {spot.label}
                    </button>
                  ))}
                </div>
              </div>
              <Panels
                activePanel={activePanel}
                onClose={() => setActivePanel(null)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_60%)]" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Mobile preview
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Immersive mode preview
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  The 3D room is available on larger screens. Use the hotspot
                  list below to explore the same content.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActivePanel(spot.panelKey)}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                    activePanel === spot.panelKey
                      ? "border-white/60 bg-white/15 text-white"
                      : "border-white/10 text-slate-200 hover:border-white/40"
                  }`}
                >
                  {spot.label}
                </button>
              ))}
            </div>
            <Panels
              activePanel={activePanel}
              onClose={() => setActivePanel(null)}
              showPlaceholder={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
