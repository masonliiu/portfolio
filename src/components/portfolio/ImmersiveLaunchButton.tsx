"use client";

import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { IMMERSIVE_SNAPSHOT_KEY } from "@/components/immersive/transition";

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

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    try {
      const nextRoot = document.getElementById("__next");
      const target = nextRoot ?? document.body;
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: window.devicePixelRatio,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      sessionStorage.setItem(IMMERSIVE_SNAPSHOT_KEY, dataUrl);
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
