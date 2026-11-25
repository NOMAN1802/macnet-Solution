import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";
import { Wordmark } from "@/components/ui/wordmark";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

async function SessionBar() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return (
    <div className="flex items-center gap-4">
      <span className="port hidden uppercase text-rail sm:inline">{session.user.email}</span>
      <form action={logout}>
        <button className="port uppercase text-paper underline-offset-4 hover:underline">Sign out</button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-rack text-paper">
        <div className="rack flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Wordmark tone="paper" />
            <nav className="port hidden gap-5 uppercase text-rail md:flex">
              <Link href="/admin" className="hover:text-paper">Leads</Link>
              <span title="Coming next" className="opacity-50">Content</span>
            </nav>
          </div>
          <Suspense fallback={null}>
            <SessionBar />
          </Suspense>
        </div>
      </header>
      <div className="rack py-10">{children}</div>
    </div>
  );
}
