import { Button } from "../components/Button";
import { usePortfolio } from "../context/PortfolioContext";

export function Contact() {
  const { content: { profile } } = usePortfolio();
  return (
    <section id="contact" className="section-pad flex min-h-[calc(100svh-5rem)] items-center">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">Contact</p>
        <h2 className="text-balance text-4xl font-extrabold text-text-primary md:text-6xl">Let's build something meaningful.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-text-secondary sm:text-lg">
          I'm open to opportunities where I can contribute, learn and grow as a software engineer.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={`mailto:${profile.email}`}>Email Me</Button>
          <Button href={profile.linkedin} variant="secondary">LinkedIn</Button>
          <Button href={profile.github} variant="secondary">GitHub</Button>
        </div>
      </div>
    </section>
  );
}
