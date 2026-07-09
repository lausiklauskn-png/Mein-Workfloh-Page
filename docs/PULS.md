# Werbetechnik-Vorlage — PULS

## 2026-07-09 — Entmarkung zur neutralen Vorlage (autonom, Freibrief)

**Auftrag (Betreiber):** Das Repo war ein UI-Klon mit echten Firmendaten. Es
soll in eine **firmenneutrale Werbetechnik-Website-Vorlage** umgewandelt werden:
Design/Struktur bleiben, aber **jeder Firmen-/Personenbezug und alle Bilder raus**.

### Gemacht
- **Alle Firmen-/Personendaten entfernt/ersetzt** durch neutrale Platzhalter:
  Firmenname → „Muster Werbetechnik" (Kurzform „Werbetechnik", 3D-Logo „WT"),
  Adresse → `[Straße Nr.]` / `[PLZ Ort]`, Telefon → `[Telefon]`, E-Mail →
  `info@example.de`, Domain → `example.de`.
- **Team-Sektion** auf 3 generische Platzhalter reduziert („Vorname Nachname",
  Rollen Werbetechnik/Montage/Grafik) — echte Namen + Team-Fotos entfernt.
- **Referenzen** neutralisiert (generische Projekt-Titel, keine echten
  Kunden-/Ortsnamen).
- **Instagram-Block + Google-Maps-Einbettungen entfernt** (Adresse/Handle raus),
  Karte durch Platzhaltertext „[Karte/Anfahrt]" ersetzt.
- **ALLE Bilddateien entfernt** (`img/*.jpg`, `assets/*.webp`, archivierte
  PNGs) bis auf die drei App-Icons; alle Bildreferenzen im Code entfernt bzw.
  auf Platzhalter/Drag-&-Drop-Slots umgestellt. Die Seite lädt ohne 404.
- **Archiviertes Instagram-Handy** (rein bild-/Instagram-getrieben) komplett
  entfernt.
- **Technische Bezeichner** entmarkt: localStorage-Keys auf `tpl-theme` /
  `tpl-install-x`, Bild-Präfix auf `tpl-img-`, Global auf `TplImg`, SW-Cache auf
  `werbetechnik-page-v1` umgestellt.
- **Doku** (README, img/README, PULS, Sage-Brief) neutralisiert.

### Bewusst NICHT geändert
- **App-Icons** (`icon-*.png`) bleiben als Datei bestehen — die Bild-Bytes
  ersetzt die Hauptsitzung separat.
- `vendor/three.module.min.js` unangetastet (nur minifizierte Bibliothek).

### Verifikation
- `node --check` auf effects.js, sw.js, mycel-bg.js (Modul) + inline-Script von
  index.html: OK.
- Grep nach `ISD/isdplus/isdwerbetechnik/Brunskamp/Seevetal` (ohne vendor/isDark):
  leer.
- **Sichttest am echten Gerät steht aus — wartet auf Browser-Lauf.**

### Offen / Nächste Schritte
1. App-Icons durch neutrale Bytes ersetzen (Hauptsitzung).
2. Eigene Bilder per Drag & Drop oder in `img/` einsetzen.
3. Vor echter Nutzung: Platzhalter (Firma/Adresse/Telefon/E-Mail) + vollständiges
   Impressum/Datenschutz ergänzen.
