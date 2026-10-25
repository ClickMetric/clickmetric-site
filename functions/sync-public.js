// functions/sync-public.js — public read-only status endpoint.
// Returns last_sync_ts + last_heal_ts so the dashboard JS can show
// "synced Xs ago" without needing the X-Sync-Token (which only Henderson
// has). Read-only; no sensitive data.

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "";
  if (request.method !== "GET" || action !== "status") {
    return json({ error: "unknown action" }, 400);
  }
  const out = {};
  for (const k of ["last_sync_ts", "last_heal_ts"]) {
    const v = await env.CMWORKS_STATE.get(`meta:${k}`, { type: "json" });
    if (v) out[k] = v;
  }
  return json(out);
}
