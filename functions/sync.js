// functions/app/api/sync.js — Henderson's bidirectional sync endpoint.
// Authenticated by X-Sync-Token header matching env.CMW_SYNC_TOKEN.
// Henderson calls this every ~2 min to:
//   action=jobs      → list queued audit jobs (Tyler's new asks)
//   action=job_done  → mark a job as finished, write result
//   action=upsert    → push a prospect's state (metadata + watch URL + email)
//   action=prospects → list all prospect records (used for initial reconcile)
//
// Not reachable from the public dashboard — Tyler's UI uses the per-action
// endpoints under /app/api/jobs, /app/api/prospects, /app/api/mark.

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequest(context) {
  const { request, env } = context;
  const token = request.headers.get("X-Sync-Token") || "";
  if (!env.CMW_SYNC_TOKEN || token !== env.CMW_SYNC_TOKEN) {
    return json({ error: "unauthorized" }, 401);
  }
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "";

  if (request.method === "GET" && action === "jobs") {
    // Return every active (non-done) job so Henderson AND the dashboard
    // both see rebuilds, re-finders, and manual queue items.
    const out = [];
    let cursor;
    do {
      const r = await env.CMWORKS_STATE.list({ prefix: "job:", cursor });
      for (const k of r.keys) {
        const j = await env.CMWORKS_STATE.get(k.name, { type: "json" });
        if (j && j.status !== "done") out.push(j);
      }
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    out.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    return json({ jobs: out });
  }

  if (request.method === "GET" && action === "prospects") {
    // KV list is paginated; walk until done.
    const out = [];
    let cursor;
    do {
      const r = await env.CMWORKS_STATE.list({ prefix: "prospect:", cursor });
      for (const k of r.keys) {
        const p = await env.CMWORKS_STATE.get(k.name, { type: "json" });
        if (p) out.push(p);
      }
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    return json({ prospects: out });
  }

  if (request.method === "POST" && action === "upsert") {
    try {
      const body = await request.json().catch(() => ({}));
      const slug = (body.business_slug || body.slug || "").trim();
      if (!slug) return json({ error: "missing business_slug" }, 400);
      const existing = (await env.CMWORKS_STATE.get(`prospect:${slug}`, { type: "json" })) || {};
      const merged = { ...existing, ...body, business_slug: slug, updated_at: new Date().toISOString() };
      await env.CMWORKS_STATE.put(`prospect:${slug}`, JSON.stringify(merged));
      return json({ ok: true, slug });
    } catch (e) {
      return json({ error: "upsert threw", detail: String(e && e.message || e), stack: (e && e.stack || "").slice(0, 500) }, 500);
    }
  }

  if (request.method === "POST" && action === "enqueue_job") {
    // Henderson creates/updates an internal job (rebuild, email-finder,
    // health-check, etc.) so it's visible in the dashboard "In-flight" list.
    const body = await request.json().catch(() => ({}));
    const id = (body.id || "cmw_int_" + Date.now().toString(36)).trim();
    const existing = (await env.CMWORKS_STATE.get(`job:${id}`, { type: "json" })) || {};
    // Default status for a brand-new enqueue is "queued" so the sync_cloud
    // loop picks it up and spawns a worker. Only existing-record updates
    // preserve the existing status (via ...existing).
    const job = {
      id,
      status: "queued",
      created_at: existing.created_at || new Date().toISOString(),
      ...existing,
      ...body,
      id,
      updated_at: new Date().toISOString(),
    };
    await env.CMWORKS_STATE.put(`job:${id}`, JSON.stringify(job));
    if (job.status === "running" || job.status === "queued") {
      const idx = (await env.CMWORKS_STATE.get("jobs:queued", { type: "json" })) || [];
      if (!idx.includes(id)) {
        idx.push(id);
        await env.CMWORKS_STATE.put("jobs:queued", JSON.stringify(idx));
      }
    }
    return json({ ok: true, id });
  }

  if (request.method === "POST" && action === "job_done") {
    const body = await request.json().catch(() => ({}));
    const id = (body.id || "").trim();
    if (!id) return json({ error: "missing id" }, 400);
    const j = await env.CMWORKS_STATE.get(`job:${id}`, { type: "json" });
    if (!j) return json({ error: "job not found" }, 404);
    j.status = body.status || "done";
    j.finished_at = new Date().toISOString();
    j.result = body.result || null;
    await env.CMWORKS_STATE.put(`job:${id}`, JSON.stringify(j));
    // Remove from queued index
    const idx = (await env.CMWORKS_STATE.get("jobs:queued", { type: "json" })) || [];
    const next = idx.filter((x) => x !== id);
    await env.CMWORKS_STATE.put("jobs:queued", JSON.stringify(next));
    return json({ ok: true });
  }

  if (request.method === "POST" && action === "upsert_meta") {
    // Rule 24: server-side timestamps for last_sync_ts / last_heal_ts so the
    // dashboard shows real sync time, not browser poll time.
    const body = await request.json().catch(() => ({}));
    const key = (body.key || "").trim();
    if (!key) return json({ error: "missing key" }, 400);
    await env.CMWORKS_STATE.put(`meta:${key}`, JSON.stringify({ value: body.value, ts: Date.now() }));
    return json({ ok: true });
  }
  if (request.method === "POST" && action === "delete_prospect") {
    const body = await request.json().catch(() => ({}));
    const slug = (body.business_slug || body.slug || "").trim();
    if (!slug) return json({ error: "missing business_slug" }, 400);
    await env.CMWORKS_STATE.delete(`prospect:${slug}`);
    return json({ ok: true, slug });
  }

  if (request.method === "POST" && action === "clear_prospects") {
    // Sarah 2026-10-16: wipe all prospect:* keys so the dashboard starts
    // from a clean master-doc-compliant baseline. Does NOT touch job:* or
    // meta:* keys.
    let deleted = 0;
    let cursor;
    do {
      const r = await env.CMWORKS_STATE.list({ prefix: "prospect:", cursor });
      for (const k of r.keys) {
        await env.CMWORKS_STATE.delete(k.name);
        deleted += 1;
      }
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    return json({ ok: true, deleted });
  }

  if (request.method === "GET" && action === "status") {
    // Public server-side status (no auth needed from dashboard — same cookie gate as app).
    const out = {};
    for (const k of ["last_sync_ts", "last_heal_ts"]) {
      const v = await env.CMWORKS_STATE.get(`meta:${k}`, { type: "json" });
      if (v) out[k] = v;
    }
    return json(out);
  }
  // --- Feedback queue (2026-10-23) ---
  // Henderson's local drain polls `feedback_list` for queued items, then
  // uses `feedback_patch` to flip state=running → done/error. The browser
  // UI continues to hit /app/api/feedback (POST) and
  // /app/api/feedback/status (GET) through the cookie-gated path.
  if (request.method === "GET" && action === "feedback_list") {
    const stateFilter = (url.searchParams.get("state") || "").toLowerCase();
    const out = [];
    let cursor;
    do {
      const r = await env.CMWORKS_STATE.list({ prefix: "feedback:queue:", cursor });
      for (const k of r.keys) {
        const rec = await env.CMWORKS_STATE.get(k.name, { type: "json" });
        if (!rec) continue;
        if (stateFilter && (rec.state || "").toLowerCase() !== stateFilter) continue;
        out.push({ key: k.name, record: rec });
      }
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    out.sort((a, b) => (a.record.submitted || "").localeCompare(b.record.submitted || ""));
    return json({ items: out });
  }

  if (request.method === "POST" && action === "feedback_patch") {
    const body = await request.json().catch(() => ({}));
    const key = (body.key || "").trim();
    if (!key.startsWith("feedback:queue:")) return json({ error: "bad key" }, 400);
    const rec = await env.CMWORKS_STATE.get(key, { type: "json" });
    if (!rec) return json({ error: "not found" }, 404);
    const patch = body.patch || {};
    const merged = { ...rec, ...patch };
    await env.CMWORKS_STATE.put(key, JSON.stringify(merged));
    const lkey = key.replace("feedback:queue:", "feedback:log:");
    const prevLog = (await env.CMWORKS_STATE.get(lkey, { type: "json" })) || [];
    prevLog.push({
      ts: new Date().toISOString(),
      state: merged.state || null,
      error: merged.error || null,
    });
    while (prevLog.length > 20) prevLog.shift();
    await env.CMWORKS_STATE.put(lkey, JSON.stringify(prevLog));
    return json({ ok: true, key, record: merged });
  }

  return json({ error: "unknown action" }, 400);
}
