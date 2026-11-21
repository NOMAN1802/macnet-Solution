"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
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
}: {
  type: "QUOTE" | "CONTACT";
  products?: Picked[];
  whatsapp: string;
  source?: string;
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
        className="border border-ink bg-white p-8"
        role="status"
      >
        <p className="port flex items-center gap-2 uppercase text-text-muted">
          <span className="h-2 w-2 rounded-full bg-led-green" /> Received
        </p>
        <h2 className="heading mt-4 text-3xl text-ink">Thanks. We&apos;ve got your {type === "QUOTE" ? "request" : "message"}.</h2>
        <p className="mt-3 text-text-muted">Our sales team usually replies within one working day. For anything urgent, message us on WhatsApp.</p>
        <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp {whatsapp}
        </a>
      </motion.div>
    );
  }

  const field = (name: keyof LeadInput) => (errors[name] ? "border-red-600" : "");
  const err = (name: keyof LeadInput) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
        {String(errors[name]?.message)}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="border border-rail-line bg-white p-6 md:p-8">
      <input type="hidden" {...register("type")} />
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      {type === "QUOTE" ? (
        <fieldset className="mb-6">
          <legend className="port uppercase text-text-muted">Products in this request</legend>
          {picked.length ? (
            <ul className="mt-3 divide-y divide-rail-line border border-rail-line">
              {picked.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span>
                    <span className="font-medium text-ink">{p.name}</span>
                    <span className="port ml-2 text-text-muted">{p.sku}</span>
                  </span>
                  <button
                    type="button"
                    className="port uppercase text-text-muted underline-offset-4 hover:text-ink hover:underline"
                    onClick={() => setPicked((list) => list.filter((x) => x.id !== p.id))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-text-muted">
              No product selected. Describe what you need below, or add items from the{" "}
              <a href="/products" className="text-signal-ink underline underline-offset-4">product list</a>.
            </p>
          )}
        </fieldset>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name *</label>
          <input id="name" autoComplete="name" className={`field mt-1.5 ${field("name")}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-medium">Company</label>
          <input id="company" autoComplete="organization" className="field mt-1.5" {...register("company")} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email *</label>
          <input id="email" type="email" autoComplete="email" className={`field mt-1.5 ${field("email")}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">Phone / WhatsApp</label>
          <input id="phone" type="tel" autoComplete="tel" className={`field mt-1.5 ${field("phone")}`} aria-invalid={!!errors.phone} {...register("phone")} />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium">
            {type === "QUOTE" ? "Quantities, models or what you need" : "Message"}
          </label>
          <textarea
            id="message"
            rows={5}
            className={`field mt-1.5 ${field("message")}`}
            placeholder={type === "QUOTE" ? "e.g. 4 × 24-port PoE switches, 12 Wi-Fi 6 APs, delivery to Gulshan" : ""}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {err("message")}
        </div>
      </div>

      {serverError ? (
        <p role="alert" className="mt-5 border-l-2 border-red-600 pl-3 text-sm text-red-700">
          {serverError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={pending}>
          {pending ? "Sending…" : type === "QUOTE" ? "Send quote request" : "Send message"} {!pending ? <ArrowRight /> : null}
        </button>
        <p className="text-sm text-text-muted">No prices online. We reply with a written quote.</p>
      </div>
    </form>
  );
}
