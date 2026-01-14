"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Scene from "./Scene";
import {
  aboutMeLinks,
  aboutMeParagraphs,
  detailContent,
  panelKeybinds,
  type DetailKey,
  type PanelKey,
} from "./data";
import { projects } from "@/lib/projects";
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
  const [pointerLocked, setPointerLocked] = useState(false);
  const [pointerLockPending, setPointerLockPending] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [exitTransitionActive, setExitTransitionActive] = useState(false);
  const lastEscapeRef = useRef(0);
  const suppressExitPromptRef = useRef(false);
  const pendingPanelRef = useRef<PanelKey | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [photoPage, setPhotoPage] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const router = useRouter();
  const [transitionImage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_KEY)
    );
  });
  const [transitionActive, setTransitionActive] = useState(
    Boolean(transitionImage),
  );
  const transitionChecked = true;
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
        setGlowActive((prev) => ({ ...prev, painting: false }));
        suppressExitPromptRef.current = true;
        document.exitPointerLock?.();
        window.dispatchEvent(new Event("immersive:release-pointer-lock"));
        return;
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

  const handleExitImmersive = useCallback(() => {
    if (exitTransitionActive) return;
    setShowExitPrompt(false);
    setActiveDetail(null);
    setActivePanel(null);
    setPaintingRevealed(false);
    document.exitPointerLock?.();
    window.dispatchEvent(new Event("immersive:release-pointer-lock"));
    setExitTransitionActive(true);
  }, [exitTransitionActive]);

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
          suppressExitPromptRef.current = true;
          requestPointerLock();
          return;
        }
        if (activePanel || activeDetail) {
          setActiveDetail(null);
          setPaintingRevealed(false);
          setActivePanel(null);
          setShowExitPrompt(false);
          suppressExitPromptRef.current = true;
          setPointerLockPending(false);
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
  }, [activeDetail, activePanel, handleSelectPanel, requestPointerLock, showExitPrompt]);

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

  const handleTransitionEnd = useCallback(() => {
    window.dispatchEvent(new Event("immersive:ready"));
    setTransitionActive(false);
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

  const handleExitTransitionEnd = useCallback(() => {
    router.push("/");
  }, [router]);

  const rootClassName =
    "fixed inset-0 z-50 h-full w-full overflow-hidden text-white";
  const sceneClassName = "opacity-100";
  const showUi =
    transitionChecked &&
    (!transitionImage || !transitionActive) &&
    !exitTransitionActive;
  const showIntro = showUi && !hasInteracted;
  const showHud = showUi && hasInteracted && !showExitPrompt;
  const showLoading = showUi && !sceneReady;
  const showCrosshair =
    showUi &&
    (pointerLocked || pointerLockPending) &&
    !activePanel &&
    !activeDetail &&
    !showIntro &&
    !showExitPrompt;
  const detail = activeDetail ? detailContent[activeDetail] : null;
  const isProjectDetail = Boolean(activeDetail?.startsWith("project-"));
  const isResumeDetail = activeDetail === "resume";
  const isPhotographyDetail = activeDetail === "photography";
  const immersiveProjects = projects;
  const showPaintingAbout = activePanel === "painting" && paintingRevealed;
  const detailTitle = isProjectDetail ? "Projects" : detail?.title;
  const photographyGallery = [
    { title: "Golden Hour", gradient: "from-amber-300 via-orange-400 to-rose-500" },
    { title: "City Dusk", gradient: "from-slate-700 via-indigo-600 to-purple-500" },
    { title: "Motion Blur", gradient: "from-emerald-300 via-teal-500 to-sky-500" },
    { title: "Studio Light", gradient: "from-rose-200 via-pink-300 to-amber-200" },
    { title: "Landscape", gradient: "from-lime-300 via-green-500 to-emerald-500" },
    { title: "Midnight Drive", gradient: "from-slate-800 via-slate-600 to-slate-400" },
  ];
  const photosPerPage = 4;
  const photoPages = Math.max(
    1,
    Math.ceil(photographyGallery.length / photosPerPage),
  );
  const currentPhotoPage = Math.min(photoPage, photoPages - 1);
  const photoPageItems = photographyGallery.slice(
    currentPhotoPage * photosPerPage,
    (currentPhotoPage + 1) * photosPerPage,
  );

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
          exitTransitionActive={exitTransitionActive}
          onTransitionEnd={handleTransitionEnd}
          onTransitionStart={handleTransitionStart}
          onTransitionAnimating={handleTransitionAnimating}
          onExitTransitionEnd={handleExitTransitionEnd}
          onPanelHitMapReady={() => setPanelHitMapReady(true)}
          glowActive={glowActive}
          onSceneReady={() => setSceneReady(true)}
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
          {showHud && (
            <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleExitImmersive}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
              >
                exit immersive
              </button>
            </div>
          )}
        </div>
      )}
      {showLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200">
            Loading room...
          </div>
        </div>
      )}
      {(showIntro || showExitPrompt) && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center backdrop-blur-[3px]">
          <div className="w-[min(440px,88vw)] rounded-3xl border border-white/15 bg-slate-950/90 p-8 text-slate-100 shadow-2xl">
            {showIntro ? (
              <>
                <div className="text-md text-slate-100">
                  Press on glowing objects to learn stuff about me!
                </div>
                <button
                  type="button"
                  onClick={handleEnterImmersive}
                  className="mt-6 w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/50 bg-slate-1500"
                >
                  Enter 
                </button>
              </>
            ) : (
              <>
                <div className="text-xl font-semibold">Paused</div>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleEnterImmersive}
                    className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/50"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={handleExitImmersive}
                    className="w-full rounded-full border border-white/20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40"
                  >
                    Exit immersive
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showUi && detail && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/50 p-6">
          <div
            className={`relative rounded-3xl border border-white/15 bg-slate-950/90 p-8 text-slate-100 shadow-2xl ${
              isResumeDetail
                ? "w-[min(960px,95vw)]"
                : "w-[min(720px,92vw)]"
            }`}
          >
            {isPhotographyDetail || isResumeDetail || isProjectDetail ? (
              <div className="flex items-center justify-between gap-4 bg-slate-1500">
                <div className="text-2xl font-semibold">{detailTitle}</div>
                <button
                  type="button"
                  onClick={() => setActiveDetail(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[11px] leading-none text-slate-200 transition hover:border-white/40"
                >
                  X
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveDetail(null)}
                  className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[11px] leading-none text-slate-200 transition hover:border-white/40"
                >
                  X
                </button>
                <div className="mt-3 text-2xl font-semibold">{detailTitle}</div>
              </>
            )}
            {isResumeDetail ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-1500">
                <iframe
                  title="Resume"
                  src="/resume.pdf#view=FitH"
                  className="h-[75vh] w-full"
                />
              </div>
            ) : null}
            {isPhotographyDetail ? (
              <div className="mt-6">
                <div className="-m-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoPage((prev) => Math.max(prev - 1, 0))
                    }
                    className="absolute -left-1 top-1/2 flex h-9 w-9 -translate-x-full -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/40"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoPage((prev) => Math.min(prev + 1, photoPages - 1))
                    }
                    className="absolute -right-1 top-1/2 flex h-9 w-9 translate-x-full -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/40"
                  >
                    ▶
                  </button>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 bg-slate-1500">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {photoPageItems.map((photo) => (
                        <div
                          key={photo.title}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                        >
                          <div
                            className={`aspect-[4/3] w-full bg-gradient-to-br ${photo.gradient}`}
                          />
                          <div className="px-4 py-3 text-xs text-slate-200">
                            {photo.title}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] text-slate-400">
                      Page {currentPhotoPage + 1} / {photoPages}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {isProjectDetail ? (
              <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid gap-4">
                  {immersiveProjects.map((project) => (
                    <div
                      key={project.slug}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {project.title}
                          </div>
                          <div className="text-xs text-slate-300">
                            {project.repo} · {project.createdAt}
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                          {project.stars ?? "—"} ★
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-200">
                        {project.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        {project.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-200 bg-slate-1500">
                        {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
                        >
                          {link.label}
                        </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {!isResumeDetail && !isPhotographyDetail && !isProjectDetail ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-xs text-slate-300 bg-slate-1500">
                Placeholder content area for the document or project preview.
              </div>
            ) : null}
            <div className="mt-6 text-[11px] uppercase tracking-[0.3em] text-slate-400">
              Press X to close
            </div>
          </div>
        </div>
      )}
      {showUi && showPaintingAbout && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/50 p-6">
          <div className="relative w-[min(720px,92vw)] rounded-3xl border border-white/15 bg-slate-950/90 p-8 text-slate-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setPaintingRevealed(false)}
              className="absolute right-6 top-6 rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40"
            >
              Close
            </button>
            <div className="-mt-1.5 text-2xl font-semibold">About Me</div>
            <div className="mt-5 space-y-4 text-sm text-slate-200 bg-slate-1500">
              {aboutMeParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-200">
              {aboutMeLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
