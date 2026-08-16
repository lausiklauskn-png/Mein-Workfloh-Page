# Werbetechnik-Website-Vorlage

**Muster Werbetechnik** — neutrale Vorlage für eine Werbetechnik-Firmen-Website
als installierbare **PWA** (eigene `index.html` + `sw.js` + Manifest,
offline-fähig, auf Desktop/Tablet installierbar).

Es handelt sich um eine **firmenneutrale Gestaltungs-Vorlage**: Alle Texte,
Kontaktdaten und Namen sind Platzhalter (`Muster Werbetechnik`, `[Straße Nr.]`,
`[PLZ Ort]`, `[Telefon]`, `info@example.de`) und werden vor einer echten
Nutzung ersetzt.

## Inhalt / Aufbau
- **Eine `index.html`** (selbst-enthaltend) mit 6 Screens: Start · Leistungen ·
  Info-/Gewerbesammelanlagen · FAQ · Über uns (Team) · Kontakt/Anfahrt.
- **`effects.js`** — Glaskugel-/Holo-Effekte + Drag-&-Drop-Bild-System.
- **`assets/mycel-bg.js`** + **`vendor/three.module.min.js`** — animierter
  three.js-Partikel-Hintergrund (rot eingefärbt).
- **`sw.js`** + **`manifest.webmanifest`** — Offline & Installierbarkeit.
- **App-Icons** (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`).

## Bilder einsetzen
Die Vorlage wird **ohne Bilder** ausgeliefert (fehlende Fotos werden durch
eigene CSS-Art bzw. neutrale Platzhalter ersetzt). Eigene Bilder lassen sich in
der laufenden App **per Drag & Drop** auf jede Bildfläche ziehen (oder über das
📷-Symbol) — sie werden lokal gespeichert.

## Themes
Hell · Dunkel · **Kontrast** (Schwarz/Rot/Weiß). Umschaltbar über das
🎨-Symbol oben rechts.

## Lokaler Sichttest
```
python3 -m http.server 8000   # dann http://localhost:8000
```

Stand / Entscheidungen: siehe `docs/PULS.md`.

---

## Rechte

Rechteinhaber ist Klaus Nitzsche. Welche Lizenz gilt und welche Rolle die
KI-Werkzeuge hatten, steht in [`RECHTE.md`](RECHTE.md); der Lizenztext in
[`LICENSE`](LICENSE).
