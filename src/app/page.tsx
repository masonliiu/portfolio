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

        <FeaturedProjects />

        <section className="grid gap-6 md:grid-cols-4 lg:grid-cols-6">
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
