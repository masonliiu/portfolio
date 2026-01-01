import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-14">
      <div className="terminal-title">Projects</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        {project.title}
      </h1>
      <p className="mt-3 text-sm text-[var(--color-subtext0)]">
        {project.summary}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--color-surface1)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-subtext1)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            {link.label}
          </a>
        ))}
      </div>

      <section className="mt-10 space-y-6">
        <div>
          <div className="terminal-title">Overview</div>
          <div className="mt-4 space-y-4 text-sm text-[var(--color-subtext0)]">
            {project.details.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <div className="terminal-title">Highlights</div>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-subtext0)]">
            {project.highlights.map((highlight) => (
              <li key={highlight}>• {highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      <Link
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] hover:text-[var(--color-accent)]"
        href="/projects"
      >
        Back to projects
      </Link>
    </div>
  );
}
