import assert from "node:assert/strict";
import { eventSchema, validatePoster } from "../src/events/eventValidation.ts";

const valid = { title: "Incontro", description: "Descrizione semplice", start_date: "2026-10-01", end_date: null };
assert.equal(eventSchema.safeParse(valid).success, true);
assert.equal(eventSchema.safeParse({ ...valid, title: "" }).success, false);
assert.equal(eventSchema.safeParse({ ...valid, title: "x".repeat(161) }).success, false);
assert.equal(eventSchema.safeParse({ ...valid, description: "x".repeat(5001) }).success, false);
assert.equal(eventSchema.safeParse({ ...valid, description: "<script>test</script>" }).success, false);
assert.equal(eventSchema.safeParse({ ...valid, end_date: "2026-09-30" }).success, false);

const jpeg = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], "poster.jpg", { type: "image/jpeg" });
await validatePoster(jpeg);
const invalid = new File(["plain text"], "poster.jpg", { type: "image/jpeg" });
await assert.rejects(validatePoster(invalid));
const tooLarge = new File([new Uint8Array(15 * 1024 * 1024 + 1)], "poster.png", { type: "image/png" });
await assert.rejects(validatePoster(tooLarge));
const svg = new File(["<svg></svg>"], "poster.svg", { type: "image/svg+xml" });
await assert.rejects(validatePoster(svg));
console.log("Validazione eventi e locandine: OK");
