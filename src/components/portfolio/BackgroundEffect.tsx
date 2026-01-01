"use client";

import { useEffect, useMemo, useRef } from "react";
import { accentNames } from "./theme";

const rows = 5;
const columns = 5;

export default function BackgroundEffect() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cells = useMemo(() => Array.from({ length: rows * columns }), []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let lastHovered = -1;
    let isMouseDown = false;
    let lastAccentIndex = 0;
    const prevDown: Record<number, boolean> = {};

    const render = (event: MouseEvent | { clientX: number; clientY: number }) => {
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const row = Math.floor((y * rows) / rect.height);
      const column = Math.floor((x * columns) / rect.width);
      let cellIndex = -1;
      if (row >= 0 && row < rows && column >= 0 && column < columns) {
        cellIndex = row * columns + column;
      }

      const hoveredChild = grid.children[cellIndex] as HTMLElement | undefined;
      if (cellIndex >= 0 && hoveredChild) {
        if (!prevDown[cellIndex] && isMouseDown) {
          const accentName = accentNames[lastAccentIndex];
          lastAccentIndex = (lastAccentIndex + 1) % accentNames.length;
          hoveredChild.style.setProperty("background", `var(--color-${accentName})`);
        }

        if (isMouseDown) {
          hoveredChild.classList.add("clicked");
        }
      }

      const lastHoveredChild = grid.children[lastHovered] as HTMLElement | undefined;
      if (lastHoveredChild) {
        lastHoveredChild.classList.remove("hovered", "clicked");
      }
      prevDown[lastHovered] = false;

      lastHovered = cellIndex;
      if (cellIndex >= 0) {
        prevDown[cellIndex] = isMouseDown;
      }
    };

    const handleMouseMove = (event: MouseEvent) => render(event);
    const handleMouseLeave = () => render({ clientX: -1, clientY: -1 });
    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      render(event);
    };
    const handleMouseUp = (event: MouseEvent) => {
      isMouseDown = false;
      render(event);
    };

    document.addEventListener("mousemove", handleMouseMove, {
      capture: true,
      passive: true,
    });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, {
      capture: true,
      passive: true,
    });
    document.addEventListener("mouseup", handleMouseUp, {
      capture: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, { capture: true });
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown, { capture: true });
      document.removeEventListener("mouseup", handleMouseUp, { capture: true });
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="pointer-events-none fixed inset-0 -z-10 grid scale-[1.05] blur-2xl"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {cells.map((_, index) => (
        <div
          key={index}
          className="bg-fade bg-[var(--color-base)] opacity-0 transition-[background,opacity] duration-150 ease-linear"
        />
      ))}
    </div>
  );
}
