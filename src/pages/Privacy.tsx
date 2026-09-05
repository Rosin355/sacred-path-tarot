import { useEffect } from "react";
import ViaLayout from "@/components/ViaLayout";
import { privacyContactEmail } from "@/config/privacy";

const Privacy = () => {
  useEffect(() => {
    document.title = "Informativa privacy | Jessica Marin";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", "Informativa sul trattamento dei dati inviati attraverso i form del Tempio delle Tre Vie.");
    return () => {
      document.title = "Tempio delle Tre Vie — Jessica Marin";
    };
  }, []);

  return (
    <ViaLayout viaClass="via-privacy" title="Privacy">
      <article className="mx-auto max-w-3xl px-6 py-24 font-body text-muted-foreground md:py-32">
        <header className="mb-14 text-center">
          <p className="mb-5 font-caption text-[10px] uppercase tracking-[0.28em] text-accent/60">Tutela e trasparenza</p>
          <h1 className="font-display text-4xl text-foreground md:text-6xl">Informativa privacy</h1>
          <p className="mt-5 text-sm">Ultimo aggiornamento: 5 settembre 2026</p>
        </header>

        <div className="space-y-10 text-sm leading-7 md:text-base">
          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Titolare del trattamento</h2>
            <p>Il titolare del trattamento è Jessica Marin.</p>
            {privacyContactEmail ? (
              <p>Per richieste relative ai tuoi dati puoi scrivere a <a className="text-accent underline underline-offset-4" href={`mailto:${privacyContactEmail}`}>{privacyContactEmail}</a>.</p>
            ) : (
              <p className="mt-3 rounded-md border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">Il recapito privacy è in fase di configurazione. I form restano disabilitati fino al completamento.</p>
            )}
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Dati raccolti e finalità</h2>
            <p>I form raccolgono nome, email, eventuale telefono, Via e motivo selezionati, messaggio e data di presa visione dell’informativa. I dati vengono utilizzati esclusivamente per leggere, organizzare e rispondere alla richiesta inviata.</p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Base giuridica</h2>
            <p>Il trattamento è necessario per rispondere alla richiesta dell’interessato e, quando pertinente, per adottare misure precontrattuali richieste dall’interessato. La casella nel form attesta la presa visione dell’informativa; il consenso viene utilizzato soltanto nei casi in cui sia la base giuridica applicabile. I dati non vengono utilizzati per newsletter, profilazione o comunicazioni promozionali automatiche.</p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Conservazione e accesso</h2>
            <p>Le richieste vengono conservate per un periodo massimo previsto di 12 mesi, salvo eliminazione anticipata o obblighi di legge. Sono accessibili soltanto agli amministratori autorizzati del sito.</p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Servizio tecnologico</h2>
            <p>I dati sono archiviati nell’infrastruttura Lovable Cloud/Supabase utilizzata dal sito. Non vengono inviati a servizi esterni di email marketing attraverso questo form.</p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Diritti dell’interessato</h2>
            <p>Puoi richiedere accesso, rettifica, cancellazione, limitazione o opposizione al trattamento dei tuoi dati, oltre alla revoca del consenso quando applicabile. Puoi inoltre presentare reclamo all’autorità di controllo competente.</p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-foreground">Dati obbligatori</h2>
            <p>Nome, email, motivo, messaggio e conferma di presa visione dell’informativa sono necessari per inviare la richiesta. Il numero di telefono è sempre facoltativo.</p>
          </section>
        </div>
      </article>
    </ViaLayout>
  );
};

export default Privacy;
