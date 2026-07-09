# Nachfolgebrief an das Sage-Protokoll

**Betreff:** Werbetechnik-Website-Vorlage (dieses Repo) — Bestandsaufnahme und die
offene Frage einer Einbindung in den Mycel-/Family-Verbund
**Von:** Bau-Sitzung (Werbetechnik-Vorlage / WorkFloh-Linie)
**An:** Sage-Protokoll
**Datum:** 2026-07-09
**Status:** Brainstorming-Vorlage — **keine weiteren Depots eingebunden.**

---

## §1 Worum es geht (kurz)

Aus einem UI-Klon ist eine **lauffähige, installierbare PWA** entstanden: eine
**firmenneutrale Werbetechnik-Website-Vorlage**. Sie nutzt **dasselbe
gestalterische und technische Erbgut wie Family Projekt** — deshalb ist die Frage
berechtigt, ob beide Welten zusammengehören. Dieser Brief klärt erst den
**Stand**, dann die **Sinnigkeit einer Einbindung**.

---

## §2 Bestandsaufnahme — was gebaut wurde

**Werbetechnik-Vorlage (Website-PWA)**
- Eine selbst-enthaltende `index.html` mit **6 Screens**: Start · Leistungen ·
  Info-/Gewerbesammelanlagen · FAQ · Über uns (Team) · Kontakt.
- **Designsystem 1:1 aus WorkFloh** (Topbar, Cards, Buttons, Sheets, Toasts,
  Tooltips, Splash, Install-Bar), drei Themes (Hell/Dunkel/Kontrast).
- **Effekte 1:1 aus Family Projekt**: Glas-Cabochon-Buttons (maus-folgender
  Glanz + 3D-Tilt) und der **three.js-Partikel-Hintergrund** (`mycel-bg.js`,
  rot eingefärbt).
- **Drag-&-Drop-Bild-System** (Downscale + localStorage) zum Selbst-Pflegen.
- **Firmenneutral**: alle Namen, Kontaktdaten und Bilder sind Platzhalter —
  die Vorlage ist ohne Bilder ausgeliefert (eigene CSS-Leucht-Art als Füllung).
- **PWA-Kern**: eigener `sw.js` (offline, Network-First fürs HTML) + Manifest,
  installierbar.

---

## §3 Ähnlichkeiten mit Family Projekt (der Anknüpfungspunkt)

| Ebene | Family Projekt | Werbetechnik-Vorlage |
|---|---|---|
| Architektur | statische Single-File-PWA | dieselbe |
| Optik/Effekte | Glas-Buttons, Holo, three.js-Mycel | **identische Quelle**, nur rot |
| Theme-System | 3 Themes | 3 Themes |
| Kern-Idee | **Hub**: Suche · Werkzeuge · Netzwerk · Markt | **Auftritt** einer Firma |

Kurz: technisch sind sie **Geschwister**. Konzeptionell (noch) nicht: Family ist
ein **Verteiler/Knoten**, die Vorlage ist die **Visitenkarte einer Firma**.

---

## §4 Die offene Frage — Einbindung: sinnvoll oder nicht?

**A — Eigenständige Firmen-Website (Status quo).** Die Vorlage bleibt für sich.
*Pro:* nichts zu klären. *Contra:* kein Netz-Nutzen.

**B — Als Knoten im Mycel-/Family-Verbund.** Die Seite wird als
**SBKIM-Mycel-Knoten** angebunden und in der Suche/im Marktplatz auffindbar.
*Pro:* genau dafür ist Familys Such-/Markt-Logik gedacht. *Contra:* lohnt erst
mit Reichweite; öffentliche Listung müsste gewollt sein.

**C — White-Label für andere Firmen.** Genau diese Code-Basis (Theme + Inhalte
tauschbar) ist eine **exzellente Vorlage** für weitere Werbetechnik-Firmen.
*Pro:* Wiederverwendung ist trivial (dieser Zustand ist bereits die neutrale
Variante). *Contra:* pro Firma müssen Inhalte gefüllt werden.

---

## §5 Sinnigkeit in Suche · Diensten · Shops

- **Suche:** Für **eine** Firma zweitrangig; Familys Suche wird erst sinnvoll,
  wenn die Firma **einer von vielen** Einträgen ist (Szenario B).
- **Dienste:** Die „Leistungen" sind bereits als **Daten-Objekte**
  (`SERVICES`-Liste) modelliert — genau das Format für ein Verzeichnis.
- **Shops:** Werbetechnik ist **anfrage-/projektbasiert**, kein Warenkorb-Shop.
  Sinnvoll ist die **Anfrage** (mailto / später Formular-Backend).

**Fazit:** Eine Einbindung ist **dann** sinnig, wenn (1) das Netz echte Nutzer
bekommt und (2) eine öffentliche Listung gewollt ist. Beides ist heute **offen** —
die Tür ist dank gemeinsamer Architektur jederzeit billig zu öffnen.

---

## §6 Empfehlung

1. **Jetzt:** die Vorlage als **eigenständige** neutrale Basis halten (A).
2. **Vorbereiten (ohne Einbinden):** die `SERVICES`-Daten so lassen, dass sie
   später als Verzeichnis-Einträge taugen (ist bereits so).
3. **Entscheiden, sobald klar:** öffentliche Listung gewollt? → Szenario B.
4. **Shop-Gedanke verwerfen** zugunsten **Anfrage/Angebot**.

---

## §7 Was bewusst NICHT getan wurde

- **Keine anderen Depots eingebunden**, kein Mycel-Knoten verdrahtet, keine
  Family-Marktplatz-Anbindung — noch im Brainstorming.

---

*Gegengezeichnet im Geist des Sage-Protokolls: ehrlich markiert, was offen ist;
nichts stillschweigend verdrahtet.*
