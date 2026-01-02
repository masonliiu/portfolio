"use client";

import { useEffect, useState } from "react";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function Footer() {
  const [timeOnSite, setTimeOnSite] = useState("00:00");

  useEffect(() => {
    const sessionStart = Date.now();
    const stored = localStorage.getItem("total-time-on-site");
    const initial = stored ? Number(stored) : 0;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
      setTimeOnSite(formatTime(initial + elapsed));
    }, 1000);

    const saveTime = () => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
      localStorage.setItem("total-time-on-site", String(initial + elapsed));
    };

    window.addEventListener("beforeunload", saveTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", saveTime);
      saveTime();
    };
  }, []);

  return (
    <footer className="text-xs text-[var(--color-subtext0)]">
      <div className="page-shell" style={{ paddingTop: "0px"}}>
        <div className="footer-bar">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Mason Liu</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--color-subtext1)]">
              <div className="flex items-center gap-2">
                <span>Time on site</span>
                <span className="text-[var(--color-accent)]">{timeOnSite}</span>
              </div>
              <span className="hidden md:inline">·</span>
              <a href="mailto:liumasn@gmail.com">Email</a>
              <span className="hidden md:inline">·</span>
              <a
                href="https://github.com/masonliiu"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <span className="hidden md:inline">·</span>
              <a
                href="https://www.linkedin.com/in/masonliiu/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
