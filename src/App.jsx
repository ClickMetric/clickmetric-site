import React, { useState, useEffect } from "react";

// Public brand (Sarah locked 2026-10-07). Appears on the site + the close-card
// contact strip in every customer video.
const BRAND = "ClickMetric";

function IconAds() { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="12" rx="2"/><path d="M3 10h18"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><path d="M8 20h8"/><path d="M12 16v4"/>
  </svg>
);}
function IconLanding() { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18"/><path d="M7 13h7"/><path d="M7 17h4"/><circle cx="17" cy="16" r="2.5" fill="currentColor" stroke="none" opacity=".9"/>
  </svg>
);}
function IconTracking() { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 17l5-5 4 4 8-9"/><path d="M14 7h7v7"/>
  </svg>
);}
function IconMatch() { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 7h7l3 10h6"/><circle cx="6" cy="7" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="17" r="2" fill="currentColor" stroke="none"/>
  </svg>
);}
function IconCall() { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>
  </svg>
);}
function IconSpend() { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H7"/>
  </svg>
);}

// Two-tier service model (per Oct-7 brief): free outside-in audit covers only
// what we can verify as a customer would see. Deeper account-level work needs
// the owner to grant access. Every line here only names things visible without
// logging in.
const TIERS = [
  {
    k: "01",
    tag: "Free · what every prospect gets",
    title: "Outside-in audit",
    access: "No access needed",
    bullets: [
      "Your ad itself — headlines, description, and what it's promising",
      "The page the paid click lands on — hero, phone, form, trust signals",
      "Message-match: does the page continue the ad's promise?",
      "Externally visible tracking — call tracking + conversion tags we can detect",
      "A spend-range estimate based on vertical + visible click volume",
    ],
  },
  {
    k: "02",
    tag: "Paid engagement",
    title: "Account-level audit",
    access: "Owner grants access",
    bullets: [
      "Every active campaign, ad group, and keyword under the microscope",
      "Search-term reports — what people actually typed before clicking",
      "Conversion setup inside the account — what's firing, what's missing",
      "Real cost per lead by campaign + weekly spend trend",
      "Negative-keyword and bid-strategy opportunities",
    ],
  },
];

const PROCESS = [
  { k: "01", title: "You submit a short request", body: "Business name, website, and roughly what you're advertising. That's enough for us to find your campaign and start digging in." },
  { k: "02", title: "We send you a walkthrough video", body: "Inside three business days, you get a short video of us clicking your ad, walking through your landing page, and showing you exactly where money's leaking. Specific, plain English, no fluff." },
  { k: "03", title: "If it's worth 15 minutes, book a call", body: "No pressure, no auto-pitch. If what you see makes sense, pick a time that works — otherwise we close the file quietly.", bookingHref: "mailto:admin@clickmetric.ca?subject=Book%20a%20clickmetric%20call" },
];

const STATS = [
  { k: "No retainer", v: "Audit first, decide after. No long contracts." },
  { k: "No commitment", v: "Review the audit before any engagement." },
  { k: "Plain-English", v: "No jargon. Written for the owner." },
  { k: "3-day turnaround", v: "Walkthrough video delivered within three business days." },
];

function Nav() {
  // Mobile equivalent of the "cmadmin" keyboard shortcut: tap the CM square 5
  // times within 3 seconds to drop the activator cookie and jump to /app/.
  const tapsRef = React.useRef([]);
  const onLogoTap = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    const recent = tapsRef.current.filter((t) => now - t < 3000);
    recent.push(now);
    tapsRef.current = recent;
    if (recent.length >= 5) {
      tapsRef.current = [];
      document.cookie = "__cmw=1; Path=/; Max-Age=86400; SameSite=Lax";
      window.location.href = "/app/";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <header className="container-tight pt-7 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onLogoTap}
          aria-label="ClickMetric"
          style={{ touchAction: "manipulation" }}
          className="w-9 h-9 rounded-xl bg-char-200 text-canvas-50 grid place-items-center font-black select-none cursor-pointer"
        >
          <span className="font-display text-sm -mt-[1px]">CM</span>
        </button>
        <a href="#top" className="font-semibold tracking-tight text-char-100 text-[16px]">{BRAND}</a>
      </div>
      <nav className="hidden md:flex items-center gap-9 text-sm text-slate3-500">
        <a href="#services" className="hover:text-char-100 transition">Services</a>
        <a href="#process" className="hover:text-char-100 transition">How it works</a>
        <a href="#why" className="hover:text-char-100 transition">Why us</a>
        <a href="#request" className="hover:text-char-100 transition">Request audit</a>
      </nav>
      <div className="flex items-center gap-2">
        <a href="mailto:admin@clickmetric.ca" className="hidden md:inline-flex items-center justify-center gap-1.5 rounded-full border border-char-100/15 text-char-100 font-medium px-4 py-2.5 text-[13px] hover:border-teal2-500 hover:text-teal2-600 transition">
          <MailIcon /> Email us
        </a>
        <a href="tel:+16047981765" className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full border border-char-100/15 text-char-100 font-medium px-4 py-2.5 text-[13px] hover:border-teal2-500 hover:text-teal2-600 transition">
          <PhoneIcon /> (604) 798-1765
        </a>
        <a href="#request" className="btn-primary text-[13px] px-5 py-2.5">Request a free audit</a>
      </div>
    </header>
  );
}

function VideoPreview() {
  return (
    <div className="relative mt-2">
      <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-teal2-500/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-6 w-56 h-56 rounded-full bg-coral-500/10 blur-3xl pointer-events-none" />

      <div className="relative card overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-char-100/[.07] bg-canvas-100/50">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-canvas-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-canvas-300" />
          <span className="ml-3 text-[11px] text-slate3-500 font-mono">your audit — walkthrough.mp4</span>
        </div>

        {/* Video frame */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-char-200 via-char-100 to-char-200">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 100 60" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fafaf7" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#grid)"/>
          </svg>

          {/* Annotation callout */}
          <div className="absolute left-[14%] top-[22%]">
            <div className="relative w-16 h-10">
              <div className="absolute inset-0 rounded-full border-[1.5px] border-coral-500 animate-pulse" />
            </div>
            <div className="mt-2 ml-3 inline-flex items-center gap-1.5 bg-coral-500 text-canvas-50 text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16h.01"/></svg>
              Gap flagged
            </div>
          </div>

          {/* Cursor */}
          <svg className="absolute right-[25%] top-[55%]" width="22" height="22" viewBox="0 0 24 24" fill="#fafaf7" stroke="#1a1a1c" strokeWidth="1.3" strokeLinejoin="round">
            <path d="M5 3l5 16 3-7 7-3z"/>
          </svg>

          {/* Center play */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-teal2-500 rounded-full blur-xl opacity-50 scale-110" />
              <div className="relative w-16 h-16 rounded-full bg-teal2-500 grid place-items-center shadow-cta">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fafaf7"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="absolute left-5 right-5 bottom-4">
            <div className="h-1 w-full bg-canvas-50/15 rounded-full overflow-hidden">
              <div className="h-full w-[42%] bg-teal2-400" />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-canvas-200/70 font-mono">
              <span>0:52</span>
              <span>Walkthrough · 2:04</span>
            </div>
          </div>
        </div>

        {/* Caption strip */}
        <div className="px-5 py-4 border-t border-char-100/[.07] bg-canvas-50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal2-500/15 grid place-items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] text-char-200 font-semibold leading-tight">What a prospect gets</div>
            <div className="text-[12px] text-slate3-500 leading-snug">A 2-minute walkthrough calling out specific gaps on their own ad + page.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditForm({ compact }) {
  const [state, setState] = useState({ name: "", business: "", website: "", email: "", notes: "" });
  const [status, setStatus] = useState({ sending: false, ok: false, error: "" });

  function up(k, v) { setState((s) => ({ ...s, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!state.email || !state.website) {
      setStatus({ sending: false, ok: false, error: "Email and website are required." });
      return;
    }
    setStatus({ sending: true, ok: false, error: "" });
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Submission failed");
      setStatus({ sending: false, ok: true, error: "" });
      setState({ name: "", business: "", website: "", email: "", notes: "" });
    } catch (err) {
      setStatus({ sending: false, ok: false, error: err.message || "Something went wrong." });
    }
  }

  if (status.ok) {
    return (
      <div className="rounded-2xl bg-canvas-50 border border-teal2-500/40 shadow-card p-7 md:p-9 text-char-100">
        <div className="eyebrow mb-2">Request received</div>
        <h3 className="font-display text-2xl font-semibold mb-3">Got it.</h3>
        <p className="text-slate3-500 leading-relaxed text-[15px]">
          You'll hear from us within one business day with a confirmation, and your walkthrough video arrives within three business days. If anything would help us run a better audit, just reply to the confirmation email.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ sending: false, ok: false, error: "" })}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal2-600 hover:text-teal2-500 transition"
        >
          Submit another request <ArrowIcon />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-2xl bg-canvas-50 border border-char-100/[.1] shadow-card ${compact ? "p-6" : "p-7 md:p-9"}`}>
      {!compact && (
        <div className="mb-6">
          <div className="eyebrow mb-2">Request a free audit</div>
          <h3 className="font-display text-[26px] md:text-3xl font-semibold leading-[1.15] text-char-200">
            Walkthrough video, delivered in 3 business days.
          </h3>
          <p className="mt-2 text-slate3-500 text-[15px] leading-relaxed">
            Free, no obligation. Review the audit before any engagement.
          </p>
        </div>
      )}
      {compact && (
        <div className="mb-4">
          <div className="eyebrow mb-1">Request a free audit</div>
          <h3 className="font-display text-[20px] font-semibold leading-[1.15] text-char-200">
            Walkthrough video, delivered in 3 business days.
          </h3>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="label">Your name</label>
          <input className="input" placeholder="First + last" value={state.name} onChange={(e) => up("name", e.target.value)} />
        </div>
        <div>
          <label className="label">Business name</label>
          <input className="input" placeholder="Company name" value={state.business} onChange={(e) => up("business", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Website or ad URL<span className="text-coral-500">*</span></label>
          <input className="input" placeholder="https://your-site.ca" value={state.website} onChange={(e) => up("website", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Email<span className="text-coral-500">*</span></label>
          <input className="input" type="email" placeholder="you@your-business.ca" value={state.email} onChange={(e) => up("email", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Anything specific worth looking at? <span className="text-slate3-400 normal-case tracking-normal text-[11px] font-medium">(optional)</span></label>
          <textarea className="input min-h-[70px] resize-none" placeholder="E.g. a specific service or campaign you want eyes on." value={state.notes} onChange={(e) => up("notes", e.target.value)} />
        </div>
      </div>
      {status.error && (
        <div className="mt-4 text-sm text-coral-600 bg-coral-500/[.08] border border-coral-500/25 rounded-lg px-4 py-3">
          {status.error}
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status.sending} className="btn-primary disabled:opacity-60 disabled:cursor-wait">
          {status.sending ? "Sending…" : <>Request audit <ArrowIcon /></>}
        </button>
        <span className="text-xs text-slate3-400">Reply within one business day.</span>
      </div>
    </form>
  );
}

function Hero() {
  return (
    <section id="top" className="container-tight pt-6 md:pt-8 pb-14 relative min-h-[calc(100vh-70px)] flex items-center">
      <div className="grid lg:grid-cols-5 gap-10 items-start w-full">
        <div className="lg:col-span-3">
          <div className="eyebrow mb-4">Independent paid-search audit</div>
          <h1 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.015em] text-char-200">
            See exactly where your <span className="text-teal2-500">Google&nbsp;Ads budget</span> is leaking — before you spend another dollar.
          </h1>
          <p className="mt-5 text-[16px] text-slate3-500 max-w-xl leading-relaxed">
            A short walkthrough video of your own ad and the page it points to. Specific, plain English, delivered within three business days. Free, with no obligation.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3 max-w-xl">
            {STATS.map((s) => (
              <div key={s.k} className="flex items-start gap-2.5 text-[13px] text-slate3-500">
                <CheckDot />
                <div>
                  <div className="text-char-100 font-medium leading-tight">{s.k}</div>
                  <div className="text-slate3-400 text-[12px] leading-snug">{s.v}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="lg:col-span-2" id="request">
          <AuditForm compact />
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative py-24 bg-canvas-50 border-y border-char-100/[.07]">
      <div className="container-tight">
        <div className="max-w-2xl mb-14">
          <div className="eyebrow mb-4">What we audit</div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.015em] leading-[1.05] text-char-200">
            Two ways we audit — one is free.
          </h2>
          <p className="mt-5 text-slate3-500 leading-relaxed text-[16px]">
            The free audit covers everything a real customer sees from the outside — your ad, your landing page, the tracking visible to any visitor. If you want us to go deeper into the account itself, that's a separate engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {TIERS.map((t, idx) => (
            <article key={t.k} className={`card p-8 relative ${idx === 0 ? "border-teal2-500/40 shadow-[0_1px_0_rgba(26,26,28,.03),0_20px_50px_-24px_rgba(15,118,110,.18)]" : ""}`}>
              {idx === 0 && (
                <div className="absolute -top-3 left-6 bg-teal2-500 text-canvas-50 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full">
                  Starts here
                </div>
              )}
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-teal2-500 font-semibold text-xs tracking-wider">{t.k}</span>
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate3-500">{t.tag}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-char-200 mb-2 leading-snug">{t.title}</h3>
              <div className="inline-flex items-center gap-2 text-[12px] font-medium text-slate3-500 bg-canvas-100 border border-char-100/[.08] rounded-full px-3 py-1 mb-5">
                <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? "bg-teal2-500" : "bg-coral-500"}`} />
                {t.access}
              </div>
              <ul className="space-y-3 text-[15px] text-slate3-600 leading-snug">
                {t.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-3">
                    <CheckDot />
                    <span className="text-char-100/90">{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate3-500 max-w-xl mx-auto leading-relaxed">
          Every line above is something a customer or a verifier could confirm — we don't claim access to what we can't see.
        </p>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="container-tight py-24 relative">
      <div className="max-w-2xl mb-14">
        <div className="eyebrow mb-4">How it works</div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.015em] leading-[1.05] text-char-200">
          Three steps. No commitment.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative">
        <div className="absolute hidden md:block top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-teal2-500/0 via-teal2-500/40 to-teal2-500/0" />
        {PROCESS.map((p) => (
          <div key={p.k} className="relative">
            <div className="w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-teal2-500/15 rounded-2xl rotate-[-6deg]" />
              <div className="absolute inset-0 bg-canvas-50 border border-teal2-500/40 rounded-2xl grid place-items-center">
                <span className="font-display text-teal2-500 font-bold text-2xl">{p.k}</span>
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold text-char-200 mb-3">{p.title}</h3>
            <p className="text-slate3-500 text-[15px] leading-relaxed">{p.body}</p>
            {p.bookingHref && (
              <a href={p.bookingHref} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal2-600 hover:text-teal2-500 transition">
                Book a 15-minute call <ArrowIcon />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Why() {
  return (
    <section id="why" className="relative py-24 border-y border-char-100/[.07] bg-canvas-50">
      <div className="container-tight relative">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <div className="eyebrow mb-4">Why us</div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.015em] leading-[1.05] text-char-200">
              A second opinion on where your paid-search money is going.
            </h2>
          </div>
          <div className="space-y-6 text-[16px] text-slate3-500 leading-relaxed">
            <p>
              Most paid-search providers charge a monthly retainer and get on with the work. That's fine — until you want to know whether the work is actually earning its keep.
            </p>
            <p>
              <span className="text-char-100 font-medium">We're the second set of eyes.</span> We watch what the real search experience looks like for a paying customer, and we flag — in plain English — where it loses them.
            </p>
            <p>
              If what we find is useful and you want to tighten it with us, that's a short follow-up conversation. The video is deliberately not a full fix list — it's enough to tell you whether a conversation is worth your fifteen minutes.
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <a href="#request" className="btn-primary">Request a free audit <ArrowIcon /></a>
              <a href="tel:+16047981765" className="btn-secondary"><PhoneIcon /> Call (604) 798-1765</a>
              <a href="mailto:admin@clickmetric.ca" className="btn-secondary"><MailIcon /> Email admin@clickmetric.ca</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Why is the audit free?", a: "The video is how we show what we do. If it's useful and you want help, we can talk. If not, we close the file and that's it." },
  { q: "What do you need from me?", a: "Your website or ad URL and an email address. That's enough for us to find your ad and the page it sends people to." },
  { q: "Do you need access to my Google Ads account?", a: "Not for the free video. It's based on what's visible from the outside: your ad, your landing page, and your site. A deeper review of campaigns, search terms, and conversion settings is only possible if you choose to give us access later." },
  { q: "What happens after I get the video?", a: "You decide. If it's worth 15 minutes, book a call. Nothing is sold automatically and nobody chases you." },
  { q: "What do you do with my information?", a: "We use your details only to send your audit video and follow up on it. We cap the form at two requests per email so no one gets spammed. Nothing is sold or shared." },
];

function FAQSection() {
  return (
    <section id="faq" className="container-tight py-24 relative">
      <div className="max-w-2xl mb-10">
        <div className="eyebrow mb-4">Common questions</div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.015em] leading-[1.05] text-char-200">
          Straight answers before you ask.
        </h2>
      </div>
      <div className="max-w-3xl space-y-3">
        {FAQ.map((item, i) => (
          <details key={i} className="group card p-6 open:border-teal2-500/40 transition">
            <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
              <h3 className="font-display text-[18px] font-semibold text-char-200 leading-snug">{item.q}</h3>
              <span className="flex-shrink-0 mt-1 w-6 h-6 rounded-full border border-char-100/15 grid place-items-center text-char-100 group-open:rotate-45 group-open:border-teal2-500 group-open:text-teal2-500 transition">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
              </span>
            </summary>
            <p className="mt-4 text-slate3-600 text-[15px] leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-canvas-50 border-y border-char-100/[.07]">
      <div className="container-tight max-w-3xl">
        <div className="eyebrow mb-4">Who's behind ClickMetric</div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.015em] leading-[1.05] text-char-200 mb-6">
          Operators, not an agency.
        </h2>
        <div className="space-y-5 text-[16px] text-slate3-600 leading-relaxed">
          <p>
            ClickMetric is run by <span className="text-char-100 font-medium">Tyler Davis</span> in <span className="text-char-100 font-medium">British Columbia</span>. We've been building websites since 2005 and managing paid-ad campaigns for small businesses alongside running several of our own — so we know what it costs when ad spend doesn't turn into phone calls.
          </p>
          <p>
            The service started because we kept seeing good businesses pay for paid-search campaigns that nobody — the owner included — had actually looked at from a customer's point of view. The free walkthrough is our way of pointing at the gap. Fixing it, if you want help, is the paid conversation that follows.
          </p>
          <p className="text-char-100">
            Questions you'd rather not type into a form? <a className="text-teal2-600 hover:text-teal2-500 transition font-medium" href="mailto:admin@clickmetric.ca">admin@clickmetric.ca</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="relative min-h-screen">
      <header className="container-tight pt-7 flex items-center justify-between">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ""; }} className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-char-200 text-canvas-50 grid place-items-center font-black">
            <span className="font-display text-sm -mt-[1px]">CM</span>
          </span>
          <span className="font-semibold tracking-tight text-char-100 text-[16px]">{BRAND}</span>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ""; }} className="text-sm text-slate3-500 hover:text-char-100 transition">← Back to home</a>
      </header>
      <main className="container-tight max-w-3xl py-16">
        <div className="eyebrow mb-4">Privacy policy</div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.015em] leading-[1.05] text-char-200 mb-6">Privacy Policy</h1>
        <div className="rounded-xl bg-coral-500/[.08] border border-coral-500/30 p-5 mb-10 text-[14px] text-ember2-600">
          <strong>DRAFT — not legal advice.</strong> This page is a scaffold based on common Canadian privacy practice (PIPEDA). Have the final text reviewed by a Canadian privacy lawyer before relying on it. Replace every <code className="font-mono text-[13px]">[TODO]</code> below.
        </div>
        <div className="space-y-8 text-[16px] text-slate3-600 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">Who we are</h2>
            <p>ClickMetric is operated by Tyler Davis in British Columbia, Canada. Contact: <a href="mailto:admin@clickmetric.ca" className="text-teal2-600 hover:text-teal2-500">admin@clickmetric.ca</a> · (604) 798-1765.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">What we collect</h2>
            <p>The audit-request form on clickmetric.ca collects: your name, business name, website / ad URL, email address, and any notes you provide. Submissions are limited to two per email address.</p>
            <p className="mt-2">We also keep basic request logs (IP address, user agent) for the submission for abuse prevention.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">How we use it</h2>
            <p>We use the information you submit to produce your audit video and follow up on it with you directly. We do not sell, rent, or share your details with third parties. We do not add you to a general mailing list.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">How long we keep it</h2>
            <p>We retain audit requests for <strong>[TODO: 12 months]</strong> after the audit is delivered unless you ask us to delete it sooner. Email us at admin@clickmetric.ca to request deletion.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">Analytics</h2>
            <p>We use <strong>[TODO: Cloudflare Web Analytics / none configured yet]</strong> to measure anonymous page visits. No personally identifying tracking cookies are used.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">Your rights</h2>
            <p>Under Canadian privacy law (PIPEDA + applicable provincial law) you can request access to the information we hold about you, correction of any inaccuracies, or deletion. Email admin@clickmetric.ca and we'll respond within 30 days.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold text-char-200 mb-3">Updates</h2>
            <p>If this policy changes materially we'll update the date below and, where appropriate, email anyone with a live audit on file.</p>
            <p className="text-slate3-400 text-sm mt-4">Last updated: [TODO: before shipping]</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="container-tight pt-14 pb-10">
      <div className="divider mb-10" />
      <div className="grid md:grid-cols-3 gap-8 text-[14px] text-slate3-600 leading-relaxed">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-lg bg-char-200 text-canvas-50 grid place-items-center font-black">
              <span className="font-display text-sm">CM</span>
            </span>
            <span className="text-char-100 font-semibold tracking-tight">{BRAND}</span>
          </div>
          <p className="text-slate3-500 text-[13px] max-w-xs">
            Independent paid-search audits for owner-run businesses in BC.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3 text-char-100/60">Contact</div>
          <div className="space-y-1.5">
            <div><a href="mailto:admin@clickmetric.ca" className="hover:text-teal2-600 transition">admin@clickmetric.ca</a></div>
            <div><a href="tel:+16047981765" className="hover:text-teal2-600 transition">(604) 798-1765</a></div>
            <div><a href="https://clickmetric.ca" className="hover:text-teal2-600 transition">clickmetric.ca</a></div>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-3 text-char-100/60">Business</div>
          <div className="space-y-1.5 text-slate3-500 text-[13px]">
            <div><span className="text-char-100/80">ClickMetric</span></div>
            <div>British Columbia, Canada</div>
            <div className="pt-1"><a href="#/privacy" className="hover:text-teal2-600 transition">Privacy Policy</a></div>
          </div>
        </div>
      </div>
      <div className="divider mt-10 mb-5" />
      <div className="text-slate3-400 text-xs tracking-wider uppercase text-center">
        © {year} ClickMetric · All rights reserved
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.86 19.86 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckDot() {
  return (
    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-teal2-500/15 grid place-items-center">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function App() {
  // Simple hash-based route for /privacy — anything else renders the main site.
  const [path, setPath] = React.useState(typeof window !== "undefined" ? window.location.hash : "");
  React.useEffect(() => {
    const h = () => setPath(window.location.hash);
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);

  // Hidden admin activator — type "cmadmin" anywhere on the page to drop a
  // cookie and jump to /app. Not linked anywhere else; invisible to normal
  // visitors. Real auth sits on top via Cloudflare Access.
  React.useEffect(() => {
    const SEQ = "cmadmin";
    let buffer = "";
    const onKey = (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (!/^[a-z]$/i.test(e.key)) { buffer = ""; return; }
      buffer = (buffer + e.key.toLowerCase()).slice(-SEQ.length);
      if (buffer === SEQ) {
        // Max-age 24h, HttpOnly can't be set from JS; this is just the gate
        // (CF Access provides real auth on top).
        document.cookie = "__cmw=1; Path=/; Max-Age=86400; SameSite=Lax";
        window.location.href = "/app/";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (path.startsWith("#/privacy")) return <PrivacyPage />;
  return (
    <div className="relative min-h-screen">
      <Nav />
      <Hero />
      <Services />
      <Process />
      <Why />
      <FAQSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
