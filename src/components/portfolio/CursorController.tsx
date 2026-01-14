"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

type CursorState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

export default function CursorController() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/immersive")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !finePointer) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const root = document.documentElement;
    root.classList.add("cursor-active");

    const state: CursorState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
    };

    const handleMove = (event: PointerEvent) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      cursor.classList.add("is-visible");

      const target = event.target as HTMLElement | null;
      const cursorTarget = target?.closest<HTMLElement>("[data-cursor]");
      const cursorLabel = cursorTarget?.dataset.cursor ?? "";
      label.textContent = cursorLabel;
      cursor.classList.toggle("has-label", Boolean(cursorLabel));
      cursor.classList.toggle(
        "is-cta",
        Boolean(target?.closest("a,button"))
      );
    };

    const handleLeave = () => {
      cursor.classList.remove("is-visible");
      cursor.classList.remove("has-label");
      label.textContent = "";
    };

    const handleDown = () => cursor.classList.add("is-pressed");
    const handleUp = () => cursor.classList.remove("is-pressed");

    let raf = 0;
    const tick = () => {
      state.x += (state.targetX - state.x) * 0.18;
      state.y += (state.targetY - state.y) * 0.18;
      cursor.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("blur", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", handleLeave);
      root.classList.remove("cursor-active");
    };
  }, [pathname]);

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

  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true">
      <span className="cursor-label" ref={labelRef} />
    </div>
  );
}
