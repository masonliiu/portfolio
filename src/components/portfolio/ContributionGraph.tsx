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

const levelColors = [
  "#2d2a4a",
  "#4b4a7a",
  "#6a66a3",
  "#8a86c7",
  "#b1aef0",
];

export default function ContributionGraph() {
  const [days, setDays] = useState<Day[]>([]);
  const [status, setStatus] = useState("loading");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const maxCount = useMemo(() => {
    return days.reduce((max, day) => Math.max(max, day.count), 0);
  }, [days]);

  const { weeks, monthLabels } = useMemo(() => {
    if (days.length === 0) {
      return { weeks: [] as Day[][], monthLabels: [] as number[] };
    }
    const currentYear = new Date().getFullYear();
    const filtered = days.filter(
      (day) => new Date(day.date).getFullYear() === currentYear
    );
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

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
        if (current.getDate() === 1) {
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
                gridTemplateColumns: `repeat(${weeks.length}, 16px)`,
                columnGap: "6px",
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
            <div className="mt-2 flex gap-1.5">
              {weeks.map((week, weekIndex) => (
                <div
                  key={`week-${weekIndex}`}
                  className="grid grid-rows-7 gap-1.5"
                >
                  {week.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      className="h-4 w-4 rounded-sm border border-[var(--color-surface1)]"
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
      <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-subtext1)]">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {levelColors.map((color) => (
            <span
              key={color}
              className="h-2 w-2 rounded-sm border border-[var(--color-surface1)]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </section>
  );
}
