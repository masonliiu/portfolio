"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CommitItem = {
  repo: string;
  message: string;
  url: string;
  additions: number;
  deletions: number;
};

type LanguageItem = {
  name: string;
  count: number;
  color: string;
};

const CACHE_KEY = "github-activity-cache-v2";
const CACHE_TTL = 1000 * 60 * 15;

export default function GitHubActivity() {
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [status, setStatus] = useState("loading");
  const [langTooltip, setLangTooltip] = useState<{
    x: number;
    text: string;
  } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as {
          timestamp: number;
          commits: CommitItem[];
          languages: LanguageItem[];
        };
        if (
          Date.now() - parsed.timestamp < CACHE_TTL &&
          (parsed.commits.length > 0 || parsed.languages.length > 0)
        ) {
          setCommits(parsed.commits);
          setLanguages(parsed.languages);
          setStatus("ready");
          return;
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch("/api/github/activity");
        if (!response.ok) {
          throw new Error("GitHub request failed");
        }
        const data = (await response.json()) as {
          commits: CommitItem[];
          languages: LanguageItem[];
        };

        setCommits(data.commits);
        setLanguages(data.languages);
        setStatus("ready");

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            commits: data.commits,
            languages: data.languages,
          })
        );
      } catch {
        setStatus("error");
      }
    };

    fetchData();
  }, []);

  const totalLanguages = useMemo(
    () => languages.reduce((sum, item) => sum + item.count, 0),
    [languages]
  );

  return (
    <section className="signal-item">
      <div className="flex items-center justify-between">
        <h3 className="section-kicker">Recent commits</h3>
        <a
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
          className="work-meta"
        >
          View on GitHub →
        </a>
      </div>
      {status === "loading" ? (
        <p className="mt-2 text-sm text-[var(--muted-2)]">
          Loading GitHub activity...
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-sm text-[var(--muted-2)]">
          GitHub activity unavailable right now.
        </p>
      ) : null}
      {status === "ready" ? (
        <>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {commits.length === 0 ? (
              <li className="text-sm text-[var(--muted-2)]">
                No recent public commits.
              </li>
            ) : (
              commits.map((commit) => (
                <li key={commit.url}>
                  <a
                    className="flex min-w-0 items-center gap-2"
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    title={`${commit.repo}: ${commit.message}`}
                  >
                    <span className="flex-shrink-0 font-semibold text-[var(--ink)]">
                      {commit.repo.split("/")[1]}:
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {commit.message}
                    </span>
                    <span className="flex-shrink-0 text-xs text-[var(--muted-2)]">
                      <span>
                        +{commit.additions.toLocaleString()}
                      </span>{" "}
                      /{" "}
                      <span>
                        -{commit.deletions.toLocaleString()}
                      </span>
                    </span>
                  </a>
                </li>
              ))
            )}
          </ul>
          {languages.length > 0 ? (
            <div className="relative mt-3">
              <div
                ref={barRef}
                className="flex h-1.5 overflow-hidden bg-[var(--soft-line)]"
                onMouseLeave={() => setLangTooltip(null)}
              >
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="h-full"
                    style={{
                      width: `${(lang.count / totalLanguages) * 100}%`,
                      backgroundColor: lang.color,
                    }}
                    onMouseEnter={(event) => {
                      const bar = barRef.current?.getBoundingClientRect();
                      const rect = event.currentTarget.getBoundingClientRect();
                      if (!bar) return;
                      const percentage = Math.round(
                        (lang.count / totalLanguages) * 100
                      );
                      setLangTooltip({
                        x: rect.left - bar.left + rect.width / 2,
                        text: `${lang.name} · ${percentage}%`,
                      });
                    }}
                    aria-label={`${lang.name}: ${Math.round(
                      (lang.count / totalLanguages) * 100
                    )}%`}
                  />
                ))}
              </div>
              {langTooltip ? (
                <span
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-6 border border-[var(--line)] bg-[var(--paper)] px-2 py-1 text-[10px] text-[var(--muted-2)]"
                  style={{ left: langTooltip.x, top: 0 }}
                >
                  {langTooltip.text}
                </span>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
