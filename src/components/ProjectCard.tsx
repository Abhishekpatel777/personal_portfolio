import { ArrowUpRight } from "lucide-react";
import { Button } from "./Button";
import { EditContentButton } from "./EditContentButton";
import { ArcaneCardHat } from "./ArcaneCardHat";

type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  liveDemo: string;
  github: string;
  imageUrl?: string;
  onEdit?: () => void;
  showArcaneHat?: boolean;
};

export function ProjectCard({ title, description, tech, liveDemo, github, imageUrl, onEdit, showArcaneHat = false }: ProjectCardProps) {
  return (
    <article className={`group relative overflow-visible rounded-[1.25rem] border border-border bg-surface/65 transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:bg-surface-hover/80 ${showArcaneHat ? "arcane-hat-card" : ""}`}>
      {showArcaneHat && <ArcaneCardHat placement="left-corner" />}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1.2rem] border-b border-border bg-background">
        {onEdit && <div className="absolute right-3 top-3 z-10"><EditContentButton onClick={onEdit} /></div>}
        {imageUrl ? <img src={imageUrl} alt={`${title} preview`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : <><div className="absolute inset-4 rounded-xl border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))] transition duration-300 group-hover:scale-[1.015]" /><div className="absolute left-8 top-8 h-2 w-20 rounded-full bg-accent/80" /><div className="absolute bottom-8 left-8 right-8 grid gap-2">
          <div className="h-2 rounded-full bg-white/18" />
          <div className="h-2 w-2/3 rounded-full bg-white/10" />
        </div></>}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-5">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-accent transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((item) => (
            <span key={item} className="font-mono text-[0.7rem] font-semibold uppercase text-text-secondary">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {liveDemo && <Button href={liveDemo} target="_blank" rel="noreferrer" variant="secondary">Live Demo</Button>}
          {github && <Button href={github} target="_blank" rel="noreferrer" variant="ghost">GitHub</Button>}
        </div>
      </div>
    </article>
  );
}
