"use client";

import { useEffect, useMemo, useState } from "react";

type Day = {
  date: string;
  count: number;
  color?: string;
};

type ApiWeek = {
  days: Day[];
};

type ApiResponse = {
  weeks: ApiWeek[];
  total?: number;
};

const levelColors = [
  "#2d2a4a",
  "#4b4a7a",
  "#6a66a3",
  "#8a86c7",
  "#b1aef0",
];

export default function ContributionGraph() {
  const [weeks, setWeeks] = useState<ApiWeek[]>([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/masonliiu?y=last"
        );
        if (!response.ok) throw new Error("Failed");
        const data = (await response.json()) as ApiResponse;
        setWeeks(data.weeks || []);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    fetchGraph();
  }, []);

  const days = useMemo(() => {
    return weeks.flatMap((week) => week.days || []);
  }, [weeks]);

  const maxCount = useMemo(() => {
    return days.reduce((max, day) => Math.max(max, day.count), 0);
  }, [days]);

  const getColor = (count: number) => {
    if (count === 0) return levelColors[0];
    if (count <= maxCount * 0.25) return levelColors[1];
    if (count <= maxCount * 0.5) return levelColors[2];
    if (count <= maxCount * 0.75) return levelColors[3];
    return levelColors[4];
  };

  return (
    <section className="terminal-card p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Github</h3>
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
        <p className="mt-2 text-xs text-[var(--color-subtext1)]">
          Loading contributions...
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-xs text-[var(--color-subtext1)]">
          Contributions unavailable right now.
        </p>
      ) : null}
      {status === "ready" ? (
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1">
          {days.map((day) => (
            <button
              key={day.date}
              type="button"
              className="h-3 w-3 rounded-sm border border-[var(--color-surface1)]"
              style={{ backgroundColor: getColor(day.count) }}
              title={`${day.count} contributions on ${day.date}`}
              aria-label={`${day.count} contributions on ${day.date}`}
            />
          ))}
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
