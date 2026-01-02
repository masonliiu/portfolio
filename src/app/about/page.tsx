import Link from "next/link";
import AboutContent from "@/components/portfolio/AboutContent";

export default function AboutPage() {
  return (
    <div className="page-shell max-w-5xl">
      <div className="scroll-blur" />
      <AboutContent />
      <Link
        className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]"
        href="/"
      >
        Back home
      </Link>
    </div>
  );
}
