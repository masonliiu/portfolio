"use client";

import { useEffect, useState } from "react";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function SessionStats() {
  const [seconds, setSeconds] = useState(0);
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const clock = setInterval(updateTime, 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="terminal-card p-6 text-xs text-[var(--muted)]">
      <div className="terminal-title">Session</div>
      <div className="mt-4 flex items-center justify-between">
        <span>Session time</span>
        <span className="text-[var(--text)]">{formatTime(seconds)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span>Local time</span>
        <span className="text-[var(--text)]">{timeString}</span>
      </div>
    </section>
  );
}
