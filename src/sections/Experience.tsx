import { SectionHeading } from "../components/SectionHeading";
import { experience } from "../data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="section-pad border-y border-border bg-surface/24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Experience" title="Focused on real-world software development." />
        <div className="mx-auto max-w-4xl rounded-[1.25rem] border border-border bg-background/72 p-6 shadow-premium sm:p-8">
          <div className="relative border-l border-border pl-6 sm:pl-8">
            <span className="absolute -left-[0.45rem] top-1 h-3.5 w-3.5 rounded-full border-4 border-background bg-accent" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">{experience.duration}</p>
            <h3 className="mt-3 text-2xl font-bold text-text-primary">{experience.role}</h3>
            <p className="mt-2 text-text-secondary">{experience.company} · {experience.location}</p>
            <div className="mt-7 rounded-2xl border border-border bg-surface/45 p-5">
              <ul className="space-y-3 text-sm leading-7 text-text-secondary">
                {experience.responsibilities.map((responsibility) => (
                  <li key={responsibility} className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
