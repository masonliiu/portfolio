"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [hasMounted, setHasMounted] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [decodedSnapshot, setDecodedSnapshot] = useState<string | null>(null);
  const [meta, setMeta] = useState<SnapshotMeta | null>(null);
  const [visible, setVisible] = useState(Boolean(snapshot));

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    if (!isImmersive) {
      setSnapshot(null);
      setDecodedSnapshot(null);
      setMeta(null);
      setVisible(false);
      return;
    }

    const storedSnapshot =
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_KEY);
    const storedMeta =
      sessionStorage.getItem(IMMERSIVE_SNAPSHOT_META_KEY) ??
      localStorage.getItem(IMMERSIVE_SNAPSHOT_LAST_META_KEY);

    if (storedSnapshot) {
      setSnapshot(storedSnapshot);
      setVisible(true);
    }

    if (storedMeta) {
      try {
        setMeta(JSON.parse(storedMeta) as SnapshotMeta);
      } catch {
        setMeta(null);
      }
    }
  }, [hasMounted, isImmersive]);

  useEffect(() => {
    if (!snapshot) {
      setDecodedSnapshot(null);
      return;
    }
    let cancelled = false;
    const image = new Image();
    image.decoding = "sync";
    image.src = snapshot;
    image
      .decode()
      .then(() => {
        if (!cancelled) {
          setDecodedSnapshot(snapshot);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDecodedSnapshot(snapshot);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [snapshot]);

  useEffect(() => {
    if (!isImmersive) return;
    const root = document.documentElement;
    const scrollbarWidth = meta?.scrollbarWidth ?? 0;
    root.style.setProperty("--snapshot-scrollbar", `${scrollbarWidth}px`);
    if (meta?.width) {
      root.style.setProperty("--snapshot-width", `${meta.width}px`);
    }
    if (meta?.height) {
      root.style.setProperty("--snapshot-height", `${meta.height}px`);
    }
    root.classList.add("immersive-mode");
    document.body.classList.add("immersive-mode");
    return () => {
      root.style.removeProperty("--snapshot-scrollbar");
      root.style.removeProperty("--snapshot-width");
      root.style.removeProperty("--snapshot-height");
      root.classList.remove("immersive-mode");
      root.classList.remove("immersive-ready");
      document.body.classList.remove("immersive-mode");
      document.body.classList.remove("immersive-ready");
    };
  }, [isImmersive, meta?.scrollbarWidth]);

  useEffect(() => {
    if (!isImmersive) return;
    const root = document.documentElement;
    if (visible) {
      root.classList.add("snapshot-locked");
      document.body.classList.add("snapshot-locked");
    } else {
      root.classList.remove("snapshot-locked");
      document.body.classList.remove("snapshot-locked");
    }
    return () => {
      root.classList.remove("snapshot-locked");
      document.body.classList.remove("snapshot-locked");
    };
  }, [isImmersive, visible]);

  useEffect(() => {
    if (!isImmersive) return;
    const root = document.documentElement;
    const handleReady = () => {
      root.classList.add("immersive-ready");
      document.body.classList.add("immersive-ready");
    };
    window.addEventListener("immersive:ready", handleReady);
    return () => {
      window.removeEventListener("immersive:ready", handleReady);
    };
  }, [isImmersive]);

  useEffect(() => {
    if (!isImmersive) return;
    const handleHide = () => {
      setVisible(false);
    };
    window.addEventListener("immersive:hide-snapshot", handleHide);
    return () => {
      window.removeEventListener("immersive:hide-snapshot", handleHide);
    };
  }, [isImmersive]);

  const overlayImage = decodedSnapshot ?? snapshot;
  if (!hasMounted || !isImmersive || !visible || !overlayImage) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        backgroundColor: "var(--color-base, #1e1e2e)",
        backgroundImage: `url("${overlayImage}")`,
        backgroundSize: "100% 100%",
        backgroundPosition: "top left",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={overlayImage}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: meta ? `${meta.width}px` : "100%",
          height: meta ? `${meta.height}px` : "100%",
          display: "block",
          maxWidth: "none",
          maxHeight: "none",
        }}
        decoding="sync"
        loading="eager"
      />
    </div>
  );
}
