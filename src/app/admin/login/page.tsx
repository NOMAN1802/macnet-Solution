import type { Metadata } from "next";
import { Wordmark } from "@/components/ui/wordmark";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm border border-rail-line bg-white p-8">
        <Wordmark />
        <p className="port mt-8 uppercase text-text-muted">Admin</p>
        <h1 className="heading mt-2 text-3xl text-ink">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
