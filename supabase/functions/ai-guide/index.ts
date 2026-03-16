import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type ChatRole = "system" | "user" | "assistant";
type KnowledgePath = "arcani" | "respiro" | "ispirazione" | "tempio";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type RequestBody = {
  messages?: ChatMessage[];
  currentPath?: KnowledgePath;
  currentRoute?: string;
  pageTitle?: string;
  enableExternalVerification?: boolean;
};

type RuleRow = {
  key: string;
  label: string;
  content: string;
  rule_type: string;
  priority: number;
};

type SourceRow = {
  id: string;
  label: string;
  description: string | null;
  url: string;
  domain: string;
  trust_level: number;
};

type DocumentRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  tags: string[];
  path: KnowledgePath;
  priority: number;
  source_url: string | null;
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  path: KnowledgePath;
  priority: number;
};

type ChunkRow = {
  id: string;
  document_id: string;
  heading: string | null;
  content: string;
  chunk_index: number;
  token_estimate: number;
  metadata: Record<string, unknown> | null;
};

type RankedInternalSource = {
  id: string;
  type: "document" | "faq" | "chunk";
  title: string;
  path: KnowledgePath;
  score: number;
  excerpt: string;
  slug?: string;
};

type ExternalEvidence = {
  label: string;
  url: string;
  excerpt: string;
  domain?: string;
  trustLevel?: number;
  sourceType: "approved_source" | "web_search";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STOPWORDS = new Set([
  "il", "lo", "la", "i", "gli", "le", "un", "una", "uno", "di", "a", "da", "in", "con", "su", "per", "tra", "fra",
  "e", "o", "ma", "che", "chi", "come", "dove", "quando", "quanto", "quale", "quali", "del", "della", "delle", "dello",
  "dei", "degli", "dell", "al", "allo", "alla", "alle", "agli", "ai", "nel", "nello", "nella", "nelle", "nei", "negli",
  "mi", "ti", "si", "ci", "vi", "è", "sono", "sei", "può", "puoi", "voglio", "vorrei", "fare", "essere", "avere",
  "this", "that", "with", "from", "your", "about", "what", "when", "where", "which", "into", "della", "delle",
]);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, max = 800) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}

function extractKeywords(text: string) {
  return Array.from(new Set(
    normalizeText(text)
      .split(" ")
      .filter((token) => token.length > 2 && !STOPWORDS.has(token))
  ));
}

function scoreText(text: string, keywords: string[]) {
  const normalized = normalizeText(text);
  return keywords.reduce((score, keyword) => {
    if (!normalized.includes(keyword)) return score;
    const occurrences = normalized.split(keyword).length - 1;
    return score + Math.min(occurrences, 4);
  }, 0);
}

function inferPathFromRoute(route?: string | null): KnowledgePath | null {
  const normalized = (route ?? "").toLowerCase();
  if (normalized.includes("arcani")) return "arcani";
  if (normalized.includes("respiro")) return "respiro";
  if (normalized.includes("ispirazione")) return "ispirazione";
  return null;
}

function shouldUseExternalVerification(question: string, internalCount: number, enabled: boolean) {
  if (!enabled) return false;
  const freshnessPattern = /(oggi|attuale|recent|recenti|novita|novità|ultim|202[5-9]|adesso|ora|web|rete|fonte esterna|verifica)/i;
  return internalCount < 2 || freshnessPattern.test(question);
}

async function fetchWithTimeout(url: string, timeoutMs = 8000, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0 Lovable AI Guide" , ...(init?.headers ?? {}) } });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchPageExcerpt(url: string) {
  try {
    const response = await fetchWithTimeout(url, 8000);
    if (!response.ok) return null;
    const html = await response.text();
    const text = truncate(stripHtml(html), 1400);
    return text || null;
  } catch {
    return null;
  }
}

async function searchDuckDuckGo(query: string): Promise<ExternalEvidence[]> {
  try {
    const response = await fetchWithTimeout(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, 8000);
    if (!response.ok) return [];
    const html = await response.text();
    const matches = [...html.matchAll(/<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/g)].slice(0, 3);

    return matches.map((match) => ({
      label: stripHtml(match[2]),
      url: match[1],
      excerpt: truncate(stripHtml(match[3]), 400),
      sourceType: "web_search" as const,
    })).filter((item) => item.label && item.url);
  } catch {
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not configured");

    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_ANON_KEY) throw new Error("SUPABASE_ANON_KEY is not configured");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = (await req.json()) as RequestBody;
    const messages = Array.isArray(body.messages) ? body.messages.filter((item) => item?.content?.trim()) : [];

    if (!messages.length) {
      return jsonResponse({ error: "Missing messages" }, 400);
    }

    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content?.trim();
    if (!latestUserMessage) {
      return jsonResponse({ error: "Missing latest user message" }, 400);
    }

    const requestedPath = body.currentPath ?? inferPathFromRoute(body.currentRoute) ?? "tempio";
    const enableExternalVerification = body.enableExternalVerification ?? true;
    const keywords = extractKeywords(latestUserMessage);
    const authHeader = req.headers.get("Authorization") ?? `Bearer ${SUPABASE_ANON_KEY}`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const [rulesResult, docsResult, faqsResult, sourcesResult] = await Promise.all([
      supabase
        .from("assistant_rules")
        .select("key, label, content, rule_type, priority")
        .eq("is_active", true)
        .order("priority", { ascending: false })
        .limit(20),
      supabase
        .from("knowledge_documents")
        .select("id, title, slug, content, summary, tags, path, priority, source_url")
        .eq("status", "published")
        .in("path", requestedPath === "tempio" ? ["tempio", "arcani", "respiro", "ispirazione"] : ["tempio", requestedPath])
        .order("priority", { ascending: false })
        .limit(30),
      supabase
        .from("assistant_faqs")
        .select("id, question, answer, tags, path, priority")
        .eq("status", "published")
        .in("path", requestedPath === "tempio" ? ["tempio", "arcani", "respiro", "ispirazione"] : ["tempio", requestedPath])
        .order("priority", { ascending: false })
        .limit(30),
      supabase
        .from("assistant_sources")
        .select("id, label, description, url, domain, trust_level")
        .eq("is_active", true)
        .order("trust_level", { ascending: false })
        .limit(20),
    ]);

    if (rulesResult.error) throw rulesResult.error;
    if (docsResult.error) throw docsResult.error;
    if (faqsResult.error) throw faqsResult.error;
    if (sourcesResult.error) throw sourcesResult.error;

    const rules = (rulesResult.data ?? []) as RuleRow[];
    const docs = (docsResult.data ?? []) as DocumentRow[];
    const faqs = (faqsResult.data ?? []) as FaqRow[];
    const sources = (sourcesResult.data ?? []) as SourceRow[];

    const rankedDocs = docs
      .map((doc) => {
        const baseText = [doc.title, doc.summary ?? "", doc.tags.join(" "), truncate(doc.content, 2000)].join(" \n");
        let score = scoreText(baseText, keywords) + doc.priority;
        if (doc.path === requestedPath) score += 8;
        if (requestedPath !== "tempio" && doc.path === "tempio") score += 3;
        return {
          doc,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const chunkDocumentIds = rankedDocs.map(({ doc }) => doc.id);
    let chunks: ChunkRow[] = [];

    if (chunkDocumentIds.length) {
      const chunksResult = await supabase
        .from("knowledge_chunks")
        .select("id, document_id, heading, content, chunk_index, token_estimate, metadata")
        .in("document_id", chunkDocumentIds)
        .limit(100);

      if (chunksResult.error) throw chunksResult.error;
      chunks = (chunksResult.data ?? []) as ChunkRow[];
    }

    const rankedFaqs = faqs
      .map((faq) => {
        const baseText = [faq.question, faq.answer, faq.tags.join(" ")].join(" \n");
        let score = scoreText(baseText, keywords) + faq.priority;
        if (faq.path === requestedPath) score += 8;
        if (requestedPath !== "tempio" && faq.path === "tempio") score += 3;
        return { faq, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const rankedChunks = chunks
      .map((chunk) => {
        const parent = rankedDocs.find(({ doc }) => doc.id === chunk.document_id)?.doc;
        const score = scoreText([chunk.heading ?? "", chunk.content].join(" \n"), keywords) + (parent?.priority ?? 0);
        return {
          chunk,
          parent,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    const internalSources: RankedInternalSource[] = [
      ...rankedFaqs.map(({ faq, score }) => ({
        id: faq.id,
        type: "faq" as const,
        title: faq.question,
        path: faq.path,
        score,
        excerpt: truncate(faq.answer, 320),
      })),
      ...rankedDocs.map(({ doc, score }) => ({
        id: doc.id,
        type: "document" as const,
        title: doc.title,
        path: doc.path,
        score,
        excerpt: truncate(doc.summary || doc.content, 320),
        slug: doc.slug,
      })),
      ...rankedChunks.map(({ chunk, parent, score }) => ({
        id: chunk.id,
        type: "chunk" as const,
        title: chunk.heading || parent?.title || "Estratto",
        path: parent?.path || "tempio",
        score,
        excerpt: truncate(chunk.content, 320),
        slug: parent?.slug,
      })),
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const internalContext = internalSources
      .map((source, index) => `#${index + 1} [${source.type}] ${source.title} (${source.path})\n${source.excerpt}`)
      .join("\n\n");

    const useExternalVerification = shouldUseExternalVerification(
      latestUserMessage,
      internalSources.length,
      enableExternalVerification,
    );

    let externalEvidence: ExternalEvidence[] = [];

    if (useExternalVerification) {
      const rankedSources = sources
        .map((source) => ({
          source,
          score: scoreText([source.label, source.description ?? "", source.domain, source.url].join(" \n"), keywords) + source.trust_level,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const approvedEvidence = await Promise.all(
        rankedSources.map(async ({ source }) => {
          const excerpt = await fetchPageExcerpt(source.url);
          if (!excerpt) return null;
          return {
            label: source.label,
            url: source.url,
            domain: source.domain,
            trustLevel: source.trust_level,
            excerpt: truncate(excerpt, 500),
            sourceType: "approved_source" as const,
          };
        })
      );

      externalEvidence = approvedEvidence.filter(Boolean) as ExternalEvidence[];

      if (!externalEvidence.length) {
        externalEvidence = await searchDuckDuckGo(`${latestUserMessage} ${requestedPath} Jessica Marin`);
      }
    }

    const externalContext = externalEvidence
      .map((item, index) => `#${index + 1} [${item.sourceType}] ${item.label}\nURL: ${item.url}\n${item.excerpt}`)
      .join("\n\n");

    const systemRules = rules.map((rule) => `- (${rule.rule_type}) ${rule.label}: ${rule.content}`).join("\n");

    const systemPrompt = [
      "Sei la Guida AI del Tempio delle Tre Vie.",
      "Tono: sacro-editoriale, chiaro, accogliente, mai dogmatico o commerciale.",
      "Priorità assoluta: usa prima la knowledge base interna del Tempio.",
      "Non inventare contenuti. Se la base interna non basta, dichiaralo con delicatezza.",
      "Quando è presente materiale esterno, usalo solo come verifica o arricchimento secondario e distinguilo chiaramente dal sapere interno.",
      "Obiettivo principale: orientare l'utente verso la Via più adatta tra Arcani, Respiro, Ispirazione.",
      "Se la domanda è fuori perimetro o troppo sensibile, invita con grazia a contattare Jessica o a esplorare la Via più coerente.",
      "Rispondi in italiano.",
      "Struttura desiderata:\n1. risposta principale breve ma utile\n2. se utile, un piccolo orientamento pratico\n3. se hai usato verifica esterna, aggiungi una nota finale breve che lo dichiari.",
      systemRules ? `Regole editoriali attive:\n${systemRules}` : "",
      `Pagina/Via corrente: ${requestedPath}`,
      body.pageTitle ? `Titolo pagina corrente: ${body.pageTitle}` : "",
      `Contesto interno prioritario:\n${internalContext || "Nessun contenuto interno rilevante trovato."}`,
      externalContext ? `Verifica esterna secondaria:\n${externalContext}` : "Nessuna verifica esterna disponibile.",
    ].filter(Boolean).join("\n\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0.5,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((message) => ({ role: message.role, content: message.content })),
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        return jsonResponse({ error: "Rate limits exceeded, please try again later." }, 429);
      }
      if (response.status === 402) {
        return jsonResponse({ error: "Payment required, please add funds to your Lovable AI workspace." }, 402);
      }
      console.error("AI guide gateway error:", response.status, errorText);
      return jsonResponse({ error: "AI gateway error" }, 500);
    }

    const payload = await response.json();
    const answer = payload.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return jsonResponse({ error: "Empty AI response" }, 500);
    }

    return jsonResponse({
      answer,
      usedExternalVerification: externalEvidence.length > 0,
      sources: {
        internal: internalSources.map(({ id, type, title, path, slug, excerpt, score }) => ({ id, type, title, path, slug, excerpt, score })),
        external: externalEvidence,
      },
      meta: {
        currentPath: requestedPath,
        internalSourceCount: internalSources.length,
        externalSourceCount: externalEvidence.length,
      },
    });
  } catch (error) {
    console.error("AI guide error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
