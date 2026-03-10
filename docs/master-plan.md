# **Master-plan**

# **30-second elevator pitch**

**Il Tempio delle Tre Vie** è un portale web editoriale e immersivo che accoglie il visitatore come in un luogo sacro, non come in un sito tradizionale.  
L’esperienza inizia con una soglia simbolica: tre porte monumentali introducono tre percorsi interiori — **Arcani**, **Respiro**, **Ispirazione** — unificati dalla guida di Jessica Marin.  
Ogni percorso apre una mini-esperienza chiara, contemplativa e orientata all’azione gentile: comprendere l’offerta, sentire la risonanza, scegliere il passo successivo.

## **Problema e missione**

### **Problema**

Oggi i siti per professionisti del benessere e della spiritualità cadono spesso in uno di questi estremi:

* troppo commerciali  
* troppo generici  
* troppo “fantasy”  
* troppo confusi nella navigazione

Il risultato è semplice: l’utente non percepisce la profondità della proposta, non capisce subito cosa viene offerto, e non entra davvero nel mondo simbolico della guida.

### **Missione**

Creare un tempio digitale che:

* faccia sentire il visitatore **accolto in una soglia**  
* presenti Jessica come **guida unica di tre mondi coerenti**  
* trasformi la navigazione in un **rito di passaggio chiaro e gentile**  
* renda facile capire l’offerta prima di chiedere un’azione

## **Target audience**

### **Pubblico primario**

* Persone interessate a **tarocchi, simbolismo, consulti spirituali, eventi esoterici**  
* Persone in cerca di **yoga, pranayama, pratiche corporee, benessere olistico**  
* Persone attratte da **arte esoterica, musica simbolica, letteratura contemplativa**

### **Pubblico secondario**

* Persone curiose, sensibili all’estetica e alla ritualità  
* Utenti che cercano una guida autorevole ma non dogmatica  
* Visitatori che desiderano un’esperienza culturale e spirituale più raffinata del solito sito-vetrina

### **Bisogni chiave**

* capire subito **chi è Jessica** e cosa propone  
* riconoscere la Via più affine  
* vivere un’esperienza coerente, calma e significativa  
* poter compiere il passo successivo senza pressione

## **Core features**

### **1\. Sacred Threshold Homepage**

La homepage non è una pagina informativa lunga.  
È una **scena fissa a schermo pieno**.

Include:

* invocazione poetica centrale  
* tre porte di pietra frontali  
* titolo rituale per ogni Via  
* sottotitolo chiaro sotto ogni titolo  
* atmosfera monumentale, scura, sospesa

### **2\. Ritual Transition**

Il click su una porta attiva una **spirale rituale** già prevista nel concept.

Obiettivo:

* sostituire il classico “entra” con un passaggio simbolico  
* dare continuità emotiva tra soglia e Via  
* mantenere una transizione calma, cinematica, inevitabile

### **3\. Mini-home dedicate per ogni Via**

Ogni Via si apre su una mini-home introduttiva.

Funzione:

* spiegare cosa offre Jessica in quel mondo  
* stabilire il tono emotivo del percorso  
* offrire 2–3 CTA chiare  
* mantenere sempre visibile il ritorno al tempio

### **4\. Via degli Arcani**

Focus:

* metodo di Jessica  
* consulti e percorsi  
* eventi esoterici  
* contatti o prenotazione

CTA principali:

* Scopri l’approccio  
* Prenota un consulto  
* Esplora gli eventi

### **5\. Via del Respiro**

Focus:

* approccio e filosofia  
* discipline e pratiche  
* lezioni, incontri, eventi  
* contatti o richiesta informazioni

CTA principali:

* Comprendi la pratica  
* Scopri le attività  
* Prenota o richiedi informazioni

### **6\. Via dell’Ispirazione**

Focus:

* articoli e riflessioni  
* musica e ascolti  
* letteratura esoterica  
* eventi culturali o progetti speciali

CTA principali:

* Esplora le ispirazioni  
* Leggi le riflessioni  
* Scopri contenuti ed eventi

### **7\. Return Pattern**

Da ogni Via, l’utente deve poter tornare con eleganza al centro simbolico.

Elemento fisso:

* **Torna al Tempio**

Questo pattern rafforza l’idea di:

* un solo universo  
* tre camere interiori  
* una navigazione poetica ma semplice

## **High-level tech stack**

### **Frontend**

* **Vite**  
  * build veloce  
  * ottimo per un progetto editoriale leggero e modulare  
* **React**  
  * ideale per costruire scene, stati di transizione e percorsi distinti  
* **TypeScript**  
  * mantiene il sistema ordinato mentre le tre Vie crescono in autonomia  
* **Tailwind CSS**  
  * perfetto per costruire rapidamente un design system coerente, rituale e riusabile  
* **shadcn/ui**  
  * ottima base per componenti accessibili, raffinabili in chiave editoriale-sacra

### **Backend & storage**

* **Lovable Cloud**  
  * sufficiente per contenuti, struttura modulare e futura espansione operativa

### **Auth**

* **Nessuna auth nell’MVP**, salvo necessità reali  
* eventuale introduzione futura di:  
  * email/password  
  * Google OAuth

### **Perché questa stack è adatta**

Questa architettura sostiene bene un prodotto che deve essere:

* **visivamente forte**  
* **modulare**  
* **facile da evolvere**  
* **chiaro nella manutenzione**  
* **coerente tra esperienza immersiva e pagine informative**

## **Conceptual data model**

Schema concettuale in parole:

### **Entità principali**

* **Temple**  
  * identità globale del progetto  
  * testi soglia  
  * atmosfera condivisa  
  * asset comuni  
* **Path**  
  * una delle tre Vie  
  * titolo  
  * sottotitolo  
  * tono  
  * hero  
  * CTA principali  
* **Page / Section**  
  * mini-home  
  * metodo / filosofia  
  * servizi / pratiche  
  * eventi  
  * contatti  
  * contenuti editoriali  
* **Offer**  
  * consulto  
  * percorso  
  * lezione  
  * incontro  
  * esperienza culturale  
* **Event**  
  * titolo  
  * data  
  * descrizione  
  * Via di appartenenza  
  * CTA collegata  
* **Editorial Content**  
  * articolo  
  * riflessione  
  * raccolta musicale  
  * selezione letteraria  
* **Contact / Inquiry**  
  * richiesta informazioni  
  * prenotazione  
  * contatto generico

### **Relazioni**

* Un **Tempio** contiene molte **Vie**  
* Ogni **Via** contiene più **Pagine/Sezioni**  
* Ogni **Via** può avere più **Offer**  
* Ogni **Via** può avere più **Event**  
* La **Via dell’Ispirazione** può avere molti **Editorial Content**  
* Tutte le CTA possono generare un **Contact / Inquiry**

## **UI design principles**

Il progetto deve seguire una logica semplice: **prima il senso, poi l’azione**.

### **Principi guida**

* **Una soglia, non una homepage tradizionale**  
  * niente scroll dispersivo all’ingresso  
  * la scelta iniziale deve essere immediata e simbolica  
* **Atmosfera prima, chiarezza subito dopo**  
  * il tempio deve emozionare  
  * le mini-home devono chiarire senza spezzare l’incanto  
* **Tre mondi distinti, un unico linguaggio**  
  * ogni Via ha un tono proprio  
  * tipografia, colore, spacing e motion restano figli dello stesso tempio  
* **CTA sobrie**  
  * mai aggressive  
  * sempre visibili  
  * sempre comprensibili  
* **Navigazione secondaria**  
  * la struttura deve sostenere l’atmosfera, non dominarla  
* **Gentilezza nelle interazioni**  
  * motion morbido  
  * stati vuoti pazienti  
  * errori non severi  
  * ritmo contemplativo

Questi principi riflettono una progettazione “emotion-first”, orientata a scene, ritualità, comportamento e gentilezza dell’interfaccia.

## **Security & compliance notes**

Per l’MVP, il profilo di rischio è moderato, ma va trattato con serietà.

### **Dati da proteggere**

* richieste di contatto  
* eventuali dati di prenotazione  
* eventuali note personali inviate dagli utenti

### **Linee guida**

* raccogliere solo i dati necessari  
* informativa privacy chiara  
* consenso esplicito per eventuali comunicazioni future  
* protezione dei form da spam e abuso  
* gestione sicura di eventuali integrazioni esterne

### **Compliance essenziale**

* conformità GDPR di base  
* cookie e tracciamenti ridotti al minimo  
* accesso amministrativo protetto  
* contenuti facilmente modificabili senza interventi rischiosi in produzione

## **Phased roadmap**

### **MVP**

Obiettivo: rendere vivo il tempio e far capire l’offerta.

Include:

* homepage-soglia full screen  
* tre porte rituali  
* transizione a spirale  
* mini-home per Arcani, Respiro, Ispirazione  
* CTA principali  
* pattern “Torna al Tempio”  
* design system base  
* placeholder content editabile

### **V1**

Obiettivo: trasformare l’esperienza in un portale utile ogni giorno.

Include:

* pagine interne complete per ogni Via  
* struttura eventi  
* form contatto/prenotazione  
* CMS leggero o gestione contenuti modulare  
* migliore articolazione di testi, immagini e hero editoriali

### **V2**

Obiettivo: espandere profondità, continuità e relazione.

Include:

* booking più strutturato  
* archivio editoriale vivo  
* media galleries  
* percorsi o raccolte tematiche  
* eventuale guida AI gentile per orientare l’utente verso la Via più affine

## **Risks & mitigations**

### **Rischio 1: troppa atmosfera, poca chiarezza**

**Pericolo:** il sito affascina ma non spiega.  
**Mitigazione:** ogni mini-home deve chiarire subito cosa offre Jessica e cosa fare dopo.

### **Rischio 2: estetica troppo fantasy o stereotipata**

**Pericolo:** l’esperienza perde credibilità.  
**Mitigazione:** usare un registro visivo sacro-editoriale, non ludico; pietra, luce, silenzio, non decorazione eccessiva.

### **Rischio 3: le tre Vie sembrano tre siti scollegati**

**Pericolo:** si perde l’unità del brand.  
**Mitigazione:** mantenere un sistema condiviso di tipografia, motion, pattern e ritorno al tempio.

### **Rischio 4: motion troppo invasivo**

**Pericolo:** la ritualità diventa attrazione fine a sé stessa.  
**Mitigazione:** animazioni lente, leggibili, disattivabili con reduce-motion, sempre al servizio della comprensione.

### **Rischio 5: crescita disordinata dei contenuti**

**Pericolo:** il progetto si complica e perde eleganza.  
**Mitigazione:** modello contenuti modulare, blocchi riusabili, gerarchia chiara tra pagine, offerte, eventi e contenuti editoriali.

## **Future expansion ideas**

* quiz rituale leggero per orientare verso la Via più affine  
* calendario eventi integrato  
* area editoriale con collezioni tematiche  
* raccolte audio o musicali curate  
* archivio di riflessioni e testi simbolici  
* percorsi guidati stagionali  
* newsletter editoriale-sacra  
* assistant opzionale con tono calmo e rituale, mai invasivo

## **Success criteria**

Il progetto sarà riuscito se:

* la homepage viene percepita come una **soglia memorabile**  
* ogni Via è subito **comprensibile**  
* Jessica emerge come **guida unica e credibile**  
* l’utente sente atmosfera e chiarezza insieme  
* le CTA portano all’azione senza rompere l’incanto

## **Final note**

**Il Tempio delle Tre Vie** non deve sembrare un contenitore di servizi.  
Deve sembrare un luogo.  
Un luogo digitale in cui simbolo, presenza e chiarezza convivono, e in cui ogni scelta dell’utente assomiglia più a un attraversamento che a un click.

