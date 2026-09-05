import { useCallback, useEffect, useMemo, useState } from "react";
import { Archive, Check, ChevronLeft, ChevronRight, Inbox, Loader2, RotateCcw, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Enums, Tables } from "@/integrations/supabase/types";
import { getInquiryTopicLabel, inquiryPathLabels, type InquiryPath } from "@/config/inquiries";

type Inquiry = Tables<"contact_inquiries">;
type InquiryStatus = Enums<"contact_inquiry_status">;
type StatusFilter = InquiryStatus | "all";
type PathFilter = InquiryPath | "all";

const PAGE_SIZE = 25;
const statusLabels: Record<InquiryStatus, string> = {
  new: "Nuova",
  read: "Letta",
  archived: "Archiviata",
};

const formatDate = (value: string) => new Intl.DateTimeFormat("it-IT", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));

const isInquiryPath = (value: string): value is InquiryPath =>
  value === "arcani" || value === "respiro" || value === "ispirazione";

export function AdminInquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [counts, setCounts] = useState<Record<InquiryStatus, number>>({ new: 0, read: 0, archived: 0 });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pathFilter, setPathFilter] = useState<PathFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Inquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const safeSearch = search.replace(/[^\p{L}\p{N}@._+\-\s]/gu, "").trim().slice(0, 100);
      setDebouncedSearch(safeSearch);
      setPage(0);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchCounts = useCallback(async () => {
    const statuses: InquiryStatus[] = ["new", "read", "archived"];
    const results = await Promise.all(statuses.map((status) =>
      supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("status", status),
    ));

    if (results.some((result) => result.error)) return;
    setCounts({
      new: results[0].count ?? 0,
      read: results[1].count ?? 0,
      archived: results[2].count ?? 0,
    });
  }, []);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    let query = supabase
      .from("contact_inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (pathFilter !== "all") query = query.eq("via", pathFilter);
    if (debouncedSearch) {
      const pattern = `%${debouncedSearch}%`;
      query = query.or(`name.ilike.${pattern},email.ilike.${pattern},topic.ilike.${pattern}`);
    }

    const from = page * PAGE_SIZE;
    const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);

    if (error) {
      setErrorMessage("Le richieste non sono disponibili. Verifica che la migrazione Supabase sia stata applicata.");
      setInquiries([]);
      setTotal(0);
    } else {
      setInquiries(data ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [debouncedSearch, page, pathFilter, statusFilter]);

  useEffect(() => {
    void supabase.rpc("purge_expired_contact_inquiries").then(() => {
      void fetchCounts();
      void fetchInquiries();
    });
  }, [fetchCounts, fetchInquiries]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const selectedPath = selected && isInquiryPath(selected.via) ? selected.via : null;
  const selectedTopicLabel = selected && selectedPath
    ? getInquiryTopicLabel(selectedPath, selected.topic)
    : selected?.topic;

  const refresh = useCallback(async () => {
    await Promise.all([fetchCounts(), fetchInquiries()]);
  }, [fetchCounts, fetchInquiries]);

  const updateStatus = async (inquiry: Inquiry, status: InquiryStatus) => {
    setActionId(inquiry.id);
    const now = new Date().toISOString();
    const updates = status === "archived"
      ? { status, archived_at: now }
      : status === "read"
        ? { status, read_at: inquiry.read_at ?? now, archived_at: null }
        : { status, read_at: null, archived_at: null };

    const { error } = await supabase.from("contact_inquiries").update(updates).eq("id", inquiry.id);
    if (error) setErrorMessage("Non è stato possibile aggiornare la richiesta.");
    else {
      if (selected?.id === inquiry.id) setSelected({ ...inquiry, ...updates });
      await refresh();
    }
    setActionId(null);
  };

  const deleteInquiry = async () => {
    if (!pendingDelete) return;
    setActionId(pendingDelete.id);
    const { error } = await supabase.from("contact_inquiries").delete().eq("id", pendingDelete.id);
    if (error) setErrorMessage("Non è stato possibile eliminare la richiesta.");
    else {
      if (selected?.id === pendingDelete.id) setSelected(null);
      setPendingDelete(null);
      await refresh();
    }
    setActionId(null);
  };

  const summaryCards = useMemo(() => ([
    { status: "new" as const, label: "Nuove", value: counts.new },
    { status: "read" as const, label: "Lette", value: counts.read },
    { status: "archived" as const, label: "Archiviate", value: counts.archived },
  ]), [counts]);

  return (
    <section aria-labelledby="admin-inquiries-title" className="space-y-6">
      <Card className="minimal-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            <Inbox className="h-3.5 w-3.5" /> Contatti dal Tempio
          </div>
          <CardTitle id="admin-inquiries-title" className="font-serif text-2xl text-foreground">Richieste</CardTitle>
          <CardDescription>Consulta e organizza i messaggi inviati dalle tre Vie. Nessuna richiesta viene inoltrata a servizi email esterni.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {summaryCards.map((item) => (
              <button key={item.status} type="button" onClick={() => { setStatusFilter(item.status); setPage(0); }} className="rounded-lg border border-border/60 bg-background/25 p-4 text-left transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</span>
                <strong className="mt-2 block font-serif text-3xl text-foreground">{item.value}</strong>
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <label className="relative">
              <span className="sr-only">Cerca nelle richieste</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cerca nome, email o argomento" maxLength={100} className="pl-9" />
            </label>
            <label>
              <span className="sr-only">Filtra per stato</span>
              <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as StatusFilter); setPage(0); }} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground">
                <option value="all">Tutti gli stati</option>
                <option value="new">Nuove</option>
                <option value="read">Lette</option>
                <option value="archived">Archiviate</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filtra per Via</span>
              <select value={pathFilter} onChange={(event) => { setPathFilter(event.target.value as PathFilter); setPage(0); }} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground">
                <option value="all">Tutte le Vie</option>
                <option value="arcani">Arcani</option>
                <option value="respiro">Respiro</option>
                <option value="ispirazione">Arte</option>
              </select>
            </label>
          </div>

          {errorMessage && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{errorMessage}</p>}

          {loading ? (
            <div className="flex min-h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /><span className="sr-only">Caricamento richieste</span></div>
          ) : inquiries.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">Nessuna richiesta corrisponde ai filtri selezionati.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border/60">
              <ul className="divide-y divide-border/50">
                {inquiries.map((inquiry) => {
                  const path = isInquiryPath(inquiry.via) ? inquiry.via : null;
                  return (
                    <li key={inquiry.id} className="grid gap-4 bg-background/15 p-4 md:grid-cols-[1fr_auto] md:items-center">
                      <button type="button" onClick={() => setSelected(inquiry)} className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="truncate text-sm text-foreground">{inquiry.name}</strong>
                          <Badge variant="outline">{statusLabels[inquiry.status]}</Badge>
                          <Badge variant="secondary">{path ? inquiryPathLabels[path] : inquiry.via}</Badge>
                        </div>
                        <p className="mt-2 truncate text-sm text-muted-foreground">{path ? getInquiryTopicLabel(path, inquiry.topic) : inquiry.topic} · {inquiry.email}</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">{formatDate(inquiry.created_at)}</p>
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {inquiry.status === "new" && <Button size="sm" variant="outline" disabled={actionId === inquiry.id} onClick={() => void updateStatus(inquiry, "read")}><Check className="mr-2 h-4 w-4" />Letta</Button>}
                        {inquiry.status !== "archived" ? (
                          <Button size="sm" variant="outline" disabled={actionId === inquiry.id} onClick={() => void updateStatus(inquiry, "archived")}><Archive className="mr-2 h-4 w-4" />Archivia</Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled={actionId === inquiry.id} onClick={() => void updateStatus(inquiry, "read")}><RotateCcw className="mr-2 h-4 w-4" />Ripristina</Button>
                        )}
                        <Button size="icon" variant="ghost" aria-label={`Elimina la richiesta di ${inquiry.name}`} disabled={actionId === inquiry.id} onClick={() => setPendingDelete(inquiry)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>{total} richieste · Pagina {page + 1} di {pageCount}</span>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" aria-label="Pagina precedente" disabled={page === 0 || loading} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Pagina successiva" disabled={page + 1 >= pageCount || loading} onClick={() => setPage((current) => current + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">{selected.name}</DialogTitle>
                <DialogDescription>{selected.email} · {formatDate(selected.created_at)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 text-sm">
                <div className="flex flex-wrap gap-2"><Badge>{statusLabels[selected.status]}</Badge><Badge variant="secondary">{selectedPath ? inquiryPathLabels[selectedPath] : selected.via}</Badge></div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Motivo</dt><dd className="mt-1 text-foreground">{selectedTopicLabel}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Telefono</dt><dd className="mt-1 text-foreground">{selected.phone || "Non indicato"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Privacy accettata</dt><dd className="mt-1 text-foreground">{formatDate(selected.privacy_accepted_at)}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Scadenza</dt><dd className="mt-1 text-foreground">{formatDate(selected.expires_at)}</dd></div>
                </dl>
                <div><h3 className="text-xs uppercase tracking-wider text-muted-foreground">Messaggio</h3><p className="mt-2 whitespace-pre-wrap rounded-md border border-border/60 bg-background/30 p-4 leading-7 text-foreground">{selected.message}</p></div>
                <div className="flex flex-wrap justify-end gap-2">
                  {selected.status === "new" && <Button variant="outline" onClick={() => void updateStatus(selected, "read")}><Check className="mr-2 h-4 w-4" />Segna come letta</Button>}
                  {selected.status !== "archived" ? <Button variant="outline" onClick={() => void updateStatus(selected, "archived")}><Archive className="mr-2 h-4 w-4" />Archivia</Button> : <Button variant="outline" onClick={() => void updateStatus(selected, "read")}><RotateCcw className="mr-2 h-4 w-4" />Ripristina</Button>}
                  <Button variant="destructive" onClick={() => setPendingDelete(selected)}><Trash2 className="mr-2 h-4 w-4" />Elimina</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare definitivamente la richiesta?</AlertDialogTitle>
            <AlertDialogDescription>Questa operazione rimuove i dati di {pendingDelete?.name} e non può essere annullata.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => void deleteInquiry()}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
