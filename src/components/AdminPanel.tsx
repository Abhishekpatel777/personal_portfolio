import { LogIn, LogOut, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { EditorField, EditorInput } from "./InlineEditor";

export function AdminPanel() {
  const { session, configured, signIn, signOut } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  async function login() {
    setBusy(true); setError("");
    try { await signIn(email, password); setOpen(false); setPassword(""); } catch (reason) { setError(reason instanceof Error ? reason.message : "Sign in failed"); } finally { setBusy(false); }
  }

  return <>
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2">
      {session ? <><span className="hidden rounded-full border border-green-400/30 bg-background/90 px-3 py-2 text-xs font-bold text-green-400 backdrop-blur sm:block">Editing enabled</span><button onClick={() => signOut()} className="admin-fab"><LogOut className="h-4 w-4" />Sign out</button></> : <button onClick={() => setOpen(true)} className="admin-fab"><Pencil className="h-4 w-4" />Admin</button>}
    </div>
    {open && !session && <div className="admin-overlay"><div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-premium">
      <div className="flex items-center justify-between"><div><p className="font-mono text-xs uppercase tracking-widest text-accent">Private access</p><h2 className="mt-1 text-xl font-bold">Admin sign in</h2></div><button onClick={() => setOpen(false)} className="rounded-full border border-border p-2"><X /></button></div>
      {!configured && <p className="mt-4 rounded-xl border border-yellow-400/25 bg-yellow-400/10 p-3 text-sm text-yellow-200">Supabase is not configured.</p>}
      <div className="mt-6 grid gap-4"><EditorField label="Email"><EditorInput value={email} onChange={setEmail} type="email" /></EditorField><EditorField label="Password"><input className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} /></EditorField>{error && <p className="text-sm text-red-400">{error}</p>}<button disabled={busy || !configured} onClick={login} className="admin-primary"><LogIn className="h-4 w-4" />{busy ? "Signing in…" : "Sign in"}</button></div>
    </div></div>}
  </>;
}
