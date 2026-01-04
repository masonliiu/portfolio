import { projects } from "@/lib/projects";
import { Link } from "next-view-transitions";

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

export default function ProjectsList() {
  return (
    <section className="space-y-6">
      <div>
        <div className="terminal-title">
          <span className="mt-3 text-3xl font-extrabold tracking-tight">projects</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="terminal-card project-card hover-panel no-lift featured-card flex min-h-[460px] flex-col"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="terminal-preview-wrap block"
              style={{ viewTransitionName: `project-${project.slug}` }}
            >
              <div className="terminal-preview terminal-preview--catalog">
                <div className="terminal-window">
                  <div className="terminal-window__top">
                    <div className="terminal-window__controls">
                      <span className="terminal-dot terminal-dot--red" />
                      <span className="terminal-dot terminal-dot--yellow" />
                      <span className="terminal-dot terminal-dot--green" />
                    </div>
                    <span className="terminal-window__stars">
                      ★ {project.stars ?? "—"}
                    </span>
                  </div>
                  <div className="terminal-window__repo truncate">
                    {project.repo}
                  </div>
                  <p className="terminal-window__desc terminal-window__desc--small clamp-3">
                    {project.summary}
                  </p>
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
            </Link>
            <div className="flex grow flex-col gap-3 p-4">
              <div className="card-title-row flex items-center justify-between gap-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="featured-title text-base font-semibold"
                >
                  {project.title}
                </Link>
                <span className="text-xs text-[var(--color-subtext1)]">
                  {project.createdAt}
                </span>
              </div>
              <p className="clamp-3 text-sm text-[var(--color-subtext0)]">
                {project.summary}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-2 text-xs">
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
          </div>
        ))}
      </div>
    </section>
  );
}
