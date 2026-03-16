import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BookOpenText, CirclePlus, ExternalLink, HelpCircle, Loader2, Save, ScrollText, ShieldCheck, Trash2 } from 'lucide-react';

type KnowledgeDocument = Tables<'knowledge_documents'>;
type AssistantFaq = Tables<'assistant_faqs'>;
type AssistantRule = Tables<'assistant_rules'>;
type AssistantSource = Tables<'assistant_sources'>;

type KnowledgeStatus = 'draft' | 'published' | 'archived';
type KnowledgePath = 'tempio' | 'arcani' | 'respiro' | 'ispirazione';
type KnowledgeContentType = 'page' | 'article' | 'method' | 'faq' | 'rule' | 'source_note';
type AssistantRuleType = 'system' | 'tone' | 'safety' | 'routing' | 'retrieval';
type AssistantSourceKind = 'approved_link' | 'reference_domain' | 'editorial_source';

type DocumentFormState = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string;
  source_url: string;
  path: KnowledgePath;
  status: KnowledgeStatus;
  content_type: KnowledgeContentType;
  priority: number;
};

type FaqFormState = {
  id?: string;
  question: string;
  answer: string;
  tags: string;
  path: KnowledgePath;
  status: KnowledgeStatus;
  priority: number;
};

type RuleFormState = {
  id?: string;
  key: string;
  label: string;
  content: string;
  rule_type: AssistantRuleType;
  priority: number;
  is_active: boolean;
};

type SourceFormState = {
  id?: string;
  label: string;
  description: string;
  url: string;
  domain: string;
  source_kind: AssistantSourceKind;
  trust_level: number;
  is_active: boolean;
};

const documentDefaults: DocumentFormState = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  tags: '',
  source_url: '',
  path: 'tempio',
  status: 'draft',
  content_type: 'page',
  priority: 50,
};

const faqDefaults: FaqFormState = {
  question: '',
  answer: '',
  tags: '',
  path: 'tempio',
  status: 'draft',
  priority: 50,
};

const ruleDefaults: RuleFormState = {
  key: '',
  label: '',
  content: '',
  rule_type: 'system',
  priority: 50,
  is_active: true,
};

const sourceDefaults: SourceFormState = {
  label: '',
  description: '',
  url: '',
  domain: '',
  source_kind: 'approved_link',
  trust_level: 50,
  is_active: true,
};

const pathLabels: Record<KnowledgePath, string> = {
  tempio: 'Tempio',
  arcani: 'Arcani',
  respiro: 'Respiro',
  ispirazione: 'Ispirazione',
};

const statusLabels: Record<KnowledgeStatus, string> = {
  draft: 'Bozza',
  published: 'Pubblicato',
  archived: 'Archiviato',
};

const contentTypeLabels: Record<KnowledgeContentType, string> = {
  page: 'Pagina',
  article: 'Articolo',
  method: 'Metodo',
  faq: 'FAQ',
  rule: 'Regola',
  source_note: 'Nota fonte',
};

const ruleTypeLabels: Record<AssistantRuleType, string> = {
  system: 'System',
  tone: 'Tono',
  safety: 'Safety',
  routing: 'Routing',
  retrieval: 'Retrieval',
};

const sourceKindLabels: Record<AssistantSourceKind, string> = {
  approved_link: 'Link approvato',
  reference_domain: 'Dominio di riferimento',
  editorial_source: 'Fonte editoriale',
};

function toTagArray(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function inferDomain(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function SectionShell({
  title,
  description,
  metric,
  children,
}: {
  title: string;
  description: string;
  metric: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="minimal-border bg-card/80 backdrop-blur-sm shadow-[0_24px_80px_-48px_hsl(var(--background))]">
      <CardHeader className="gap-4 border-b border-border/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-serif text-2xl text-foreground">{title}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</CardDescription>
          </div>
          <Badge variant="outline" className="w-fit border-accent/40 bg-accent/10 text-foreground">
            {metric}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

export function AdminKnowledgeManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [documentForm, setDocumentForm] = useState<DocumentFormState>(documentDefaults);
  const [faqForm, setFaqForm] = useState<FaqFormState>(faqDefaults);
  const [ruleForm, setRuleForm] = useState<RuleFormState>(ruleDefaults);
  const [sourceForm, setSourceForm] = useState<SourceFormState>(sourceDefaults);

  const documentsQuery = useQuery({
    queryKey: ['admin', 'knowledge-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as KnowledgeDocument[];
    },
  });

  const faqsQuery = useQuery({
    queryKey: ['admin', 'assistant-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistant_faqs')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as AssistantFaq[];
    },
  });

  const rulesQuery = useQuery({
    queryKey: ['admin', 'assistant-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistant_rules')
        .select('*')
        .order('priority', { ascending: false });
      if (error) throw error;
      return data as AssistantRule[];
    },
  });

  const sourcesQuery = useQuery({
    queryKey: ['admin', 'assistant-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistant_sources')
        .select('*')
        .order('trust_level', { ascending: false });
      if (error) throw error;
      return data as AssistantSource[];
    },
  });

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'knowledge-documents'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'assistant-faqs'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'assistant-rules'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'assistant-sources'] }),
    ]);
  };

  const documentsMutation = useMutation({
    mutationFn: async (payload: DocumentFormState) => {
      const preparedSlug = slugify(payload.slug || payload.title);
      const prepared: TablesInsert<'knowledge_documents'> | TablesUpdate<'knowledge_documents'> = {
        title: payload.title,
        slug: preparedSlug,
        summary: payload.summary || null,
        content: payload.content,
        tags: toTagArray(payload.tags),
        source_url: payload.source_url || null,
        path: payload.path,
        status: payload.status,
        content_type: payload.content_type,
        priority: payload.priority,
      };

      if (payload.id) {
        const { error } = await supabase.from('knowledge_documents').update(prepared).eq('id', payload.id);
        if (error) throw error;
        return 'updated';
      }

      const { error } = await supabase.from('knowledge_documents').insert(prepared as TablesInsert<'knowledge_documents'>);
      if (error) throw error;
      return 'created';
    },
    onSuccess: async (action) => {
      toast({
        title: action === 'created' ? 'Documento creato' : 'Documento aggiornato',
        description: 'La knowledge base interna è stata raffinata con successo.',
      });
      setDocumentForm(documentDefaults);
      await invalidateAll();
    },
    onError: (error: Error) => {
      toast({ title: 'Errore documento', description: error.message, variant: 'destructive' });
    },
  });

  const faqsMutation = useMutation({
    mutationFn: async (payload: FaqFormState) => {
      const prepared: TablesInsert<'assistant_faqs'> | TablesUpdate<'assistant_faqs'> = {
        question: payload.question,
        answer: payload.answer,
        tags: toTagArray(payload.tags),
        path: payload.path,
        status: payload.status,
        priority: payload.priority,
      };

      if (payload.id) {
        const { error } = await supabase.from('assistant_faqs').update(prepared).eq('id', payload.id);
        if (error) throw error;
        return 'updated';
      }

      const { error } = await supabase.from('assistant_faqs').insert(prepared as TablesInsert<'assistant_faqs'>);
      if (error) throw error;
      return 'created';
    },
    onSuccess: async (action) => {
      toast({
        title: action === 'created' ? 'FAQ creata' : 'FAQ aggiornata',
        description: 'Le risposte curate della guida sono state aggiornate.',
      });
      setFaqForm(faqDefaults);
      await invalidateAll();
    },
    onError: (error: Error) => {
      toast({ title: 'Errore FAQ', description: error.message, variant: 'destructive' });
    },
  });

  const rulesMutation = useMutation({
    mutationFn: async (payload: RuleFormState) => {
      const prepared: TablesInsert<'assistant_rules'> | TablesUpdate<'assistant_rules'> = {
        key: payload.key,
        label: payload.label,
        content: payload.content,
        rule_type: payload.rule_type,
        priority: payload.priority,
        is_active: payload.is_active,
      };

      if (payload.id) {
        const { error } = await supabase.from('assistant_rules').update(prepared).eq('id', payload.id);
        if (error) throw error;
        return 'updated';
      }

      const { error } = await supabase.from('assistant_rules').insert(prepared as TablesInsert<'assistant_rules'>);
      if (error) throw error;
      return 'created';
    },
    onSuccess: async (action) => {
      toast({
        title: action === 'created' ? 'Regola creata' : 'Regola aggiornata',
        description: 'Il comportamento editoriale della guida è stato aggiornato.',
      });
      setRuleForm(ruleDefaults);
      await invalidateAll();
    },
    onError: (error: Error) => {
      toast({ title: 'Errore regola', description: error.message, variant: 'destructive' });
    },
  });

  const sourcesMutation = useMutation({
    mutationFn: async (payload: SourceFormState) => {
      const prepared: TablesInsert<'assistant_sources'> | TablesUpdate<'assistant_sources'> = {
        label: payload.label,
        description: payload.description || null,
        url: payload.url,
        domain: payload.domain || inferDomain(payload.url),
        source_kind: payload.source_kind,
        trust_level: payload.trust_level,
        is_active: payload.is_active,
      };

      if (payload.id) {
        const { error } = await supabase.from('assistant_sources').update(prepared).eq('id', payload.id);
        if (error) throw error;
        return 'updated';
      }

      const { error } = await supabase.from('assistant_sources').insert(prepared as TablesInsert<'assistant_sources'>);
      if (error) throw error;
      return 'created';
    },
    onSuccess: async (action) => {
      toast({
        title: action === 'created' ? 'Fonte approvata creata' : 'Fonte approvata aggiornata',
        description: 'Il layer di verifica esterna è stato raffinato.',
      });
      setSourceForm(sourceDefaults);
      await invalidateAll();
    },
    onError: (error: Error) => {
      toast({ title: 'Errore fonte', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ table, id }: { table: 'knowledge_documents' | 'assistant_faqs' | 'assistant_rules' | 'assistant_sources'; id: string }) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast({ title: 'Elemento eliminato', description: 'La dashboard AI è stata aggiornata.' });
      await invalidateAll();
    },
    onError: (error: Error) => {
      toast({ title: 'Errore eliminazione', description: error.message, variant: 'destructive' });
    },
  });

  const loading = documentsQuery.isLoading || faqsQuery.isLoading || rulesQuery.isLoading || sourcesQuery.isLoading;

  const metrics = useMemo(() => ({
    documents: documentsQuery.data?.length ?? 0,
    faqs: faqsQuery.data?.length ?? 0,
    rules: rulesQuery.data?.length ?? 0,
    sources: sourcesQuery.data?.length ?? 0,
  }), [documentsQuery.data, faqsQuery.data, rulesQuery.data, sourcesQuery.data]);

  if (loading) {
    return (
      <Card className="minimal-border bg-card/80 backdrop-blur-sm">
        <CardContent className="flex min-h-[280px] items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Sto aprendo lo spazio editoriale della guida…
        </CardContent>
      </Card>
    );
  }

  return (
    <SectionShell
      title="Knowledge base della Guida AI"
      description="Gestisci i contenuti che orientano la Guida alla Via: documenti editoriali, FAQ curate, regole comportamentali e fonti esterne approvate."
      metric={`${metrics.documents} documenti · ${metrics.faqs} FAQ · ${metrics.rules} regole · ${metrics.sources} fonti`}
    >
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
          <TabsTrigger value="documents" className="border border-border/60 bg-card/60 py-3 data-[state=active]:border-accent/40 data-[state=active]:bg-accent/10">
            <BookOpenText className="mr-2 h-4 w-4" /> Documenti
          </TabsTrigger>
          <TabsTrigger value="faqs" className="border border-border/60 bg-card/60 py-3 data-[state=active]:border-accent/40 data-[state=active]:bg-accent/10">
            <HelpCircle className="mr-2 h-4 w-4" /> FAQ
          </TabsTrigger>
          <TabsTrigger value="rules" className="border border-border/60 bg-card/60 py-3 data-[state=active]:border-accent/40 data-[state=active]:bg-accent/10">
            <ShieldCheck className="mr-2 h-4 w-4" /> Prompt & regole
          </TabsTrigger>
          <TabsTrigger value="sources" className="border border-border/60 bg-card/60 py-3 data-[state=active]:border-accent/40 data-[state=active]:bg-accent/10">
            <ExternalLink className="mr-2 h-4 w-4" /> Fonti approvate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="minimal-border bg-background/40">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{documentForm.id ? 'Modifica documento' : 'Nuovo documento'}</CardTitle>
                <CardDescription>Testi lunghi, pagine, metodo e contenuti editoriali che la guida deve privilegiare.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Titolo" value={documentForm.title} onChange={(e) => setDocumentForm((prev) => ({ ...prev, title: e.target.value, slug: prev.id ? prev.slug : slugify(e.target.value) }))} />
                  <Input placeholder="Slug" value={documentForm.slug} onChange={(e) => setDocumentForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Select value={documentForm.path} onValueChange={(value: KnowledgePath) => setDocumentForm((prev) => ({ ...prev, path: value }))}>
                    <SelectTrigger><SelectValue placeholder="Via" /></SelectTrigger>
                    <SelectContent>{Object.entries(pathLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={documentForm.status} onValueChange={(value: KnowledgeStatus) => setDocumentForm((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger><SelectValue placeholder="Stato" /></SelectTrigger>
                    <SelectContent>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={documentForm.content_type} onValueChange={(value: KnowledgeContentType) => setDocumentForm((prev) => ({ ...prev, content_type: value }))}>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>{Object.entries(contentTypeLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Input placeholder="Summary breve" value={documentForm.summary} onChange={(e) => setDocumentForm((prev) => ({ ...prev, summary: e.target.value }))} />
                <Textarea className="min-h-[280px]" placeholder="Contenuto completo" value={documentForm.content} onChange={(e) => setDocumentForm((prev) => ({ ...prev, content: e.target.value }))} />
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                  <Input placeholder="Tag separati da virgola" value={documentForm.tags} onChange={(e) => setDocumentForm((prev) => ({ ...prev, tags: e.target.value }))} />
                  <Input type="number" min={0} max={100} placeholder="Priorità" value={documentForm.priority} onChange={(e) => setDocumentForm((prev) => ({ ...prev, priority: Number(e.target.value) || 0 }))} />
                </div>
                <Input placeholder="URL sorgente opzionale" value={documentForm.source_url} onChange={(e) => setDocumentForm((prev) => ({ ...prev, source_url: e.target.value }))} />
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => documentsMutation.mutate(documentForm)} disabled={documentsMutation.isPending || !documentForm.title || !documentForm.content}>
                    {documentsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {documentForm.id ? 'Aggiorna documento' : 'Salva documento'}
                  </Button>
                  <Button variant="outline" onClick={() => setDocumentForm(documentDefaults)}>Nuovo</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-border bg-background/20">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Archivio documenti</CardTitle>
                <CardDescription>Ordina la base interna della guida per Via, stato e intensità editoriale.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documentsQuery.data?.length ? documentsQuery.data.map((doc) => (
                  <button key={doc.id} type="button" onClick={() => setDocumentForm({ id: doc.id, title: doc.title, slug: doc.slug, summary: doc.summary ?? '', content: doc.content, tags: doc.tags.join(', '), source_url: doc.source_url ?? '', path: doc.path as KnowledgePath, status: doc.status as KnowledgeStatus, content_type: doc.content_type as KnowledgeContentType, priority: doc.priority })} className="w-full rounded-lg border border-border/60 bg-card/50 p-4 text-left transition hover:border-accent/40 hover:bg-accent/5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{doc.title}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{pathLabels[doc.path as KnowledgePath]}</Badge>
                          <Badge variant="outline">{statusLabels[doc.status as KnowledgeStatus]}</Badge>
                          <Badge variant="outline">{contentTypeLabels[doc.content_type as KnowledgeContentType]}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Eliminare "${doc.title}"?`)) {
                            deleteMutation.mutate({ table: 'knowledge_documents', id: doc.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{doc.summary || doc.content}</p>
                  </button>
                )) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-background/30 p-6 text-sm text-muted-foreground">Nessun documento ancora presente.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card className="minimal-border bg-background/40">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{faqForm.id ? 'Modifica FAQ' : 'Nuova FAQ'}</CardTitle>
                <CardDescription>Domande frequenti curate per orientare rapidamente la Guida AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Domanda" value={faqForm.question} onChange={(e) => setFaqForm((prev) => ({ ...prev, question: e.target.value }))} />
                <Textarea className="min-h-[200px]" placeholder="Risposta" value={faqForm.answer} onChange={(e) => setFaqForm((prev) => ({ ...prev, answer: e.target.value }))} />
                <div className="grid gap-4 md:grid-cols-3">
                  <Select value={faqForm.path} onValueChange={(value: KnowledgePath) => setFaqForm((prev) => ({ ...prev, path: value }))}>
                    <SelectTrigger><SelectValue placeholder="Via" /></SelectTrigger>
                    <SelectContent>{Object.entries(pathLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={faqForm.status} onValueChange={(value: KnowledgeStatus) => setFaqForm((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger><SelectValue placeholder="Stato" /></SelectTrigger>
                    <SelectContent>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" min={0} max={100} placeholder="Priorità" value={faqForm.priority} onChange={(e) => setFaqForm((prev) => ({ ...prev, priority: Number(e.target.value) || 0 }))} />
                </div>
                <Input placeholder="Tag separati da virgola" value={faqForm.tags} onChange={(e) => setFaqForm((prev) => ({ ...prev, tags: e.target.value }))} />
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => faqsMutation.mutate(faqForm)} disabled={faqsMutation.isPending || !faqForm.question || !faqForm.answer}>
                    {faqsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CirclePlus className="mr-2 h-4 w-4" />}
                    {faqForm.id ? 'Aggiorna FAQ' : 'Salva FAQ'}
                  </Button>
                  <Button variant="outline" onClick={() => setFaqForm(faqDefaults)}>Nuova</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-border bg-background/20">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Archivio FAQ</CardTitle>
                <CardDescription>Risposte concise ad alta priorità per i casi ricorrenti.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {faqsQuery.data?.length ? faqsQuery.data.map((faq) => (
                  <button key={faq.id} type="button" onClick={() => setFaqForm({ id: faq.id, question: faq.question, answer: faq.answer, tags: faq.tags.join(', '), path: faq.path as KnowledgePath, status: faq.status as KnowledgeStatus, priority: faq.priority })} className="w-full rounded-lg border border-border/60 bg-card/50 p-4 text-left transition hover:border-accent/40 hover:bg-accent/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{faq.question}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{pathLabels[faq.path as KnowledgePath]}</Badge>
                          <Badge variant="outline">{statusLabels[faq.status as KnowledgeStatus]}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); if (confirm(`Eliminare questa FAQ?`)) deleteMutation.mutate({ table: 'assistant_faqs', id: faq.id }); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </button>
                )) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-background/30 p-6 text-sm text-muted-foreground">Nessuna FAQ ancora disponibile.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card className="minimal-border bg-background/40">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{ruleForm.id ? 'Modifica regola' : 'Nuova regola'}</CardTitle>
                <CardDescription>Prompt, tono, limiti e criteri di retrieval che guidano la backend function.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Chiave tecnica" value={ruleForm.key} onChange={(e) => setRuleForm((prev) => ({ ...prev, key: slugify(e.target.value).replace(/-/g, '_') }))} />
                  <Input placeholder="Etichetta visibile" value={ruleForm.label} onChange={(e) => setRuleForm((prev) => ({ ...prev, label: e.target.value }))} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Select value={ruleForm.rule_type} onValueChange={(value: AssistantRuleType) => setRuleForm((prev) => ({ ...prev, rule_type: value }))}>
                    <SelectTrigger><SelectValue placeholder="Tipo regola" /></SelectTrigger>
                    <SelectContent>{Object.entries(ruleTypeLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" min={0} max={100} placeholder="Priorità" value={ruleForm.priority} onChange={(e) => setRuleForm((prev) => ({ ...prev, priority: Number(e.target.value) || 0 }))} />
                  <Select value={ruleForm.is_active ? 'active' : 'inactive'} onValueChange={(value) => setRuleForm((prev) => ({ ...prev, is_active: value === 'active' }))}>
                    <SelectTrigger><SelectValue placeholder="Stato" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Attiva</SelectItem>
                      <SelectItem value="inactive">Disattiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea className="min-h-[220px]" placeholder="Contenuto della regola" value={ruleForm.content} onChange={(e) => setRuleForm((prev) => ({ ...prev, content: e.target.value }))} />
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => rulesMutation.mutate(ruleForm)} disabled={rulesMutation.isPending || !ruleForm.key || !ruleForm.label || !ruleForm.content}>
                    {rulesMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScrollText className="mr-2 h-4 w-4" />}
                    {ruleForm.id ? 'Aggiorna regola' : 'Salva regola'}
                  </Button>
                  <Button variant="outline" onClick={() => setRuleForm(ruleDefaults)}>Nuova</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-border bg-background/20">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Regole attive della guida</CardTitle>
                <CardDescription>Definiscono il tono sacro-editoriale e le priorità del RAG.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rulesQuery.data?.length ? rulesQuery.data.map((rule) => (
                  <button key={rule.id} type="button" onClick={() => setRuleForm({ id: rule.id, key: rule.key, label: rule.label, content: rule.content, rule_type: rule.rule_type as AssistantRuleType, priority: rule.priority, is_active: rule.is_active })} className="w-full rounded-lg border border-border/60 bg-card/50 p-4 text-left transition hover:border-accent/40 hover:bg-accent/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{rule.label}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{ruleTypeLabels[rule.rule_type as AssistantRuleType]}</Badge>
                          <Badge variant="outline">{rule.is_active ? 'Attiva' : 'Disattiva'}</Badge>
                          <Badge variant="outline">Priorità {rule.priority}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); if (confirm(`Eliminare la regola "${rule.label}"?`)) deleteMutation.mutate({ table: 'assistant_rules', id: rule.id }); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{rule.content}</p>
                  </button>
                )) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-background/30 p-6 text-sm text-muted-foreground">Nessuna regola ancora impostata.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card className="minimal-border bg-background/40">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{sourceForm.id ? 'Modifica fonte approvata' : 'Nuova fonte approvata'}</CardTitle>
                <CardDescription>Link e domini da usare per la verifica esterna secondaria della Guida AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Nome fonte" value={sourceForm.label} onChange={(e) => setSourceForm((prev) => ({ ...prev, label: e.target.value }))} />
                <Input placeholder="URL completo" value={sourceForm.url} onChange={(e) => setSourceForm((prev) => ({ ...prev, url: e.target.value, domain: inferDomain(e.target.value) || prev.domain }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Dominio" value={sourceForm.domain} onChange={(e) => setSourceForm((prev) => ({ ...prev, domain: e.target.value }))} />
                  <Select value={sourceForm.source_kind} onValueChange={(value: AssistantSourceKind) => setSourceForm((prev) => ({ ...prev, source_kind: value }))}>
                    <SelectTrigger><SelectValue placeholder="Tipo fonte" /></SelectTrigger>
                    <SelectContent>{Object.entries(sourceKindLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Textarea className="min-h-[180px]" placeholder="Descrizione / note editoriali" value={sourceForm.description} onChange={(e) => setSourceForm((prev) => ({ ...prev, description: e.target.value }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input type="number" min={0} max={100} placeholder="Trust level" value={sourceForm.trust_level} onChange={(e) => setSourceForm((prev) => ({ ...prev, trust_level: Number(e.target.value) || 0 }))} />
                  <Select value={sourceForm.is_active ? 'active' : 'inactive'} onValueChange={(value) => setSourceForm((prev) => ({ ...prev, is_active: value === 'active' }))}>
                    <SelectTrigger><SelectValue placeholder="Stato" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Attiva</SelectItem>
                      <SelectItem value="inactive">Disattiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => sourcesMutation.mutate(sourceForm)} disabled={sourcesMutation.isPending || !sourceForm.label || !sourceForm.url}>
                    {sourcesMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                    {sourceForm.id ? 'Aggiorna fonte' : 'Salva fonte'}
                  </Button>
                  <Button variant="outline" onClick={() => setSourceForm(sourceDefaults)}>Nuova</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-border bg-background/20">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Registro fonti esterne</CardTitle>
                <CardDescription>La rete entra solo qui: come verifica secondaria, esplicita e controllata.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sourcesQuery.data?.length ? sourcesQuery.data.map((source) => (
                  <button key={source.id} type="button" onClick={() => setSourceForm({ id: source.id, label: source.label, description: source.description ?? '', url: source.url, domain: source.domain, source_kind: source.source_kind as AssistantSourceKind, trust_level: source.trust_level, is_active: source.is_active })} className="w-full rounded-lg border border-border/60 bg-card/50 p-4 text-left transition hover:border-accent/40 hover:bg-accent/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{source.label}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{sourceKindLabels[source.source_kind as AssistantSourceKind]}</Badge>
                          <Badge variant="outline">{source.is_active ? 'Attiva' : 'Disattiva'}</Badge>
                          <Badge variant="outline">Trust {source.trust_level}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); if (confirm(`Eliminare la fonte "${source.label}"?`)) deleteMutation.mutate({ table: 'assistant_sources', id: source.id }); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{source.domain}</p>
                    {source.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{source.description}</p>}
                  </button>
                )) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-background/30 p-6 text-sm text-muted-foreground">Nessuna fonte esterna approvata ancora presente.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-8 bg-border/60" />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border/60 bg-background/20 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Documenti</p>
          <p className="mt-3 font-serif text-3xl text-foreground">{metrics.documents}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/20 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">FAQ</p>
          <p className="mt-3 font-serif text-3xl text-foreground">{metrics.faqs}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/20 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Regole</p>
          <p className="mt-3 font-serif text-3xl text-foreground">{metrics.rules}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/20 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Fonti</p>
          <p className="mt-3 font-serif text-3xl text-foreground">{metrics.sources}</p>
        </div>
      </div>
    </SectionShell>
  );
}
