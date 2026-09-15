// Flusso admin locale con Auth, REST e Storage sintetici. Nessuna credenziale o scrittura remota.
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
const base = "http://127.0.0.1:5173";
const user = { id: "00000000-0000-4000-8000-000000000001", email: "admin@example.test", aud: "authenticated", role: "authenticated", app_metadata: { provider: "email", providers: ["email"] }, user_metadata: {}, created_at: new Date().toISOString(), email_confirmed_at: new Date().toISOString() };
const objects = new Map();
const events = new Map();
let failRpc = false;
const bucketKey = (bucket, path) => `${bucket}:${path}`;

try {
  const page = await browser.newPage();
  const errors = []; page.on("pageerror", error => errors.push(error.message));
  await page.route(/https?:\/\/[^/]+\/(rest|auth|functions|storage)\/v1\//, async route => {
    const request = route.request(); const url = new URL(request.url()); const path = url.pathname; const method = request.method();
    if (path.includes("/auth/v1/token")) return route.fulfill({ json: { access_token: "local-qa-token", refresh_token: "local-qa-refresh", token_type: "bearer", expires_in: 3600, user } });
    if (path.includes("/auth/v1/user")) return route.fulfill({ json: user });
    if (path.endsWith("/rest/v1/user_roles")) return route.fulfill({ json: [{ role: "admin" }] });
    if (path.endsWith("/rest/v1/site_events")) {
      let rows = [...events.values()];
      if (url.searchParams.get("status") === "eq.published") rows = rows.filter(event => event.status === "published");
      const imageFilter = url.searchParams.get("original_image_path");
      if (imageFilter?.startsWith("eq.")) rows = rows.filter(event => event.original_image_path === imageFilter.slice(3));
      return route.fulfill({ json: rows });
    }
    if (path.endsWith("/rest/v1/rpc/save_site_event")) {
      if (failRpc) { failRpc = false; return route.fulfill({ status: 503, json: { message: "Errore di rete sintetico" } }); }
      const input = request.postDataJSON(); const current = input.p_id ? events.get(input.p_id) : null;
      if (current ? current.revision !== input.p_expected_revision : input.p_expected_revision !== 0) return route.fulfill({ status: 409, json: { code: "40001", message: "Conflitto di revisione" } });
      const bucket = input.p_status === "published" ? "event-posters" : "event-poster-drafts";
      if (!objects.has(bucketKey(bucket, input.p_original_image_path)) || !objects.has(bucketKey(bucket, input.p_thumbnail_image_path))) return route.fulfill({ status: 400, json: { message: "Locandina mancante" } });
      const now = new Date().toISOString();
      const saved = { id: current?.id ?? randomUUID(), title: input.p_title, description: input.p_description, start_date: input.p_start_date, end_date: input.p_end_date, original_image_path: input.p_original_image_path, thumbnail_image_path: input.p_thumbnail_image_path, status: input.p_status, revision: current ? current.revision + 1 : 1, created_at: current?.created_at ?? now, updated_at: now };
      events.set(saved.id, saved); return route.fulfill({ json: saved });
    }
    if (path.includes("/storage/v1/object/")) {
      const signed = path.match(/\/object\/sign\/([^/]+)\/(.+)$/);
      if (signed && method === "POST") return route.fulfill({ json: { signedURL: `/storage/v1/object/sign/${signed[1]}/${signed[2]}?token=synthetic` } });
      const object = path.match(/\/object\/(?:public\/|sign\/)?([^/]+)\/(.+)$/);
      const bulk = path.match(/\/object\/([^/]+)$/);
      if (bulk && method === "DELETE") {
        const prefixes = request.postDataJSON().prefixes ?? [];
        for (const prefix of prefixes) objects.delete(bucketKey(bulk[1], prefix));
        return route.fulfill({ json: prefixes.map(name => ({ name })) });
      }
      if (object && method === "POST") { objects.set(bucketKey(object[1], object[2]), request.postDataBuffer()); return route.fulfill({ json: { Key: object[2] } }); }
      if (object && method === "GET") { const body = objects.get(bucketKey(object[1], object[2])); return body ? route.fulfill({ body, contentType: object[2].endsWith(".webp") ? "image/webp" : "image/png" }) : route.fulfill({ status: 404, json: { message: "File non trovato" } }); }
    }
    return route.fulfill({ json: [] });
  });
  await page.goto(`${base}/login`);
  await page.locator("#email").fill("admin@example.test");
  await page.locator("#password").fill("LocalTest123!");
  await page.getByRole("button", { name: "Accedi", exact: true }).click();
  await page.waitForURL(`${base}/admin`, { timeout: 7000 });
  await page.getByRole("tab", { name: "Eventi" }).click();
  await page.locator("#event-title").fill("Evento QA");
  await page.locator("#event-start").fill("2026-10-12");
  await page.locator("#event-end").fill("2026-10-13");
  await page.locator("#event-description").fill("Descrizione completa per la prova locale.");
  await page.locator("#event-poster").setInputFiles("public/favicon.png");
  await page.getByRole("button", { name: "Salva bozza" }).click();
  await page.getByText("Bozza salvata", { exact: true }).waitFor({ timeout: 7000 });
  assert.equal([...events.values()][0].status, "draft");
  assert([...objects.keys()].every(key => key.startsWith("event-poster-drafts:")));
  await page.getByRole("button", { name: "Pubblica", exact: true }).click();
  await page.getByText("Evento pubblicato", { exact: true }).waitFor({ timeout: 7000 });
  assert.equal([...events.values()][0].status, "published");
  assert([...objects.keys()].every(key => key.startsWith("event-posters:")));
  await page.getByRole("button", { name: "Archivia" }).click();
  await page.getByText("Evento archiviato", { exact: true }).waitFor({ timeout: 7000 });
  assert.equal([...events.values()][0].status, "archived");
  assert([...objects.keys()].every(key => key.startsWith("event-poster-drafts:")));
  await page.getByRole("button", { name: "Ripristina bozza" }).click();
  await page.getByText("Bozza salvata", { exact: true }).waitFor({ timeout: 7000 });
  assert.equal([...events.values()][0].status, "draft");
  const current = [...events.values()][0];
  events.set(current.id, { ...current, revision: current.revision + 1 });
  await page.locator("#event-description").fill("Testo conservato dopo conflitto");
  await page.getByRole("button", { name: "Salva bozza" }).click();
  await page.getByText("Operazione non riuscita", { exact: true }).waitFor({ timeout: 7000 });
  assert.equal(await page.locator("#event-description").inputValue(), "Testo conservato dopo conflitto");
  await page.reload();
  await page.getByRole("tab", { name: "Eventi" }).click();
  await page.getByRole("button", { name: /Evento QA/ }).first().click();
  failRpc = true;
  await page.locator("#event-description").fill("Testo dopo errore di rete");
  await page.locator("#event-poster").setInputFiles("public/favicon.png");
  await page.getByRole("button", { name: "Salva bozza" }).click();
  await page.getByText("Operazione non riuscita", { exact: true }).waitFor({ timeout: 7000 });
  assert.equal(await page.locator("#event-description").inputValue(), "Testo dopo errore di rete");
  assert.equal(objects.size, 2, "Un errore RPC non deve lasciare i nuovi file");
  const beforeReplace = [...events.values()][0].original_image_path;
  await page.getByRole("button", { name: "Salva bozza" }).click();
  await page.getByText("Bozza salvata", { exact: true }).waitFor({ timeout: 7000 });
  assert.notEqual([...events.values()][0].original_image_path, beforeReplace, "La nuova locandina deve essere salvata");
  assert.equal(objects.size, 2, "La vecchia locandina va rimossa dopo il commit del database");
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log("Admin Eventi: bozza, pubblicazione, archivio, ripristino, conflitto, errore rete, cleanup e sostituzione locandina: OK (mock)");
} finally { await browser.close(); }
