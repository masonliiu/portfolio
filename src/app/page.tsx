import BackgroundEffect from "@/components/portfolio/BackgroundEffect";
import Hero from "@/components/portfolio/Hero";
import FeaturedProjects from "@/components/portfolio/FeaturedProjects";
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
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-8 py-14">
        <Hero />

        <FeaturedProjects />

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
