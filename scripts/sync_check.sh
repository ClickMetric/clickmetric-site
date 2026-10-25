#!/usr/bin/env bash
# sync_check.sh — read CHANGES_LIVE.md tail and show only entries NEWER
# than the last time THIS session called sync_check.
#
# Each session should run this at turn start when working in this repo.
# Example (put in AGENTS.md): run `bash scripts/sync_check.sh` before any
# edit/deploy to see what the other Henderson did since last check.
#
# Session identity comes from HENDERSON_SESSION env var (set per-shell).
# A tiny marker file per session is stored at
#   .git/henderson_sync/<session>.ts
# with the last-seen entry timestamp.

set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$REPO/CHANGES_LIVE.md"
ACTOR="${HENDERSON_SESSION:-unknown}"
MARK_DIR="$REPO/.git/henderson_sync"
MARK="$MARK_DIR/${ACTOR}.ts"
mkdir -p "$MARK_DIR"
LAST="$(cat "$MARK" 2>/dev/null || echo "1970-01-01T00:00:00Z")"

# All log lines whose ISO timestamp > LAST and not from this actor.
NEW="$(awk -v last="$LAST" -v me="actor=$ACTOR" '
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T/ {
    ts=$1
    if (ts > last && index($0, me) == 0) print $0
  }' "$LOG" || true)"

if [ -z "$NEW" ]; then
  echo "sync_check: no new entries from other sessions since $LAST"
else
  echo "=== sync_check: new entries from other sessions since $LAST ==="
  echo "$NEW"
  echo "=== end sync_check ==="
fi

# Advance marker to latest entry overall (so we never re-report the same line)
LATEST_TS="$(awk '/^[0-9]{4}-[0-9]{2}-[0-9]{2}T/ {ts=$1} END {print ts}' "$LOG")"
if [ -n "$LATEST_TS" ]; then echo "$LATEST_TS" > "$MARK"; fi
exit 0
