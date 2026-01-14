"use client";

import { useEffect, useRef } from "react";

const details = [
  "CS @ UTD",
  "Full-stack systems",
  "Game-inspired UI",
  "Low-level curiosity",
  "Photography & motion",
];

export default function RevealBlob() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      stage.style.setProperty("--blob-x", `${x}px`);
      stage.style.setProperty("--blob-y", `${y}px`);
      stage.style.setProperty("--blob-size", "260px");
    };

    const handleLeave = () => {
      stage.style.setProperty("--blob-size", "0px");
    };

    stage.addEventListener("pointermove", handleMove);
    stage.addEventListener("pointerleave", handleLeave);

    return () => {
      stage.removeEventListener("pointermove", handleMove);
      stage.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div ref={stageRef} className="reveal-stage" data-reveal>
      <div className="reveal-back">
        <div className="reveal-back__title">Devouring details.</div>
        <p>
          Hover to reveal the signal beneath the surface. This portfolio is
          built for recruiters who care about craft, clarity, and impact.
        </p>
        <div className="reveal-back__list">
          {details.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="reveal-front">
        <p className="section-kicker">Hover reveal</p>
        <h2 className="section-title">Devouring the details that make it real.</h2>
        <p className="section-subtitle">
          Move your cursor across this field to expose the layers underneath.
          Every interaction is designed to feel tactile and intentional.
        </p>
      </div>
    </div>
  );
}
