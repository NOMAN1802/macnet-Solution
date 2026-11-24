"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "motion/react";
import { submitLead } from "@/app/actions/leads";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { whatsappLink } from "@/lib/site";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/icons";

type Picked = { id: string; name: string; sku: string };

export function LeadForm({
  type,
  products = [],
  whatsapp,
  source,
  variant = "card",
}: {
  type: "QUOTE" | "CONTACT";
  products?: Picked[];
  whatsapp: string;
  source?: string;
  /** "card" draws its own shadowed panel; "plain" sits inside a panel the page provides. */
  variant?: "card" | "plain";
}) {
  const [picked, setPicked] = useState<Picked[]>(products);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const reduce = useReducedMotion();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { type, name: "", company: "", email: "", phone: "", message: "", productIds: products.map((p) => p.id), source, website: "" },
  });

  const onSubmit = (values: LeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await submitLead({ ...values, productIds: picked.map((p) => p.id) });
      if (res.ok) {
        setDone(true);
        return;
      }
      setServerError(res.error);
      for (const [field, msgs] of Object.entries(res.fieldErrors ?? {})) {
        setError(field as keyof LeadInput, { message: msgs[0] });
      }
    });
  };

  if (done) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-shadow border-t-4 border-red bg-white p-8 md:p-10"
        role="status"
      >
        <p className="eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-led-green" /> Received
        </p>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">Thanks. We&apos;ve got your {type === "QUOTE" ? "request" : "message"}.</h2>
        <p className="mt-3">Our sales team usually replies within one working day. For anything urgent, message us on WhatsApp.</p>
        <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-red mt-6">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp {whatsapp}
        </a>
      </motion.div>
    );
  }

  const field = (name: keyof LeadInput) => (errors[name] ? "!border-red" : "");
  const err = (name: keyof LeadInput) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1.5 text-sm text-red-dark">
        {String(errors[name]?.message)}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={variant === "card" ? "card-shadow bg-white p-6 sm:p-8 md:p-10" : ""}>
      <input type="hidden" {...register("type")} />
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      {type === "QUOTE" ? (
        <fieldset className="mb-6">
          <legend className="font-display text-[0.9375rem] font-semibold text-heading">Products in this request</legend>
          {picked.length ? (
            <ul className="mt-3 divide-y divide-line border border-line bg-mist">
              {picked.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span>
                    <span className="font-medium text-heading">{p.name}</span>
                    <span className="ml-2 text-xs">{p.sku}</span>
                  </span>
                  <button
                    type="button"
                    className="link-more shrink-0 hover:underline"
                    onClick={() => setPicked((list) => list.filter((x) => x.id !== p.id))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm">
              No product selected. Describe what you need below, or add items from the{" "}
              <Link href="/products" className="text-red underline underline-offset-4">product list</Link>.
            </p>
          )}
        </fieldset>
      ) : null}

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-display text-[0.9375rem] font-semibold text-heading">Name *</label>
          <input id="name" autoComplete="name" placeholder="Your name" className={`field mt-1.5 ${field("name")}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="company" className="font-display text-[0.9375rem] font-semibold text-heading">Company</label>
          <input id="company" autoComplete="organization" placeholder="Company name" className="field mt-2" {...register("company")} />
        </div>
        <div>
          <label htmlFor="email" className="font-display text-[0.9375rem] font-semibold text-heading">Email *</label>
          <input id="email" type="email" autoComplete="email" placeholder="you@company.com" className={`field mt-1.5 ${field("email")}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="font-display text-[0.9375rem] font-semibold text-heading">Phone / WhatsApp</label>
          <input id="phone" type="tel" autoComplete="tel" placeholder="+880" className={`field mt-1.5 ${field("phone")}`} aria-invalid={!!errors.phone} {...register("phone")} />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="font-display text-[0.9375rem] font-semibold text-heading">
            {type === "QUOTE" ? "Quantities, models or what you need" : "Message"}
          </label>
          <textarea
            id="message"
            rows={5}
            className={`field mt-1.5 ${field("message")}`}
            placeholder={type === "QUOTE" ? "e.g. 4 × 24-port PoE switches, 12 Wi-Fi 6 APs, delivery to Gulshan" : "How can we help?"}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {err("message")}
        </div>
      </div>

      {serverError ? (
        <p role="alert" className="mt-5 border-l-4 border-red bg-red-soft px-4 py-3 text-sm text-red-dark">
          {serverError}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-red disabled:opacity-60" disabled={pending}>
          {pending ? "Sending…" : type === "QUOTE" ? "Send quote request" : "Send message"} {!pending ? <ArrowRight /> : null}
        </button>
        <p className="text-sm">No prices online. We reply with a written quote.</p>
      </div>
    </form>
  );
}
