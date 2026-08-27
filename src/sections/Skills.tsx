import { Plus } from "lucide-react";
import { useState } from "react";
import { EditorActions, EditorField, EditorInput, EditorList, EditorTextarea } from "../components/InlineEditor";
import { SectionHeading } from "../components/SectionHeading";
import { SkillCard } from "../components/SkillCard";
import { usePortfolio } from "../context/PortfolioContext";
import type { SkillGroup } from "../data/portfolio";

const blank = (): SkillGroup => ({ id: crypto.randomUUID(), title: "", description: "", skills: [] });

export function Skills() {
  const { content, session, save } = usePortfolio();
  const [draft, setDraft] = useState<SkillGroup | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function persist() { if (!draft) return; setBusy(true); setStatus(""); try { const clean = { ...draft, skills: draft.skills.map(item => item.trim()).filter(Boolean) }; const exists = content.skillGroups.some((item) => item.id === draft.id); await save({ ...content, skillGroups: exists ? content.skillGroups.map((item) => item.id === draft.id ? clean : item) : [...content.skillGroups, clean] }); setDraft(null); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Save failed"); } finally { setBusy(false); } }
  async function remove() { if (!draft) return; setBusy(true); try { await save({ ...content, skillGroups: content.skillGroups.filter((item) => item.id !== draft.id) }); setDraft(null); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Delete failed"); } finally { setBusy(false); } }

  return <section id="skills" className="section-pad"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"><SectionHeading eyebrow="Skills" title="A practical stack for building usable full-stack products." description="Organized around the technologies Abhishek uses to design interfaces, build APIs, manage data and collaborate on production-minded software." />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{content.skillGroups.map((group, index) => draft?.id === group.id ? <SkillEditor key={group.id} draft={draft} setDraft={setDraft} busy={busy} status={status} onSave={persist} onCancel={() => setDraft(null)} onDelete={remove} /> : <SkillCard key={group.id} {...group} number={String(index + 1).padStart(2, "0")} showArcaneHat={index % 3 === 0} onEdit={session ? () => { setStatus(""); setDraft({ ...group, skills: [...group.skills] }); } : undefined} />)}
      {draft && !content.skillGroups.some((item) => item.id === draft.id) && <SkillEditor draft={draft} setDraft={setDraft} busy={busy} status={status} onSave={persist} onCancel={() => setDraft(null)} />}
    </div>
    {session && !draft && <button onClick={() => { setStatus(""); setDraft(blank()); }} className="admin-add mt-6"><Plus className="h-4 w-4" />Add new skill card</button>}
  </div></section>;
}

function SkillEditor({ draft, setDraft, busy, status, onSave, onCancel, onDelete }: { draft: SkillGroup; setDraft: (value: SkillGroup) => void; busy: boolean; status: string; onSave: () => void; onCancel: () => void; onDelete?: () => void }) {
  return <article className="rounded-[1.25rem] border border-accent/40 bg-surface/70 p-6 shadow-premium"><div className="grid gap-4"><EditorField label="Card title"><EditorInput value={draft.title} onChange={(title) => setDraft({ ...draft, title })} placeholder="Frontend" /></EditorField><EditorField label="Description"><EditorTextarea value={draft.description} onChange={(description) => setDraft({ ...draft, description })} /></EditorField><EditorList label="Skills" values={draft.skills} onChange={(skills) => setDraft({ ...draft, skills })} addLabel="Add skill" placeholder="React.js" /></div><EditorActions busy={busy} status={status} onSave={onSave} onCancel={onCancel} onDelete={onDelete} /></article>;
}
