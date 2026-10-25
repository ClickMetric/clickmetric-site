// outlook.js — the Outlook send flow for the Clickmetric Works dashboard.
//
// Single responsibility: given a prospect slug, POST to
// /app/api/outreach-launch (which returns an .eml MIME file) and trigger
// a browser download. The user double-clicks the downloaded .eml →
// Windows file-associates with Outlook desktop → compose window opens
// pre-filled with the full outreach email.
//
// Nothing else lives here. No KV reads, no rendering, no state. Just the
// Outlook action. Imported by profile.js (and anywhere else a "send
// outreach" affordance appears later).
//
// Communicates with: /app/api/outreach-launch (Pages Function).
// Communicates with: a button DOM element passed in by the caller.

const ENDPOINT = "/app/api/outreach-launch";

export async function openInOutlook(slug, btn) {
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Building draft…";
  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
      throw new Error(j.error || `HTTP ${r.status}`);
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outreach-${slug}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    btn.textContent = "✓ Draft downloaded — double-click to open in Outlook";
    btn.style.background = "#0f766e";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.style.background = "";
    }, 6000);
  } catch (e) {
    btn.textContent = "✗ " + (e.message || "failed").slice(0, 80);
    btn.style.background = "#a5342a";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.style.background = "";
    }, 6000);
  }
}
