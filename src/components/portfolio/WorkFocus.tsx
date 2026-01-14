"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { projects } from "@/lib/projects";

export default function WorkFocus() {
  const featured = projects.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featured[activeIndex];

  return (
    <section className="section-block" data-reveal>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Selected work</p>
            <h2 className="section-title">Projects with a pulse.</h2>
          </div>
          <span className="work-meta">Hover to explore</span>
        </div>
        <div className="work-focus">
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
              >
                <span className="work-meta">{project.createdAt}</span>
                <span className="work-focus__title">{project.title}</span>
              </button>
            ))}
          </div>
          <div className="work-focus__detail" aria-live="polite">
            <p className="work-meta">{active.repo}</p>
            <h3>{active.title}</h3>
            <p>{active.summary}</p>
            <div className="work-tags">
              {active.tags.slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="hero-cta">
              {active.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <Link className="work-meta inline-flex" href="/projects">
          Full archive →
        </Link>
      </div>
    </section>
  );
}
