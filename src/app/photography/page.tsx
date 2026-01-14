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
          <div className="space-y-6">
            <p className="section-kicker">Photography</p>
            <h1 className="section-title">Visual studies in light and motion.</h1>
            <p className="section-subtitle">
              This gallery is in progress. The plan is to publish curated sets of
              portraits, street scenes, and motion experiments that mirror the
              way I think about rhythm in digital experiences.
            </p>
          </div>
          <div className="photo-strip mt-10">
            {photographyStudies.map((label) => (
              <div key={label} className="photo-frame">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
        <Link className="work-meta inline-flex" href="/">
          Back home →
        </Link>
      </main>
      <Footer />
    </>
  );
}
