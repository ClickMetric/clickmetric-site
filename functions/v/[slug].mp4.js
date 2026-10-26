// functions/v/[slug].mp4.js
// Resolves /v/<business-slug>.mp4 -> 302 /v/<watch-token>.mp4
//
// Static files in public/v/*.mp4 are served by Pages before this function
// runs. This function only handles requests where the slug segment is a
// business_slug (no matching static file exists), i.e. SPA fallback cases.
//
// Lookup: KV `CMWORKS_STATE`, key `prospect:<slug>`.
// Prospect record `watch_url` is `https://clickmetric.ca/w/<token>`; we pull
// the trailing path segment as the token and redirect to the hash-named mp4.

export async function onRequestGet({ params, env }) {
  const slug = (params.slug || "").toLowerCase().trim();
  if (!slug) return new Response("not found", { status: 404 });

  // Short-circuit: a hash-looking slug (24-char hex) means the static file
  // should have handled it; a miss here is a true 404, not a slug lookup.
  if (/^[a-f0-9]{24}$/.test(slug)) {
    return new Response("not found", { status: 404 });
  }

  let record;
  try {
    record = await env.CMWORKS_STATE.get(`prospect:${slug}`, { type: "json" });
  } catch (e) {
    return new Response("kv error", { status: 502 });
  }
  if (!record || !record.watch_url) {
    return new Response("not found", { status: 404 });
  }

  // watch_url example: https://clickmetric.ca/w/<token>
  const m = record.watch_url.match(/\/w\/([a-zA-Z0-9]+)\/?$/);
  if (!m) return new Response("malformed watch_url", { status: 500 });
  const token = m[1];

  const target = `/v/${token}.mp4`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store",
    },
  });
}
