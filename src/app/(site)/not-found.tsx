import Link from "next/link";
import { PageBanner } from "@/components/site/page-banner";

export default function NotFound() {
  return (
    <>
      <PageBanner title="Page Not Found" crumbs={[{ label: "404" }]} />
      <section className="py-20 text-center md:py-28">
        <div className="container-x">
          <p className="font-display text-[6rem] font-bold leading-none text-red sm:text-[8rem]">404</p>
          <h2 className="section-title mt-4">This page isn&apos;t here</h2>
          <p className="mx-auto mt-4 max-w-md">The link may be old or mistyped. Head back to the home page, or send us a request and we&apos;ll help.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-red">Back to home</Link>
            <Link href="/quote" className="btn btn-ghost text-heading">Request a quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
