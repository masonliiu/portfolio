"use client";

import { Link } from "next-view-transitions";
import { projects } from "@/lib/projects";

export default function ProjectsList() {
  const sortedProjects = [...projects].sort((a, b) =>
    b.createdAtISO.localeCompare(a.createdAtISO)
  );

  return (
    <section className="section-block" data-reveal>
      <div className="section-center space-y-4">
        <p className="section-kicker">Projects archive</p>
        <h1
          className="section-title outline-fill blob-text"
          data-fill
          data-blob-text="Projects."
          data-blob-target
        >
          Projects.
        </h1>
        <p className="section-subtitle">Full-stack products and systems work.</p>
      </div>

      <div className="work-list mt-10">
        {sortedProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="work-row"
            data-reveal
            data-magnet
            data-cursor="Open"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="work-meta">{project.createdAt}</div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <div className="work-meta">{project.repo}</div>
            </div>
            <div className="work-tags">
              {project.tags.slice(0, 8).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
