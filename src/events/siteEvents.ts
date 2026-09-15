import { eventSchema, validatePoster } from "./eventValidation";
export { eventSchema, validatePoster } from "./eventValidation";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type SiteEvent = Database["public"]["Tables"]["site_events"]["Row"];
export type EventStatus = "draft" | "published" | "archived";
export type EventForm = Pick<SiteEvent, "title" | "description" | "start_date" | "end_date">;
export const posterBucket = "event-posters";
export const draftPosterBucket = "event-poster-drafts";
const bucketFor = (status: EventStatus | string) => status === "published" ? posterBucket : draftPosterBucket;
const cleanupKey = "sacred-event-poster-cleanup";
type CleanupItem = { bucket: string; paths: string[] };
const queuedCleanup = (): CleanupItem[] => { try { return JSON.parse(localStorage.getItem(cleanupKey) ?? "[]") as CleanupItem[]; } catch { return []; } };
const enqueueCleanup = (item: CleanupItem) => { try { localStorage.setItem(cleanupKey, JSON.stringify([...queuedCleanup(), item])); } catch { /* La rimozione verrà riprovata manualmente. */ } };
async function removeOrQueue(item: CleanupItem) {
  const { error } = await supabase.storage.from(item.bucket).remove(item.paths);
  if (error) enqueueCleanup(item);
}
export async function reconcilePosterCleanup() {
  const pending = queuedCleanup();
  if (!pending.length) return;
  const events = await loadEvents(true);
  const remaining: CleanupItem[] = [];
  for (const item of pending) {
    const referenced = events.some(event => bucketFor(event.status) === item.bucket && item.paths.some(path => path === event.original_image_path || path === event.thumbnail_image_path));
    if (referenced) continue;
    const { error } = await supabase.storage.from(item.bucket).remove(item.paths);
    if (error) remaining.push(item);
  }
  try { localStorage.setItem(cleanupKey, JSON.stringify(remaining)); } catch { /* La coda rimane disponibile nella sessione corrente. */ }
}
export const posterUrl = (path: string) => supabase.storage.from(posterBucket).getPublicUrl(path).data.publicUrl;
export async function adminPosterUrl(path: string, status: string) {
  if (status === "published") return posterUrl(path);
  const { data, error } = await supabase.storage.from(draftPosterBucket).createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}
export async function loadEvents(admin = false): Promise<SiteEvent[]> {
  const request = supabase.from("site_events").select("*").order("start_date", { ascending: false });
  const { data, error } = await (admin ? request : request.eq("status", "published"));
  if (error) throw error;
  return data ?? [];
}

async function thumbnail(file: File): Promise<Blob> {
  const bitmap = typeof createImageBitmap === "function" ? await createImageBitmap(file) : null;
  const fallback = bitmap ? null : await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Locandina non leggibile")); };
    image.src = url;
  });
  try {
    const width = bitmap?.width ?? fallback?.naturalWidth ?? 0;
    const height = bitmap?.height ?? fallback?.naturalHeight ?? 0;
    if (!width || !height) throw new Error("Locandina non leggibile");
    const scale = Math.min(1, 960 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Miniatura non generata");
    context.drawImage(bitmap ?? fallback!, 0, 0, canvas.width, canvas.height);
    const preferred = canvas.toDataURL("image/webp").startsWith("data:image/webp") ? "image/webp" : "image/png";
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Miniatura non generata")), preferred, 0.82));
  } finally { bitmap?.close(); }
}

async function uploadPoster(file: File, bucket: string): Promise<{ original: string; thumb: string }> {
  await validatePoster(file);
  const id = crypto.randomUUID();
  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const original = `${id}/original.${ext}`;
  const generated = await thumbnail(file);
  const thumb = `${id}/thumb.${generated.type === "image/webp" ? "webp" : "png"}`;
  const store = supabase.storage.from(bucket);
  const first = await store.upload(original, file, { contentType: file.type, upsert: false });
  if (first.error) { enqueueCleanup({ bucket, paths: [original] }); throw first.error; }
  try {
    const second = await store.upload(thumb, generated, { contentType: generated.type, upsert: false });
    if (second.error) throw second.error;
  } catch (error) { await removeOrQueue({ bucket, paths: [original, thumb] }); throw error; }
  return { original, thumb };
}

async function transferPoster(current: SiteEvent, destination: string): Promise<{ original: string; thumb: string }> {
  const source = supabase.storage.from(bucketFor(current.status));
  const target = supabase.storage.from(destination);
  const id = crypto.randomUUID();
  const original = `${id}/${current.original_image_path.split("/").at(-1)}`;
  const thumb = `${id}/${current.thumbnail_image_path.split("/").at(-1)}`;
  const oldPaths = [current.original_image_path, current.thumbnail_image_path];
  const newPaths = [original, thumb];
  try {
    for (let index = 0; index < 2; index++) {
      const downloaded = await source.download(oldPaths[index]);
      if (downloaded.error || !downloaded.data) throw downloaded.error ?? new Error("Locandina non scaricata");
      const uploaded = await target.upload(newPaths[index], downloaded.data, { contentType: downloaded.data.type, upsert: false });
      if (uploaded.error) throw uploaded.error;
    }
  } catch (error) { await removeOrQueue({ bucket: destination, paths: newPaths }); throw error; }
  return { original, thumb };
}

export async function saveEvent(input: EventForm, status: EventStatus, current: SiteEvent | null, file: File | null): Promise<SiteEvent> {
  const parsed = eventSchema.parse(input);
  if (!file && !current) throw new Error("Seleziona una locandina.");
  const targetBucket = bucketFor(status);
  const uploaded = file ? await uploadPoster(file, targetBucket) : current && bucketFor(current.status) !== targetBucket ? await transferPoster(current, targetBucket) : null;
  const original = uploaded?.original ?? current?.original_image_path ?? "";
  const thumb = uploaded?.thumb ?? current?.thumbnail_image_path ?? "";
  try {
    const { data, error } = await supabase.rpc("save_site_event", {
      p_id: current?.id ?? null, p_title: parsed.title, p_description: parsed.description,
      p_start_date: parsed.start_date, p_end_date: parsed.end_date,
      p_original_image_path: original, p_thumbnail_image_path: thumb,
      p_expected_revision: current?.revision ?? 0, p_status: status,
    });
    if (error) throw error;
    if (uploaded && current) await removeOrQueue({ bucket: bucketFor(current.status), paths: [current.original_image_path, current.thumbnail_image_path] });
    return data;
  } catch (error) {
    if (uploaded) {
      // Se la risposta RPC è ambigua, controlliamo il database prima di eliminare i nuovi file.
      const { data, error: lookupError } = await supabase.from("site_events").select("*").eq("original_image_path", original).maybeSingle();
      if (data) {
        if (current) await removeOrQueue({ bucket: bucketFor(current.status), paths: [current.original_image_path, current.thumbnail_image_path] });
        return data;
      }
      if (!lookupError && !data) await removeOrQueue({ bucket: targetBucket, paths: [original, thumb] });
      if (lookupError) enqueueCleanup({ bucket: targetBucket, paths: [original, thumb] });
    }
    throw error;
  }
}
