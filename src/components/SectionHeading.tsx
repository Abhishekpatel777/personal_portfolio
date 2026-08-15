type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
      <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-bold text-text-primary md:text-5xl">{title}</h2>
      {description ? <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-8 text-text-secondary">{description}</p> : null}
    </div>
  );
}
