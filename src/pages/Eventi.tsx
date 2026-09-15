import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ViaLayout from "@/components/ViaLayout";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { loadEvents, posterUrl, type SiteEvent } from "@/events/siteEvents";
import "./editorial-pages.css";
import "./event-pages.css";

const dates = (event: SiteEvent) => {
  const format = (value: string) => new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
  return event.end_date ? `${format(event.start_date)} – ${format(event.end_date)}` : format(event.start_date);
};

export function EventCard({ event }: { event: SiteEvent }) {
  return <Dialog><DialogTrigger asChild>
    <button type="button" className="event-card" aria-label={`Apri locandina e dettagli: ${event.title}, ${dates(event)}`}>
      <img src={posterUrl(event.thumbnail_image_path)} alt="" loading="lazy" />
      <span className="event-card__copy"><strong>{event.title}</strong><time dateTime={event.start_date}>{dates(event)}</time></span>
    </button>
  </DialogTrigger><DialogContent className="event-dialog max-h-[90dvh] max-w-3xl overflow-y-auto border-violet-300/40 bg-[#120c25] text-[#f9f2ff]" aria-describedby={`event-description-${event.id}`}>
    <DialogTitle className="font-serif text-3xl">{event.title}</DialogTitle>
    <p className="text-violet-100"><time dateTime={event.start_date}>{dates(event)}</time></p>
    <img className="event-dialog__poster" src={posterUrl(event.original_image_path)} alt={`Locandina di ${event.title}`} />
    <DialogDescription id={`event-description-${event.id}`} className="whitespace-pre-wrap text-base leading-relaxed text-violet-50">{event.description}</DialogDescription>
  </DialogContent></Dialog>;
}

export default function Eventi() {
  const query = useQuery({ queryKey: ["public-events"], queryFn: () => loadEvents(false), retry: false });
  useEffect(() => { document.title = "Eventi | Jessica Marin"; }, []);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (query.data ?? []).filter(event => (event.end_date ?? event.start_date) >= today).sort((a, b) => a.start_date.localeCompare(b.start_date));
  const past = (query.data ?? []).filter(event => (event.end_date ?? event.start_date) < today).sort((a, b) => b.start_date.localeCompare(a.start_date));
  return <ViaLayout viaClass="editorial-page" title="Eventi">
    <div className="editorial-hero event-hero"><div className="editorial-hero__copy"><p className="editorial-kicker">✦ Incontri e percorsi</p><h1>Eventi</h1><p className="editorial-intro">Uno spazio per incontrarsi, praticare e condividere il cammino.</p></div></div>
    <div className="event-sections">
      {query.isLoading && <p role="status">Caricamento eventi…</p>}
      {query.isError && <p role="alert">Gli eventi non sono disponibili. Riprova più tardi.</p>}
      <section aria-labelledby="next-events"><h2 id="next-events">Prossimi eventi</h2>{upcoming.length ? <div className="event-grid">{upcoming.map(event => <EventCard key={event.id} event={event} />)}</div> : query.isSuccess && <p>Non ci sono eventi in programma.</p>}</section>
      <section aria-labelledby="past-events"><h2 id="past-events">Eventi passati</h2>{past.length ? <div className="event-grid">{past.map(event => <EventCard key={event.id} event={event} />)}</div> : query.isSuccess && <p>Non ci sono ancora eventi passati.</p>}</section>
    </div>
  </ViaLayout>;
}
