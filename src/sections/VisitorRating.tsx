import { Check, MessageSquareText, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const ratingLabels = ["", "Needs work", "Promising", "Solid", "Impressive", "Exceptional"];
const tokenKey = "abhishek-portfolio-rating-token";
const submittedKey = "abhishek-portfolio-rating-submitted";

function getVisitorToken() {
  const saved = window.localStorage.getItem(tokenKey);
  if (saved) return saved;
  const token = crypto.randomUUID();
  window.localStorage.setItem(tokenKey, token);
  return token;
}

export function VisitorRating() {
  const [ratings, setRatings] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(() => window.localStorage.getItem(submittedKey) === "true");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.from("visitor_ratings").select("score").then(({ data, error: loadError }) => {
      if (loadError) {
        console.error("Could not load visitor ratings", loadError);
        return;
      }
      setRatings((data ?? []).map((item) => item.score as number));
    });
  }, []);

  const average = useMemo(
    () => ratings.length ? ratings.reduce((sum, score) => sum + score, 0) / ratings.length : 0,
    [ratings],
  );

  async function submitRating() {
    if (!supabase || !selected || submitted) return;
    setSubmitting(true);
    setError("");
    const { error: saveError } = await supabase.from("visitor_ratings").insert({
      visitor_token: getVisitorToken(),
      score: selected,
      feedback: feedback.trim() || null,
    });
    setSubmitting(false);
    if (saveError && saveError.code !== "23505") {
      setError("The rating could not be saved. Please try again.");
      return;
    }
    window.localStorage.setItem(submittedKey, "true");
    setSubmitted(true);
    if (!saveError) setRatings((current) => [...current, selected]);
  }

  const activeRating = hovered || selected;

  return (
    <section id="rating" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-surface/65 shadow-premium backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex flex-col justify-between border-b border-border bg-background/35 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                  <Sparkles className="h-3.5 w-3.5" /> Visitor signal
                </span>
                <h2 className="mt-6 text-3xl font-extrabold text-text-primary sm:text-4xl">Rate this experience.</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-text-secondary">Your honest rating helps me improve the portfolio and build better digital experiences.</p>
              </div>
              <div className="mt-9 flex items-end gap-3">
                <strong className="text-5xl font-black tracking-tight text-text-primary">{average ? average.toFixed(1) : "—"}</strong>
                <div className="pb-1">
                  <div className="flex gap-0.5 text-accent" aria-label={average ? `${average.toFixed(1)} out of 5` : "No ratings yet"}>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${average >= star - 0.5 ? "fill-current" : "opacity-25"}`} />)}
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{ratings.length ? `${ratings.length} visitor${ratings.length === 1 ? "" : "s"} rated` : "Be the first to rate"}</p>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              {submitted ? (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-accent/35 bg-accent/12 text-accent shadow-[0_0_35px_rgb(var(--accent)/.2)]"><Check className="h-8 w-8" /></span>
                  <h3 className="mt-6 text-2xl font-bold text-text-primary">Signal received. Thank you.</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-text-secondary">Your feedback is now part of this portfolio's journey.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-text-primary">How did the portfolio feel?</p>
                  <div className="mt-5 flex flex-wrap gap-2" onMouseLeave={() => setHovered(0)}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setSelected(rating)}
                        onMouseEnter={() => setHovered(rating)}
                        className={`group grid h-14 w-14 place-items-center rounded-2xl border transition duration-200 hover:-translate-y-1 ${activeRating >= rating ? "border-accent/55 bg-accent/15 text-accent shadow-[0_8px_25px_rgb(var(--accent)/.14)]" : "border-border bg-background/45 text-text-secondary"}`}
                        aria-label={`${rating} out of 5: ${ratingLabels[rating]}`}
                        aria-pressed={selected === rating}
                      >
                        <Star className={`h-6 w-6 transition-transform group-hover:scale-110 ${activeRating >= rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 h-5 text-sm font-medium text-accent">{activeRating ? ratingLabels[activeRating] : "Choose a rating"}</p>

                  <label className="mt-5 block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary"><MessageSquareText className="h-3.5 w-3.5" /> Optional feedback</span>
                    <textarea
                      value={feedback}
                      onChange={(event) => setFeedback(event.target.value.slice(0, 280))}
                      rows={3}
                      placeholder="What stood out, or what could be better?"
                      className="w-full resize-none rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/55 focus:border-accent"
                    />
                    <span className="mt-1 block text-right font-mono text-[0.65rem] text-text-secondary">{feedback.length}/280</span>
                  </label>
                  {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                  {!isSupabaseConfigured && <p className="mt-2 text-sm text-text-secondary">Ratings will activate after the Supabase environment variables are configured.</p>}
                  <button
                    type="button"
                    onClick={submitRating}
                    disabled={!selected || submitting || !isSupabaseConfigured}
                    className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-background shadow-[0_12px_30px_rgb(var(--accent)/.22)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                  >
                    {submitting ? "Sending signal…" : "Submit rating"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
