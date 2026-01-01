import Link from "next/link";
import { projects } from "@/lib/projects";

const tagColors = [
  "peach",
  "blue",
  "green",
  "mauve",
  "red",
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="terminal-card hover-panel group overflow-hidden"
          >
            <div className="bg-[var(--color-surface0)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--color-subtext1)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-red)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-yellow)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-green)]" />
                <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-[var(--color-overlay1)]">
                  Preview
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-[var(--color-base)] px-4 py-5 text-sm text-[var(--color-text)]">
                <div className="text-[var(--color-accent)]">
                  {project.title}
                </div>
                <p className="mt-2 text-sm text-[var(--color-subtext0)]">
                  {project.summary}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-semibold transition group-hover:text-[var(--color-accent)]">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--color-subtext0)]">
                {project.summary}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {project.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      borderColor: `var(--color-${tagColors[index % tagColors.length]})`,
                      color: `var(--color-${tagColors[index % tagColors.length]})`,
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
