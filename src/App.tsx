import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Education } from "./sections/Education";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { AdminPanel } from "./components/AdminPanel";
import { CommandPalette } from "./components/CommandPalette";
import { CursorCompanion } from "./components/CursorCompanion";
import { ScrollExperience } from "./components/ScrollExperience";
import { ArcaneAtmosphere } from "./components/ArcaneAtmosphere";
import { usePortfolio } from "./context/PortfolioContext";
import { VisitorRating } from "./sections/VisitorRating";

export default function App() {
  usePortfolio();
  return (
    <>
      <ArcaneAtmosphere />
      <ScrollExperience />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <VisitorRating />
        <Contact />
      </main>
      <Footer />
      <AdminPanel />
      <CommandPalette />
      <CursorCompanion />
    </>
  );
}
