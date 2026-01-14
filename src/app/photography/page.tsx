import { Link } from "next-view-transitions";
import Footer from "@/components/portfolio/Footer";

export default function PhotographyPage() {
  return (
    <>
      <main className="page-shell">
        <section className="section-block" data-reveal>
          <div className="section-center space-y-6">
            <p className="section-kicker">Photography</p>
            <h1 className="section-title outline-fill" data-fill data-blob-target>
              Studies.
            </h1>
            <p className="section-subtitle">
              Portraits, street frames, and motion experiments.
            </p>
          </div>
          <div className="image-collage" aria-hidden="true">
            <div className="image-card image-card--wide" />
            <div className="image-card image-card--portrait" />
            <div className="image-card image-card--small" />
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
