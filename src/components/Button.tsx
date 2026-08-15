import { ArrowRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  showIcon?: boolean;
};

export function Button({ children, variant = "primary", showIcon = true, className = "", ...props }: ButtonProps) {
  const base =
    "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
  const variants = {
    primary: "bg-accent text-zinc-950 shadow-glow hover:-translate-y-0.5 hover:bg-accent/90",
    secondary: "border border-border bg-surface/70 text-text-primary hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-hover",
    ghost: "px-1 text-text-secondary hover:text-text-primary",
  };

  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {showIcon ? <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" /> : null}
    </a>
  );
}
