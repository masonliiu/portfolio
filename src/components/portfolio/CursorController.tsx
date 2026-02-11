"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CursorController() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const blobTexts = Array.from(
      document.querySelectorAll<HTMLElement>("[data-blob-text]")
    );

    const smallSize = 40;
    const largeSize = 460;
    const hitPadding = 20;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let size = smallSize;
    let targetSize = smallSize;
    let raf = 0;

    const updateSizeTarget = (x: number, y: number) => {
      targetSize = smallSize;
      for (const el of blobTexts) {
        const rect = el.getBoundingClientRect();
        const inX = x >= rect.left - hitPadding && x <= rect.right + hitPadding;
        const inY = y >= rect.top - hitPadding && y <= rect.bottom + hitPadding;
        if (inX && inY) {
          targetSize = largeSize;
          break;
        }
      }
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      updateSizeTarget(targetX, targetY);
    };

    const onResize = () => {
      updateSizeTarget(targetX, targetY);
    };

    const tick = () => {
      size += (targetSize - size) * 0.16;

      const root = document.documentElement;
      root.style.setProperty("--blob-x", `${targetX}px`);
      root.style.setProperty("--blob-y", `${targetY}px`);
      root.style.setProperty("--blob-size", `${size}px`);
      root.classList.toggle("blob-expanded", targetSize === largeSize);

      blobTexts.forEach((element) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--blob-mask-x", `${targetX - rect.left}px`);
        element.style.setProperty("--blob-mask-y", `${targetY - rect.top}px`);
      });

      raf = requestAnimationFrame(tick);
    };

    updateSizeTarget(targetX, targetY);
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("blob-expanded");
      document.documentElement.style.removeProperty("--blob-x");
      document.documentElement.style.removeProperty("--blob-y");
      document.documentElement.style.removeProperty("--blob-size");
    };
  }, [pathname]);

  return null;
}
