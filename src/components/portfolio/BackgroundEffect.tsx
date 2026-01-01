"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffect() {
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    let lastTime = 0;
    const handlePointerMove = (event: PointerEvent) => {
      if (!document.documentElement.classList.contains("bg-effect")) return;
      const now = Date.now();
      if (now - lastTime < 30) return;
      lastTime = now;

      const dot = document.createElement("span");
      const size = Math.floor(Math.random() * 12) + 10;
      dot.className = "trail-dot";
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      trail.appendChild(dot);
      setTimeout(() => dot.remove(), 700);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div ref={trailRef} className="trail-layer absolute inset-0" />
    </div>
  );
}
