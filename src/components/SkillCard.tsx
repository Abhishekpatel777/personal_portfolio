type SkillCardProps = {
  number: string;
  title: string;
  description: string;
  skills: string[];
};

export function SkillCard({ number, title, description, skills }: SkillCardProps) {
  return (
    <article className="group rounded-[1.25rem] border border-border bg-surface/62 p-6 shadow-premium transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:bg-surface-hover/80">
      <div className="mb-8 flex items-start justify-between gap-5">
        <span className="font-mono text-xs font-semibold text-accent">{number}</span>
        <div className="h-px flex-1 translate-y-2 bg-border transition group-hover:bg-accent/40" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="mt-3 min-h-16 text-sm leading-6 text-text-secondary">{description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full border border-border bg-background/45 px-3 py-1.5 text-xs font-medium text-text-primary">
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}
