"use client";

import { useMemo, useState } from "react";
import { Link } from "next-view-transitions";
import { projects } from "@/lib/projects";

type WorkFocusProps = {
  className?: string;
  id?: string;
};

export default function WorkFocus({ className, id }: WorkFocusProps) {
  const featured = useMemo(() => projects.slice(0, 5), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featured[activeIndex];

  return (
    <section id={id} className={className} data-reveal>
      <div className="work-focus">
        <p className="section-kicker">Work</p>
        <h2 className="section-title outline-fill" data-fill data-blob-target>
          Projects.
        </h2>
        <div className="work-focus__grid">
          <div className="work-focus__list">
            {featured.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                className={`work-focus__item ${
                  index === activeIndex ? "is-active" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                data-magnet
                data-blob-target
              >
                <span className="work-meta">{project.createdAt}</span>
                <span className="work-focus__title">{project.title}</span>
              </button>
            ))}
          </div>
          <div className="work-focus__detail" aria-live="polite">
            <p className="work-meta">{active.repo}</p>
            <h3 className="work-focus__headline">{active.title}</h3>
            <p className="work-focus__summary">{active.summary}</p>
            <div className="work-tags">
              {active.tags.slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="hero-cta">
              {active.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  data-magnet
                  data-cursor="Open"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <Link
          className="work-meta inline-flex"
          href="/projects"
          data-magnet
          data-cursor="Archive"
        >
          Full archive →
        </Link>
      </div>
    </section>
  );
}
