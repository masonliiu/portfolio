"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      stage.style.setProperty("--reveal-x", `${x}px`);
      stage.style.setProperty("--reveal-y", `${y}px`);
      stage.style.setProperty("--reveal-size", "240px");
    };

    const handleLeave = () => {
      stage.style.setProperty("--reveal-size", "0px");
    };

    stage.addEventListener("pointermove", handleMove);
    stage.addEventListener("pointerleave", handleLeave);

    return () => {
      stage.removeEventListener("pointermove", handleMove);
      stage.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  const ghostCopy =
    active.sections?.[0]?.body?.[0] ??
    "Building systems that feel precise, fast, and story-driven.";

  return (
    <section id={id} className={className} data-reveal>
      <div className="work-focus" ref={stageRef} data-cursor="Reveal">
        <div className="work-focus__ghost" aria-hidden="true">
          <span className="work-meta">Behind the surface</span>
          <h3>{active.title}</h3>
          <p>{ghostCopy}</p>
          <div className="work-tags">
            {active.tags.slice(0, 5).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="work-focus__surface">
          <div className="work-focus__header">
            <div>
              <p className="section-kicker">Selected work</p>
              <h2 className="section-title">Projects with a pulse.</h2>
            </div>
            <span className="work-meta">Hover to explore</span>
          </div>
          <div className="work-focus__grid">
            <div className="work-focus__list" data-cursor="Reveal">
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
          <Link className="work-meta inline-flex" href="/projects" data-magnet data-cursor="Archive">
            Full archive →
          </Link>
        </div>
      </div>
    </section>
  );
}
