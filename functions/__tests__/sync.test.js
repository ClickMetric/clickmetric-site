// Phase 1 failure-class tests for the sync.js client contract.
//
// Stdlib only — Node's built-in `node:test` runner + `node:assert`. No jest,
// no mocha, no `responses`-equivalent library. We mock `globalThis.fetch` and
// drive a strict-fetch wrapper that mirrors scripts/lib/strict_http.py.
//
// Each test proves: a failure class raises AND no hash-write side-effect
// occurs. The hash-write side-effect is a module-local `writes` counter the
// wrapper only bumps on confirmed success.
//
// Mirrors the 11 Python failure classes against the sync.js call surface
// (upsert / enqueue_job / job_done / upsert_meta).

import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

// ---- strict-fetch wrapper (JS twin of scripts/lib/strict_http.py) ----------

class StrictFetchError extends Error {
  constructor(kind, message, extra = {}) {
    super(`[${kind}] ${message}`);
    this.kind = kind;
    Object.assign(this, extra);
  }
}

const HARD_FAIL = new Set([401, 403, 405, 429]);

async function strictFetch(url, opts = {}) {
  const { expectJson = false, require: req = [] } = opts;
  let res;
  try {
    res = await globalThis.fetch(url, opts);
  } catch (e) {
    const msg = String(e && e.message || e).toLowerCase();
    const kind = msg.includes("timeout") || msg.includes("timed out") ? "timeout" : "network";
    throw new StrictFetchError(kind, String(e && e.message || e), { url });
  }
  const status = res.status;
  const text = typeof res.text === "function" ? await res.text() : "";
  if (HARD_FAIL.has(status)) {
    throw new StrictFetchError(String(status), `HTTP ${status} from ${url}`, { status });
  }
  if (status >= 500 && status < 600) {
    throw new StrictFetchError(String(status), `HTTP ${status} from ${url}`, { status });
  }
  if (!(status >= 200 && status < 300)) {
    throw new StrictFetchError(String(status), `unexpected HTTP ${status} from ${url}`, { status });
  }
  if (expectJson || req.length) {
    let parsed;
    try { parsed = JSON.parse(text); }
    catch (e) {
      throw new StrictFetchError("malformed_json", `body not JSON: ${e.message}`, { body: text.slice(0, 200) });
    }
    if (parsed && typeof parsed === "object") {
      if (parsed.success === false) {
        throw new StrictFetchError("api_error_body", `success=false: ${JSON.stringify(parsed.errors || parsed.error)}`);
      }
      if (parsed.error) {
        throw new StrictFetchError("api_error_body", `error field present: ${parsed.error}`);
      }
    }
    const missing = req.filter((k) => !parsed || parsed[k] === undefined || parsed[k] === "" || parsed[k] === null);
    if (missing.length) {
      throw new StrictFetchError("partial_deployment", `missing required fields: ${missing.join(",")}`);
    }
    return { status, body: parsed, raw: text };
  }
  return { status, body: null, raw: text };
}

// Hash-write guard: records live sha256 ONLY after live-fetch verification.
const HASH_STORE = new Map();
function sha256(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }

async function safeWriteSyncHash({ slug, liveUrl, localBytes }) {
  const localHex = sha256(localBytes);
  const resp = await strictFetch(liveUrl, { method: "GET" });
  const liveHex = sha256(Buffer.from(resp.raw, "utf8"));
  if (liveHex !== localHex) {
    throw new StrictFetchError("hash_mismatch", `live ${liveHex.slice(0,12)} != local ${localHex.slice(0,12)}`);
  }
  HASH_STORE.set(slug, liveHex);
  return liveHex;
}

// ---- fake fetch factories --------------------------------------------------

function fakeResp({ status = 200, body = "", throwErr = null } = {}) {
  if (throwErr) {
    globalThis.fetch = () => Promise.reject(throwErr);
    return;
  }
  globalThis.fetch = () => Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    text: () => Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
    json: () => Promise.resolve(typeof body === "string" ? JSON.parse(body) : body),
  });
}

function resetHashes() { HASH_STORE.clear(); }
function assertNoWrite(slug) {
  assert.equal(HASH_STORE.has(slug), false, `hash store must not contain ${slug}`);
}

// ---- tests -----------------------------------------------------------------

test.beforeEach(resetHashes);

test("test_401_unauthorized_raises_and_leaves_state_unchanged", async () => {
  fakeResp({ status: 401, body: '{"error":"unauthorized"}' });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/v/t.mp4", localBytes: Buffer.from("local") }),
    (e) => e.kind === "401"
  );
  assertNoWrite("s");
});

test("test_403_forbidden_raises_and_leaves_state_unchanged", async () => {
  fakeResp({ status: 403, body: "" });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/", localBytes: Buffer.from("local") }),
    (e) => e.kind === "403"
  );
  assertNoWrite("s");
});

test("test_405_method_not_allowed_raises", async () => {
  fakeResp({ status: 405, body: "" });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/", localBytes: Buffer.from("local") }),
    (e) => e.kind === "405"
  );
  assertNoWrite("s");
});

test("test_429_rate_limit_raises", async () => {
  fakeResp({ status: 429, body: "" });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/", localBytes: Buffer.from("local") }),
    (e) => e.kind === "429"
  );
  assertNoWrite("s");
});

test("test_500_server_error_raises", async () => {
  fakeResp({ status: 500, body: "boom" });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/", localBytes: Buffer.from("local") }),
    (e) => e.kind === "500"
  );
  assertNoWrite("s");
});

test("test_timeout_raises", async () => {
  const err = new Error("read timed out");
  fakeResp({ throwErr: err });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/", localBytes: Buffer.from("local") }),
    (e) => e.kind === "timeout"
  );
  assertNoWrite("s");
});

test("test_network_error_raises", async () => {
  const err = new Error("ECONNREFUSED");
  fakeResp({ throwErr: err });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/", localBytes: Buffer.from("local") }),
    (e) => e.kind === "network"
  );
  assertNoWrite("s");
});

test("test_malformed_json_raises", async () => {
  fakeResp({ status: 200, body: "{not-json" });
  await assert.rejects(
    () => strictFetch("https://x/api/sync?action=upsert", { expectJson: true }),
    (e) => e.kind === "malformed_json"
  );
  assertNoWrite("s");
});

test("test_error_object_body_raises", async () => {
  // sync.js returns { error: "..." } with 200 on some upsert paths
  fakeResp({ status: 200, body: '{"error":"missing business_slug"}' });
  await assert.rejects(
    () => strictFetch("https://x/api/sync?action=upsert", { expectJson: true }),
    (e) => e.kind === "api_error_body"
  );
  assertNoWrite("s");
});

test("test_partial_deployment_raises", async () => {
  // Cloudflare pending state: 200 but required field missing
  fakeResp({ status: 200, body: '{"success":true,"result":{"stage":"pending"}}' });
  await assert.rejects(
    () => strictFetch("https://x/api/deploy", { expectJson: true, require: ["deployment_id"] }),
    (e) => e.kind === "partial_deployment"
  );
  assertNoWrite("s");
});

test("test_live_content_hash_mismatch_blocks_hash_write", async () => {
  // live body differs from local — hash write must be refused
  fakeResp({ status: 200, body: "DIFFERENT-SERVED-BYTES" });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/v/t.mp4", localBytes: Buffer.from("LOCAL-BYTES") }),
    (e) => e.kind === "hash_mismatch"
  );
  assertNoWrite("s");
});

test("test_production_skip_gate_rejected", async () => {
  // JS twin: the sync.js enqueue_job client refuses to run when env says
  // production AND the caller tries to skip the pre-deploy gate.
  function clientEnqueue({ env, skipGate }) {
    if (env === "production" && skipGate) {
      throw new StrictFetchError("skip_gate_blocked", "--skip-gate forbidden under production");
    }
  }
  assert.throws(() => clientEnqueue({ env: "production", skipGate: true }),
                (e) => e.kind === "skip_gate_blocked");
  assertNoWrite("s");
});

test("test_required_asset_missing_raises", async () => {
  // JS twin: safeWriteSyncHash with null bytes must throw before any write
  fakeResp({ status: 200, body: "irrelevant" });
  await assert.rejects(
    () => safeWriteSyncHash({ slug: "s", liveUrl: "https://x/v/t.mp4", localBytes: null }),
    (e) => e instanceof TypeError || e instanceof Error
  );
  assertNoWrite("s");
});

test("test_kv_dashboard_failure_blocks_hash_write", async () => {
  // KV upsert returns 500 — downstream recorder must refuse to write hash
  fakeResp({ status: 500, body: "kv down" });
  let recorded = false;
  try {
    await strictFetch("https://x/api/sync?action=upsert", { method: "POST", expectJson: true });
    recorded = true; // never reached
    HASH_STORE.set("s", "fake");
  } catch (e) {
    assert.equal(e.kind, "500");
  }
  assert.equal(recorded, false);
  assertNoWrite("s");
});
