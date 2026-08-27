import { Plus } from "lucide-react";
import { useState } from "react";
import { EditContentButton } from "../components/EditContentButton";
import { EditorActions, EditorField, EditorInput, EditorList } from "../components/InlineEditor";
import { SectionHeading } from "../components/SectionHeading";
import { usePortfolio } from "../context/PortfolioContext";
import type { ExperienceItem } from "../data/portfolio";

const blank = (): ExperienceItem => ({ id: crypto.randomUUID(), role: "", company: "", location: "", duration: "", responsibilities: [] });

export function Experience() {
  const { content, session, save } = usePortfolio();
  const [draft, setDraft] = useState<ExperienceItem | null>(null);
  const [busy, setBusy] = useState(false); const [status, setStatus] = useState("");
  async function persist() { if (!draft) return; setBusy(true); setStatus(""); try { const clean = { ...draft, responsibilities: draft.responsibilities.map(item => item.trim()).filter(Boolean) }; const exists = content.experiences.some(i => i.id === draft.id); await save({ ...content, experiences: exists ? content.experiences.map(i => i.id === draft.id ? clean : i) : [...content.experiences, clean] }); setDraft(null); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Save failed"); } finally { setBusy(false); } }
  async function remove() { if (!draft) return; setBusy(true); try { await save({ ...content, experiences: content.experiences.filter(i => i.id !== draft.id) }); setDraft(null); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Delete failed"); } finally { setBusy(false); } }
  const isNew = draft && !content.experiences.some(i => i.id === draft.id);

  return <section id="experience" className="section-pad border-y border-border bg-surface/24"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"><SectionHeading eyebrow="Experience" title="Focused on real-world software development." /><div className="mx-auto grid max-w-4xl gap-5">
    {content.experiences.map((item) => draft?.id === item.id ? <ExperienceEditor key={item.id} draft={draft} setDraft={setDraft} busy={busy} status={status} onSave={persist} onCancel={() => setDraft(null)} onDelete={remove} /> : <article key={item.id} className="relative rounded-[1.25rem] border border-border bg-background/72 p-6 shadow-premium sm:p-8">{session && <div className="absolute right-4 top-4"><EditContentButton onClick={() => { setStatus(""); setDraft({ ...item, responsibilities: [...item.responsibilities] }); }} /></div>}<div className="relative border-l border-border pl-6 sm:pl-8"><span className="absolute -left-[0.45rem] top-1 h-3.5 w-3.5 rounded-full border-4 border-background bg-accent" /><p className="pr-20 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">{item.duration}</p><h3 className="mt-3 text-2xl font-bold text-text-primary">{item.role}</h3><p className="mt-2 text-text-secondary">{item.company} · {item.location}</p><div className="mt-7 rounded-2xl border border-border bg-surface/45 p-5"><ul className="space-y-3 text-sm leading-7 text-text-secondary">{item.responsibilities.map((responsibility) => <li key={responsibility} className="flex gap-3"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span>{responsibility}</span></li>)}</ul></div></div></article>)}
    {isNew && draft && <ExperienceEditor draft={draft} setDraft={setDraft} busy={busy} status={status} onSave={persist} onCancel={() => setDraft(null)} />}
    {session && !draft && <button onClick={() => { setStatus(""); setDraft(blank()); }} className="admin-add"><Plus className="h-4 w-4" />Add new experience</button>}
  </div></div></section>;
}

function ExperienceEditor({ draft, setDraft, busy, status, onSave, onCancel, onDelete }: { draft: ExperienceItem; setDraft: (v: ExperienceItem) => void; busy: boolean; status: string; onSave: () => void; onCancel: () => void; onDelete?: () => void }) {
  return <article className="rounded-[1.25rem] border border-accent/40 bg-background/72 p-6 shadow-premium sm:p-8"><div className="grid gap-4 sm:grid-cols-2">{(["role", "company", "location", "duration"] as const).map(key => <EditorField key={key} label={key}><EditorInput value={draft[key]} onChange={(value) => setDraft({ ...draft, [key]: value })} /></EditorField>)}<div className="sm:col-span-2"><EditorList label="Responsibilities" values={draft.responsibilities} onChange={(responsibilities) => setDraft({ ...draft, responsibilities })} addLabel="Add responsibility" placeholder="Describe your work" /></div></div><EditorActions busy={busy} status={status} onSave={onSave} onCancel={onCancel} onDelete={onDelete} /></article>;
}
