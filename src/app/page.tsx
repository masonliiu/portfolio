import BackgroundEffect from "@/components/portfolio/BackgroundEffect";
import TerminalHeader from "@/components/portfolio/TerminalHeader";
import Hero from "@/components/portfolio/Hero";
import ProjectsTeaser from "@/components/portfolio/ProjectsTeaser";
import ThemePanel from "@/components/portfolio/ThemePanel";
import ConnectForm from "@/components/portfolio/ConnectForm";
import LocationCard from "@/components/portfolio/LocationCard";
import ClickCounter from "@/components/portfolio/ClickCounter";
import GitHubActivity from "@/components/portfolio/GitHubActivity";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffect />
      <TerminalHeader />
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <Hero />

        <ProjectsTeaser />

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ThemePanel />
          <ConnectForm />
          <LocationCard />
          <ClickCounter />
          <GitHubActivity />
        </section>
      </main>
      <Footer />
    </div>
  );
}
