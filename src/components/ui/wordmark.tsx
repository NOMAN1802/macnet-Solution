import Image from "next/image";
import Link from "next/link";

/** Macnet Solutions logo. "ink" is the full-colour logo for light backgrounds; "paper" is the white version for dark ones. */
export function Wordmark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const src = tone === "ink" ? "/brand/macnet-logo.png" : "/brand/macnet-logo-white.png";
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Macnet Solutions home">
      <Image src={src} alt="Macnet Solutions" width={1600} height={152} priority className="h-[22px] w-auto sm:h-[26px]" />
    </Link>
  );
}
