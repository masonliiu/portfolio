const beats = [
  {
    title: "Signal",
    detail: "Short, high-impact summaries that show what the work actually does.",
  },
  {
    title: "System",
    detail: "Architecture decisions, performance trade-offs, and scaling notes.",
  },
  {
    title: "Surface",
    detail: "Motion, interaction, and deliberate visual rhythm that supports clarity.",
  },
  {
    title: "Story",
    detail: "A narrative arc that guides recruiters from context to outcomes.",
  },
];

export default function HorizontalRail() {
  return (
    <section className="section-block" data-horizontal>
      <div className="horizontal-pin">
        <div className="horizontal-intro">
          <p className="section-kicker">How I build</p>
          <h2 className="section-title">A scroll-driven studio reel.</h2>
          <p className="section-subtitle">
            This horizontal sequence is scrubbed by your scroll. Each chapter is
            a quick hit of how I think and ship.
          </p>
        </div>
        <div className="horizontal-track" data-horizontal-track>
          {beats.map((beat, index) => (
            <div key={beat.title} className="horizontal-panel">
              <span className="work-meta">0{index + 1}</span>
              <h3>{beat.title}</h3>
              <p>{beat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
