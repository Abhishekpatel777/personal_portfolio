import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/portfolio";

const links = [
  { label: "GitHub", href: profile.github, Icon: Github },
  { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin },
  { label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
];

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className={`group inline-flex items-center gap-2 rounded-full border border-border bg-surface/55 text-sm font-semibold text-text-secondary transition hover:-translate-y-0.5 hover:border-accent/45 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
            compact ? "p-3" : "px-4 py-2.5"
          }`}
        >
          <Icon aria-hidden="true" className="h-4 w-4 transition group-hover:text-accent" />
          {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
        </a>
      ))}
    </div>
  );
}
