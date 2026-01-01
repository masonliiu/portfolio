"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffect() {
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    let isPointerDown = false;
    let lastTime = 0;

    const spawnTrail = (event: PointerEvent) => {
      const now = Date.now();
      if (now - lastTime < 16) return;
      lastTime = now;

      const dot = document.createElement("span");
      const size = Math.floor(Math.random() * 36) + 40;
      dot.className = "trail-dot";
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      trail.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!document.documentElement.classList.contains("bg-effect")) return;
      isPointerDown = true;
      spawnTrail(event);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPointerDown) return;
      spawnTrail(event);
    };

    const handlePointerUp = () => {
      isPointerDown = false;
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
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div ref={trailRef} className="trail-layer absolute inset-0" />
    </div>
  );
}
