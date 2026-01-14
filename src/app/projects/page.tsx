import ProjectsList from "@/components/portfolio/ProjectsList";
import Footer from "@/components/portfolio/Footer";
import { Link } from "next-view-transitions";

export default function ProjectsPage() {
  return (
    <>
      <main className="page-shell">
        <ProjectsList />
        <Link className="work-meta mt-10 inline-flex" href="/" data-magnet data-cursor="Home">
          Back home →
        </Link>
      </main>
      <Footer />
    </>
  );
}
