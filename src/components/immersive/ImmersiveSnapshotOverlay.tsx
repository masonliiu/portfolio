"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  IMMERSIVE_SNAPSHOT_KEY,
  IMMERSIVE_SNAPSHOT_LAST_KEY,
  IMMERSIVE_SNAPSHOT_META_KEY,
  IMMERSIVE_SNAPSHOT_LAST_META_KEY,
} from "./transition";

type SnapshotMeta = {
  width: number;
  height: number;
  scrollbarWidth?: number;
};

export default function ImmersiveSnapshotOverlay() {
  const pathname = usePathname();
  const isImmersive = pathname.startsWith("/immersive");

  const { snapshot, meta } = useMemo(() => {
    if (!isImmersive || typeof window === "undefined") {
      return { snapshot: null, meta: null } as {
        snapshot: string | null;
        meta: SnapshotMeta | null;
      };
    }

    const storedSnapshot =
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_KEY);
    const storedMeta =
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_META_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_META_KEY);

    let parsedMeta: SnapshotMeta | null = null;
    if (storedMeta) {
      try {
        parsedMeta = JSON.parse(storedMeta) as SnapshotMeta;
      } catch {
        parsedMeta = null;
      }
    }

    return { snapshot: storedSnapshot, meta: parsedMeta };
  }, [isImmersive]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (!isImmersive) {
      root.classList.remove("immersive-mode", "immersive-ready", "snapshot-locked", "snapshot-hidden");
      body.classList.remove("immersive-mode", "immersive-ready", "snapshot-locked");
      root.style.removeProperty("--snapshot-scrollbar");
      root.style.removeProperty("--snapshot-width");
      root.style.removeProperty("--snapshot-height");
      return;
    }

    const scrollbarWidth = meta?.scrollbarWidth ?? 0;
    root.style.setProperty("--snapshot-scrollbar", `${scrollbarWidth}px`);
    if (meta?.width) {
      root.style.setProperty("--snapshot-width", `${meta.width}px`);
    }
    if (meta?.height) {
      root.style.setProperty("--snapshot-height", `${meta.height}px`);
    }

    root.classList.add("immersive-mode", "snapshot-locked");
    body.classList.add("immersive-mode", "snapshot-locked");
    root.classList.remove("snapshot-hidden");

    const handleReady = () => {
      root.classList.add("immersive-ready");
      body.classList.add("immersive-ready");
    };
    const handleHide = () => {
      root.classList.add("snapshot-hidden");
    };

    window.addEventListener("immersive:ready", handleReady);
    window.addEventListener("immersive:hide-snapshot", handleHide);

    return () => {
      window.removeEventListener("immersive:ready", handleReady);
      window.removeEventListener("immersive:hide-snapshot", handleHide);
      root.classList.remove("immersive-mode", "immersive-ready", "snapshot-locked", "snapshot-hidden");
      body.classList.remove("immersive-mode", "immersive-ready", "snapshot-locked");
      root.style.removeProperty("--snapshot-scrollbar");
      root.style.removeProperty("--snapshot-width");
      root.style.removeProperty("--snapshot-height");
    };
  }, [isImmersive, meta?.height, meta?.scrollbarWidth, meta?.width]);

  if (!isImmersive || !snapshot) {
    return null;
  }

  return (
    <div
      className="snapshot-overlay"
      style={{
        backgroundImage: `url("${snapshot}")`,
      }}
    />
  );
}
