export function About() {
  return (
    <section id="about" className="section-pad border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">About</p>
          <h2 className="text-3xl font-bold text-text-primary md:text-5xl">About Me</h2>
        </div>
        <div className="max-w-3xl text-lg leading-9 text-text-secondary">
          <p>
            I'm a Jr. MERN Stack Developer with hands-on experience building modern, responsive and scalable web applications.
          </p>
          <p className="mt-6">
            I work across frontend and backend development, with a strong focus on React, TypeScript, Node.js, Express.js, REST APIs and databases.
          </p>
          <p className="mt-6">
            I also work with Python and FastAPI and am continuously expanding my knowledge toward AI/ML and intelligent software applications.
          </p>
        </div>
      </div>
    </section>
  );
}
