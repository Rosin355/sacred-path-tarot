import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { adminPosterUrl, eventSchema, loadEvents, reconcilePosterCleanup, saveEvent, validatePoster, type EventForm, type EventStatus, type SiteEvent } from "@/events/siteEvents";

const empty: EventForm = { title: "", description: "", start_date: "", end_date: null };

export function AdminEventManager() {
  const [selected, setSelected] = useState<SiteEvent | null>(null);
  const [form, setForm] = useState<EventForm>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedPosterUrl, setSavedPosterUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const query = useQuery({ queryKey: ["admin-events"], queryFn: () => loadEvents(true), retry: false });
  const client = useQueryClient();
  const { toast } = useToast();
  useEffect(() => { if (query.data) void reconcilePosterCleanup().catch(() => undefined); }, [query.data]);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file); setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    let cancelled = false;
    setSavedPosterUrl(null);
    if (selected) void adminPosterUrl(selected.original_image_path, selected.status).then(url => { if (!cancelled) setSavedPosterUrl(url); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [selected]);

  const edit = (event: SiteEvent | null) => {
    setSelected(event); setForm(event ? { title: event.title, description: event.description, start_date: event.start_date, end_date: event.end_date } : empty); setFile(null);
  };
  const set = (field: keyof EventForm, value: string | null) => setForm(previous => ({ ...previous, [field]: value }));
  const image = previewUrl ?? savedPosterUrl;
  const save = async (status: EventStatus) => {
    const result = eventSchema.safeParse(form);
    if (!result.success) { toast({ title: "Evento non valido", description: result.error.issues[0]?.message, variant: "destructive" }); return; }
    if (!file && !selected) { toast({ title: "Seleziona una locandina", variant: "destructive" }); return; }
    setBusy(true);
    try {
      const saved = await saveEvent(result.data, status, selected, file);
      setSelected(saved); setFile(null);
      await client.invalidateQueries({ queryKey: ["admin-events"] });
      await client.invalidateQueries({ queryKey: ["public-events"] });
      toast({ title: status === "published" ? "Evento pubblicato" : status === "archived" ? "Evento archiviato" : "Bozza salvata" });
    } catch (error) { toast({ title: "Operazione non riuscita", description: error instanceof Error ? error.message : "Testi e locandina selezionata sono stati conservati.", variant: "destructive" }); }
    finally { setBusy(false); }
  };

  return <div className="grid gap-7 lg:grid-cols-[18rem_1fr]">
    <aside className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-4">
      <div className="flex items-center justify-between gap-2"><h2 className="font-serif text-2xl">Eventi</h2><Button size="sm" onClick={() => edit(null)}>Nuovo</Button></div>
      {query.isError && <p role="alert">Il database degli eventi non risponde. Riprova prima di salvare.</p>}
      {query.data?.map(event => <button key={event.id} type="button" onClick={() => edit(event)} className="block w-full rounded-lg border border-border/50 p-3 text-left hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <strong className="block">{event.title}</strong><span className="text-xs text-muted-foreground">{event.start_date} · {event.status} · rev. {event.revision}</span>
      </button>)}
    </aside>
    <section className="space-y-5 rounded-xl border border-border/60 bg-card/70 p-5" aria-label="Editor evento">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-serif text-2xl">{selected ? `Modifica: ${selected.title}` : "Nuovo evento"}</h2><span className="text-sm text-muted-foreground">{selected ? `Stato: ${selected.status} · revisione ${selected.revision}` : "Bozza nuova"}</span></div>
      <div className="space-y-2"><Label htmlFor="event-title">Titolo *</Label><Input id="event-title" value={form.title} maxLength={160} onChange={event => set("title", event.target.value)} /><small>{form.title.length}/160</small></div>
      <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="event-start">Data iniziale *</Label><Input id="event-start" type="date" value={form.start_date} onChange={event => set("start_date", event.target.value)} /></div><div className="space-y-2"><Label htmlFor="event-end">Data finale</Label><Input id="event-end" type="date" min={form.start_date || undefined} value={form.end_date ?? ""} onChange={event => set("end_date", event.target.value || null)} /></div></div>
      <div className="space-y-2"><Label htmlFor="event-description">Descrizione *</Label><Textarea id="event-description" value={form.description} maxLength={5000} rows={8} onChange={event => set("description", event.target.value)} /><small>{form.description.length}/5000</small></div>
      <div className="space-y-2"><Label htmlFor="event-poster">Locandina {selected ? "(sostituzione facoltativa)" : "*"}</Label><Input id="event-poster" type="file" accept="image/jpeg,image/png,image/webp" onChange={async event => { const chosen = event.target.files?.[0] ?? null; if (chosen) { try { await validatePoster(chosen); setFile(chosen); } catch (error) { event.target.value = ""; toast({ title: "Locandina non valida", description: error instanceof Error ? error.message : undefined, variant: "destructive" }); } } }} /><small>JPEG, PNG, WebP · massimo 15 MB · miniatura senza ritaglio</small></div>
      {image && <img src={image} alt="Anteprima della locandina" className="max-h-72 max-w-full object-contain" />}
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy || query.isError} onClick={() => save("draft")}>Salva bozza</Button>
        <Dialog><DialogTrigger asChild><Button variant="outline" disabled={!image}>Anteprima</Button></DialogTrigger><DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto"><DialogTitle>{form.title || "Evento senza titolo"}</DialogTitle><p>{form.start_date}{form.end_date ? ` – ${form.end_date}` : ""}</p>{image && <img src={image} alt="Locandina ingrandita" className="max-h-[60vh] w-full object-contain" />}<DialogDescription className="whitespace-pre-wrap text-foreground">{form.description}</DialogDescription></DialogContent></Dialog>
        <Button disabled={busy || query.isError} onClick={() => save("published")}>Pubblica</Button>
        {selected && <Button variant="secondary" disabled={busy || query.isError} onClick={() => save("archived")}>Archivia</Button>}
        {selected?.status === "archived" && <Button variant="outline" disabled={busy || query.isError} onClick={() => save("draft")}>Ripristina bozza</Button>}
      </div>
      <p className="text-xs text-muted-foreground">Ogni operazione usa la revisione mostrata: un conflitto tra sessioni richiede di ricaricare l’evento prima di riprovare.</p>
    </section>
  </div>;
}
