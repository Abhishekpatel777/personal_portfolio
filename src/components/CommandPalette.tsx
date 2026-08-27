import { BriefcaseBusiness, FileDown, Github, GraduationCap, Mail, Search, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { usePortfolio } from "../context/PortfolioContext";

type CommandItem = { label: string; hint: string; href: string; Icon: ComponentType<{ className?: string }> };

export function CommandPalette() {
  const { content: { profile } } = usePortfolio();
  const [open, setOpen] = useState(false); const [query, setQuery] = useState("");
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(value => !value); } if (event.key === "Escape") setOpen(false); };
    const custom = () => setOpen(true);
    window.addEventListener("keydown", keyboard); window.addEventListener("open-command-palette", custom);
    return () => { window.removeEventListener("keydown", keyboard); window.removeEventListener("open-command-palette", custom); };
  }, []);
  useEffect(() => { if (!open) setQuery(""); }, [open]);
  const commands: CommandItem[] = [{ label: "About Abhishek", hint: "Profile & story", href: "#about", Icon: UserRound }, { label: "View projects", hint: "Selected full-stack work", href: "#projects", Icon: BriefcaseBusiness }, { label: "Explore skills", hint: "Tools & technologies", href: "#skills", Icon: Sparkles }, { label: "Education", hint: "Academic foundation", href: "#education", Icon: GraduationCap }, { label: "Send an email", hint: profile.email, href: `mailto:${profile.email}`, Icon: Mail }, { label: "Open GitHub", hint: "Source code & activity", href: profile.github, Icon: Github }, { label: "Download résumé", hint: "PDF document", href: profile.resumeUrl, Icon: FileDown }];
  const filtered = useMemo(() => commands.filter(item => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase())), [query, profile]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-md" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl border border-border shadow-premium"><div className="flex items-center gap-3 border-b border-border px-4"><Search className="h-5 w-5 text-accent" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Where do you want to go?" className="h-16 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary" /><button onClick={() => setOpen(false)} className="rounded-lg border border-border p-1.5 text-text-secondary hover:text-text-primary"><X className="h-4 w-4" /></button></div><div className="max-h-[26rem] overflow-y-auto p-2">{filtered.map(({ label, hint, href, Icon }) => <a key={label} href={href} onClick={() => setOpen(false)} className="group flex items-center gap-4 rounded-xl p-3 transition hover:bg-surface-hover/75"><span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background/70 text-text-secondary transition group-hover:border-accent/30 group-hover:text-accent"><Icon className="h-4 w-4" /></span><span className="flex-1"><span className="block text-sm font-semibold text-text-primary">{label}</span><span className="mt-0.5 block text-xs text-text-secondary">{hint}</span></span><span className="font-mono text-xs text-text-secondary opacity-0 transition group-hover:opacity-100">↵</span></a>)}{filtered.length === 0 && <p className="p-8 text-center text-sm text-text-secondary">No command found.</p>}</div><div className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wider text-text-secondary"><span>Quick navigation</span><span>ESC to close</span></div></div></div>;
}
