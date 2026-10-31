**🔬 Regel: Forschung nur in Kimhub (Klaus 2026-10-31: „einheitlich alles in Kimhub … in den einzelnen Repos soll keine Forschungseinträge sein“):** jeder Forschungseintrag (Sitzungs-Befunde, Messungen, Stunden-Auswertungen, Forschungsnotizen) kommt nach **Kimhub `forschung/messungen/`**; in diesem Repo werden keine Forschungseinträge geführt und keine Forschungsdateien angelegt. Öffentliche Forschungs**aufgaben** stehen in Sage-Protokol.

# Werbetechnik-Website-Vorlage — Sitzungs-Anker

**Kurz-Verfassung.** Ausführliches steht netzweit in **Sage-Protokol**; hier steht nur,
was eine Sitzung wissen muss, **bevor** sie hier etwas anfasst.

## Was dieses Repo ist

**Muster Werbetechnik** — eine **firmenneutrale** Vorlage für eine
Werbetechnik-Firmen-Website als installierbare PWA, zugleich SBKIM-Endknoten
(DB-Schublade `workflohpage`).

**Alle Texte, Namen und Kontaktdaten sind Platzhalter.** Wer hier echte Firmendaten
einträgt, macht aus der Vorlage eine Einzelfassung — genau das soll sie nicht sein.

## Prüfen

```bash
npm test    # Drift-Guard + alle tests/*.mjs (Gegenproben ausgenommen)
```
Zuletzt gemessen: **82 grün, 0 rot**.

## Was hier leicht kaputtgeht

- **`modules/01…05, 23` sind byte-1:1-Kopien**, per SHA-256 im Drift-Guard gepinnt.
  App-eigener Code gehört in `assets/rendezvous-init.js`.
- **Cache-Bump:** `CACHE` in `sw.js` (`werbetechnik-page-vNN`).
- **Keine echten personenbezogenen Daten** — auch nicht als „Beispiel".
- **Der Gerätename** wird vom app-eigenen Glue ins Verbinden-Panel gehängt — hier `assets/rendezvous-init.js`, **nie** in eine byte-kopierte Panel-Datei. Regel: [NETZWEIT § 2](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md).

## Netzweit — gilt in jedem Repo, steht in Sage

Freibrief zum Selbst-Mergen · Gerätename im Verbinden-Panel · frisch von
`origin/main` vor jeder Arbeit · Ton · kein PII · Ehrlichkeit:
**[`Sage-Protokol/docs/NETZWEIT.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md)**

Verbindliche Verträge: **[`INTERFACES.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/INTERFACES.md)** (Andock §11,
Briefkasten §11.6, Gerätename §11.7). Die Fallen beim Abzweigen und
Veröffentlichen: **[`LEHREN.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/LEHREN.md)**.

Das Kurze davon, weil es täglich gebraucht wird:

```bash
git fetch origin --quiet && git checkout -B <branch> origin/main
git push -u origin refs/heads/<branch>:refs/heads/<branch>
git diff --stat origin/main origin/<branch>     # leer = der PR wäre leer
```

> **Bis 2026-08-22 stand das hier ausgeschrieben** — und wortgleich in bis zu
> 19 weiteren Repos. Zwanzig Kopien einer Regel sind nicht zwanzigmal so
> verbindlich; sie sind zwanzig Stellen, an denen sie auseinanderlaufen kann.
> Genau das war passiert. Die alte Fassung dieser Datei steht vollständig in
> [`docs/archiv/CLAUDE-2026-08-22.md`](docs/archiv/CLAUDE-2026-08-22.md).


## ⬇ Installieren-Knopf in der Kopfleiste (2026-10-18)

Klaus: „Den Installieren-Button überall fest einbauen … Wenn es kein Einstellungsfeld gibt, dann den Installier-Button oben ins Menü hinein.“ `assets/installieren.js` ist byte-1:1 aus Sage-Protokol (SHA-256 `e0644084…c3`), nie hier abwandeln. Der Knopf steht vor 🌙 (`data-vor="tbDark"`, nur ⬇), ist immer da und verschwindet, sobald die Seite als App läuft. Die Leiste unten (`#installBar`) bleibt ein Hinweis; ihr Knopf tippt den neuen an (`installApp`). Im Vorrat, Cache erhöht. Gemessen im Browser: sichtbar, als App weg, Meldung lesbar, keine Installierbarkeits-Fehler, 360 px ohne Überlauf. ⚠ Am Tablet nicht gemessen.
