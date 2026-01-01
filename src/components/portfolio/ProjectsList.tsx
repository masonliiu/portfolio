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

export default function ProjectsList() {
  return (
    <section className="space-y-6">
      <div>
        <div className="terminal-title">Projects</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Project catalog
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-subtext0)]">
          Explore every build with a preview, highlights, and quick links.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="terminal-card hover-panel group p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold transition group-hover:text-[var(--color-accent)]">
                {project.title}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
                Preview
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-subtext0)]">
              {project.summary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
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
          </Link>
        ))}
      </div>
    </section>
  );
}
