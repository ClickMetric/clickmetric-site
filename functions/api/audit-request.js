// Cloudflare Pages Function — handles POST /api/audit-request.
//
// In production this takes a form submission and forwards it somewhere Sarah
// can actually see it. Dev-mode submissions still hit the vite middleware in
// ../vite.config.js (which writes to leads.json) — this function only runs on
// the deployed site.
//
// Current destination: Resend (hello@clickmetric.ca → NOTIFY_TO env var).
// Falls back to logging + 200 if RESEND_API_KEY is missing so the form never
// looks broken in front of a prospect — Sarah's dashboard will still see the
// submission in the Cloudflare request logs until the real wire-up is done.
//
// Set these as Pages env vars in Cloudflare before shipping:
//   RESEND_API_KEY  — from resend.com (free tier covers early volume)
//   NOTIFY_TO       — Sarah's real inbox (where submissions are forwarded)
//   NOTIFY_FROM     — verified sending address, e.g. forms@clickmetric.ca

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const errs = validate(body);
  if (errs.length) return json({ ok: false, error: errs.join("; ") }, 400);

  const ts = new Date().toISOString();
  const payload = {
    ts,
    name: body.name || "",
    business: body.business || "",
    website: body.website,
    email: body.email,
    notes: body.notes || "",
    ua: request.headers.get("user-agent") || "",
    ip: request.headers.get("cf-connecting-ip") || "",
  };

  // Log every submission so it shows up in the Pages request log even if
  // the email forwarder below is misconfigured.
  console.log(`[audit-request] ${payload.email} / ${payload.website} / ${payload.business || "anon"}`);

  if (env.RESEND_API_KEY && env.NOTIFY_TO && env.NOTIFY_FROM) {
    try {
      await sendViaResend(env, payload);
    } catch (e) {
      // Still report success to the submitter — their submission is in the
      // logs and we can replay from there. We only fail-fast on validation.
      console.error(`[audit-request] resend send failed: ${e.message}`);
    }
  }

  return json({ ok: true });
}

function validate(b) {
  const errs = [];
  if (!b || typeof b !== "object") { errs.push("Body missing"); return errs; }
  if (!b.email || !/.+@.+\..+/.test(b.email)) errs.push("Valid email required");
  if (!b.website || b.website.length < 4) errs.push("Website required");
  if (b.notes && b.notes.length > 2000) errs.push("Notes too long");
  return errs;
}

async function sendViaResend(env, p) {
  const subject = `Audit request — ${p.business || p.email}`;
  const text = [
    `Business: ${p.business || "(not provided)"}`,
    `Name:     ${p.name || "(not provided)"}`,
    `Email:    ${p.email}`,
    `Website:  ${p.website}`,
    "",
    "Notes:",
    p.notes || "(none)",
    "",
    "---",
    `Submitted: ${p.ts}`,
    `IP: ${p.ip}`,
    `UA: ${p.ua}`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM,
      to: env.NOTIFY_TO,
      reply_to: p.email,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`resend ${res.status}: ${t.slice(0, 200)}`);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
