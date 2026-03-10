# **design-guidelines.md**

## **Emotional Tone**

**Feels like an ancient stone sanctuary at twilight — sacred, editorial, feminine, and quietly powerful; every interaction should feel like a calm threshold, never a busy interface.**

Questa direzione segue quattro regole madri:

* **Emotion first**  
  * prima si progetta la sensazione  
  * poi si progetta la schermata  
* **Scenes, not screens**  
  * ogni passaggio deve sembrare una scena rituale  
  * arrivo, scelta, attraversamento, comprensione, azione  
* **Kindness in Design**  
  * il prodotto deve far sentire l’utente accolto, non testato  
  * tono, errori, stati vuoti e motion devono rispettare il suo ritmo  
* **Visual anchors**  
  * base strutturale chiara come **shadcn/ui**  
  * precisione e compostezza come **Linear**  
  * grazia e attenzione emotiva come **Apple Human Interface**

## **Emotional Thesis**

Il prodotto non deve sembrare un “sito spirituale”.  
Deve sembrare **un luogo sacro-editoriale abitato da silenzio, pietra, luce e intenzione**.

L’utente deve percepire:

* soglia  
* scelta  
* passaggio  
* orientamento  
* invito all’azione senza pressione

## **Visual System**

### **Design personality**

Il sistema visivo deve unire:

* **sacro**  
* **editoriale**  
* **monumentale**  
* **misurato**  
* **intimo**  
* **contemporaneo, non fantasy**

### **Cosa evitare**

* UI da videogioco fantasy  
* simboli esoterici in eccesso  
* glow aggressivi  
* texture rumorose  
* sovraccarico ornamentale  
* CTA da landing commerciale

### **Regola visiva centrale**

**La porta, la luce e il testo devono sempre respirare.**  
Se un elemento “spinge” troppo, va ridotto.

## **Typography**

La tipografia deve sostenere due cose insieme:

* **cerimonialità nei titoli**  
* **leggibilità calma nei contenuti**

### **Typeface direction**

* **Display / H1**  
  * serif ad alto contrasto o serif editoriale raffinata  
  * sensazione: rito, autorevolezza, soglia  
* **H2–H4**  
  * serif elegante o transitional serif  
  * sensazione: guida, struttura, continuità  
* **Body**  
  * serif leggibile oppure soft sans umanista  
  * sensazione: fiducia, respiro, chiarezza  
* **Caption / label / navigation**  
  * sans sobria, ariosa, poco invadente  
  * sensazione: servizio silenzioso

### **Typographic hierarchy**

| Level | Size | Weight | Line-height | Use |
| ----- | ----- | ----- | ----- | ----- |
| H1 | 56px desktop / 40px mobile | 600 | 1.1 | invocation, hero page, titoli cerimoniali |
| H2 | 40px / 32px | 600 | 1.15 | titoli di Via, sezioni principali |
| H3 | 28px / 24px | 600 | 1.2 | sottosezioni, blocchi editoriali |
| H4 | 22px / 20px | 500 | 1.25 | card CTA, moduli, micro-sezioni |
| Body L | 20px / 18px | 400 | 1.6 | paragrafi introduttivi |
| Body | 18px / 16px | 400 | 1.6 | testo standard |
| Small | 15px / 15px | 400 | 1.5 | note, metadata |
| Caption / Label | 13px / 12px | 500 | 1.4 | label porte, tag, utility |

### **Typographic rules**

* lunghezza riga ideale body: **55–75 caratteri**  
* allineamento:  
  * centrato nella homepage-soglia  
  * a bandiera sinistra nelle mini-home e nei contenuti  
* tracking:  
  * leggermente aperto su label e piccoli titoli  
  * normale sul body  
* mai usare tutto maiuscolo per testi lunghi  
* titoli solenni, ma mai teatrali

### **Tone by path**

* **Arcani**  
  * più contrasto e gravitas  
  * titoli più profondi, ritmo più raccolto  
* **Respiro**  
  * più aria, più luce, più spazio bianco percepito  
  * testo visivamente più leggero  
* **Ispirazione**  
  * più sapore editoriale  
  * relazione forte tra titoli, excerpt e contenuto culturale

## **Color System**

Palette dark-first, costruita per un’esperienza serale, lunare e contemplativa.

### **Core palette**

| Token | Hex | RGB | Mood | Primary use |
| ----- | ----- | ----- | ----- | ----- |
| Obsidian Plum | `#0D0A12` | `13, 10, 18` | sacro, notturno | background principale |
| Temple Night | `#17111F` | `23, 17, 31` | profondità | pannelli, overlay |
| Sacred Violet | `#4B2E83` | `75, 46, 131` | mistero, interiorità | accento primario |
| Mist Lilac | `#B8A7D9` | `184, 167, 217` | aria, intuizione | evidenze morbide |
| Antique Gold | `#C9A86A` | `201, 168, 106` | luce antica | CTA nobili, highlight |
| Stone Gray | `#7E778B` | `126, 119, 139` | pietra, stabilità | bordi, testi secondari |
| Lunar Ivory | `#F3EDE4` | `243, 237, 228` | chiarezza, rito | testo principale su dark |
| Parchment Glow | `#E7D8BE` | `231, 216, 190` | calore editoriale | ispirazione, accenti caldi |

### **Semantic palette**

| Token | Hex | RGB | Use |
| ----- | ----- | ----- | ----- |
| Success | `#93C6A0` | `147, 198, 160` | stati positivi, conferme |
| Warning | `#D4B06A` | `212, 176, 106` | avvisi morbidi |
| Error | `#E59A9A` | `229, 154, 154` | errori gentili |
| Info | `#7DB8D6` | `125, 184, 214` | messaggi informativi |

### **Path-specific accents**

* **La Via degli Arcani**  
  * base: Sacred Violet  
  * shadow tone: Temple Night  
  * light accent: Lunar Ivory  
  * feeling: profondità, intimità, oracolarità  
* **La Via del Respiro**  
  * base: Mist Lilac  
  * air tone: Lunar Ivory  
  * secondary shadow: Stone Gray  
  * feeling: respiro, spazio, calma luminosa  
* **La Via dell’Ispirazione**  
  * base: Parchment Glow  
  * accent: Antique Gold  
  * deep grounding: Temple Night  
  * feeling: archivio vivo, cultura, contemplazione

### **Light mode companion**

Il prodotto è **dark-first**.  
Se in futuro servirà una modalità chiara per aree editoriali:

* background: `#F5F0E8`  
* testo principale: `#241B2E`  
* accento violet: `#4B2E83`  
* neutral text: `#6A5F74`

### **Color rules**

* contrasto minimo testo/body: **WCAG AA, 4.5:1**  
* contrasto dei titoli: puntare oltre **7:1** nei blocchi chiave  
* il gold non va usato per testo lungo  
* il violet non deve diventare “brand urlato”  
* ogni Via si distingue per sfumatura e luce, non per cambiare sistema

## **Spacing & Layout**

### **Grid system**

Usare un sistema a **8pt**.

Scala consigliata:

* 4  
* 8  
* 16  
* 24  
* 32  
* 48  
* 64  
* 96  
* 128

### **Layout rhythm**

Il ritmo verticale deve sostenere l’idea di tempio:

* homepage: più vuoto, più monumentalità  
* mini-home: più struttura, senza perdere sacralità  
* pagine interne: chiarezza editoriale, non densità

### **Max widths**

* hero content: **720px**  
* contenuti standard: **760–840px**  
* layout con CTA cards: **1120–1280px**  
* full-screen threshold: usa tutta la scena, ma con centro visivo stabile

### **Padding rules**

* sezione standard mobile: **24px**  
* sezione standard desktop: **48–64px**  
* card padding: **24px** mobile, **32px** desktop  
* hero top spacing: ampio; mai compresso

### **Responsive breakpoints**

* **Mobile**: 360–767px  
* **Tablet**: 768–1023px  
* **Desktop**: 1024–1439px  
* **Wide**: 1440px+

### **Responsive behavior**

* mobile first  
* la soglia deve restare leggibile anche se le porte diventano stack o quasi-stack  
* su schermi stretti:  
  * invocation sempre visibile  
  * porte ancora protagoniste  
  * sottotitoli più brevi  
* le mini-home possono passare da layout a colonne a layout verticale  
* evitare densità di contenuto oltre 3 blocchi primari sopra la piega

## **Threshold Homepage Art Direction**

Questa è la scena più importante del prodotto.

### **Composition rules**

* tre porte **frontali**  
* stessa dignità visiva  
* stessa scala narrativa  
* differenze sottili solo in aura, luce e sottotitolo

### **Required elements**

* invocation in alto al centro  
* tre porte al centro della composizione  
* titolo rituale per ogni porta  
* sottotitolo chiaro sotto ciascuna  
* atmosfera scura, calma, ferma

### **Visual language**

* pietra antica  
* luce radente  
* nebbia minima o pulviscolo discreto  
* ombra profonda ma leggibile  
* prospettiva composta, non drammatica

### **Avoid**

* portali colorati neon  
* simboli giganti sovrapposti  
* fumo eccessivo  
* texture sporche troppo “dark fantasy”  
* elementi UI che rubano il centro alle porte

## **Motion & Interaction**

La motion deve essere rituale, mai performativa.

### **Motion principles**

* guidare  
* rassicurare  
* dare continuità  
* segnalare stati senza agitare

### **Timing**

* hover, focus, press: **150–250ms**  
* transizioni standard UI: **200–300ms**  
* reveal morbidi di sezione: **240–320ms**  
* transizione soglia → spirale → Via: **700–1200ms**  
* motion più lunga solo per momenti veramente cinematografici

### **Easing**

* preferire curve morbide  
* entrate: ease-out delicato  
* uscite: ease-in breve  
* niente bounce giocoso  
* niente accelerazioni aggressive

### **Interaction tone**

* **hover**  
  * lieve risveglio di luce  
  * aumento minimo di contrasto  
  * mai pulse insistente  
* **focus**  
  * bordo visibile  
  * alone chiaro sobrio  
  * mai focus invisibile  
* **tap / click**  
  * risposta rapida  
  * micro-compressione o shift leggerissimo  
  * poi passaggio naturale alla scena successiva

### **Spiral transition**

La spirale è il cuore rituale del progetto.

Deve comunicare:

* attraversamento  
* inevitabilità calma  
* senso di entrata in una camera interiore

Non deve comunicare:

* effetto speciale  
* gioco  
* gimmick

### **Empty states and waiting states**

* messaggi brevi e pazienti  
* no spinner dominante se evitabile  
* preferire fade-in o skeleton sobri  
* il sistema deve sembrare in ascolto, non in crisi

### **Reduced motion**

Supporto obbligatorio.

* sostituire movimenti ampi con dissolvenze corte  
* ridurre parallax e drift  
* mantenere comunque gerarchia e continuità narrativa

## **Voice & Tone**

La voce deve sembrare **Jessica come guida**, non un brand che vende.

### **Tone keywords**

* sacra  
* calda  
* intelligente  
* femminile  
* quieta  
* invitante  
* mai insistente

### **Writing rules**

* frasi corte  
* lessico limpido  
* poesia controllata  
* simbolismo comprensibile  
* nessun gergo pseudo-esoterico decorativo

### **CTA tone**

CTA chiare, senza aggressività.

Preferire:

* **Scopri il metodo**  
* **Prenota un consulto**  
* **Esplora gli eventi**  
* **Comprendi la pratica**  
* **Leggi le riflessioni**  
* **Torna al Tempio**

Evitare:

* “Compra ora”  
* “Non perdere”  
* “Ultima occasione”  
* “Scopri il segreto”

### **Microcopy examples**

**Onboarding / soglia**

* “Ogni via si apre a chi è pronto ad ascoltare.”  
* “Scegli la soglia che ti chiama.”

**Success state**

* “La tua richiesta è stata accolta. Ti risponderemo con cura.”  
* “Il tuo messaggio ha trovato la sua via.”

**Error state**

* “Qualcosa non si è aperto come previsto. Riproviamo con calma.”  
* “Manca un dettaglio per completare il passaggio.”

## **System Consistency**

L’intero prodotto deve obbedire a una sola metafora:

* **un tempio**  
* **tre camere**  
* **una guida**  
* **un sistema visivo condiviso**

### **Consistency anchors**

* stessa grammatica tipografica  
* stessa qualità della luce  
* stessa gentilezza nelle interazioni  
* stesso trattamento dei CTA  
* stesso pattern di ritorno al centro: **Torna al Tempio**

### **Pattern library da rendere ricorrente**

* hero di Via  
* card CTA principali  
* sezione introduttiva breve  
* blocco contenuto editoriale  
* modulo contatto discreto  
* pattern di ritorno  
* stato vuoto gentile  
* separatori e superfici pietra/luna

## **Page-by-Page Emotional Translation**

### **Sacred Threshold Homepage**

Deve far sentire:

* soglia  
* mistero ordinato  
* chiarezza immediata della scelta

### **Mini-home Arcani**

Deve far sentire:

* fiducia  
* profondità  
* ascolto intimo

### **Mini-home Respiro**

Deve far sentire:

* presenza  
* sollievo  
* spazio nel corpo

### **Mini-home Ispirazione**

Deve far sentire:

* curiosità contemplativa  
* ricchezza culturale  
* nutrimento simbolico

### **Internal pages**

Devono far sentire:

* comprensione prima dell’azione  
* ordine  
* continuità  
* credibilità

## **Accessibility**

L’accessibilità deve essere parte della grazia del sistema, non un’aggiunta.

### **Semantic structure**

* un solo H1 per pagina  
* landmarks chiari:  
  * header  
  * main  
  * nav  
  * footer  
* ordine gerarchico coerente di H2–H4  
* liste usate quando migliorano scansione e comprensione

### **Keyboard navigation**

* tutte le porte devono essere raggiungibili da tastiera  
* ordine focus coerente con la composizione visiva  
* “Torna al Tempio” sempre accessibile  
* nessuna interazione dipendente solo da hover

### **Focus indicators**

* focus ring visibile e coerente col sistema  
* contrasto elevato  
* outline chiaro su sfondi scuri  
* niente rimozione del focus nativo senza sostituzione forte

### **ARIA and labeling**

* porte con label descrittive  
* pulsanti con testo chiaro  
* immagini decorative marcate come tali  
* elementi simbolici importanti con alt contestuale, non poetico-vago

### **Comfort rules**

* animazioni non invadenti  
* contenuti leggibili anche senza effetti  
* contrasto AA minimo ovunque  
* target touch comodi  
* nessun testo troppo piccolo su mobile

## **Emotional Audit Checklist**

Prima del rilascio, verificare ogni macro-decisione con queste domande.

* Questa interfaccia evoca davvero il sentimento giusto: calma, soglia, presenza?  
* Il visitatore sente di entrare in un luogo, non in una landing page?  
* Le tre Vie sono distinte senza sembrare tre brand diversi?  
* Motion e copy rinforzano il tono senza distrarre?  
* L’utente si sente sostenuto, non giudicato?  
* Le CTA invitano senza premere?  
* La homepage resta memorabile anche con contenuti minimi?  
* Ogni mini-home chiarisce bene cosa offre Jessica prima di chiedere un’azione?

## **Technical QA Checklist**

* scala tipografica coerente con il ritmo verticale  
* griglia 8pt rispettata  
* contrasti WCAG AA o superiori  
* stati hover, focus, pressed distinti  
* animazioni standard tra 150–300ms  
* cinematic motion usata solo nei momenti rituali  
* responsive solido su mobile, tablet, desktop  
* contenuti placeholder sostituibili senza rompere il layout  
* pattern condivisi riutilizzati nelle tre Vie  
* reduce-motion supportato in tutti i passaggi importanti

## **Adaptive System Memory**

Non risultano linee guida precedenti da cui mantenere continuità.  
Questa versione deve diventare il **baseline estetico ed emotivo** del progetto.

Riusi consigliati per iterazioni future:

* mantenere la palette dark rituale come fondazione  
* mantenere il contrasto “pietra \+ luce \+ serif”  
* mantenere la grammatica di motion gentile  
* espandere le Vie senza cambiare la metafora centrale del tempio

## **Design Snapshot**

### **Emotional thesis**

**Un santuario di pietra al crepuscolo dove ogni scelta sembra un attraversamento interiore, non una normale navigazione web.**

### **Color palette preview**

```
Obsidian Plum   #0D0A12
Temple Night    #17111F
Sacred Violet   #4B2E83
Mist Lilac      #B8A7D9
Antique Gold    #C9A86A
Stone Gray      #7E778B
Lunar Ivory     #F3EDE4
Parchment Glow  #E7D8BE
Success         #93C6A0
Warning         #D4B06A
Error           #E59A9A
Info            #7DB8D6
```

### **Typographic scale summary**

| Style | Mobile | Desktop | Weight |
| ----- | ----- | ----- | ----- |
| H1 | 40px | 56px | 600 |
| H2 | 32px | 40px | 600 |
| H3 | 24px | 28px | 600 |
| H4 | 20px | 22px | 500 |
| Body L | 18px | 20px | 400 |
| Body | 16px | 18px | 400 |
| Caption | 12px | 13px | 500 |

### **Spacing & layout summary**

* griglia base: **8pt**  
* section padding: **24px mobile / 48–64px desktop**  
* card padding: **24–32px**  
* hero width: **max 720px**  
* content width: **760–840px**  
* CTA grid width: **1120–1280px**  
* homepage: più vuoto, più centro  
* mini-home: più struttura, stesso respiro

## **Design Integrity Review**

La direzione emotiva e quella tecnica sono ben allineate: la palette sostiene la soglia, la tipografia dà autorevolezza senza pesantezza, e la motion resta rituale ma leggibile. Il sistema è sufficientemente distinto per le tre Vie, ma abbastanza unificato da far percepire un solo tempio.

**Miglioramento consigliato:** dedicare una rifinitura specifica alla composizione mobile della homepage, perché è il punto più delicato per mantenere insieme monumentalità, leggibilità e immediatezza della scelta.

