import { useEffect, useState } from "react";
import { EditContentButton } from "../components/EditContentButton";
import { EditorActions, EditorField, EditorTextarea, splitLines } from "../components/InlineEditor";
import { usePortfolio } from "../context/PortfolioContext";

export function About() {
  const { content, save } = usePortfolio();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content.about.join("\n"));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => setDraft(content.about.join("\n")), [content.about]);
  async function persist() { setBusy(true); setStatus(""); try { await save({ ...content, about: splitLines(draft) }); setEditing(false); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Save failed"); } finally { setBusy(false); } }

  return <section id="about" className="section-pad border-t border-border"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"><div><p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">About</p><h2 className="text-3xl font-bold text-text-primary md:text-5xl">About Me</h2>{!editing && <div className="mt-5"><EditContentButton onClick={() => setEditing(true)} label="Edit about" /></div>}</div>
    {editing ? <div className="rounded-[1.25rem] border border-accent/35 bg-surface/65 p-5 shadow-premium"><EditorField label="About paragraphs (one paragraph per line)"><EditorTextarea rows={8} value={draft} onChange={setDraft} /></EditorField><EditorActions busy={busy} status={status} onSave={persist} onCancel={() => { setDraft(content.about.join("\n")); setEditing(false); }} /></div> : <div className="max-w-3xl text-lg leading-9 text-text-secondary">{content.about.map((paragraph, index) => <p key={`${paragraph}-${index}`} className={index ? "mt-6" : ""}>{paragraph}</p>)}</div>}
  </div></section>;
}
