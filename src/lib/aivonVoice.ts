import { supabase } from "./supabase";

export async function requestAivonVoice(text: string) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.functions.invoke("aivon-voice", { body: { text } });
  if (error) throw error;
  if (data instanceof Blob) return data;
  if (data instanceof ArrayBuffer) return new Blob([data], { type: "audio/mpeg" });
  throw new Error("The voice service returned an invalid audio response");
}
