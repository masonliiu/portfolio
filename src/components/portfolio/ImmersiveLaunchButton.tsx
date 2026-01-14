"use client";

import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  IMMERSIVE_SNAPSHOT_KEY,
  IMMERSIVE_SNAPSHOT_META_KEY,
  IMMERSIVE_SNAPSHOT_LAST_KEY,
  IMMERSIVE_SNAPSHOT_LAST_META_KEY,
} from "@/components/immersive/transition";

type ImmersiveLaunchButtonProps = {
  className?: string;
  children: ReactNode;
};

export default function ImmersiveLaunchButton({
  className,
  children,
}: ImmersiveLaunchButtonProps) {
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const hasPrefetched = useRef(false);

  const preloadRoom = useCallback(async () => {
    if (hasPrefetched.current) return;
    hasPrefetched.current = true;
    try {
      const response = await fetch("/models/finalroom.glb", { cache: "force-cache" });
      if (response.ok) {
        await response.arrayBuffer();
      }
    } catch {
      // Preload failures should not block navigation.
    }
  }, []);

  const schedulePreload = useCallback(() => {
    if (hasPrefetched.current) return;
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      (window as Window & {
        requestIdleCallback: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      }).requestIdleCallback(() => {
        void preloadRoom();
      }, { timeout: 2500 });
      return;
    }
    window.setTimeout(() => {
      void preloadRoom();
    }, 1200);
  }, [preloadRoom]);

  const captureSnapshot = async () => {
    const nextRoot = document.getElementById("__next");
    const target = nextRoot ?? document.body;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const scrollbarWidth = Math.max(
      window.innerWidth - document.documentElement.clientWidth,
      0,
    );
    const disabledSheets: CSSStyleSheet[] = [];
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        void sheet.cssRules;
      } catch {
        if (!sheet.disabled) {
          sheet.disabled = true;
          disabledSheets.push(sheet);
        }
      }
    });
    let dataUrl: string;
    const baseOptions = {
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: "",
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      width: viewportWidth,
      height: viewportHeight,
      style: {
        width: `${viewportWidth}px`,
        height: `${viewportHeight}px`,
      },
    };
    try {
      dataUrl = await toPng(target, baseOptions);
    } catch (error) {
      throw error;
    } finally {
      disabledSheets.forEach((sheet) => {
        sheet.disabled = false;
      });
    }
    return {
      dataUrl,
      width: viewportWidth,
      height: viewportHeight,
      scrollbarWidth,
    };
  };

  const handleClick = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    void preloadRoom();
    void captureSnapshot()
      .then(({ dataUrl, width, height, scrollbarWidth }) => {
        sessionStorage.setItem(IMMERSIVE_SNAPSHOT_KEY, dataUrl);
        sessionStorage.setItem(
          IMMERSIVE_SNAPSHOT_META_KEY,
          JSON.stringify({ width, height, scrollbarWidth }),
        );
        localStorage.setItem(IMMERSIVE_SNAPSHOT_LAST_KEY, dataUrl);
        localStorage.setItem(
          IMMERSIVE_SNAPSHOT_LAST_META_KEY,
          JSON.stringify({ width, height, scrollbarWidth }),
        );
      })
      .catch((error) => {
        console.error("Failed to capture immersive snapshot", error);
      })
      .finally(() => {
        setIsCapturing(false);
      });

    router.push("/immersive");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerEnter={schedulePreload}
      onFocus={schedulePreload}
      className={className}
      disabled={isCapturing}
    >
      {children}
    </button>
  );
}
