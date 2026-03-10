# **implementation-plan**

## **Obiettivo del build**

Costruire una web experience modulare e rituale per **Il Tempio delle Tre Vie**.

Priorità assolute:

* rendere memorabile la soglia iniziale  
* chiarire l’offerta di Jessica dentro ogni Via  
* mantenere il sistema semplice da estendere  
* evitare complessità tecnica non necessaria nell’MVP

## **Principi di esecuzione**

* **Prima la struttura, poi il dettaglio visivo**  
  * prima rendiamo chiaro il flusso  
  * poi rifiniamo atmosfera, motion e contenuti  
* **Una decisione per schermata**  
  * homepage: scegli una Via  
  * mini-home: comprendi la proposta  
  * pagina interna: compi un’azione  
* **Micro-task, non macro-task**  
  * ogni fase deve essere scomponibile in passi piccoli  
  * ogni passo deve avere un output verificabile  
* **Atmosfera al servizio della chiarezza**  
  * il rituale non deve rallentare la comprensione  
  * ogni animazione deve avere uno scopo

## **Step-by-step build sequence**

## **Fase 0 — Allineamento e fondamenta**

### **0.1 Definire il perimetro MVP**

Output:

* elenco pagine MVP  
* elenco CTA MVP  
* lista contenuti placeholder  
* lista elementi non inclusi nel primo rilascio

Micro-task:

* confermare le 4 aree principali:  
  * homepage-soglia  
  * Via degli Arcani  
  * Via del Respiro  
  * Via dell’Ispirazione  
* confermare il pattern fisso:  
  * **Torna al Tempio**  
* confermare cosa rimane fuori:  
  * booking avanzato  
  * CMS complesso  
  * area privata  
  * AI guide  
  * automazioni sofisticate

### **0.2 Definire l’architettura informativa**

Output:

* mappa delle pagine  
* gerarchia dei contenuti  
* schema CTA per Via

Micro-task:

* nominare le pagine top-level  
* nominare le sottosezioni di ogni Via  
* definire 2–3 CTA massime per mini-home  
* definire un solo obiettivo primario per ogni pagina

### **0.3 Definire i contenuti placeholder**

Output:

* set minimo di testi temporanei eleganti  
* titoli, intro e CTA coerenti

Micro-task:

* scrivere invocation homepage  
* scrivere titolo e sottotitolo per le 3 porte  
* scrivere intro breve per ogni mini-home  
* scrivere label CTA coerenti e sobrie  
* scrivere testo del ritorno al tempio

## **Fase 1 — Design system base**

### **1.1 Impostare i token fondamentali**

Output:

* palette base  
* tipografia  
* spacing scale  
* radius, ombre, glow, layer depth

Micro-task:

* definire colori globali del tempio  
* definire variazioni cromatiche per le 3 Vie  
* definire scala tipografica H1–caption  
* definire griglia 8pt  
* definire regole di contrasto accessibile

### **1.2 Creare i componenti base**

Output:

* componenti UI riusabili  
* pattern coerenti per tutte le Vie

Micro-task:

* creare layout wrapper globale  
* creare titolo hero  
* creare card CTA  
* creare bottone/link rituale  
* creare pattern “Torna al Tempio”  
* creare contenitore sezione editoriale  
* creare stato vuoto elegante  
* creare feedback loading leggero solo dove serve

### **1.3 Definire motion language**

Output:

* libreria minima di transizioni e hover state

Micro-task:

* definire fade base  
* definire glow/awakening hover per le porte  
* definire timing della spirale  
* definire comportamento reduce-motion  
* definire transizione pagina → pagina

## **Fase 2 — Homepage soglia**

### **2.1 Costruire la scena full-screen**

Output:

* homepage fissa e completa

Micro-task:

* impostare layout a schermo pieno  
* posizionare invocation in alto al centro  
* costruire composizione frontale delle 3 porte  
* aggiungere titolo e sottotitolo sotto ogni porta  
* verificare equilibrio visivo desktop e mobile

### **2.2 Curare l’esperienza di scelta**

Output:

* homepage chiara, simbolica, non dispersiva

Micro-task:

* rendere tutta la porta cliccabile  
* aggiungere hover delicato  
* evitare scroll inutile  
* evitare elementi secondari in competizione  
* verificare focus keyboard su ogni porta

### **2.3 Validare il “primo impatto”**

Checklist:

* la pagina sembra una soglia e non una landing page  
* la scelta delle 3 Vie è immediata  
* i testi sono leggibili senza sforzo  
* le porte restano il centro visivo assoluto

## **Fase 3 — Transizione rituale**

### **3.1 Integrare la spirale esistente**

Output:

* transizione simbolica attivata dal click sulla porta

Micro-task:

* rimuovere ogni etichetta “Enter”  
* collegare ogni porta alla stessa logica di passaggio  
* associare la destinazione corretta alla Via scelta  
* garantire continuità visiva tra soglia e approdo

### **3.2 Regolare tempi e intensità**

Output:

* transizione cinematica ma non invadente

Micro-task:

* ridurre eccessi visivi  
* evitare effetto “game portal”  
* tarare durata percepita  
* testare fluidità su dispositivi medi  
* prevedere fallback semplice se animazione non disponibile

### **3.3 Validare il rito di passaggio**

Checklist:

* il passaggio sembra inevitabile e calmo  
* non blocca l’utente senza motivo  
* rafforza la narrativa del tempio  
* non compromette performance e accessibilità

## **Fase 4 — Mini-home delle tre Vie**

## **4.1 Struttura comune delle mini-home**

Output:

* template condiviso per ogni Via

Micro-task:

* creare hero della Via  
* aggiungere intro breve  
* aggiungere 2–3 blocchi CTA  
* posizionare “Torna al Tempio”  
* definire area visual coerente con la Via

### **4.2 Mini-home — Via degli Arcani**

Output:

* prima pagina chiara del mondo Arcani

Micro-task:

* definire titolo forte  
* scrivere intro sul metodo di Jessica  
* creare CTA:  
  * scopri l’approccio  
  * prenota un consulto  
  * esplora gli eventi  
* impostare atmosfera più profonda e ombrosa

### **4.3 Mini-home — Via del Respiro**

Output:

* prima pagina chiara del mondo Respiro

Micro-task:

* definire titolo forte  
* scrivere intro sulla pratica incarnata  
* creare CTA:  
  * comprendi la pratica  
  * scopri le attività  
  * richiedi informazioni  
* impostare atmosfera più luminosa e ariosa

### **4.4 Mini-home — Via dell’Ispirazione**

Output:

* prima pagina chiara del mondo Ispirazione

Micro-task:

* definire titolo forte  
* scrivere intro editoriale e contemplativa  
* creare CTA:  
  * esplora le ispirazioni  
  * leggi le riflessioni  
  * scopri eventi o progetti  
* impostare atmosfera più culturale e calda

## **Fase 5 — Pagine interne essenziali**

### **5.1 Via degli Arcani**

Pagine MVP:

* Il metodo di Jessica  
* Consulti / Percorsi  
* Eventi esoterici  
* Contatti / Prenotazione

Micro-task:

* strutturare ogni pagina con hero \+ spiegazione \+ CTA  
* evitare tono commerciale  
* rendere chiaro cosa aspettarsi da un consulto  
* differenziare eventi da percorsi individuali

### **5.2 Via del Respiro**

Pagine MVP:

* Approccio e filosofia  
* Discipline e pratiche  
* Eventi / lezioni / incontri  
* Contatti / Prenotazione

Micro-task:

* chiarire che non è fitness mainstream  
* spiegare i formati delle pratiche  
* distinguere lezioni, incontri, percorsi  
* rendere il contatto semplice e rassicurante

### **5.3 Via dell’Ispirazione**

Pagine MVP:

* Articoli / riflessioni  
* Musica / ascolti / ispirazioni  
* Letteratura esoterica  
* Eventi culturali / progetti speciali

Micro-task:

* predisporre struttura editoriale modulare  
* definire formati ripetibili  
* distinguere contenuti da eventi  
* mantenere tono contemplativo e ordinato

## **Fase 6 — Contatti e conversione gentile**

### **6.1 Creare i punti di contatto**

Output:

* flusso contatto semplice e credibile

Micro-task:

* definire un form minimo  
* definire campi essenziali  
* definire messaggio di conferma gentile  
* definire eventuale email di notifica interna  
* proteggere il form da spam

### **6.2 Curare la conversione**

Regola:

* prima comprensione  
* poi fiducia  
* poi azione

Micro-task:

* verificare che ogni CTA abbia contesto  
* ridurre duplicazioni inutili  
* evitare linguaggio pressante  
* rendere le azioni sempre leggibili

## **Fase 7 — Content management leggero**

### **7.1 Rendere i contenuti editabili**

Output:

* struttura pronta per sostituire placeholder senza redesign

Micro-task:

* separare contenuti da layout  
* definire campi per titoli, intro, CTA, hero, eventi  
* definire schema coerente per le 3 Vie  
* prevedere espansione futura di articoli ed eventi

### **7.2 Preparare la crescita**

Output:

* base solida per V1

Micro-task:

* strutturare moduli riusabili  
* evitare hardcode dispersivo  
* definire convenzioni nomi e sezioni  
* documentare pattern ripetibili

## **Fase 8 — Accessibilità, qualità e rifinitura**

### **8.1 Accessibilità**

Checklist:

* navigazione keyboard completa  
* focus states visibili  
* landmark semantici corretti  
* contrasto AA  
* supporto reduce-motion  
* etichette pulsanti chiare

### **8.2 Performance**

Checklist:

* homepage leggera  
* immagini ottimizzate  
* animazioni non bloccanti  
* caricamento rapido delle mini-home  
* nessun effetto superfluo all’arrivo

### **8.3 Coerenza emotiva**

Checklist:

* una sola logica visiva globale  
* tre tonalità di Via, non tre brand diversi  
* CTA presenti ma non invadenti  
* atmosfera stabile dal primo all’ultimo step

## **Timeline con checkpoint**

## **Settimana 1 — Fondamenta**

Checkpoint:

* perimetro MVP confermato  
* architettura pagine approvata  
* contenuti placeholder base pronti  
* design tokens base definiti

Deliverable:

* mappa del sito  
* schema CTA  
* mini style foundation

## **Settimana 2 — Sistema e homepage**

Checkpoint:

* componenti base pronti  
* homepage soglia completa  
* 3 porte funzionanti  
* primo test visivo desktop/mobile

Deliverable:

* threshold homepage navigabile  
* primi componenti riusabili

## **Settimana 3 — Spirale e mini-home**

Checkpoint:

* transizione rituale integrata  
* 3 mini-home complete  
* ritorno al tempio funzionante  
* tone check su ogni Via

Deliverable:

* primo flusso end-to-end completo

## **Settimana 4 — Pagine interne MVP**

Checkpoint:

* pagine chiave delle 3 Vie pronte  
* CTA e contatti collegati  
* contenuti placeholder coerenti  
* revisione di chiarezza e tono

Deliverable:

* MVP quasi completo

## **Settimana 5 — QA e rifinitura**

Checkpoint:

* accessibilità verificata  
* performance controllata  
* motion rifinito  
* microcopy rifinito  
* revisione finale con test utenti rapidi

Deliverable:

* MVP pronto al rilascio

## **Timeline alternativa ultra-lean**

Se serve una prima release più rapida:

### **Sprint A**

* homepage soglia  
* 3 porte  
* spirale  
* 3 mini-home

### **Sprint B**

* una pagina interna per Via  
* contatti base  
* ritorno al tempio  
* rifinitura accessibilità

### **Sprint C**

* eventi  
* contenuti editoriali  
* booking leggero  
* ottimizzazione narrativa

## **Team roles**

## **Setup minimo**

### **Product / Creative Lead**

Responsabilità:

* protegge la visione del tempio  
* approva tono, priorità e chiarezza  
* decide cosa entra nell’MVP

### **UX / Content Strategist**

Responsabilità:

* scrive architettura e microcopy  
* verifica comprensione delle CTA  
* controlla che l’atmosfera non oscuri il senso

### **UI / Visual Designer**

Responsabilità:

* costruisce il sistema visivo  
* definisce porte, hero, palette, typography  
* regola il bilanciamento tra monumentalità e leggibilità

### **Frontend Builder**

Responsabilità:

* realizza layout, componenti, routing, motion  
* garantisce coerenza, modularità e performance  
* implementa accessibilità e responsive behavior

### **Content Editor**

Responsabilità:

* sostituisce i placeholder  
* organizza eventi, riflessioni, offerte  
* mantiene la voce coerente con Jessica

## **Setup essenziale a una persona**

Se il progetto viene sviluppato da una sola persona:

* cappello 1: visione e priorità  
* cappello 2: design system e UX  
* cappello 3: build e QA

Regola pratica:

* non lavorare a copy, motion e nuove pagine nello stesso blocco  
* chiudere prima una scena completa, poi passare alla successiva

## **Recommended rituals**

### **Rituale settimanale di allineamento**

Durata: 30 minuti

Agenda:

* cosa è stato completato  
* cosa confonde ancora  
* cosa va tolto, non aggiunto  
* quale singolo passaggio utente va semplificato

### **Test di usabilità bisettimanale**

Durata: 30 minuti  
Partecipanti: 3 utenti reali o simili al target

Task da testare:

* “Scegli la Via che senti più tua”  
* “Capisci cosa offre Jessica in questa sezione”  
* “Trova come chiedere informazioni o prenotare”

Osservare:

* dove esitano  
* dove non capiscono  
* dove il rituale rallenta troppo

### **Revisione mensile del sistema**

Obiettivo:

* eliminare incoerenze  
* consolidare pattern  
* decidere cosa standardizzare  
* aggiornare componenti riusabili

## **Definition of done per blocco**

Un blocco si considera finito solo se:

* è chiaro al primo sguardo  
* è coerente con il tono del tempio  
* funziona bene da tastiera  
* mantiene contrasto corretto  
* non aggiunge rumore visivo  
* ha CTA comprensibili  
* può accogliere copy reale senza rifare il layout

## **Rischi operativi e contromisure**

### **Rischio: scope troppo ampio**

Contromisura:

* chiudere prima il tempio e le mini-home  
* rimandare booking avanzato e archivi complessi

### **Rischio: dipendenza da copy finale**

Contromisura:

* usare placeholder eleganti e strutturali  
* progettare layout resilienti a testi futuri

### **Rischio: incoerenza tra le 3 Vie**

Contromisura:

* usare un template condiviso  
* differenziare solo tono, luce e contenuto

### **Rischio: motion troppo pesante**

Contromisura:

* limitare le animazioni speciali alla soglia e alla spirale  
* rendere il resto sobrio e veloce

## **Optional integrations**

Da valutare in V1 o V2:

* calendario eventi  
* form avanzati con automazioni email  
* newsletter editoriale  
* raccolta media audio o playlist  
* CMS più strutturato per articoli e archivi  
* analytics privacy-friendly  
* tool per prenotazioni

## **Stretch goals**

* esperienza sonora opzionale e discreta  
* quiz rituale per orientare verso una Via  
* assistant poetico per orientamento soft  
* pagine stagionali o cicliche  
* raccolte editoriali curate per tema

## **Criteri di successo del build**

Il piano funziona se, al rilascio:

* la homepage comunica subito il tempio  
* le tre Vie sono chiare e desiderabili  
* la spirale arricchisce, non complica  
* ogni mini-home spiega bene l’offerta  
* l’utente trova facilmente il prossimo passo  
* il sistema è pronto a crescere senza perdersi

