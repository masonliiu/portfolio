import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = true;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const project = getProject(decodeURIComponent(resolved.slug));
  if (!project) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="section-block" data-reveal>
        <div className="space-y-6">
          <p className="section-kicker">Project</p>
          <h1 className="section-title">{project.title}</h1>
          <p className="section-subtitle">{project.summary}</p>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.3em] text-[var(--muted-2)]">
            <span>{project.createdAt}</span>
            <span>{project.repo}</span>
            <span>
              {project.contributors.length === 1
                ? project.contributors[0]
                : `${project.contributors.length} contributors`}
            </span>
          </div>
          <div className="hero-cta">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" data-reveal>
        <div className="work-list">
          {project.sections.map((section) => (
            <div key={section.title} className="work-row">
              <h3>{section.title}</h3>
              {section.body ? (
                <div className="space-y-3 text-[var(--muted)]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {section.bullets ? (
                <ul className="space-y-2 text-[var(--muted)]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <Link className="work-meta inline-flex" href="/projects">
        Back to projects →
      </Link>
    </main>
  );
}
