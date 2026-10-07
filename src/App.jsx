import React, { useState } from "react";

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

const SERVICES = [
  { k: "01", icon: IconAds, title: "Google Ads account audit",
    body: "Every active campaign, ad group, and keyword goes under the microscope. We flag mismatched intent, wasted spend, and the gaps between what your ad promises and where it sends people." },
  { k: "02", icon: IconLanding, title: "Landing-page experience review",
    body: "The page a paid click lands on is the single biggest lever on return. We walk through yours like a real customer and tell you where visitors drop off — in plain English, not jargon." },
  { k: "03", icon: IconTracking, title: "Conversion tracking check",
    body: "If Google can't see which clicks become customers, it can't bid for the right ones. We verify what's being tracked, what isn't, and what that costs you per month." },
  { k: "04", icon: IconMatch, title: "Message-match + ad copy",
    body: "Your ad is a promise. We score how closely your landing page honours it — a mismatch is the fastest, cheapest leak most owner-run shops are paying for right now." },
  { k: "05", icon: IconCall, title: "Call tracking + lead capture",
    body: "Most trades, home services, and emergency businesses close over the phone. We check whether those calls are being counted, and whether your form is quietly turning leads away." },
  { k: "06", icon: IconSpend, title: "Spend sanity-check",
    body: "We estimate the range you're likely spending against the clicks you're buying, and whether that number is working for the leads it brings in." },
];

const PROCESS = [
  { k: "01", title: "You submit a short request", body: "Business name, website, and roughly what you're advertising. That's enough for us to find your campaign and start digging in." },
  { k: "02", title: "We send you a walkthrough video", body: "Inside three business days, you get a short video of us clicking your ad, walking through your landing page, and showing you exactly where money's leaking. Specific, plain English, no fluff." },
  { k: "03", title: "If it's worth 15 minutes, book a call", body: "No pressure, no auto-pitch. If what you see makes sense and you want help tightening the campaign, book a call. If not, we close the file quietly." },
];

const STATS = [
  { k: "No retainer", v: "Audit first, decide after. No long contracts." },
  { k: "No commitment", v: "Review the audit before any engagement." },
  { k: "Plain-English", v: "No jargon. Written for the owner." },
  { k: "3-day turnaround", v: "Walkthrough video delivered within three business days." },
];

function Nav() {
  return (
    <header className="container-tight pt-7 flex items-center justify-between relative z-10">
      <a href="#top" className="flex items-center gap-3 group">
        <span className="w-9 h-9 rounded-xl bg-char-200 text-canvas-50 grid place-items-center font-black">
          <span className="font-display text-sm -mt-[1px]">CM</span>
        </span>
        <span className="font-semibold tracking-tight text-char-100 text-[16px]">{BRAND}</span>
      </a>
      <nav className="hidden md:flex items-center gap-9 text-sm text-slate3-500">
        <a href="#services" className="hover:text-char-100 transition">Services</a>
        <a href="#process" className="hover:text-char-100 transition">How it works</a>
        <a href="#why" className="hover:text-char-100 transition">Why us</a>
        <a href="#request" className="hover:text-char-100 transition">Request audit</a>
      </nav>
      <a href="#request" className="btn-primary text-[13px] px-5 py-2.5">Request a free audit</a>
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
        <h3 className="font-display text-2xl font-semibold mb-3">We're on it.</h3>
        <p className="text-slate3-500 leading-relaxed text-[15px]">
          You'll have a walkthrough video within three business days. If anything else would help us run a better audit, just reply to the confirmation email.
        </p>
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
            Six categories. One short video. No runaround.
          </h2>
          <p className="mt-5 text-slate3-500 leading-relaxed text-[16px]">
            A real audit, not a sales deck. We walk through what Google and a customer actually see — and tell you where money's going and where it isn't.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <article key={s.k} className="card p-7 hover:border-teal2-500/40 hover:-translate-y-[2px] transition group">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-teal2-500/[.08] text-teal2-500 grid place-items-center group-hover:bg-teal2-500 group-hover:text-canvas-50 transition">
                    <span className="w-6 h-6 block"><Icon /></span>
                  </div>
                  <span className="font-mono text-slate3-400 font-semibold text-xs tracking-wider">{s.k}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-char-200 mb-3 leading-snug">{s.title}</h3>
                <p className="text-slate3-500 text-[15px] leading-relaxed">{s.body}</p>
              </article>
            );
          })}
        </div>
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
              <span className="text-char-100 font-medium">We're the second set of eyes.</span> We watch what the real search experience looks like for a paying customer, and we tell you specifically where it loses them.
            </p>
            <p>
              If what we find is useful, we fix it with you. The whole point is you end up as the owner with the information — not someone being told what to think.
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <a href="#request" className="btn-primary">Request a free audit <ArrowIcon /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="container-tight pb-14 pt-12">
      <div className="divider mb-10" />
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-char-200 text-canvas-50 grid place-items-center font-black">
            <span className="font-display text-sm">CM</span>
          </span>
          <span className="text-char-100 font-semibold tracking-tight">{BRAND}</span>
          <span className="text-slate3-400 text-sm ml-2 hidden md:inline">— Independent paid-search review</span>
        </div>
        <div className="text-slate3-400 text-xs tracking-wider uppercase">
          © {new Date().getFullYear()} · All rights reserved
        </div>
      </div>
    </footer>
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
  return (
    <div className="relative min-h-screen">
      <Nav />
      <Hero />
      <Services />
      <Process />
      <Why />
      <Footer />
    </div>
  );
}
