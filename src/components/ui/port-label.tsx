/** Mono "port" label shown above section headings, e.g. P-01 · Products. */
export function PortLabel({ port, children, tone = "ink" }: { port: string; children: React.ReactNode; tone?: "ink" | "paper" }) {
  return (
    <p className={`port flex items-center gap-2 uppercase ${tone === "ink" ? "text-text-muted" : "text-rail"}`}>
      <span className={`inline-flex h-5 items-center border px-1.5 ${tone === "ink" ? "border-ink text-ink" : "border-signal text-signal"}`}>
        {port}
      </span>
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  port,
  label,
  title,
  intro,
  tone = "ink",
}: {
  port: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "ink" | "paper";
}) {
  return (
    <div className="max-w-2xl">
      <PortLabel port={port} tone={tone}>
        {label}
      </PortLabel>
      <h2 className={`heading mt-4 text-3xl md:text-[2.75rem] ${tone === "ink" ? "text-ink" : "text-paper"}`}>{title}</h2>
      {intro ? <p className={`mt-4 text-lg ${tone === "ink" ? "text-text-muted" : "text-rail"}`}>{intro}</p> : null}
    </div>
  );
}
