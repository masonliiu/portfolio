"use client";

import { useEffect } from "react";

export default function BackgroundEffect() {
  useEffect(() => {
    let isPointerDown = false;
    const root = document.documentElement;

    const setGlowPosition = (event: PointerEvent) => {
      root.style.setProperty("--bg-x", `${event.clientX}px`);
      root.style.setProperty("--bg-y", `${event.clientY}px`);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!root.classList.contains("bg-effect")) return;
      isPointerDown = true;
      setGlowPosition(event);
      root.style.setProperty("--bg-opacity", "1");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPointerDown) return;
      setGlowPosition(event);
    };

    const handlePointerUp = () => {
      isPointerDown = false;
      root.style.setProperty("--bg-opacity", "0");
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointerleave", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerUp);
    };
  }, []);

  return (
    <div className="bg-glow pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
  );
}
