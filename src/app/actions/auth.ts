"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) return "Email or password is incorrect.";
    throw error; // lets Next.js handle the redirect
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
