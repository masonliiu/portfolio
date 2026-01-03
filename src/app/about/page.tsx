import AboutContent from "@/components/portfolio/AboutContent";
import { Link } from "next-view-transitions";

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="scroll-blur" />
      <AboutContent />
      <Link
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)] clickable"
        href="/"
      >
        Back home
      </Link>
    </div>
  );
}
