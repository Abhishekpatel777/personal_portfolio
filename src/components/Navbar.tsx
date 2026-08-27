import { Command, FileDown, Flame, Menu, Snowflake, WandSparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "../data/portfolio";
import { usePortfolio } from "../context/PortfolioContext";

type Theme = "dark" | "light" | "arcane";

const THEME_DETAILS: Record<Theme, { name: string; next: Theme; color: string }> = {
  dark: { name: "Cryo Reactor", next: "light", color: "#05080e" },
  light: { name: "Inferno Reactor", next: "arcane", color: "#faf7f2" },
  arcane: { name: "Arcane Archives", next: "dark", color: "#080919" },
};

export function Navbar() {
  const { content: { profile } } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = document.documentElement.dataset.theme;
    return saved === "light" || saved === "arcane" ? saved : "dark";
  });
  const currentTheme = THEME_DETAILS[theme];
  const nextTheme = THEME_DETAILS[currentTheme.next];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", currentTheme.color);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${scrolled ? "border-b border-border/70 bg-background/72 shadow-[0_10px_50px_rgba(0,0,0,.12)] backdrop-blur-2xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" data-aegis-dock className="group flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/25 bg-accent/10 font-display text-sm font-bold text-accent shadow-glow transition group-hover:rotate-3 group-hover:scale-105">AP</span>
          <span className="hidden font-display text-base font-bold tracking-tight text-text-primary sm:block">{profile.name}</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-hover/70 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {item.label}
            </a>
          ))}
          <button type="button" onClick={() => window.dispatchEvent(new Event("open-command-palette"))} className="ml-1 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-2 font-mono text-xs text-text-secondary transition hover:border-accent/40 hover:text-text-primary"><Command className="h-3.5 w-3.5" /><span>K</span></button>
          <a
            href={profile.resumeUrl}
            className="ml-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span className="inline-flex items-center gap-2"><FileDown className="h-4 w-4" />Resume</span>
          </a>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition hover:border-accent/50"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <div className={`md:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition duration-200`}>
        <div className="mx-4 mb-4 rounded-2xl border border-border bg-surface/95 p-3 shadow-premium backdrop-blur-xl">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={profile.resumeUrl} className="mt-2 block rounded-xl bg-accent px-4 py-3 text-center text-base font-bold text-zinc-950" onClick={() => setIsOpen(false)}>
            Resume
          </a>
        </div>
      </div>
      <button
        type="button"
        data-aegis-control
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => setTheme(value => THEME_DETAILS[value].next)}
        className="appearance-controller group fixed left-3 top-24 z-[68] flex min-w-[10.5rem] items-center gap-3 rounded-2xl border border-accent/35 bg-background/88 px-3 py-2.5 text-left shadow-premium outline-none backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-accent/65 focus-visible:ring-2 focus-visible:ring-accent/60 sm:left-5 sm:min-w-[11.5rem] sm:px-4"
        aria-label={`Current appearance: ${currentTheme.name}. Switch to ${nextTheme.name}.`}
      >
        <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-accent/30 bg-accent/12 text-accent shadow-glow">
          {theme === "dark" ? <Snowflake className="h-5 w-5" aria-hidden="true" /> : theme === "light" ? <Flame className="h-5 w-5" aria-hidden="true" /> : <WandSparkles className="h-5 w-5" aria-hidden="true" />}
          <span className="absolute inset-x-1 bottom-0 h-px bg-accent shadow-[0_0_8px_rgb(var(--accent))]" />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-text-secondary">Appearance</span>
          <strong className="mt-0.5 block whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.08em] text-text-primary sm:text-[0.8rem]">{currentTheme.name}</strong>
          <span className="mt-0.5 block whitespace-nowrap text-[0.58rem] text-text-secondary">Switch to {nextTheme.name}</span>
        </span>
      </button>
    </header>
  );
}
