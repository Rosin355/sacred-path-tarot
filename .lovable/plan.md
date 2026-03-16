
Obiettivo: attivare la futura Guida AI senza rompere l’architettura attuale dell’orb, facendo sì che le risposte partano sempre prima dalla knowledge base interna, e solo dopo possano essere arricchite dalla rete con verifica esplicita.

1. Attivare la Guida AI come “Phase 2” dentro l’assistente esistente
- Riuseremo il floating voice assistant già presente, senza sostituirlo.
- Il bottone “Chiedi alla guida” smetterà di essere placeholder e aprirà una modalità conversazionale nello stesso pannello/orb.
- La prima capability da attivare sarà la “Guida alla Via”, coerente con quanto hai scelto.

2. Introdurre un backend AI dedicato
- Creeremo una backend function separata per la guida AI, distinta da `voice-read-page`.
- Userà Lovable AI lato backend, così il prompt e la logica di retrieval restano protetti e modificabili nel tempo.
- Modello iniziale consigliato: `google/gemini-3-flash-preview`.
- La funzione riceverà: messaggi conversazione, pagina corrente, eventuale Via corrente, e contesto recuperato dalla knowledge base.

3. Definire una pipeline RAG a priorità interna
La risposta seguirà sempre questo ordine:
```text
Utente → recupero contenuti interni approvati → costruzione risposta base
      → eventuale verifica/arricchimento rete → risposta finale con distinzione fonti
```
- Step A: recupero dalla knowledge base interna
- Step B: ranking dei contenuti più rilevanti
- Step C: generazione risposta AI basata prima sulle fonti interne
- Step D: se serve, verifica/raffinamento con fonti esterne approvate o rete
- Step E: risposta finale che distingua chiaramente:
  - cosa deriva dai contenuti interni
  - cosa deriva da fonti esterne/verifica web

4. Preparare il modello dati della knowledge base
Per supportare bene la futura dashboard admin, conviene creare tabelle dedicate, non un CMS improvvisato. Struttura consigliata:
- `knowledge_documents`
  - titolo, tipo contenuto, stato pubblicazione, Via associata, testo, summary, priorità, tag
- `knowledge_chunks`
  - frammenti indicizzati del documento per retrieval
- `assistant_rules`
  - prompt di sistema, tono, limiti, priorità fonti, policy di risposta
- `assistant_faqs`
  - domande/risposte curate e riusabili
- `assistant_sources`
  - link/fonte esterna approvata, tipo, dominio, livello fiducia
- opzionale più avanti: `chat_sessions` e `chat_messages` se vorrai memoria persistente utente
Tutto protetto con RLS: pubblico in sola lettura solo dove serve, admin per gestione contenuti.

5. Preparare l’ingestione dei contenuti admin
Dato che vuoi raffinare le risposte con contenuti che caricherai più tardi:
- la dashboard admin dovrà permettere di inserire:
  - testi lunghi
  - FAQ strutturate
  - prompt e regole
  - link/fonti esterne approvate
- al salvataggio:
  - il documento viene normalizzato
  - spezzato in chunk
  - arricchito con metadata (Via, tema, priorità, stato)
  - pronto per retrieval
Questo evita di dover riscrivere l’AI quando arriverà la dashboard.

6. Decidere come fare retrieval
Due fasi consigliate:
- Fase 1 semplice e rapida:
  - retrieval keyword + tag + Via + priorità editoriale
  - utile per partire presto
- Fase 2 migliore:
  - aggiunta embeddings / semantic search per trovare testi più pertinenti
Se vuoi partire presto, farei Fase 1 subito e terrei l’upgrade semantico come step successivo.

7. Gestire la rete come fonte secondaria “sempre con verifica”
Hai scelto che la rete possa essere usata, ma solo partendo dalla knowledge base.
Quindi la regola sarà:
- l’AI non cerca online come prima scelta
- usa prima contenuti interni approvati
- poi, se la risposta richiede aggiornamento o conferma, consulta:
  - prima `assistant_sources` approvate
  - poi eventualmente ricerca web controllata
Per la parte rete, il piano migliore è prevedere un connettore/search backend dedicato, ma solo in una seconda iterazione. Prima conviene stabilizzare bene la base interna.

8. Raffinare il comportamento dell’assistente
La Guida AI dovrà avere regole chiare:
- tono coerente con Jessica e con il tempio
- niente affermazioni arbitrarie se la knowledge base non copre il tema
- priorità assoluta ai contenuti interni
- se usa la rete, deve segnalarlo
- se un tema è sensibile o non coperto, invita a contatto/prenotazione o alla Via corretta

9. Aggiornare il pannello vocale in modo non distruttivo
Nel pannello attuale aggiungeremo una sezione conversazionale elegante:
- input domanda
- area risposta markdown
- stato “listening / thinking / speaking”
- eventuale toggle futuro:
  - “Solo guida interna”
  - “Guida + verifica esterna”
La logica “Leggi contenuto” resterà intatta e separata.

10. Roadmap consigliata
Fase A — Fondamenta AI
- creare schema knowledge base
- creare backend function AI
- collegare il pannello a una prima chat Q&A / Guida alla Via
- usare solo contenuti interni

Fase B — Admin content
- estendere `/admin` con gestione documenti, FAQ, regole e fonti
- salvare e organizzare i contenuti per Via e priorità

Fase C — Retrieval avanzato
- migliorare ranking/semantic retrieval
- aggiungere memoria conversazionale se la vorrai

Fase D — Rete verificata
- integrare ricerca esterna controllata
- mostrare in risposta quali parti arrivano da fonti interne vs esterne

11. Cosa farei subito come primo sprint
Sprint 1 consigliato:
- attivare la Guida AI nel pannello esistente
- creare backend function AI
- creare tabelle minime:
  - `knowledge_documents`
  - `knowledge_chunks`
  - `assistant_rules`
  - `assistant_faqs`
- precaricare i contenuti già presenti nelle pagine Arcani / Respiro / Ispirazione come prima knowledge base
- limitare la prima versione alla “Guida alla Via”
Così ottieni una prima AI utile subito, già pronta a essere raffinata più avanti dalla dashboard admin.

12. Risultato atteso
Alla fine di questo piano avrai:
- un assistente AI dentro l’orb esistente
- risposte sempre basate prima sulla tua knowledge base
- una struttura pronta a ricevere i contenuti admin futuri
- possibilità di arricchimento con rete senza perdere controllo editoriale
- una base solida per evolvere poi verso letture tarocchi AI con RAG dedicato

Se vuoi, il prossimo step pratico che pianificherei è: “costruiamo la Fase A con schema dati minimo + prima Guida AI alla Via nel pannello esistente”.
