import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/Button";
import { ProjectCard } from "../components/ProjectCard";
import { SectionHeading } from "../components/SectionHeading";
import { featuredProject, otherProjects } from "../data/portfolio";

function ProjectPreview() {
  return (
    <div className="group relative overflow-hidden rounded-[1.35rem] border border-border bg-background shadow-premium transition duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-red-400/75" />
          <span className="h-3 w-3 rounded-full bg-yellow-300/75" />
          <span className="h-3 w-3 rounded-full bg-accent/75" />
        </div>
        <span className="font-mono text-[0.68rem] font-semibold uppercase text-text-secondary">hospital.app</span>
      </div>
      <div className="aspect-[16/11] overflow-hidden p-4 sm:p-6">
        <div className="h-full rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(93,176,255,0.16),rgba(255,255,255,0.025)_45%,rgba(255,255,255,0.06))] p-4 transition duration-300 group-hover:scale-[1.01] sm:p-6">
          <div className="grid h-full grid-rows-[auto_1fr] gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="h-2 w-28 rounded-full bg-accent/80" />
                <div className="mt-3 h-2 w-44 rounded-full bg-white/14" />
              </div>
              <div className="h-9 w-24 rounded-full border border-accent/35 bg-accent/14" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-xl border border-white/10 bg-background/70 p-4">
                <div className="mb-4 h-28 rounded-lg border border-border bg-surface/70" />
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-white/18" />
                  <div className="h-2 w-4/5 rounded-full bg-white/10" />
                  <div className="h-2 w-2/3 rounded-full bg-accent/55" />
                </div>
              </div>
              <div className="grid gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-background/58 p-3">
                    <div className="h-2 w-16 rounded-full bg-accent/55" />
                    <div className="mt-3 h-2 rounded-full bg-white/12" />
                    <div className="mt-2 h-2 w-2/3 rounded-full bg-white/8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section-pad">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Built to show real product thinking across the stack."
          description="The featured project highlights frontend, backend, API integration, database operations, state management and responsive UI work."
        />
        <article className="grid gap-8 rounded-[1.5rem] border border-border bg-surface/52 p-4 shadow-premium sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <ProjectPreview />
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">{featuredProject.label}</p>
            <h3 className="mt-4 text-3xl font-bold text-text-primary md:text-5xl">{featuredProject.title}</h3>
            <p className="mt-5 text-base leading-8 text-text-secondary">{featuredProject.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredProject.tech.map((item) => (
                <span key={item} className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs font-semibold text-text-primary">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {featuredProject.features.map((feature) => (
                <div key={feature} className="flex gap-3 text-sm leading-6 text-text-secondary">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={featuredProject.liveDemo}>Live Demo</Button>
              <Button href={featuredProject.github} variant="secondary">GitHub</Button>
            </div>
          </div>
        </article>
        <div className="mt-16">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">More work</p>
              <h3 className="mt-3 text-2xl font-bold text-text-primary">Project placeholders</h3>
            </div>
            <p className="hidden max-w-md text-right text-sm leading-6 text-text-secondary md:block">Replace these with verified projects when you are ready to publish.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {otherProjects.map((project, index) => (
              <ProjectCard key={`${project.title}-${index}`} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
