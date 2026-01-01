import Link from "next/link";
import { projects } from "@/lib/projects";

const tagColors = [
  "peach",
  "blue",
  "green",
  "mauve",
  "sapphire",
  "teal",
  "lavender",
  "yellow",
];

export default function FeaturedProjects() {
  const featured = projects.slice(0, 2);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <span className="text-[var(--color-accent)]">★</span>
          Featured Projects
        </h2>
        <Link
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] hover:text-[var(--color-accent)]"
          href="/projects"
        >
          View all →
        </Link>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="terminal-card hover-panel group overflow-hidden"
          >
            <div className="terminal-preview">
              <div className="terminal-window">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-red)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--color-yellow)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--color-green)]" />
                  <div className="terminal-window__title ml-2 flex-1">
                    {project.repo}
                  </div>
                  <span className="text-xs text-[var(--color-subtext1)]">
                    ★ {project.stars ?? "—"}
                  </span>
                </div>
                <p className="terminal-window__desc">{project.summary}</p>
                <div className="terminal-window__footer">
                  <span />
                  <span>
                    {project.contributors.length === 1
                      ? project.contributors[0]
                      : `${project.contributors.length} contributors`}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <h3 className="text-base font-semibold transition group-hover:text-[var(--color-accent)]">
                  {project.title}
                </h3>
                <span className="text-xs text-[var(--color-subtext1)]">
                  {project.createdAt}
                </span>
              </div>
              <p className="clamp-3 text-sm text-[var(--color-subtext0)]">
                {project.summary}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {project.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="tag-pill"
                    style={{
                      ["--tag-color" as string]: `var(--color-${tagColors[index % tagColors.length]})`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
