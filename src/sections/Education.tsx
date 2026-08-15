export function Education() {
  return (
    <section className="section-pad border-y border-border bg-surface/24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">Education</p>
            <h2 className="text-3xl font-bold text-text-primary md:text-5xl">Academic foundation.</h2>
          </div>
          <div className="rounded-[1.25rem] border border-border bg-background/72 p-6 shadow-premium sm:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">2024</p>
            <h3 className="mt-4 text-2xl font-bold text-text-primary">Bachelor of Technology (B.Tech)</h3>
            <p className="mt-2 text-lg text-text-secondary">Information Technology</p>
            <div className="mt-7 border-t border-border pt-6">
              <p className="font-semibold text-text-primary">Acropolis Institute of Technology and Research</p>
              <p className="mt-1 text-text-secondary">Indore</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
