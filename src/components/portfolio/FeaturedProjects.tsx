import { projects } from "@/lib/projects";
import { Link } from "next-view-transitions";
import Image from "next/image";

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
        <h2 className="flex items-center gap-3 text-3xl font-extrabold">
          <span className="text-[var(--color-accent)]">★</span>
          Featured Projects
        </h2>
        <Link className="arrow-link more-link" href="/projects">
          View all
          <span className="more-link__arrow">→</span>
        </Link>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {featured.map((project) => (
          <div
            key={project.slug}
            className="terminal-card hover-panel no-lift featured-card group overflow-hidden"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="terminal-preview block"
              style={{ viewTransitionName: `project-${project.slug}` }}
            >
              <div className="terminal-window terminal-preview__inner">
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
            </Link>
            <div className="space-y-3 p-5">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-lg font-semibold"
                >
                  {project.title}
                </Link>
                <span className="text-sm text-[var(--color-subtext1)]">
                  {project.createdAt}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[var(--color-subtext1)]">
                {project.links.map((link) => {
                  const label = link.label.toLowerCase();
                  const isGithub = label.includes("github");
                  const isLive = label.includes("live");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
                    >
                      {isGithub ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.13-4.56-5.02 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.03a9.34 9.34 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.55 1.41.2 2.45.1 2.71.64.71 1.02 1.62 1.02 2.73 0 3.9-2.34 4.75-4.57 5 .36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.09 10.09 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
                        </svg>
                      ) : null}
                      {isLive ? (
                        <Image
                          src="/globe.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                      ) : null}
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
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
          </div>
        ))}
      </div>
    </section>
  );
}
