import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function Dashboard() {
  await connection();
  const session = await auth();
  if (!session?.user) return null;
  const [leads, counts] = await Promise.all([
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.lead.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <>
      <dl className="grid gap-px border border-rail-line bg-rail-line sm:grid-cols-4">
        {[
          ["New leads", count("NEW")],
          ["Contacted", count("CONTACTED")],
          ["Quoted", count("QUOTED")],
          ["Won", count("WON")],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-white p-5">
            <dt className="port uppercase text-text-muted">{label}</dt>
            <dd className="display mt-2 text-4xl text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="heading mt-12 text-2xl text-ink">Latest leads</h2>
      {leads.length === 0 ? (
        <p className="mt-4 text-text-muted">No leads yet. Quote and contact form submissions will appear here.</p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-rail-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="port border-b border-ink uppercase text-text-muted">
              <tr>
                <th className="p-3 font-normal">Received</th>
                <th className="p-3 font-normal">Type</th>
                <th className="p-3 font-normal">From</th>
                <th className="p-3 font-normal">Message</th>
                <th className="p-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-rail-line align-top">
                  <td className="port p-3 text-text-muted">{l.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="port p-3">{l.type}</td>
                  <td className="p-3">
                    <p className="font-medium text-ink">{l.name}</p>
                    <p className="text-text-muted">{l.company}</p>
                    <a href={`mailto:${l.email}`} className="text-signal-ink">{l.email}</a>
                    {l.phone ? <p className="port">{l.phone}</p> : null}
                  </td>
                  <td className="max-w-xs p-3 text-text-muted">{l.message}</td>
                  <td className="port p-3">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminHome() {
  return (
    <>
      <p className="port uppercase text-text-muted">Admin · Overview</p>
      <h1 className="heading mt-2 text-4xl text-ink">Leads</h1>
      <p className="mt-2 max-w-2xl text-text-muted">
        Quote requests and contact messages from the website. Content editing comes in the next phase.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="port uppercase text-text-muted">Loading…</p>}>
          <Dashboard />
        </Suspense>
      </div>
    </>
  );
}
