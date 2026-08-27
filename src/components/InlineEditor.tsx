import { Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useState, type ChangeEvent, type ReactNode } from "react";
import { usePortfolio } from "../context/PortfolioContext";

export const editorInput = "w-full rounded-xl border border-border bg-background/85 px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent";

export function EditorField({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`grid gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary ${className}`}><span>{label}</span>{children}</label>;
}

export function EditorInput({ value, onChange, placeholder = "", type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input className={editorInput} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

export function EditorTextarea({ value, onChange, rows = 3, placeholder = "" }: { value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }) {
  return <textarea className={`${editorInput} resize-y`} rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

export function EditorFile({ label, value, accept, onChange }: { label: string; value: string; accept: string; onChange: (url: string) => void }) {
  const { upload } = usePortfolio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try { onChange(await upload(file)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Upload failed"); } finally { setBusy(false); }
  }
  return <EditorField label={label}><div className="flex flex-col gap-2 sm:flex-row"><EditorInput value={value} onChange={onChange} placeholder="File URL" /><label className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent/40 px-4 text-sm normal-case tracking-normal text-accent hover:bg-accent/10"><Upload className="h-4 w-4" />{busy ? "Uploading…" : "Upload"}<input className="sr-only" type="file" accept={accept} onChange={choose} disabled={busy} /></label></div>{error && <span className="normal-case tracking-normal text-red-400">{error}</span>}</EditorField>;
}

export function EditorList({ label, values, onChange, addLabel = "Add item", placeholder = "" }: { label: string; values: string[]; onChange: (values: string[]) => void; addLabel?: string; placeholder?: string }) {
  return <div className="grid gap-3"><p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</p>{values.length === 0 && <p className="rounded-xl border border-dashed border-border p-3 text-sm text-text-secondary">No items added yet.</p>}{values.map((value, index) => <div key={index} className="flex items-center gap-2"><input className={editorInput} value={value} placeholder={placeholder} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /><button type="button" aria-label={`Remove ${label} ${index + 1}`} onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/25 text-red-400 hover:bg-red-400/10"><Trash2 className="h-4 w-4" /></button></div>)}<button type="button" onClick={() => onChange([...values, ""])} className="inline-flex w-fit items-center gap-2 rounded-xl border border-dashed border-accent/45 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10"><Plus className="h-4 w-4" />{addLabel}</button></div>;
}

export function EditorActions({ onSave, onCancel, onDelete, busy = false, status = "" }: { onSave: () => void; onCancel: () => void; onDelete?: () => void; busy?: boolean; status?: string }) {
  return <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5"><button type="button" disabled={busy} onClick={onSave} className="admin-primary"><Save className="h-4 w-4" />{busy ? "Saving…" : "Save"}</button><button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary"><X className="h-4 w-4" />Cancel</button>{onDelete && <button type="button" onClick={onDelete} className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/10"><Trash2 className="h-4 w-4" />Delete</button>}{status && <span className={`w-full text-sm ${status.includes("Saved") ? "text-green-400" : "text-red-400"}`}>{status}</span>}</div>;
}

export const splitComma = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
export const splitLines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
