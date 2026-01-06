"use client";

import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  IMMERSIVE_SNAPSHOT_KEY,
  IMMERSIVE_SNAPSHOT_META_KEY,
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

  const preloadRoom = async () => {
    try {
      const response = await fetch("/models/office.glb", { cache: "force-cache" });
      if (response.ok) {
        await response.arrayBuffer();
      }
    } catch {
      // Preload failures should not block navigation.
    }
  };

  const captureSnapshot = async () => {
    const nextRoot = document.getElementById("__next");
    const target = nextRoot ?? document.body;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dataUrl = await toPng(target, {
      cacheBust: true,
      skipFonts: true,
      pixelRatio: 1,
      width: viewportWidth,
      height: viewportHeight,
      style: {
        width: `${viewportWidth}px`,
        height: `${viewportHeight}px`,
      },
    });
    return { dataUrl, width: viewportWidth, height: viewportHeight };
  };

  const handleClick = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const [{ dataUrl, width, height }] = await Promise.all([
        captureSnapshot(),
        preloadRoom(),
      ]);
      sessionStorage.setItem(IMMERSIVE_SNAPSHOT_KEY, dataUrl);
      sessionStorage.setItem(
        IMMERSIVE_SNAPSHOT_META_KEY,
        JSON.stringify({ width, height }),
      );
    } catch (error) {
      console.error("Failed to capture immersive snapshot", error);
    }

    router.push("/immersive");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      disabled={isCapturing}
    >
      {children}
    </button>
  );
}
