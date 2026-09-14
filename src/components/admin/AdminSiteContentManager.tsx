import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, RotateCcw, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { contentFields, defaultSiteContent, maxLengthFor, pageContentSchema, pageLabels, sitePages, type SitePage, type SitePageContent } from "@/content/siteContent";
import { loadSiteContent, publishContent, restoreDraft, saveDraft } from "@/content/siteContentApi";

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Non disponibile";

export const AdminSiteContentManager = () => {
  const [page, setPage] = useState<SitePage>("home");
  const [form, setForm] = useState<SitePageContent>(defaultSiteContent.home);
  const [baseline, setBaseline] = useState<SitePageContent>(defaultSiteContent.home);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const draft = useQuery({ queryKey: ["site-content", page, "draft"], queryFn: () => loadSiteContent(page, "draft"), retry: false });
  const published = useQuery({ queryKey: ["site-content", page, "published"], queryFn: () => loadSiteContent(page, "published"), retry: false });

  useEffect(() => {
    const next = draft.data?.content ?? defaultSiteContent[page];
    setForm(next);
    setBaseline(next);
  }, [draft.data, page]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const grouped = useMemo(() => Object.entries(contentFields[page].reduce<Record<string, typeof contentFields[SitePage]>>((groups, field) => {
    (groups[field.group] ??= []).push(field);
    return groups;
  }, {})), [page]);
  const validate = () => {
    const result = pageContentSchema(page).safeParse(form);
    if (!result.success) {
      toast({ title: "Controlla i testi", description: result.error.issues[0]?.message ?? "Alcuni campi non sono validi.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["site-content", page, "draft"] }),
      queryClient.invalidateQueries({ queryKey: ["site-content", page, "published"] }),
    ]);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      await saveDraft(page, form, draft.data?.revision ?? 0);
      setBaseline(form);
      await refresh();
      toast({ title: "Bozza salvata", description: `I testi di ${pageLabels[page]} sono al sicuro.` });
    } catch (error) {
      toast({ title: "Bozza non salvata", description: error instanceof Error ? error.message : "Riprova tra poco. Il testo inserito è stato conservato.", variant: "destructive" });
    } finally { setBusy(false); }
  };

  const handlePublish = async () => {
    if (dirty) {
      toast({ title: "Salva prima la bozza", description: "La pubblicazione usa l’ultima bozza salvata." });
      return;
    }
    setBusy(true);
    try {
      await publishContent(page, draft.data?.revision ?? 0, published.data?.revision ?? 0);
      await refresh();
      toast({ title: "Testi pubblicati", description: `La pagina ${pageLabels[page]} è stata aggiornata.` });
    } catch (error) {
      toast({ title: "Pubblicazione non riuscita", description: error instanceof Error ? error.message : "Riprova tra poco.", variant: "destructive" });
    } finally { setBusy(false); }
  };

  const handleRestore = async () => {
    if (!window.confirm("Sostituire la bozza con l’ultima versione pubblicata? I testi pubblici non cambieranno.")) return;
    setBusy(true);
    try {
      await restoreDraft(page, draft.data?.revision ?? 0, published.data?.revision ?? 0);
      await refresh();
      toast({ title: "Bozza ripristinata", description: "La versione pubblicata è stata copiata nella bozza." });
    } catch (error) {
      toast({ title: "Ripristino non riuscito", description: error instanceof Error ? error.message : "Riprova tra poco.", variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <Card className="minimal-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><CardTitle className="font-serif text-2xl">Testi del sito</CardTitle><CardDescription className="mt-2 max-w-2xl">Modifica solo i contenuti editoriali. Struttura, grafica, menu, form e privacy restano protetti.</CardDescription></div>
          <Select value={page} onValueChange={value => { if (dirty && !window.confirm("Cambiare pagina senza salvare le modifiche?")) return; setPage(value as SitePage); }}>
            <SelectTrigger className="w-[200px]" aria-label="Pagina da modificare"><SelectValue /></SelectTrigger>
            <SelectContent>{sitePages.map(value => <SelectItem key={value} value={value}>{pageLabels[value]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 pt-3 text-xs text-muted-foreground">
          <Badge variant={dirty ? "destructive" : "secondary"}>{dirty ? "Modifiche non salvate" : "Bozza salvata"}</Badge>
          <span>Ultimo salvataggio: {formatDate(draft.data?.updated_at)}</span><span>·</span><span>Ultima pubblicazione: {formatDate(published.data?.updated_at)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {draft.isError && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">L’editor non riesce a leggere il database. I contenuti predefiniti restano visibili, ma attendi prima di salvare.</p>}
        {grouped.map(([group, fields]) => <fieldset key={group} className="space-y-5 rounded-lg border border-border/60 p-5"><legend className="px-2 font-serif text-xl">{group}</legend>
          {fields?.map(field => { const max = maxLengthFor(field.kind); const id = `${page}-${field.key}`; return <div key={field.key} className="space-y-2"><div className="flex justify-between gap-3"><Label htmlFor={id}>{field.label}</Label><span className="text-xs text-muted-foreground">{form[field.key]?.length ?? 0}/{max}</span></div>{field.kind === "paragraph" ? <Textarea id={id} rows={5} maxLength={max} value={form[field.key] ?? ""} onChange={event => setForm(current => ({ ...current, [field.key]: event.target.value }))} /> : <Input id={id} maxLength={max} value={form[field.key] ?? ""} onChange={event => setForm(current => ({ ...current, [field.key]: event.target.value }))} />}</div>; })}
        </fieldset>)}
        <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-lg border border-border/70 bg-card/95 p-4 shadow-lg backdrop-blur">
          <Button onClick={handleSave} disabled={busy || !dirty}><Save className="mr-2 h-4 w-4" />Salva bozza</Button>
          <Button variant="outline" asChild aria-disabled={dirty}><a href={`/admin/testi/anteprima/${page}`} target="_blank" rel="noreferrer" onClick={event => { if (dirty) { event.preventDefault(); toast({ title: "Salva prima la bozza" }); } }}><ExternalLink className="mr-2 h-4 w-4" />Anteprima</a></Button>
          <Button variant="secondary" onClick={handlePublish} disabled={busy}><Send className="mr-2 h-4 w-4" />Pubblica testi</Button>
          <Button variant="ghost" onClick={handleRestore} disabled={busy}><RotateCcw className="mr-2 h-4 w-4" />Ripristina dal pubblicato</Button>
        </div>
      </CardContent>
    </Card>
  );
};
