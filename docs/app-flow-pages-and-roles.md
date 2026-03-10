# **App-flow-pages-and-roles**

# **Obiettivo del documento**

Definire la struttura essenziale del portale **Il Tempio delle Tre Vie** in modo semplice, leggibile e pronto per la build.

Questo documento copre:

* mappa delle pagine top-level  
* scopo di ogni pagina  
* ruoli utente e livelli di accesso  
* journey principali, ciascuno in massimo 3 step

## **Site Map**

## **Livello 1 — Ingresso**

* **Homepage / Il Tempio**  
* **La Via degli Arcani**  
* **La Via del Respiro**  
* **La Via dell’Ispirazione**

## **Livello 1 — Pagine top-level interne alle Vie**

### **Via degli Arcani**

* **Il metodo di Jessica**  
* **Consulti / Percorsi**  
* **Eventi esoterici**  
* **Contatti / Prenotazione**

### **Via del Respiro**

* **Approccio e filosofia**  
* **Discipline e pratiche**  
* **Eventi / lezioni / incontri**  
* **Contatti / Prenotazione**

### **Via dell’Ispirazione**

* **Articoli / riflessioni**  
* **Musica / ascolti / ispirazioni**  
* **Letteratura esoterica**  
* **Eventi culturali / progetti speciali**

## **Livello 1 — Pagine trasversali opzionali**

Da includere solo se servono nel primo rilascio o subito dopo:

* **Chi è Jessica**  
* **Contatti generali**  
* **Privacy Policy**  
* **Cookie Policy**

## **Site Map sintetica**

```
Il Tempio
├── La Via degli Arcani
│   ├── Il metodo di Jessica
│   ├── Consulti / Percorsi
│   ├── Eventi esoterici
│   └── Contatti / Prenotazione
├── La Via del Respiro
│   ├── Approccio e filosofia
│   ├── Discipline e pratiche
│   ├── Eventi / lezioni / incontri
│   └── Contatti / Prenotazione
└── La Via dell’Ispirazione
    ├── Articoli / riflessioni
    ├── Musica / ascolti / ispirazioni
    ├── Letteratura esoterica
    └── Eventi culturali / progetti speciali
```

## **Purpose of Each Page**

## **Homepage / Il Tempio**

**Scopo:** accogliere l’utente nella soglia simbolica e aiutarlo a scegliere una delle tre Vie senza distrazioni.

## **La Via degli Arcani**

**Scopo:** introdurre il mondo dei tarocchi, del consulto e degli eventi esoterici con tono intimo, profondo e affidabile.

## **Il metodo di Jessica**

**Scopo:** spiegare l’approccio di Jessica alla lettura simbolica e alla guida spirituale prima di qualsiasi richiesta d’azione.

## **Consulti / Percorsi**

**Scopo:** chiarire cosa può prenotare l’utente, come si svolge l’esperienza e per chi è adatta.

## **Eventi esoterici**

**Scopo:** presentare incontri, cerchi o appuntamenti collettivi legati alla Via degli Arcani.

## **Contatti / Prenotazione — Arcani**

**Scopo:** offrire un passaggio semplice e rassicurante verso richiesta informazioni o prenotazione.

## **La Via del Respiro**

**Scopo:** introdurre il mondo delle pratiche corporee come spazio di presenza, benessere e ascolto incarnato.

## **Approccio e filosofia**

**Scopo:** spiegare la visione di Jessica su yoga, pranayama e pratiche del corpo, distinguendola dal fitness standard.

## **Discipline e pratiche**

**Scopo:** presentare in modo ordinato le attività disponibili e il loro significato.

## **Eventi / lezioni / incontri**

**Scopo:** mostrare appuntamenti, classi e percorsi legati alla Via del Respiro.

## **Contatti / Prenotazione — Respiro**

**Scopo:** permettere all’utente di chiedere informazioni o prenotare una pratica con chiarezza e calma.

## **La Via dell’Ispirazione**

**Scopo:** aprire uno spazio editoriale e culturale dedicato ad arte, musica e letteratura esoterica.

## **Articoli / riflessioni**

**Scopo:** raccogliere pensieri, testi e approfondimenti che esprimono la visione culturale e simbolica di Jessica.

## **Musica / ascolti / ispirazioni**

**Scopo:** offrire una raccolta curata di ascolti, riferimenti e suggestioni sonore.

## **Letteratura esoterica**

**Scopo:** presentare libri, testi, citazioni e percorsi di lettura in chiave contemplativa.

## **Eventi culturali / progetti speciali**

**Scopo:** dare visibilità a iniziative editoriali, artistiche o esperienze fuori dai formati standard.

## **Chi è Jessica**

**Scopo:** raccontare Jessica come guida unica del tempio e creare fiducia trasversale tra le tre Vie.

## **Contatti generali**

**Scopo:** fornire un punto di contatto neutro per chi non sa ancora quale Via scegliere.

## **Privacy Policy**

**Scopo:** spiegare in modo trasparente come vengono gestiti i dati dell’utente.

## **Cookie Policy**

**Scopo:** chiarire l’uso di cookie e strumenti tecnici in modo conforme e leggibile.

## **User Roles and Access Levels**

Per l’MVP, il sistema deve restare semplice.

## **1\. Visitatore**

**Descrizione:** utente anonimo che entra nel tempio e naviga liberamente.  
**Accesso:**

* può vedere homepage e tutte le Vie pubbliche  
* può leggere contenuti, eventi e pagine informative  
* può usare CTA di contatto o richiesta informazioni

## **2\. Utente che invia una richiesta**

**Descrizione:** visitatore che compila un form di contatto o prenotazione.  
**Accesso:**

* stesso accesso del visitatore  
* può inviare richieste  
* non ha bisogno di area privata nell’MVP

## **3\. Jessica / Admin editoriale**

**Descrizione:** figura che gestisce contenuti, offerte, eventi e richieste.  
**Accesso:**

* modifica contenuti delle tre Vie  
* aggiorna testi, CTA, eventi e contatti  
* gestisce eventuali richieste ricevute  
* controlla asset visuali e contenuti editoriali

## **4\. Collaboratore editoriale opzionale**

**Descrizione:** supporto interno per contenuti o aggiornamenti specifici.  
**Accesso:**

* modifica solo alcuni contenuti assegnati  
* non gestisce impostazioni globali  
* non accede a funzioni sensibili se non necessario

## **Access policy consigliata**

* **Pubblico by default**  
  * quasi tutta l’esperienza deve essere accessibile senza login  
* **Admin separato dal front-end**  
  * l’area di gestione non deve interferire con l’esperienza rituale pubblica  
* **Auth solo se serve**  
  * niente complessità account nel primo rilascio, salvo esigenze operative reali

## **Primary User Journeys**

Ogni journey deve restare breve, chiaro e senza pensiero superfluo.

## **Journey 1 — Scelta intuitiva della Via**

### **Obiettivo**

Aiutare il visitatore a riconoscere il proprio ingresso naturale.

### **Step**

1. **Arriva al Tempio**  
   * legge l’invocazione  
   * vede subito le tre porte  
2. **Sceglie una Via**  
   * clicca la porta che sente più affine  
3. **Entra nella mini-home**  
   * comprende subito il mondo scelto e le opzioni disponibili

## **Journey 2 — Prenotare o chiedere un consulto negli Arcani**

### **Obiettivo**

Portare l’utente da curiosità a richiesta concreta, senza tono commerciale.

### **Step**

1. **Entra nella Via degli Arcani**  
   * percepisce tono, offerta e fiducia  
2. **Legge il metodo o la pagina Consulti / Percorsi**  
   * capisce come lavora Jessica  
3. **Apre Contatti / Prenotazione**  
   * invia richiesta o prenota

## **Journey 3 — Scoprire una pratica nella Via del Respiro**

### **Obiettivo**

Far capire che la proposta è esperienza incarnata, non fitness generico.

### **Step**

1. **Entra nella Via del Respiro**  
   * incontra una mini-home calma e luminosa  
2. **Apre Approccio e filosofia o Discipline e pratiche**  
   * capisce il senso delle attività  
3. **Richiede informazioni o prenota**  
   * passa all’azione con fiducia

## **Journey 4 — Esplorare contenuti nella Via dell’Ispirazione**

### **Obiettivo**

Guidare l’utente verso un’esperienza editoriale, culturale e contemplativa.

### **Step**

1. **Entra nella Via dell’Ispirazione**  
   * comprende subito il tono della sezione  
2. **Sceglie un contenuto**  
   * apre articoli, ascolti o letteratura  
3. **Prosegue verso evento o approfondimento**  
   * continua l’esplorazione in modo naturale

## **Journey 5 — Tornare al centro**

### **Obiettivo**

Rafforzare l’idea di un tempio unico, non di tre siti scollegati.

### **Step**

1. **Esplora una Via**  
   * legge una mini-home o una pagina interna  
2. **Usa “Torna al Tempio”**  
   * ritorna al centro simbolico del sistema  
3. **Sceglie un’altra Via o conclude la visita**  
   * continua l’esperienza senza disorientamento

## **Journey 6 — Capire chi è Jessica prima di agire**

### **Obiettivo**

Dare fiducia a chi vuole orientarsi prima di scegliere una Via o una richiesta.

### **Step**

1. **Arriva al Tempio o a una Via**  
   * percepisce la presenza di una guida unica  
2. **Apre “Chi è Jessica” o una pagina metodo/filosofia**  
   * comprende identità, approccio e tono  
3. **Sceglie la Via o il contatto più adatto**  
   * agisce con maggiore chiarezza

## **Navigation Rules**

## **Regola 1 — La homepage non si trasforma in landing lunga**

La soglia deve restare:

* fissa  
* simbolica  
* immediata

## **Regola 2 — Le mini-home fanno da orientamento**

Ogni mini-home deve rispondere subito a tre domande:

* dove sono  
* cosa offre Jessica qui  
* qual è il prossimo passo

## **Regola 3 — “Torna al Tempio” è un pattern di sistema**

Deve comparire in modo coerente da ogni Via e da ogni pagina chiave.

## **Regola 4 — Pochi percorsi, leggibili**

Meglio:

* 2–3 CTA forti per pagina

Peggio:

* molte uscite concorrenti  
* menu densi  
* troppe priorità visive

## **Regola 5 — L’atmosfera non sostituisce la chiarezza**

Ogni pagina deve restare comprensibile anche con contenuti ancora placeholder.

## **Suggested Menu Logic**

## **Homepage**

Nessun menu tradizionale dominante in apertura, oppure menu minimale secondario.

Elementi ammessi:

* eventuale link discreto a Jessica  
* eventuale link discreto a contatti  
* nessun elemento che rubi centralità alle tre porte

## **Dentro ogni Via**

Menu semplice e secondario, con voci limitate:

* mini-home della Via  
* pagine chiave della Via  
* Torna al Tempio

## **Cross-linking rules**

Le tre Vie non devono essere iper-collegate tra loro in modo caotico.  
Il collegamento principale tra loro è:

* **ritorno al Tempio**  
* nuova scelta consapevole

## **Content Structure Rules**

## **Ogni mini-home deve includere**

* titolo forte  
* breve testo introduttivo  
* visual hero coerente  
* 2–3 CTA principali  
* ritorno al tempio

## **Ogni pagina interna deve includere**

* titolo chiaro  
* breve introduzione  
* contenuto centrale ordinato  
* CTA contestuale  
* uscita chiara verso ritorno o contatto

## **Ogni CTA deve portare a una sola intenzione**

Esempi:

* capire  
* esplorare  
* contattare  
* prenotare

Mai mischiare troppe intenzioni nello stesso blocco.

## **MVP Scope for Pages**

## **Da includere nel primo rilascio**

* Homepage / Il Tempio  
* Mini-home delle 3 Vie  
* 1–4 pagine chiave per ogni Via  
* Contatti / Prenotazione base  
* Privacy / Cookie

## **Da rimandare se necessario**

* booking avanzato  
* area personale  
* archivi editoriali complessi  
* filtri contenuto sofisticati  
* assistente AI  
* automazioni articolate

## **Success Criteria for Flow**

Il flow funziona se:

* l’utente capisce subito che esistono **tre Vie**  
* ogni Via chiarisce rapidamente l’offerta  
* il passaggio verso contatto o approfondimento è naturale  
* il ritorno al Tempio rafforza l’unità del progetto  
* il sito sembra un luogo coerente, non un insieme di sezioni scollegate