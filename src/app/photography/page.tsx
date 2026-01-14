import { Link } from "next-view-transitions";
import Footer from "@/components/portfolio/Footer";

const photographyStudies = [
  "Street portrait series",
  "Late-night reflections",
  "Motion blur experiments",
  "Studio light tests",
  "City geometry",
  "Golden hour archive",
];

export default function PhotographyPage() {
  return (
    <>
      <main className="page-shell">
        <section className="section-block" data-reveal>
          <div className="section-center space-y-6">
            <p className="section-kicker">Photography</p>
            <h1 className="section-title">Visual studies in light and motion.</h1>
            <p className="section-subtitle">
              A curated set of portraits, street scenes, and motion experiments
              that mirror how I think about rhythm in digital experiences.
            </p>
          </div>
          <div className="photo-strip mt-10">
            {photographyStudies.map((label) => (
              <div key={label} className="photo-frame" data-magnet data-cursor="View">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
        <Link className="work-meta inline-flex" href="/" data-magnet data-cursor="Home">
          Back home →
        </Link>
      </main>
      <Footer />
    </>
  );
}
