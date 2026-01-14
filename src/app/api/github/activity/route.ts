import { NextResponse } from "next/server";

const USERNAME = "masonliiu";
const CACHE_SECONDS = 60 * 15;

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
  SQL: "#e38c00",
  Markdown: "#6e6e6e",
  JSON: "#a88dff",
  YAML: "#cb171e",
  SCSS: "#c6538c",
  Sass: "#c6538c",
};

const EXTENSION_LANGUAGE: Record<string, string> = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".java": "Java",
  ".cs": "C#",
  ".go": "Go",
  ".py": "Python",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".html": "HTML",
  ".htm": "HTML",
  ".sql": "SQL",
  ".md": "Markdown",
  ".json": "JSON",
  ".yml": "YAML",
  ".yaml": "YAML",
  ".c": "C",
  ".cc": "C++",
  ".cpp": "C++",
  ".cxx": "C++",
  ".rs": "Rust",
  ".rb": "Ruby",
  ".php": "PHP",
};

const EXTENSION_COLORS: Record<string, string> = {
  C: "#555555",
  "C++": "#f34b7d",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
};

const getExtension = (file: string) => {
  const index = file.lastIndexOf(".");
  if (index === -1) return null;
  return file.slice(index).toLowerCase();
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Missing GITHUB_TOKEN" },
      { status: 500 }
    );
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "masonliu-portfolio",
    };

    const searchResponse = await fetch(
      `https://api.github.com/search/commits?q=author:${USERNAME}&sort=author-date&order=desc&per_page=4`,
      {
        headers: {
          ...headers,
          Accept: "application/vnd.github.cloak-preview+json",
        },
        next: { revalidate: CACHE_SECONDS },
      }
    );

    if (!searchResponse.ok) {
      throw new Error("GitHub request failed");
    }

    const searchData = (await searchResponse.json()) as {
      items?: Array<{
        url: string;
        html_url: string;
        commit: { message: string };
        repository: { full_name: string };
      }>;
    };

    let commitDetails = await Promise.all(
      (searchData.items ?? []).map(async (item) => {
        const response = await fetch(item.url, {
          headers,
          next: { revalidate: CACHE_SECONDS },
        });
        if (!response.ok) {
          throw new Error("Commit request failed");
        }
        const detail = (await response.json()) as {
          html_url: string;
          commit: { message: string };
          stats?: { additions?: number; deletions?: number };
          files?: Array<{ filename: string; additions: number; deletions: number }>;
        };
        return { item, detail };
      })
    );

    if (commitDetails.length === 0) {
      const eventsRes = await fetch(
        `https://api.github.com/users/${USERNAME}/events/public`,
        {
          headers,
          next: { revalidate: CACHE_SECONDS },
        }
      );

      if (!eventsRes.ok) {
        throw new Error("GitHub request failed");
      }

      const events = (await eventsRes.json()) as Array<{
        type: string;
        repo: { name: string };
        payload: { commits?: Array<{ message: string; url: string }> };
      }>;

      const commitUrls: string[] = [];
      const repoMap = new Map<string, string>();
      events.forEach((event) => {
        if (event.type !== "PushEvent" || !event.payload.commits) return;
        event.payload.commits.forEach((commit) => {
          commitUrls.push(commit.url);
          repoMap.set(commit.url, event.repo.name);
        });
      });

      const uniqueCommitUrls = Array.from(new Set(commitUrls)).slice(0, 4);
      commitDetails = await Promise.all(
        uniqueCommitUrls.map(async (url) => {
          const response = await fetch(url, {
            headers,
            next: { revalidate: CACHE_SECONDS },
          });
          if (!response.ok) {
            throw new Error("Commit request failed");
          }
          const detail = (await response.json()) as {
            html_url: string;
            commit: { message: string };
            stats?: { additions?: number; deletions?: number };
            files?: Array<{
              filename: string;
              additions: number;
              deletions: number;
            }>;
          };
          return {
            item: {
              url,
              repository: { full_name: repoMap.get(url) ?? USERNAME },
              commit: { message: detail.commit.message },
              html_url: detail.html_url,
            },
            detail,
          };
        })
      );
    }

    const commitItems: CommitItem[] = commitDetails.map(({ item, detail }) => ({
      repo: item.repository.full_name,
      message: item.commit.message.split("\n")[0] || "Commit",
      url: detail.html_url || item.html_url,
      additions: detail.stats?.additions ?? 0,
      deletions: detail.stats?.deletions ?? 0,
    }));

    const commitLanguageTotals: Record<string, number> = {};
    commitDetails.forEach(({ detail }) => {
      (detail.files ?? []).forEach((file) => {
        const ext = getExtension(file.filename);
        const language = ext ? EXTENSION_LANGUAGE[ext] : null;
        if (!language) return;
        const weight = file.additions + file.deletions;
        commitLanguageTotals[language] =
          (commitLanguageTotals[language] || 0) + weight;
      });
    });

    const languageItems: LanguageItem[] = Object.entries(commitLanguageTotals)
      .map(([name, count]) => ({
        name,
        count,
        color:
          LANGUAGE_COLORS[name] ||
          EXTENSION_COLORS[name] ||
          "#94a3b8",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return NextResponse.json(
      {
        commits: commitItems.slice(0, 4),
        languages: languageItems,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`,
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "GitHub activity unavailable" },
      { status: 500 }
    );
  }
}
