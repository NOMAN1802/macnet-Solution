import type { StockStatus } from "@prisma/client";

const MAP: Record<StockStatus, { label: string; dot: string }> = {
  IN_STOCK: { label: "In stock", dot: "bg-led-green" },
  ON_ORDER: { label: "On order", dot: "bg-led-amber" },
  DISCONTINUED: { label: "Discontinued", dot: "bg-rail" },
};

export function StockLed({ stock, className = "" }: { stock: StockStatus; className?: string }) {
  const s = MAP[stock];
  return (
    <span className={`port inline-flex items-center gap-1.5 uppercase ${className}`}>
      <span aria-hidden className={`h-2 w-2 rounded-full ${s.dot} ${stock === "IN_STOCK" ? "shadow-[0_0_6px_var(--led-green)]" : ""}`} />
      {s.label}
    </span>
  );
}
