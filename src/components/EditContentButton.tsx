import { Pencil } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

type EditContentButtonProps = {
  onClick: () => void;
  label?: string;
};

export function EditContentButton({ onClick, label = "Edit" }: EditContentButtonProps) {
  const { session } = usePortfolio();
  if (!session) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/90 px-3 py-2 text-xs font-bold text-accent shadow-premium backdrop-blur transition hover:-translate-y-0.5 hover:bg-surface"
    >
      <Pencil className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
