import Link from "next/link";

export default function NotFound() {
  return (
    <section className="rack py-24">
      <p className="port uppercase text-text-muted">E-404 · No link</p>
      <h1 className="display mt-5 text-6xl text-ink">This port is empty.</h1>
      <p className="mt-4 max-w-md text-text-muted">The page you asked for isn&apos;t here. Try the product list or send us a request.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/products" className="btn btn-primary">Browse products</Link>
        <Link href="/quote" className="btn btn-ghost text-ink">Request a quote</Link>
      </div>
    </section>
  );
}
