import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultPortfolio, type PortfolioContent } from "../data/portfolio";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type Value = { content: PortfolioContent; session: Session | null; loading: boolean; configured: boolean; save: (value: PortfolioContent) => Promise<void>; signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void>; upload: (file: File) => Promise<string> };
const PortfolioContext = createContext<Value | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultPortfolio);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: auth } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    supabase.from("portfolio_content").select("content").eq("id", "main").maybeSingle().then(({ data, error }) => {
      if (error) console.error("Could not load portfolio content", error);
      if (data?.content) setContent(data.content as PortfolioContent);
      setLoading(false);
    });
    return () => auth.subscription.unsubscribe();
  }, []);

  const value = useMemo<Value>(() => ({ content, session, loading, configured: isSupabaseConfigured,
    async save(next) {
      if (!supabase || !session) throw new Error("Sign in before saving changes.");
      const { error } = await supabase.from("portfolio_content").upsert({ id: "main", content: next, updated_at: new Date().toISOString() });
      if (error) throw error;
      setContent(next);
    },
    async signIn(email, password) {
      if (!supabase) throw new Error("Supabase is not configured yet.");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signOut() { if (supabase) await supabase.auth.signOut(); },
    async upload(file) {
      if (!supabase || !session) throw new Error("Sign in before uploading files.");
      const ext = file.name.split(".").pop()?.toLowerCase() || "file";
      const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("portfolio-files").upload(path, file, { contentType: file.type });
      if (error) throw error;
      return supabase.storage.from("portfolio-files").getPublicUrl(path).data.publicUrl;
    },
  }), [content, session]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return value;
}
