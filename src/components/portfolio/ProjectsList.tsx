"use client";

import { projects } from "@/lib/projects";
import { useTransitionRouter } from "next-view-transitions";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

type Project = (typeof projects)[number];

const clampWords = (text: string, maxWords: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
};

type ProjectCardProps = {
  project: Project;
  onCardClick: (event: React.MouseEvent<HTMLDivElement>, slug: string) => void;
  onCardKey: (event: React.KeyboardEvent<HTMLDivElement>, slug: string) => void;
  onNavigate: (slug: string) => void;
};

function ProjectCard({
  project,
  onCardClick,
  onCardKey,
  onNavigate,
}: ProjectCardProps) {
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const element = tagsRef.current;
    if (!element) return;
    const update = () => {
      setShowArrow(element.scrollWidth > element.clientWidth + 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [project.tags.length]);

  return (
    <div
      key={project.slug}
      className="terminal-card project-card hover-panel no-lift featured-card flex min-h-[360px] flex-col cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={(event) => onCardClick(event, project.slug)}
      onKeyDown={(event) => onCardKey(event, project.slug)}
    >
      <div
        className="terminal-preview-wrap"
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
            <div className="terminal-window__repo truncate">{project.repo}</div>
            <p className="terminal-window__desc terminal-window__desc--small clamp-4">
              {clampWords(project.summary, 11)}
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
      </div>
      <div className="flex grow flex-col justify-between gap-2 px-3 pb-5 pt-2.5">
        <div className="flex items-center gap-2 text-[var(--color-subtext1)]">
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
                className="inline-flex items-center gap-2 text-[12px] font-semibold lowercase tracking-[0.08em]"
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
                    width={12}
                    height={12}
                    className="h-4 w-4"
                  />
                ) : null}
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
        <div className="card-title-row flex items-center justify-between gap-4">
          <span className="featured-title text-sm font-semibold">
            {project.title}
          </span>
          <span className="text-[10px] text-[var(--color-subtext1)]">
            {project.createdAt}
          </span>
        </div>
        <p className="line-clamp-2 text-xs text-[var(--color-subtext0)]">
          {project.summary}
        </p>
        <div className="flex items-center gap-2">
          <div
            ref={tagsRef}
            className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden text-[10px]"
          >
            {project.tags.map((tag, index) => (
              <span
                key={tag}
                className="tag-pill"
                style={{
                  ["--tag-color" as string]: `var(--color-${
                    tagColors[index % tagColors.length]
                  })`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          {showArrow && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(project.slug);
              }}
              className="more-link clickable shrink-0 text-[10px] text-[var(--color-subtext1)]"
              aria-label={`Open ${project.title}`}
            >
              <span className="more-link__arrow">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsList() {
  const sortedProjects = [...projects].sort((a, b) =>
    b.createdAtISO.localeCompare(a.createdAtISO)
  );
  const router = useTransitionRouter();

  const handleCardClick = (
    event: React.MouseEvent<HTMLDivElement>,
    slug: string
  ) => {
    if ((event.target as HTMLElement).closest("a")) return;
    router.push(`/projects/${slug}`);
  };

  const handleCardKey = (event: React.KeyboardEvent<HTMLDivElement>, slug: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(`/projects/${slug}`);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <div className="terminal-title">
          <span className="mt-3 text-3xl font-extrabold tracking-tight">projects</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onCardClick={handleCardClick}
            onCardKey={handleCardKey}
            onNavigate={(slug) => router.push(`/projects/${slug}`)}
          />
        ))}
      </div>
    </section>
  );
}
