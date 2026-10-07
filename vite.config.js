import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Local audit-request handler. Writes submissions to leads.json so Sarah can
// read them offline. In production this would hit a real backend (Formspree,
// Netlify Forms, etc) — swap the fetch URL in App.jsx when that's wired up.
function auditRequestApi() {
  return {
    name: "audit-request-api",
    configureServer(server) {
      server.middlewares.use("/api/audit-request", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          try {
            const data = JSON.parse(body || "{}");
            const entry = { ts: new Date().toISOString(), ...data };
            const file = path.resolve("./leads.json");
            let arr = [];
            if (fs.existsSync(file)) {
              try { arr = JSON.parse(fs.readFileSync(file, "utf-8")); } catch (e) {}
            }
            arr.push(entry);
            fs.writeFileSync(file, JSON.stringify(arr, null, 2));
            console.log(`[audit-request] saved from ${entry.email || "anon"}`);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), auditRequestApi()],
});
