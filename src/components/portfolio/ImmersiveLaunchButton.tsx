"use client";

import html2canvas from "html2canvas";
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
      const root = document.documentElement;
      const prevAccent = root.style.getPropertyValue("--color-accent");
      const accent = getComputedStyle(root)
        .getPropertyValue("--current-accent-color")
        .trim();
      if (accent) {
        root.style.setProperty("--color-accent", accent);
      }

      const canvas = await html2canvas(document.body, {
        backgroundColor: null,
        useCORS: true,
        logging: false,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
      });
      const dataUrl = canvas.toDataURL("image/png", 0.92);
      sessionStorage.setItem(IMMERSIVE_SNAPSHOT_KEY, dataUrl);
      if (accent) {
        if (prevAccent) {
          root.style.setProperty("--color-accent", prevAccent);
        } else {
          root.style.removeProperty("--color-accent");
        }
      }
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
