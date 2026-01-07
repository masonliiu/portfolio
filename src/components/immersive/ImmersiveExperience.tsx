"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Scene from "./Scene";
import {
  detailContent,
  panelContent,
  panelKeybinds,
  panelTitles,
  type DetailKey,
  type PanelKey,
} from "./data";
import {
  IMMERSIVE_SNAPSHOT_KEY,
  IMMERSIVE_SNAPSHOT_LAST_KEY,
  IMMERSIVE_SNAPSHOT_META_KEY,
} from "./transition";

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
  const [activeDetail, setActiveDetail] = useState<DetailKey | null>(null);
  const [paintingRevealed, setPaintingRevealed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [transitionImage, setTransitionImage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_KEY)
    );
  });
  const [transitionActive, setTransitionActive] = useState(
    Boolean(transitionImage),
  );
  const [transitionChecked, setTransitionChecked] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const handleSelectPanel = useCallback(
    (panel: PanelKey) => {
      if (panel === "painting" && activePanel === "painting") {
        setPaintingRevealed((prev) => !prev);
        document.exitPointerLock?.();
        return;
      }
      setPaintingRevealed(false);
      setActivePanel(panel);
      setActiveDetail(null);
      document.exitPointerLock?.();
    },
    [activePanel],
  );

  const handleSelectDetail = useCallback((detail: DetailKey) => {
    setActiveDetail(detail);
    document.exitPointerLock?.();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "escape") {
        if (activeDetail) {
          setActiveDetail(null);
          return;
        }
        setPaintingRevealed(false);
        setActivePanel(null);
        return;
      }
      if (key === "x" && activeDetail) {
        setActiveDetail(null);
        return;
      }
      const panelEntry = Object.entries(panelKeybinds).find(
        ([, value]) => value.toLowerCase() === key,
      );
      if (panelEntry) {
        const [panelKey] = panelEntry as [PanelKey, string];
        handleSelectPanel(panelKey);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDetail, handleSelectPanel]);

  useEffect(() => {
    const markInteracted = () => setHasInteracted(true);
    window.addEventListener("pointerdown", markInteracted, { once: true });
    return () => window.removeEventListener("pointerdown", markInteracted);
  }, []);

  useEffect(() => {
    if (transitionImage) return;
    const stored =
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_KEY);
    if (stored) {
      setTransitionImage(stored);
      setTransitionActive(true);
    }
    setTransitionChecked(true);
  }, [transitionImage]);

  const handleTransitionEnd = useCallback(() => {
    window.dispatchEvent(new Event("immersive:ready"));
    setTransitionActive(false);
    setTransitionChecked(true);
    window.setTimeout(() => {
      sessionStorage.removeItem(IMMERSIVE_SNAPSHOT_KEY);
      sessionStorage.removeItem(IMMERSIVE_SNAPSHOT_META_KEY);
    }, 5000);
  }, []);

  const handleTransitionStart = useCallback(() => {
    window.dispatchEvent(new Event("immersive:hide-snapshot"));
  }, []);

  const handleTransitionAnimating = useCallback((isAnimating: boolean) => {
    if (!isAnimating) return;
    window.dispatchEvent(new Event("immersive:hide-snapshot"));
  }, []);

  const rootClassName =
    "fixed inset-0 z-50 h-full w-full overflow-hidden bg-black text-white";
  const sceneClassName = "opacity-100";
  const showUi = transitionChecked && (!transitionImage || !transitionActive);
  const panel = activePanel ? panelContent[activePanel] : null;
  const detail = activeDetail ? detailContent[activeDetail] : null;

  return (
    <div className={rootClassName}>
      <div className={`absolute inset-0 transition-opacity duration-300 ${sceneClassName}`}>
        <Scene
          activePanel={activePanel}
          onSelect={handleSelectPanel}
          onSelectDetail={handleSelectDetail}
          paintingRevealed={paintingRevealed}
          reducedMotion={prefersReducedMotion}
          transitionImage={transitionImage}
          transitionActive={transitionActive}
          onTransitionEnd={handleTransitionEnd}
          onTransitionStart={handleTransitionStart}
          onTransitionAnimating={handleTransitionAnimating}
        />
      </div>
      {showUi && (
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
          <div className="pointer-events-auto absolute left-6 top-24 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-slate-300">
            Hotkeys: [1] Desk · [2] Table · [3] Painting · [4] Shelves
          </div>
          {activePanel && (
            <div className="pointer-events-auto absolute left-6 top-[9.5rem] rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-slate-300">
              Press Esc to return
            </div>
          )}
          <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-3">
            {activePanel && (
              <button
                type="button"
                onClick={() => {
                  setActivePanel(null);
                  setPaintingRevealed(false);
                }}
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
      )}
      {showUi && panel && (
        <div className="pointer-events-auto absolute bottom-6 left-1/2 w-[min(420px,90vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-slate-100 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                {panelTitles[activePanel]}
              </div>
              <div className="mt-2 text-xl font-semibold">{panel.title}</div>
            </div>
            <button
              className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40"
              type="button"
              onClick={() => {
                setActivePanel(null);
                setPaintingRevealed(false);
              }}
            >
              Close
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            {panel.items.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  if (item.detailKey) {
                    setActiveDetail(item.detailKey);
                    document.exitPointerLock?.();
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-white/30"
              >
                <div className="text-sm font-semibold text-white">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-slate-300">
                  {item.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {showUi && detail && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/50 p-6">
          <div className="relative w-[min(540px,92vw)] rounded-3xl border border-white/15 bg-slate-950/90 p-8 text-slate-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveDetail(null)}
              className="absolute right-6 top-6 rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40"
            >
              X
            </button>
            <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
              Detail View
            </div>
            <div className="mt-3 text-2xl font-semibold">{detail.title}</div>
            <div className="mt-3 text-sm text-slate-300">
              {detail.description}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-xs text-slate-300">
              Placeholder content area for the document or project preview.
            </div>
            <div className="mt-6 text-[11px] uppercase tracking-[0.3em] text-slate-400">
              Press X to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
