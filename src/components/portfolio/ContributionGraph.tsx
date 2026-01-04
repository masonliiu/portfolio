"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Day = {
  date: string;
  count: number;
  color?: string;
};

type ApiResponse = {
  days: Day[];
};

const DEFAULT_COLORS = [
  "#1f1b33",
  "#403a5f",
  "#655f8b",
  "#8a85b6",
  "#b6b1e6",
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseColor = (value: string) => {
  if (!value) return null;
  if (value.startsWith("#")) {
    const hex = value.replace("#", "");
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    const int = parseInt(full, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === rr) h = ((gg - bb) / delta) % 6;
    if (max === gg) h = (bb - rr) / delta + 2;
    if (max === bb) h = (rr - gg) / delta + 4;
    h *= 60;
  }
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
};

const buildRamp = (accent: string) => {
  const rgb = parseColor(accent);
  if (!rgb) return DEFAULT_COLORS;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const saturation = clamp(hsl.s, 45, 85);
  const steps = [18, 32, 48, 64, 80];
  return steps.map(
    (lightness) =>
      `hsl(${Math.round(hsl.h)} ${Math.round(saturation)}% ${lightness}%)`
  );
};

export default function ContributionGraph() {
  const [days, setDays] = useState<Day[]>([]);
  const [status, setStatus] = useState("loading");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [levelColors, setLevelColors] = useState(DEFAULT_COLORS);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch("/api/github/contributions");
        if (!response.ok) throw new Error("Failed");
        const data = (await response.json()) as ApiResponse;
        setDays(data.days || []);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    fetchGraph();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const compute = () => {
      const accent = getComputedStyle(root)
        .getPropertyValue("--color-accent")
        .trim();
      setLevelColors(buildRamp(accent));
    };
    compute();
    const observer = new MutationObserver(compute);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const maxCount = useMemo(() => {
    return days.reduce((max, day) => Math.max(max, day.count), 0);
  }, [days]);

  const { weeks, monthLabels } = useMemo(() => {
    if (days.length === 0) {
      return { weeks: [] as Day[][], monthLabels: [] as number[] };
    }
    const currentYear = new Date().getFullYear();
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

    const startDate = new Date(currentYear, 0, 1);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(currentYear, 11, 31);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dayMap = new Map(sorted.map((day) => [day.date, day.count]));
    const weeksList: Day[][] = [];
    const monthStarts: number[] = [];

    let current = new Date(startDate);
    let weekIndex = 0;

    while (current <= endDate) {
      const week: Day[] = [];
      for (let i = 0; i < 7; i += 1) {
          const iso = current.toISOString().slice(0, 10);
          if (current.getDate() === 1 && current.getMonth() < 12) {
            monthStarts.push(weekIndex);
          }
        week.push({
          date: iso,
          count: dayMap.get(iso) ?? 0,
        });
        current.setDate(current.getDate() + 1);
      }
      weeksList.push(week);
      weekIndex += 1;
    }

    return { weeks: weeksList, monthLabels: monthStarts };
  }, [days]);

  const getColor = (count: number) => {
    if (count === 0) return levelColors[0];
    if (count <= maxCount * 0.25) return levelColors[1];
    if (count <= maxCount * 0.5) return levelColors[2];
    if (count <= maxCount * 0.75) return levelColors[3];
    return levelColors[4];
  };

  return (
    <section className="terminal-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Github</h3>
        <a
          className="text-xs text-[var(--color-subtext1)]"
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
        >
          View profile
        </a>
      </div>
      {status === "loading" ? (
        <p className="mt-2 text-sm text-[var(--color-subtext1)]">
          Loading contributions...
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-sm text-[var(--color-subtext1)]">
          Contributions unavailable right now.
        </p>
      ) : null}
      {status === "ready" ? (
        <div className="relative mt-3">
          <div
            ref={gridRef}
            className="flex flex-col"
            onMouseLeave={() => setTooltip(null)}
          >
            <div
              className="grid text-[10px] text-[var(--color-subtext1)]"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
                columnGap: "2px",
              }}
            >
              {monthLabels.map((index) => {
                const labelDate = weeks[index]?.[0]?.date;
                const label = labelDate
                  ? new Date(labelDate).toLocaleString("en-US", {
                      month: "short",
                    })
                  : "";
                return (
                  <span
                    key={`${label}-${index}`}
                    style={{ gridColumnStart: index + 1 }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
            <div className="mt-2 flex gap-0.5">
              {weeks.map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-0.5">
                  {week.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      className="h-3 w-3 rounded-[3px] border border-[var(--color-surface1)]"
                      style={{ backgroundColor: getColor(day.count) }}
                      onMouseEnter={(event) => {
                        const grid = gridRef.current?.getBoundingClientRect();
                        const rect = event.currentTarget.getBoundingClientRect();
                        if (!grid) return;
                        setTooltip({
                          x: rect.left - grid.left + rect.width / 2,
                          y: rect.top - grid.top,
                          text: `${day.count} contributions on ${day.date}`,
                        });
                      }}
                      aria-label={`${day.count} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {tooltip ? (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border border-[var(--color-surface1)] bg-[var(--color-crust)] px-2 py-1 text-[10px] text-[var(--color-subtext1)] shadow-lg"
              style={{ left: tooltip.x, top: tooltip.y - 8 }}
            >
              {tooltip.text}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--color-subtext1)]">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {levelColors.map((color) => (
            <span
              key={color}
              className="h-3 w-3 rounded-[3px] border border-[var(--color-surface1)]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </section>
  );
}
