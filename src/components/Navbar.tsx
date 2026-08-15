import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, profile } from "../data/portfolio";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scrolled ? "border-b border-border bg-background/78 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" className="rounded-md text-2xl font-bold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          {profile.name}
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {item.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            className="ml-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Resume
          </a>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition hover:border-accent/50 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
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
    </header>
  );
}
