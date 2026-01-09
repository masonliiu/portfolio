"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Scene from "./Scene";
import {
  detailContent,
  panelContent,
  panelKeybinds,
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
  const [panelHitMapReady, setPanelHitMapReady] = useState(false);
  const [debugHitName, setDebugHitName] = useState<string | null>(null);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [pointerLockPending, setPointerLockPending] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const lastEscapeRef = useRef(0);
  const suppressExitPromptRef = useRef(false);
  const pendingPanelRef = useRef<PanelKey | null>(null);
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
  const [glowActive, setGlowActive] = useState<Record<string, boolean>>(() => ({
    "desk-papers": true,
    "photo-book": true,
    painting: true,
    "shelf-books": true,
  }));

  const handleSelectPanel = useCallback(
    (panel: PanelKey) => {
      if (!panelHitMapReady) {
        pendingPanelRef.current = panel;
        return;
      }
      if (panel === "painting" && activePanel === "painting") {
        setPaintingRevealed((prev) => !prev);
        suppressExitPromptRef.current = true;
        document.exitPointerLock?.();
        window.dispatchEvent(new Event("immersive:release-pointer-lock"));
        return;
      }
      if (panel === "painting") {
        setGlowActive((prev) => ({ ...prev, painting: false }));
      }
      setPaintingRevealed(false);
      setActivePanel(panel);
      setActiveDetail(null);
      suppressExitPromptRef.current = true;
      document.exitPointerLock?.();
      window.dispatchEvent(new Event("immersive:release-pointer-lock"));
    },
    [activePanel, panelHitMapReady],
  );

  const requestPointerLock = useCallback(() => {
    setPointerLockPending(true);
    window.dispatchEvent(new Event("immersive:request-pointer-lock"));
  }, []);

  const returnToCouch = useCallback(() => {
    setActivePanel(null);
    setActiveDetail(null);
    setPaintingRevealed(false);
    requestPointerLock();
  }, [requestPointerLock]);

  const handleSelectDetail = useCallback(
    (detail: DetailKey) => {
      setActiveDetail(detail);
      suppressExitPromptRef.current = true;
      document.exitPointerLock?.();
      window.dispatchEvent(new Event("immersive:release-pointer-lock"));
      if (detail === "resume" || detail === "experience") {
        setGlowActive((prev) => ({ ...prev, "desk-papers": false }));
        return;
      }
      if (detail === "photography") {
        setGlowActive((prev) => ({ ...prev, "photo-book": false }));
        return;
      }
      if (detail.startsWith("project-")) {
        setGlowActive((prev) => ({ ...prev, "shelf-books": false }));
      }
    },
    [],
  );

  const handleEnterImmersive = useCallback(() => {
    setHasInteracted(true);
    setShowExitPrompt(false);
    requestPointerLock();
  }, [requestPointerLock]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "escape") {
        if (event.repeat) return;
        lastEscapeRef.current = Date.now();
      }
      if (key === "escape") {
        if (showExitPrompt) {
          setShowExitPrompt(false);
          requestPointerLock();
          return;
        }
        if (activePanel || activeDetail) {
          setActiveDetail(null);
          setPaintingRevealed(false);
          setActivePanel(null);
          setShowExitPrompt(false);
          suppressExitPromptRef.current = true;
          requestPointerLock();
          return;
        }
        setActiveDetail(null);
        setPaintingRevealed(false);
        setActivePanel(null);
        document.exitPointerLock?.();
        window.dispatchEvent(new Event("immersive:release-pointer-lock"));
        setShowExitPrompt(true);
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
  }, [activeDetail, handleSelectPanel, showExitPrompt]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ locked: boolean }>).detail;
      const locked = Boolean(detail?.locked);
      setPointerLocked(locked);
      setPointerLockPending(false);
      if (!locked) {
        if (suppressExitPromptRef.current) {
          suppressExitPromptRef.current = false;
          return;
        }
        if (
          hasInteracted &&
          !activePanel &&
          !activeDetail &&
          !showExitPrompt
        ) {
          setShowExitPrompt(true);
        }
      }
    };
    window.addEventListener("immersive:pointer-lock", handler as EventListener);
    return () =>
      window.removeEventListener("immersive:pointer-lock", handler as EventListener);
  }, [activeDetail, activePanel, hasInteracted, requestPointerLock, showExitPrompt]);

  useEffect(() => {
    if (!panelHitMapReady || !pendingPanelRef.current) return;
    const panel = pendingPanelRef.current;
    pendingPanelRef.current = null;
    handleSelectPanel(panel);
  }, [handleSelectPanel, panelHitMapReady]);

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
    "fixed inset-0 z-50 h-full w-full overflow-hidden text-white";
  const sceneClassName = "opacity-100";
  const showUi = transitionChecked && (!transitionImage || !transitionActive);
  const showIntro = showUi && !hasInteracted;
  const showHud = showUi && hasInteracted && !showExitPrompt;
  const showCrosshair =
    showUi &&
    (pointerLocked || pointerLockPending) &&
    !activePanel &&
    !activeDetail &&
    !showIntro &&
    !showExitPrompt;
  const panel = activePanel ? panelContent[activePanel] : null;
  const detail = activeDetail ? detailContent[activeDetail] : null;

  const immersiveCursor =
    showIntro || showExitPrompt || (!pointerLocked && !pointerLockPending)
      ? "auto"
      : "none";

  const rootStyle: React.CSSProperties = {
    cursor: immersiveCursor,
    backgroundColor: "var(--color-base, #1e1e2e)",
  };
  if (transitionImage) {
    rootStyle.backgroundImage = `url(${transitionImage})`;
    rootStyle.backgroundRepeat = "no-repeat";
    rootStyle.backgroundPosition = "top left";
    rootStyle.backgroundSize = "100% 100%";
  }

  return (
    <div className={rootClassName} style={rootStyle}>
      <div className={`absolute inset-0 transition-opacity duration-300 ${sceneClassName}`}>
        <Scene
          activePanel={activePanel}
          activeDetail={activeDetail}
          onSelect={handleSelectPanel}
          onSelectDetail={handleSelectDetail}
          onReturnToCouch={returnToCouch}
          paintingRevealed={paintingRevealed}
          reducedMotion={prefersReducedMotion}
          transitionImage={transitionImage}
          transitionActive={transitionActive}
          onTransitionEnd={handleTransitionEnd}
          onTransitionStart={handleTransitionStart}
          onTransitionAnimating={handleTransitionAnimating}
          onPanelHitMapReady={() => setPanelHitMapReady(true)}
          onDebugHitName={setDebugHitName}
          glowActive={glowActive}
        />
      </div>
      {showUi && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ cursor: immersiveCursor }}
        >
          {showCrosshair && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 opacity-80">
              <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-white/80" />
              <div className="absolute left-1/2 bottom-0 h-2 w-px -translate-x-1/2 bg-white/80" />
              <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-white/80" />
              <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-white/80" />
            </div>
          )}
          {showHud && (
            <div className="pointer-events-auto left-95 absolute bottom-1.5 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-[11px] font-extrabold lowercase tracking-[0.2em] text-slate-300">
              Hotkeys: [1] Desk · [2] Table · [3] Painting · [4] Shelves
            </div>
          )}
          {/* DEBUG - {debugHitName && (
            <div className="pointer-events-auto absolute left-6 top-[12.5rem] rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-200">
              Hit: {debugHitName}
            </div>
          )} */}
          {showHud && (
            <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-3">
              <Link
                href="/"
                className="header-link rounded-full border border-[color-mix(in srgb,var(--color-surface0) 60%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text)]"
              >
                exit immersive
              </Link>
            </div>
          )}
        </div>
      )}
      {(showIntro || showExitPrompt) && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center backdrop-blur-[3px]">
          <div className="w-[min(440px,88vw)] rounded-3xl border border-white/15 bg-slate-950/90 p-8 text-slate-100 shadow-2xl">
            {showIntro ? (
              <>
                <div className="text-xl font-semibold">Immersive Mode</div>
                <p className="mt-3 text-sm text-slate-300">
                  Press on glowing objects to learn about me.
                </p>
                <button
                  type="button"
                  onClick={handleEnterImmersive}
                  className="mt-6 w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/50"
                >
                  Enter immersive
                </button>
              </>
            ) : (
              <>
                <div className="text-xl font-semibold">Immersive paused</div>
                <p className="mt-3 text-sm text-slate-300">
                  Resume the scene or exit immersive mode.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleEnterImmersive}
                    className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/50"
                  >
                    Resume
                  </button>
                  <Link
                    href="/"
                    className="w-full rounded-full border border-white/20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40"
                  >
                    Exit immersive
                  </Link>
                </div>
              </>
            )}
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
            <div className="mt-3 text-2xl font-semibold">{detail.title}</div>
            {activeDetail === "resume" ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <iframe
                  title="Resume"
                  src="/resume.pdf#view=FitH"
                  className="h-[60vh] w-full"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-xs text-slate-300">
                Placeholder content area for the document or project preview.
              </div>
            )}
            <div className="mt-6 text-[11px] uppercase tracking-[0.3em] text-slate-400">
              Press X to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
