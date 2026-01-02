"use client";

import { useEffect, useMemo, useState } from "react";

type CommitItem = {
  repo: string;
  message: string;
  url: string;
};

type LanguageItem = {
  name: string;
  count: number;
  color: string;
};

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  "C#": "#178600",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572a5",
  Go: "#00ADD8",
  Shell: "#89e051",
};

const CACHE_KEY = "github-activity-cache";
const CACHE_TTL = 1000 * 60 * 15;

export default function GitHubActivity() {
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as {
          timestamp: number;
          commits: CommitItem[];
          languages: LanguageItem[];
        };
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
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
        const [eventsRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/masonliiu/events/public"),
          fetch("https://api.github.com/users/masonliiu/repos?per_page=100"),
        ]);

        if (!eventsRes.ok || !reposRes.ok) {
          throw new Error("GitHub request failed");
        }

        const events = (await eventsRes.json()) as Array<{
          type: string;
          repo: { name: string };
          payload: { commits?: Array<{ message: string; url: string }> };
        }>;

        const commitItems: CommitItem[] = [];
        events.forEach((event) => {
          if (event.type !== "PushEvent" || !event.payload.commits) return;
          event.payload.commits.forEach((commit) => {
            commitItems.push({
              repo: event.repo.name,
              message: commit.message,
              url: commit.url.replace("api.", "").replace("repos/", ""),
            });
          });
        });

        const repos = (await reposRes.json()) as Array<{
          language: string | null;
        }>;

        const languageCount: Record<string, number> = {};
        repos.forEach((repo) => {
          if (!repo.language) return;
          languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        });

        const languageItems = Object.entries(languageCount)
          .map(([name, count]) => ({
            name,
            count,
            color: LANGUAGE_COLORS[name] || "#94a3b8",
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        const finalCommits = commitItems.slice(0, 4);
        setCommits(finalCommits);
        setLanguages(languageItems);
        setStatus("ready");

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            commits: finalCommits,
            languages: languageItems,
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
    <section className="terminal-card p-3">
      <div className="flex items-center justify-between text-sm">
        <h3 className="font-semibold">Recent Commits</h3>
        <a
          href="https://github.com/masonliiu"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[var(--color-accent)]"
        >
          View on GitHub
        </a>
      </div>
      {status === "loading" ? (
        <p className="mt-2 text-xs text-[var(--color-subtext1)]">
          Loading GitHub activity...
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-xs text-[var(--color-subtext1)]">
          GitHub activity unavailable right now.
        </p>
      ) : null}
      {status === "ready" ? (
        <>
          <ul className="mt-2 space-y-1.5 text-sm">
            {commits.length === 0 ? (
              <li className="text-xs text-[var(--color-subtext1)]">
                No recent public commits.
              </li>
            ) : (
              commits.map((commit) => (
                <li key={`${commit.repo}-${commit.message}`}>
                  <a
                    className="flex min-w-0 items-center gap-2 text-[var(--color-subtext0)]"
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    title={`${commit.repo}: ${commit.message}`}
                  >
                    <span className="flex-shrink-0 font-semibold text-[var(--color-text)]">
                      {commit.repo.split("/")[1]}:
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {commit.message}
                    </span>
                  </a>
                </li>
              ))
            )}
          </ul>
          {languages.length > 0 ? (
            <div className="mt-3">
              <div className="flex h-2 overflow-hidden rounded bg-[var(--color-surface0)]">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="relative h-full"
                    style={{
                      width: `${(lang.count / totalLanguages) * 100}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
