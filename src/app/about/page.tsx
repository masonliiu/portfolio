import AboutContent from "@/components/portfolio/AboutContent";
import { Link } from "next-view-transitions";
import Footer from "@/components/portfolio/Footer";

export default function AboutPage() {
  return (
    <>
      <main className="page-shell">
        <AboutContent />
        <Link className="work-meta mt-10 inline-flex" href="/" data-magnet data-cursor="Home">
          Back home →
        </Link>
      </main>
      <Footer />
    </>
  );
}
