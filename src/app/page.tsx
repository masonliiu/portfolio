import BackgroundEffect from "@/components/portfolio/BackgroundEffect";
import Hero from "@/components/portfolio/Hero";
import FeaturedProjects from "@/components/portfolio/FeaturedProjects";
import ThemePanel from "@/components/portfolio/ThemePanel";
import ConnectForm from "@/components/portfolio/ConnectForm";
import LocationCard from "@/components/portfolio/LocationCard";
import ClickCounter from "@/components/portfolio/ClickCounter";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import ContributionGraph from "@/components/portfolio/ContributionGraph";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffect />
      <div className="scroll-blur" />
      <main className="page-shell relative z-10 flex flex-col gap-12">
        <Hero />

        <section className="terminal-card flex flex-col gap-4 p-5">
          <div className="terminal-title">About</div>
          <p className="text-base text-[var(--color-subtext0)]">
            CS student at UTD focused on full-stack development and game
            development. Building projects that are clean, fast, and thoughtful
            to use.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-subtext1)]">
            <a href="https://github.com/masonliiu" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="mailto:liumasn@gmail.com">Email</a>
            <a href="https://instagram.com/mason_liuu" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
          <a
            href="/about"
            className="more-link text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-subtext1)]"
          >
            More about me
            <span className="more-link__arrow">→</span>
          </a>
        </section>

        <FeaturedProjects />

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <ThemePanel />
          </div>
          <div className="lg:col-span-2">
            <ConnectForm />
          </div>
          <div className="lg:col-span-2">
            <LocationCard />
          </div>
          <div className="lg:col-span-6">
            <ClickCounter />
          </div>
          <div className="lg:col-span-6">
            <GitHubActivity />
          </div>
          <div className="lg:col-span-6">
            <ContributionGraph />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
