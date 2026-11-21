import Link from "next/link";

/** Text wordmark used until the logo file arrives in public/brand/. */
export function Wordmark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const color = tone === "ink" ? "text-ink" : "text-paper";
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${color}`} aria-label="Macnet Solutions home">
      <span aria-hidden className="grid grid-cols-3 gap-[3px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={`block h-[7px] w-[7px] ${i === 4 ? "bg-signal" : tone === "ink" ? "bg-ink" : "bg-paper"}`}
          />
        ))}
      </span>
      <span className="heading text-[1.15rem] leading-none">
        Macnet <span className="font-medium">Solutions</span>
      </span>
    </Link>
  );
}
