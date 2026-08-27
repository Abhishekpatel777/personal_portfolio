import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { EditContentButton } from "../components/EditContentButton";
import { ArcaneCardHat } from "../components/ArcaneCardHat";
import { EditorActions, EditorField, EditorFile, EditorInput } from "../components/InlineEditor";
import { usePortfolio } from "../context/PortfolioContext";
import type { EducationItem } from "../data/portfolio";

const blank = (): EducationItem => ({ id: crypto.randomUUID(), year: "", degree: "", field: "", institution: "", location: "", score: "", documentUrl: "" });

export function Education() {
  const { content, session, save } = usePortfolio();
  const [draft, setDraft] = useState<EducationItem | null>(null); const [busy, setBusy] = useState(false); const [status, setStatus] = useState("");
  async function persist() { if (!draft) return; setBusy(true); setStatus(""); try { const exists = content.education.some(i => i.id === draft.id); await save({ ...content, education: exists ? content.education.map(i => i.id === draft.id ? draft : i) : [...content.education, draft] }); setDraft(null); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Save failed"); } finally { setBusy(false); } }
  async function remove() { if (!draft) return; setBusy(true); try { await save({ ...content, education: content.education.filter(i => i.id !== draft.id) }); setDraft(null); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Delete failed"); } finally { setBusy(false); } }
  const isNew = draft && !content.education.some(i => i.id === draft.id);
  return <section id="education" className="section-pad border-y border-border bg-surface/24"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"><div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">Education</p><h2 className="text-3xl font-bold text-text-primary md:text-5xl">Academic foundation.</h2></div><div className="grid w-full items-stretch gap-5">
    {content.education.map((item, index) => draft?.id === item.id ? <EducationEditor key={item.id} draft={draft} setDraft={setDraft} busy={busy} status={status} onSave={persist} onCancel={() => setDraft(null)} onDelete={remove} /> : <article key={item.id} className={`relative w-full rounded-[1.25rem] border border-border bg-background/72 p-6 shadow-premium sm:p-8 ${index % 2 === 0 ? "arcane-hat-card" : ""}`}>{index % 2 === 0 && <ArcaneCardHat placement={session ? "safe-corner" : "corner"} />}{session && <div className="absolute right-4 top-4"><EditContentButton onClick={() => { setStatus(""); setDraft({ ...item }); }} /></div>}<p className="pr-20 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">{item.year}</p><h3 className="mt-4 text-2xl font-bold text-text-primary">{item.degree}</h3><p className="mt-2 text-lg text-text-secondary">{item.field}{item.score ? ` · ${item.score}` : ""}</p><div className="mt-7 border-t border-border pt-6"><p className="font-semibold text-text-primary">{item.institution}</p><p className="mt-1 text-text-secondary">{item.location}</p></div>{item.documentUrl && <a href={item.documentUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"><FileText className="h-4 w-4" />View degree / marksheet</a>}</article>)}
    {isNew && draft && <EducationEditor draft={draft} setDraft={setDraft} busy={busy} status={status} onSave={persist} onCancel={() => setDraft(null)} />}
    {session && !draft && <button onClick={() => { setStatus(""); setDraft(blank()); }} className="admin-add"><Plus className="h-4 w-4" />Add new education card</button>}
  </div></div></div></section>;
}

function EducationEditor({ draft, setDraft, busy, status, onSave, onCancel, onDelete }: { draft: EducationItem; setDraft: (v: EducationItem) => void; busy: boolean; status: string; onSave: () => void; onCancel: () => void; onDelete?: () => void }) {
  return <article className="rounded-[1.25rem] border border-accent/40 bg-background/72 p-6 shadow-premium sm:p-8"><div className="grid gap-4 sm:grid-cols-2">{(["year", "degree", "field", "institution", "location", "score"] as const).map(key => <EditorField key={key} label={key}><EditorInput value={draft[key]} onChange={(value) => setDraft({ ...draft, [key]: value })} /></EditorField>)}<div className="sm:col-span-2"><EditorFile label="Degree / marksheet PDF" value={draft.documentUrl} accept="application/pdf" onChange={(documentUrl) => setDraft({ ...draft, documentUrl })} /></div></div><EditorActions busy={busy} status={status} onSave={onSave} onCancel={onCancel} onDelete={onDelete} /></article>;
}
