import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "../components/Button";
import { SocialLinks } from "../components/SocialLinks";
import { profile } from "../data/portfolio";

function EditorVisual() {
  const rows = [
    ["const", "developer", "=", "Abhishek"],
    ["stack", "React", "TypeScript", "Node"],
    ["build", "APIs", "UI", "Data"],
    ["focus", "Clean", "Scalable", "Fast"],
  ];

  return (
    <div className="hero-visual relative mx-auto w-full max-w-[34rem] rounded-[1.5rem] border border-border bg-surface/72 p-3 shadow-premium">
      <div className="rounded-[1.1rem] border border-border bg-background/85">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-300/80" />
            <span className="h-3 w-3 rounded-full bg-accent/80" />
          </div>
          <span className="font-mono text-[0.68rem] font-semibold uppercase text-text-secondary">portfolio.tsx</span>
        </div>
        <div className="grid gap-3 p-4 sm:p-6">
          {rows.map((row, index) => (
            <div key={row.join("-")} className="grid grid-cols-[1.5rem_1fr] gap-3 font-mono text-xs sm:text-sm">
              <span className="text-text-secondary/60">{index + 1}</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {row.map((item, itemIndex) => (
                  <span key={`${item}-${itemIndex}`} className={itemIndex === 0 ? "text-accent" : "text-text-primary/88"}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 rounded-xl border border-border bg-surface/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[0.68rem] font-semibold uppercase text-text-secondary">Build Status</span>
              <span className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-white/14" />
              <div className="h-2 w-4/5 rounded-full bg-accent/60" />
              <div className="h-2 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      <div className="subtle-grid absolute inset-0 -z-10" />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="reveal max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 font-mono text-xs font-semibold uppercase text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {profile.role}
          </div>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-text-primary sm:text-6xl lg:text-7xl">
            Building modern web experiences that solve real problems.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-text-secondary sm:text-lg">
            I build responsive, scalable web applications using React, TypeScript, Node.js and modern backend technologies.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-text-secondary">
            <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
            {profile.location}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#projects">View Projects</Button>
            <Button href="#contact" variant="secondary">Let's Connect</Button>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase text-text-secondary">
              Connect <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <SocialLinks />
          </div>
        </div>
        <div className="reveal delay-150">
          <EditorVisual />
        </div>
      </div>
    </section>
  );
}
