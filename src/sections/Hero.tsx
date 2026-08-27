import { Activity, ArrowUpRight, Braces, ChevronRight, Code2, Layers3, MapPin, Sparkles, Terminal } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { EditContentButton } from "../components/EditContentButton";
import { EditorActions, EditorField, EditorFile, EditorInput } from "../components/InlineEditor";
import { SocialLinks } from "../components/SocialLinks";
import { usePortfolio } from "../context/PortfolioContext";

function WorkspaceVisual({ name, photoUrl, skillCount, projectCount }: { name: string; photoUrl: string; skillCount: number; projectCount: number }) {
  return <div className="hero-scroll-visual relative mx-auto grid w-full max-w-[35rem] grid-cols-2 gap-3">
    <div className="glass-panel relative col-span-2 overflow-hidden rounded-[1.7rem] border border-border/80 p-3">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
      <div className="overflow-hidden rounded-[1.25rem] border border-border/70 bg-background/70">
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3"><div className="flex gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" /><span className="h-2.5 w-2.5 rounded-full bg-green-400/80" /></div><span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-text-secondary"><Terminal className="h-3 w-3 text-accent" />workspace.tsx</span></div>
        {photoUrl ? <img src={photoUrl} alt={name} className="aspect-[16/11] w-full object-cover" /> : <div className="relative aspect-[16/11] p-5 font-mono text-xs sm:p-7 sm:text-sm"><div className="space-y-3"><p><span className="text-fuchsia-300">const</span> <span className="text-accent">developer</span> <span className="text-text-secondary">=</span> <span className="text-amber-200">&#123;</span></p><p className="pl-5"><span className="text-sky-200">name:</span> <span className="text-green-300">&quot;{name}&quot;</span>,</p><p className="pl-5"><span className="text-sky-200">craft:</span> <span className="text-green-300">&quot;Full-stack products&quot;</span>,</p><p className="pl-5"><span className="text-sky-200">mindset:</span> <span className="text-green-300">&quot;Build. Learn. Improve.&quot;</span></p><p className="text-amber-200">&#125;;</p></div><div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-accent/15 bg-accent/[0.06] px-4 py-3"><span className="text-[0.65rem] uppercase tracking-wider text-text-secondary">System status</span><span className="flex items-center gap-2 text-[0.68rem] font-semibold text-green-300"><span className="status-pulse h-2 w-2 rounded-full bg-green-400" />Ready to build</span></div></div>}
      </div>
    </div>
    <div className="glass-panel rounded-[1.35rem] border border-border/80 p-4 sm:p-5"><div className="flex items-center justify-between"><Layers3 className="h-5 w-5 text-accent" /><span className="font-mono text-[0.6rem] uppercase tracking-wider text-text-secondary">Toolkit</span></div><p className="mt-5 font-display text-3xl font-bold text-text-primary">{skillCount}<span className="text-accent">+</span></p><p className="mt-1 text-xs text-text-secondary">Technologies in the stack</p></div>
    <div className="glass-panel rounded-[1.35rem] border border-border/80 p-4 sm:p-5"><div className="flex items-center justify-between"><Activity className="h-5 w-5 text-accent" /><span className="font-mono text-[0.6rem] uppercase tracking-wider text-text-secondary">Shipped</span></div><p className="mt-5 font-display text-3xl font-bold text-text-primary">{projectCount.toString().padStart(2, "0")}</p><p className="mt-1 text-xs text-text-secondary">Projects documented</p></div>
    <div className="glass-panel col-span-2 flex items-center justify-between rounded-[1.35rem] border border-border/80 px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-green-400/10"><Sparkles className="h-5 w-5 text-green-300" /></div><div><p className="text-sm font-semibold text-text-primary">Open to meaningful opportunities</p><p className="mt-0.5 text-xs text-text-secondary">Full-stack · Frontend · Product engineering</p></div></div><ArrowUpRight className="h-5 w-5 text-accent" /></div>
  </div>;
}

export function Hero() {
  const { content, session, save } = usePortfolio();
  const { profile } = content;
  const [draft, setDraft] = useState(profile); const [editing, setEditing] = useState(false); const [busy, setBusy] = useState(false); const [status, setStatus] = useState("");
  const skillCount = new Set(content.skillGroups.flatMap(group => group.skills)).size;
  const techTicker = content.skillGroups.flatMap(group => group.skills).slice(0, 12);
  async function persist() { setBusy(true); setStatus(""); try { await save({ ...content, profile: draft }); setEditing(false); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Save failed"); } finally { setBusy(false); } }

  return <section id="top" className="relative overflow-hidden pt-28 sm:pt-32"><div className="subtle-grid absolute inset-0 -z-10" /><div className="pointer-events-none absolute left-[8%] top-44 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[110px]" />
    <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-14 px-5 pb-16 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-8">
      <div className="reveal max-w-3xl">{editing ? <div className="glass-panel rounded-[1.5rem] border border-accent/40 p-5 sm:p-6"><p className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-accent">Edit profile</p><div className="grid gap-4 sm:grid-cols-2">{(["name", "role", "location", "email", "linkedin", "github"] as const).map(key => <EditorField key={key} label={key}><EditorInput value={draft[key]} onChange={(value) => setDraft({ ...draft, [key]: value })} /></EditorField>)}<div className="sm:col-span-2"><EditorFile label="Profile photo" value={draft.photoUrl} accept="image/*" onChange={(photoUrl) => setDraft({ ...draft, photoUrl })} /></div><div className="sm:col-span-2"><EditorFile label="Resume PDF" value={draft.resumeUrl} accept="application/pdf" onChange={(resumeUrl) => setDraft({ ...draft, resumeUrl })} /></div></div><EditorActions busy={busy} status={status} onSave={persist} onCancel={() => { setDraft(profile); setEditing(false); }} /></div> : <>
        <div className="mb-6 flex flex-wrap items-center gap-3">{session && <EditContentButton onClick={() => { setDraft(profile); setStatus(""); setEditing(true); }} label="Edit profile" />}<div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3 py-1.5 font-mono text-[0.67rem] font-semibold uppercase tracking-widest text-accent"><Braces className="h-3.5 w-3.5" />{profile.role}</div></div>
        <h1 className="text-balance font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.055em] text-text-primary sm:text-6xl lg:text-[4.55rem]">I turn ideas into <span className="gradient-text">digital products.</span></h1>
        <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-text-secondary sm:text-lg">Full-stack developer crafting thoughtful interfaces, reliable APIs and scalable product experiences—from first idea to deployment.</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-text-secondary"><MapPin className="h-4 w-4 text-accent" />{profile.location}<span className="mx-1 text-border">/</span><span className="text-green-300">Available</span></div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="#projects">Explore my work</Button><Button href="#contact" variant="secondary">Start a conversation</Button></div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><span className="inline-flex items-center gap-1 font-mono text-[0.67rem] font-semibold uppercase tracking-wider text-text-secondary">Find me online <ChevronRight className="h-3.5 w-3.5" /></span><SocialLinks /></div>
      </>}</div>
      <div className="reveal delay-150"><WorkspaceVisual name={profile.name} photoUrl={profile.photoUrl} skillCount={skillCount} projectCount={content.projects.length} /></div>
    </div>
    {techTicker.length > 0 && <div className="overflow-hidden border-y border-border/60 bg-surface/[0.18] py-3"><div className="marquee-track flex w-max items-center">{[...techTicker, ...techTicker].map((tech, index) => <span key={`${tech}-${index}`} className="flex items-center gap-5 px-5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-secondary"><Code2 className="h-3.5 w-3.5 text-accent/70" />{tech}</span>)}</div></div>}
  </section>;
}
