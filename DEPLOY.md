# ClickMetric — Deploy

The site is a static Vite build. Deploy target: Cloudflare Pages.

## Credentials in use

- **Email (owner of all accounts):** clickmetric.ca@gmail.com
- **Domain:** clickmetric.ca
- **Public email (what appears on the site + close card):** hello@clickmetric.ca → forwards via Cloudflare Email Routing to clickmetric.ca@gmail.com

## One-time setup (Sarah's hands-on list)

1. **Sign up for GitHub** at [github.com/signup](https://github.com/signup) with `clickmetric.ca@gmail.com`. Handle suggestion: `clickmetric`.
2. **Create an empty repo** named `clickmetric-site` on the new account. Don't initialize with README.
3. **Generate a Personal Access Token (PAT)** at `github.com/settings/tokens` with `repo` + `workflow` scope — paste it here so I can push the first commit, or add me as collaborator (less secure, works).
4. **Sign up for Cloudflare** at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) with the same email.
5. **Register `clickmetric.ca`** at `dash.cloudflare.com/?to=/:account/registrar/register` (Cloudflare Registrar — cleanest since Pages lives in the same account). Or register elsewhere and point nameservers at Cloudflare after.
6. **Enable Cloudflare Email Routing** (Dashboard → Email → Email Routing) once the domain is in Cloudflare — set `hello@clickmetric.ca` to forward to `clickmetric.ca@gmail.com`. This is what makes the public email on the close card actually land somewhere.
7. **For the form backend** sign up at [resend.com](https://resend.com) with the same email, verify the sending domain `clickmetric.ca`, and copy the `RESEND_API_KEY`.

## Deploy pipeline

Cloudflare Pages auto-detects Vite:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20

Pages Functions in `/functions/` deploy automatically alongside the static assets.

### Environment variables (Pages → Settings → Environment variables)

| Var | Value |
|---|---|
| `RESEND_API_KEY` | copied from resend.com dashboard |
| `NOTIFY_TO` | `clickmetric.ca@gmail.com` |
| `NOTIFY_FROM` | `forms@clickmetric.ca` (verified in Resend) — use `onboarding@resend.dev` until the domain is verified in Resend |

If any of the three are missing, submissions still return `{ok:true}` to the user — the form never looks broken — and the entry shows up in Pages request logs for manual replay.

## Local dev

```bash
npm install
npm run dev    # serves on http://127.0.0.1:5177
```

Dev-mode form submissions hit the vite middleware in `vite.config.js` and get written to `./leads.json`. The Pages Function in `functions/api/audit-request.js` only runs on the deployed site.

## Custom domain

Once Pages is building successfully, in the Pages dashboard: Custom Domain → Add → `clickmetric.ca` + `www.clickmetric.ca`. Cloudflare handles the SSL + DNS automatically if the domain is on Cloudflare DNS.
