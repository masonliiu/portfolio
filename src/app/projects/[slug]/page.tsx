import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
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

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = true;

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(decodeURIComponent(params.slug));
  if (!project) {
    notFound();
  }

  return (
    <div className="page-shell max-w-6xl">
      <div className="scroll-blur" />
      <div className="terminal-title">Projects</div>
      <div className="mt-6 flex flex-col items-center gap-6 text-center">
        <div
          className="terminal-preview w-full max-w-2xl"
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
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
            <p className="terminal-window__desc clamp-3">
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

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {project.title}
          </h1>
          <span className="text-sm text-[var(--color-subtext1)]">
            {project.createdAt}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[var(--color-subtext1)]">
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
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
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

      <section className="mx-auto mt-10 max-w-3xl space-y-8 text-left">
        {project.sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="terminal-title">{section.title}</div>
            {section.body ? (
              <div className="space-y-3 text-base text-[var(--color-subtext0)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {section.bullets ? (
              <ul className="space-y-2 text-base text-[var(--color-subtext0)]">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <Link
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]"
        href="/projects"
      >
        Back to projects
      </Link>
    </div>
  );
}
