import { projects } from "@/lib/projects";
import ViewTransitionLink from "./ViewTransitionLink";

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
        <div className="terminal-title">Projects</div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          Project catalog
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--color-subtext0)]">
          Explore every build with a preview, highlights, and quick links.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ViewTransitionLink
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="terminal-card flex min-h-[420px] flex-col"
            style={{ viewTransitionName: `project-${project.slug}` }}
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
                <h2 className="text-base font-semibold">
                  {project.title}
                </h2>
                <span className="text-xs text-[var(--color-subtext1)]">
                  {project.createdAt}
                </span>
              </div>
              <p className="clamp-3 text-sm text-[var(--color-subtext0)]">
                {project.summary}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
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
          </ViewTransitionLink>
        ))}
      </div>
    </section>
  );
}
