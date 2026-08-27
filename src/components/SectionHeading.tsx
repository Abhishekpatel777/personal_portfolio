type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading mx-auto mb-12 max-w-3xl text-center md:mb-16">
      <div className="mb-5 inline-flex items-center gap-3"><span className="h-px w-7 bg-gradient-to-r from-transparent to-accent" /><p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p><span className="h-px w-7 bg-gradient-to-r from-accent to-transparent" /></div>
      <h2 className="text-balance font-display text-3xl font-bold tracking-[-0.035em] text-text-primary md:text-5xl">{title}</h2>
      {description ? <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-8 text-text-secondary">{description}</p> : null}
    </div>
  );
}
