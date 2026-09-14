import { z } from "zod";

export const sitePages = ["home", "arcani", "respiro", "ispirazione"] as const;
export type SitePage = (typeof sitePages)[number];
export type ContentState = "draft" | "published";
export type SitePageContent = Record<string, string>;

export type ContentField = {
  key: string;
  label: string;
  group: string;
  kind: "title" | "paragraph" | "item";
};

const f = (key: string, label: string, group: string, kind: ContentField["kind"]): ContentField => ({ key, label, group, kind });

export const pageLabels: Record<SitePage, string> = {
  home: "Homepage",
  arcani: "Arcani",
  respiro: "Respiro",
  ispirazione: "Arte",
};

export const contentFields: Record<SitePage, ContentField[]> = {
  home: [
    f("hero_kicker", "Testo introduttivo", "Soglia", "title"), f("hero_title", "Titolo", "Soglia", "title"),
    f("hero_subtitle", "Sottotitolo", "Soglia", "paragraph"), f("intro_kicker", "Titolo breve", "Presentazione", "title"),
    f("intro_text", "Presentazione", "Presentazione", "paragraph"),
    f("arcani_kicker", "Titolo breve", "Via degli Arcani", "title"), f("arcani_title", "Titolo", "Via degli Arcani", "title"),
    f("arcani_intro", "Introduzione", "Via degli Arcani", "paragraph"),
    ...Array.from({ length: 6 }, (_, i) => f(`arcani_item_${i + 1}`, `Voce ${i + 1}`, "Via degli Arcani", "item")),
    f("arcani_closing", "Testo conclusivo", "Via degli Arcani", "paragraph"),
    f("respiro_kicker", "Titolo breve", "Via del Respiro", "title"), f("respiro_title", "Titolo", "Via del Respiro", "title"),
    f("respiro_intro", "Introduzione", "Via del Respiro", "paragraph"),
    f("respiro_group_1", "Primo ambito", "Via del Respiro", "title"), f("respiro_items_1", "Discipline del primo ambito", "Via del Respiro", "item"),
    f("respiro_group_2", "Secondo ambito", "Via del Respiro", "title"), f("respiro_items_2", "Discipline del secondo ambito", "Via del Respiro", "item"),
    f("respiro_closing", "Testo conclusivo", "Via del Respiro", "paragraph"), f("respiro_place", "Luogo e orario", "Via del Respiro", "item"),
    f("respiro_note", "Nota pratica", "Via del Respiro", "item"),
    f("arte_kicker", "Titolo breve", "Via dell’Arte", "title"), f("arte_title", "Titolo", "Via dell’Arte", "title"),
    f("arte_intro", "Introduzione", "Via dell’Arte", "paragraph"),
    ...Array.from({ length: 4 }, (_, i) => [f(`arte_group_${i + 1}`, `Ambito ${i + 1}`, "Via dell’Arte", "title"), f(`arte_text_${i + 1}`, `Descrizione ${i + 1}`, "Via dell’Arte", "item")]).flat(),
    f("final_kicker", "Titolo breve", "Chiusura", "title"), f("final_title", "Titolo", "Chiusura", "title"),
    f("final_arcani", "Nome Via degli Arcani", "Chiusura", "title"), f("final_respiro", "Nome Via del Respiro", "Chiusura", "title"), f("final_arte", "Nome Via dell’Arte", "Chiusura", "title"),
  ],
  arcani: [
    f("hero_kicker", "Titolo breve", "Apertura", "title"), f("hero_title", "Titolo", "Apertura", "title"), f("hero_text", "Introduzione", "Apertura", "paragraph"),
    ...Array.from({ length: 3 }, (_, i) => [f(`section_${i + 1}_title`, `Titolo sezione ${i + 1}`, "Percorsi", "title"), f(`section_${i + 1}_text`, `Testo sezione ${i + 1}`, "Percorsi", "paragraph")]).flat(),
    f("closing", "Testo conclusivo", "Chiusura", "paragraph"),
  ],
  respiro: [
    f("hero_kicker", "Titolo breve", "Apertura", "title"), f("hero_title", "Titolo", "Apertura", "title"), f("hero_text", "Introduzione", "Apertura", "paragraph"),
    ...Array.from({ length: 4 }, (_, i) => [f(`section_${i + 1}_title`, `Titolo sezione ${i + 1}`, "Discipline", "title"), f(`section_${i + 1}_text`, `Testo sezione ${i + 1}`, "Discipline", "paragraph")]).flat(),
    f("practical_label", "Titolo breve", "Informazioni pratiche", "title"), f("practical_place", "Luogo", "Informazioni pratiche", "title"), f("practical_text", "Giorni e orari", "Informazioni pratiche", "paragraph"),
    f("closing", "Testo conclusivo", "Chiusura", "paragraph"),
  ],
  ispirazione: [
    f("hero_kicker", "Titolo breve", "Apertura", "title"), f("hero_title", "Titolo", "Apertura", "title"), f("hero_text", "Introduzione", "Apertura", "paragraph"),
    ...Array.from({ length: 4 }, (_, i) => [f(`section_${i + 1}_label`, `Etichetta sezione ${i + 1}`, "Ambiti", "title"), f(`section_${i + 1}_title`, `Titolo sezione ${i + 1}`, "Ambiti", "title"), f(`section_${i + 1}_text`, `Testo sezione ${i + 1}`, "Ambiti", "paragraph")]).flat(),
    f("closing", "Testo conclusivo", "Chiusura", "paragraph"),
  ],
};

export const defaultSiteContent: Record<SitePage, SitePageContent> = {
  home: {
    hero_kicker: "Un percorso con Jessica Marin", hero_title: "Le tre vie\nper illuminarsi", hero_subtitle: "Tarocchi, yoga, attività fisica e arte: tre vie per conoscerti, ritrovare equilibrio ed esprimere ciò che sei.",
    intro_kicker: "La Sacerdotessa", intro_text: "Sono Jessica Marin. Ti accompagno nell’esplorazione del tuo mondo interiore attraverso simboli, tarocchi e pratiche del corpo. Nei miei corsi, percorsi e workshop condivido conoscenze esoteriche, yoga e attività motorie, dai livelli di base a quelli avanzati. Vuoi trovare la tua luce interiore? Scegli la tua via.",
    arcani_kicker: "Il cammino attraverso i simboli", arcani_title: "La Via degli Arcani", arcani_intro: "Non solo divinazione: i tarocchi come via di conoscenza, interpretazione e consapevolezza.",
    arcani_item_1: "Corsi sugli Arcani Maggiori e Minori", arcani_item_2: "Metodi di stesura e lettura", arcani_item_3: "Medianità attraverso i tarocchi", arcani_item_4: "La Carta del Destino — comprendere sé e gli altri dalla data di nascita", arcani_item_5: "Esercitazioni pratiche sulle stesure — ogni primo venerdì del mese, Libreria Esoterica Il Sigillo", arcani_item_6: "Consulti personali", arcani_closing: "Ogni percorso è pensato per accompagnarti verso una comprensione più profonda del simbolo e di te stesso.",
    respiro_kicker: "Yoga e attività fisica", respiro_title: "La Via del Respiro", respiro_intro: "La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica: Yoga e attività fisica si incontrano in un percorso di ascolto, forza e consapevolezza.", respiro_group_1: "Attività fisica e pratiche dinamiche", respiro_items_1: "Power Yoga · Ginnastica Total Body", respiro_group_2: "Yoga, tecnica e respiro", respiro_items_2: "Iyengar · Hatha · Yin · Pranayama", respiro_closing: "Equilibrio tra flessibilità, forza, potenza e resistenza; atmosfera e ascolto, con chiusura di rilassamento e integrazione.", respiro_place: "Kairos Spazio Olistico — mercoledì 20:30–21:45", respiro_note: "+ sostituzioni in altre palestre",
    arte_kicker: "Arte, parola e contemplazione", arte_title: "La Via dell’Arte", arte_intro: "L’arte dà forma al mondo interiore: trasforma simboli, parole e ascolto in espressione e consapevolezza.", arte_group_1: "Editoriale", arte_text_1: "Articoli su simbolismo e alchimia interiore", arte_group_2: "Sonoro", arte_text_2: "Ascolti e paesaggi sonori esoterici", arte_group_3: "Letterario", arte_text_3: "Testi sacri e poesia mistica", arte_group_4: "Culturale", arte_text_4: "Eventi e progetti",
    final_kicker: "Il tuo prossimo passo", final_title: "Scegli la via\nche senti tua", final_arcani: "La Via degli Arcani", final_respiro: "La Via del Respiro", final_arte: "La Via dell’Arte",
  },
  arcani: {
    hero_kicker: "Il cammino attraverso i simboli", hero_title: "La Via degli Arcani", hero_text: "La Via degli Arcani è il percorso dedicato a chi desidera entrare davvero nel linguaggio dei tarocchi, non solo come strumento divinatorio, ma come via di conoscenza, interpretazione e consapevolezza. Qui Jessica Marin accompagna l'allievo nello studio degli arcani maggiori, degli arcani minori, dei metodi di stesura, della medianità attraverso i tarocchi e della carta del destino.",
    section_1_title: "Corsi e percorsi sui tarocchi", section_1_text: "Il percorso include corsi dedicati agli arcani maggiori, agli arcani minori, ai metodi di stesura dei tarocchi e allo sviluppo della medianità per mezzo dei tarocchi. Ogni proposta è pensata per aiutare la persona a leggere il simbolo con più profondità, ordine e sensibilità.", section_2_title: "Carta del destino e lettura simbolica", section_2_text: "Tra i percorsi proposti c'è anche la carta del destino, un lavoro che aiuta a comprendere se stessi e gli altri attraverso la data di nascita, in una chiave simbolica e riflessiva.", section_3_title: "Esercitazioni pratiche sulle stesure dei tarocchi", section_3_text: "Ogni primo venerdì del mese, presso la Libreria Esoterica Il Sigillo, Jessica guida un incontro di esercitazione sulle stesure dei tarocchi. Questo spazio formativo aiuta gli allievi a integrare arcani maggiori e minori, imparare a porre le domande giuste e offrire un responso più chiaro, veritiero e ben strutturato.", closing: "Ogni percorso è pensato per accompagnarti verso una comprensione più profonda del simbolo e di te stesso.",
  },
  respiro: {
    hero_kicker: "Yoga e attività fisica", hero_title: "La Via del Respiro", hero_text: "La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica: Yoga e attività fisica si incontrano in un percorso di ascolto, forza e consapevolezza.", section_1_title: "Attività fisica e pratiche dinamiche", section_1_text: "Power Yoga e Ginnastica Total Body sviluppano movimento, energia, forza e resistenza attraverso una pratica consapevole e progressiva.", section_2_title: "Yoga, tecnica e respiro", section_2_text: "Iyengar, Hatha, Yin e Pranayama uniscono precisione, ascolto e respirazione per accompagnare ogni persona verso una pratica più profonda.", section_3_title: "Ascolto, forza e consapevolezza", section_3_text: "La pratica diventa un percorso concreto di relazione con il corpo e la mente, adattabile ai diversi livelli e orientato a una crescita graduale.", section_4_title: "Un approccio che unisce forza e presenza", section_4_text: "Jessica non guida solo al rilassamento, ma porta la persona verso un equilibrio tra flessibilità, forza, potenza, resistenza, atmosfera e ascolto. Ogni lezione custodisce il ricordo del respiro, una cura per l'ambiente e un momento finale di rilassamento e integrazione.", practical_label: "Dove e quando", practical_place: "Kairos Spazio Olistico", practical_text: "Le lezioni si tengono attualmente presso Kairos Spazio Olistico il mercoledì sera, dalle 20:30 alle 21:45, oltre a eventuali sostituzioni in altre palestre.", closing: "La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica.",
  },
  ispirazione: {
    hero_kicker: "Arte, parola e contemplazione", hero_title: "La Via dell’Arte", hero_text: "L’arte dà forma al mondo interiore: trasforma simboli, parole e ascolto in espressione e consapevolezza.", section_1_label: "editoriale", section_1_title: "Articoli e riflessioni", section_1_text: "Scritti contemplativi su simbolismo, alchimia interiore e le correnti invisibili che attraversano l'esistenza. Uno spazio di pensiero lento e profondo.", section_2_label: "sonoro", section_2_title: "Musica e ascolti", section_2_text: "Ascolti curati, paesaggi sonori esoterici e musica che risveglia la dimensione sacra del sentire. Un invito a fermarsi e lasciarsi attraversare dal suono.", section_3_label: "letterario", section_3_title: "Letteratura esoterica", section_3_text: "Una biblioteca vivente di testi sacri, poesia mistica e opere che illuminano il cammino interiore. Letture scelte per nutrire la ricerca personale.", section_4_label: "culturale", section_4_title: "Eventi culturali e progetti speciali", section_4_text: "Incontri, collaborazioni e iniziative che uniscono arte, simbolo e comunità. Progetti che nascono dall'incontro tra visione interiore e creazione condivisa.", closing: "L’arte rende visibile ciò che il mondo interiore custodisce ancora senza forma.",
  },
};

export const maxLengthFor = (kind: ContentField["kind"]) => kind === "title" ? 160 : kind === "item" ? 500 : 3000;

export const pageContentSchema = (page: SitePage) => z.object(Object.fromEntries(contentFields[page].map(field => [field.key, z.string().trim().min(1, "Il campo non può essere vuoto").max(maxLengthFor(field.kind))]))).strict();

export const mergeWithDefaults = (page: SitePage, value: unknown): SitePageContent => {
  const parsed = pageContentSchema(page).safeParse(value);
  return parsed.success ? parsed.data : defaultSiteContent[page];
};
