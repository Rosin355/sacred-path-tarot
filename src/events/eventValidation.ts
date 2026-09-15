import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().trim().min(1).max(160).refine(value => !/<[^>]+>/.test(value), "Usa solo testo semplice"),
  description: z.string().trim().min(1).max(5000).refine(value => !/<[^>]+>/.test(value), "Usa solo testo semplice"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
}).refine(value => !value.end_date || value.end_date >= value.start_date, { path: ["end_date"], message: "La data finale precede quella iniziale" });

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
export async function validatePoster(file: File) {
  if (!allowedTypes.includes(file.type)) throw new Error("Locandina: usa JPEG, PNG o WebP.");
  if (file.size > 15 * 1024 * 1024) throw new Error("La locandina supera 15 MB.");
  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = signature[0] === 0xff && signature[1] === 0xd8;
  const png = signature[0] === 0x89 && signature[1] === 0x50 && signature[2] === 0x4e && signature[3] === 0x47;
  const webp = String.fromCharCode(...signature.slice(0, 4)) === "RIFF" && String.fromCharCode(...signature.slice(8, 12)) === "WEBP";
  if (!(file.type === "image/jpeg" && jpeg || file.type === "image/png" && png || file.type === "image/webp" && webp)) throw new Error("Il formato reale del file non corrisponde all’estensione.");
}
