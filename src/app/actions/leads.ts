"use server";

import { db } from "@/lib/db";
import { leadSchema, type LeadInput } from "@/lib/validation";

export type LeadResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;
  // Honeypot filled: pretend success, store nothing.
  if (data.website) return { ok: true };
  if (data.type === "QUOTE" && !data.message && data.productIds.length === 0) {
    return { ok: false, error: "Tell us what you need, or pick at least one product.", fieldErrors: { message: ["Add a short description"] } };
  }

  const lead = await db.lead.create({
    data: {
      type: data.type,
      name: data.name,
      company: data.company || null,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      message: data.message || null,
      productIds: data.productIds,
      source: data.source ?? null,
    },
  });
  await db.activity.create({
    data: { action: "lead.created", entity: "Lead", entityId: lead.id, summary: `${data.type} from ${data.name}` },
  });

  // Email alert: no mail provider is configured yet. When one is added (e.g. Resend),
  // send to process.env.LEAD_ALERT_EMAIL here. Until then leads are visible in /admin.
  if (process.env.NODE_ENV !== "production") {
    console.info(`[lead] ${data.type} from ${data.email} → would alert ${process.env.LEAD_ALERT_EMAIL ?? "(unset)"}`);
  }
  return { ok: true };
}
