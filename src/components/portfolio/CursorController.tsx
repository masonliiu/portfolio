"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function CursorController() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !finePointer) return;

    const magnets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnet]")
    );
    const cleanups: Array<() => void> = [];

    magnets.forEach((element) => {
      const strength = Number(element.dataset.magnet) || 0.35;
      const handleMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const relX = event.clientX - rect.left - rect.width / 2;
        const relY = event.clientY - rect.top - rect.height / 2;
        gsap.to(element, {
          x: relX * strength,
          y: relY * strength,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      const handleLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      };

      element.style.willChange = "transform";
      element.addEventListener("pointermove", handleMove);
      element.addEventListener("pointerleave", handleLeave);

      cleanups.push(() => {
        element.removeEventListener("pointermove", handleMove);
        element.removeEventListener("pointerleave", handleLeave);
        element.style.removeProperty("will-change");
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
