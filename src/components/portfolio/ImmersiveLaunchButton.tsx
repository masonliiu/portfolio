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

  const handleClick = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const nextRoot = document.getElementById("__next");
      const target = nextRoot ?? document.body;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
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
      sessionStorage.setItem(IMMERSIVE_SNAPSHOT_KEY, dataUrl);
      sessionStorage.setItem(
        IMMERSIVE_SNAPSHOT_META_KEY,
        JSON.stringify({ width: viewportWidth, height: viewportHeight }),
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
