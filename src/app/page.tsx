import Link from "next/link";
import Hero from "@/components/portfolio/Hero";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Contact from "@/components/portfolio/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Mason Liu
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#projects">
              Projects
            </a>
            <a className="hover:text-slate-900" href="#skills">
              Skills
            </a>
            <a className="hover:text-slate-900" href="#experience">
              Experience
            </a>
            <a className="hover:text-slate-900" href="#contact">
              Contact
            </a>
          </nav>
          <Link
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
            href="/immersive"
          >
            Enter Immersive Mode
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16">
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <footer className="border-t border-slate-200/70 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-500">
          <span>© 2024 Mason Liu. All rights reserved.</span>
          <a className="font-medium text-slate-700 hover:text-slate-900" href="#hero">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
