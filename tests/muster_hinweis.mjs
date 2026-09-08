/*
 * Probe: die Seite sagt selbst, dass sie eine Vorlage ist.
 *
 * WARUM ES DIESE PROBE GIBT. „Muster Werbetechnik" ist eine firmenneutrale
 * Vorlage — und sie steht zugleich im Marktplatz. Wer sie dort anklickt,
 * sieht einen Betrieb mit Anschrift, Telefon, Preisen und Referenzen, und
 * nichts davon gibt es. Der Hinweis darauf stand bis zum 2026-09-08 nur im
 * Impressum, also hinter zwei Klicks, und sagte obendrein etwas Falsches:
 * die Angaben würden „vor Veröffentlichung ergänzt" — die Veröffentlichung
 * war längst. Klaus hat am 2026-09-08 entschieden: benannter Hinweis auf der
 * Seite, keine echten Betreiber-Daten in einer Vorlage.
 *
 * GEMESSEN WIRD DIE ZUSICHERUNG, NICHT DER WORTLAUT. Ein Wächter, der einen
 * Satz festnagelt, verbietet das nächste Richtigstellen — dieselbe Lehre wie
 * in Kimhub am 2026-08-22. Gehängt wird deshalb an die Marke
 * `data-muster-hinweis`; vom Text wird nur verlangt, dass er das Wort
 * überhaupt sagt.
 *
 * Und er steht als ECHTES HTML im Dokument, nicht per Skript nachgetragen:
 * ein Band, das nach dem Laden erscheint, schöbe die ganze Seite.
 *
 * Lauf: node tests/muster_hinweis.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const seite = readFileSync(join(ROOT, "index.html"), "utf-8");

let gruen = 0, rot = 0;
const ok = (was, gut) => {
  if (gut) { gruen++; console.log("  ✓ " + was); }
  else { rot++; console.log("  ✗ ROT: " + was); }
};

/* 1 · Der Hinweis steht im ausgelieferten Dokument. */
const marke = /<p[^>]*\bdata-muster-hinweis\b[^>]*>([\s\S]*?)<\/p>/.exec(seite);
ok("die Seite trägt den Muster-Hinweis als echtes HTML", !!marke);

/* 2 · Er steht VOR dem Inhalt, nicht am Fuß. Ein Hinweis, den man erst nach
      der halben Seite liest, kommt nach dem Eindruck, den er einordnen soll. */
if (marke) {
  const hero = seite.indexOf('class="hero');
  ok("… und zwar oben, vor dem ersten Inhalt",
    hero === -1 || marke.index < hero);
}

/* 3 · Er sagt die Sache beim Namen. Kein Wortlaut-Nagel — nur: das Wort
      „Muster" bzw. „Vorlage" muss fallen, und dass die Daten erfunden sind. */
if (marke) {
  const text = marke[1].replace(/<[^>]*>/g, " ");
  ok("… nennt sich Muster oder Vorlage", /muster|vorlage/i.test(text));
  ok("… und sagt, dass die Angaben nicht echt sind",
    /erfunden|kein Betrieb|keine echte|Platzhalter/i.test(text));
}

/* 4 · Er ist nicht wegklickbar. Ein Hinweis mit Schließen-Knopf ist beim
      zweiten Besucher wieder da und beim ersten schon weg. */
if (marke) {
  ok("… und lässt sich nicht wegklicken",
    !/onclick|<button/i.test(marke[0]));
}

/* 5 · Die Rechtstexte versprechen nichts, was vorbei ist. „wird vor
      Veröffentlichung ergänzt" war einmal richtig; die Seite ist seit
      langem veröffentlicht und im Marktplatz gelistet. Eine Zusage auf
      einen vergangenen Zeitpunkt liest sich wie eine Auskunft. */
ok(`kein "wird vor Veröffentlichung ergänzt" mehr in den Rechtstexten`,
  !/vor Veröffentlichung ergänzt/i.test(seite));

/* 6 · Und der Kern der Entscheidung: es stehen KEINE echten Betreiber-Daten
      in der Vorlage. Geprüft an Klaus' eigenen Angaben, die in den
      Schwester-Repos wirklich vorkommen.

      ⚠ GEMESSEN WIRD JEDE FUNDSTELLE, nicht die erste. Die erste Fassung
      dieses Wächters fragte, ob der Name VOR `<html` steht — und war damit
      blind für jede weitere Stelle dahinter. Genau die Sorte Prüfung, die
      grün bleibt, während das Gesuchte danebenliegt.

      Zwei Stellen sind erlaubt und bleiben: der Kopf-Kommentar und der
      `_CR`-Block. Beide sagen, wem die VORLAGE gehört — das ist Klaus'
      Copyright und ausdrücklich gewollt (NETZWEIT). Sie sagen NICHT, wer
      der Betrieb ist, und darum geht es hier. */
const kopfEnde = seite.indexOf("<html");
const crBlock = /<script>\/\* FP-COPYRIGHT \*\/[\s\S]*?<\/script>/.exec(seite);
const erlaubt = (pos) =>
  pos < kopfEnde
  || (crBlock && pos >= crBlock.index && pos < crBlock.index + crBlock[0].length);

for (const echt of ["Nitzsche", "lausiklaus.kn", "family-projekt.de"]) {
  const stellen = [];
  for (let k = seite.indexOf(echt); k !== -1; k = seite.indexOf(echt, k + 1)) stellen.push(k);
  const fremd = stellen.filter((k) => !erlaubt(k));
  const zeilen = fremd.map((k) => seite.slice(0, k).split("\n").length);
  ok(`„${echt}" steht nur im Copyright, nicht als Betreiber-Angabe`
    + ` (${stellen.length} Fundstellen`
    + (fremd.length ? `, davon ${fremd.length} in Zeile ${zeilen.join(", ")}` : "")
    + ")",
    fremd.length === 0);
}

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══`);
process.exit(rot > 0 ? 1 : 0);
