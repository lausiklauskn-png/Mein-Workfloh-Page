/*
 * Probe: der SBKIM-Einbau in Muster Werbetechnik ist vollständig und richtig
 * zusammengesetzt.
 *
 * WAS SIE PRÜFT — und warum jeder Punkt drinsteht:
 *
 *   1  Alle Kanon-Module liegen da und sind byte-1:1 (Drift-Guard).
 *   2  Der Klebstoff trägt die EIGENEN Werte, nicht die der Vorlage. Der
 *      teuerste Fehler beim Kopieren ist der stille: ein übernommener
 *      DB_SUFFIX. Alle Apps liegen unter EINER Adresse; zwei Apps mit
 *      demselben Suffix teilen sich eine Identität, und auf der Mycel-Karte
 *      stünden zwei Knoten mit derselben Kennung.
 *   3  Die LADEREIHENFOLGE stimmt. Modul 17 legt die Anker an, an die sich
 *      Wächter (15) und Siegel (16) hängen. Steht 17 dahinter, hängen beide
 *      ins Leere — und zwar lautlos: die Seite sieht normal aus, nur Lampe
 *      und Siegel fehlen.
 *   4  Die Kette wird NACH dem Laden geholt, nicht als <script src> im Kopf.
 *      Die Messwerte dieser Seite stehen öffentlich im Marktplatz.
 *   5  Das Siegel-Modal trägt den Andock-Wizard MIT Identitäts-Wechsler —
 *      der fehlt in frühen Kopien am häufigsten (gemessen 2026-08-16:
 *      Kimseek und Private Brain haben ihn nicht).
 *
 * Gegenprobe: node tests/sbkim.gegenprobe.mjs
 * Lauf:       node tests/sbkim.smoke.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const lies = (p) => readFileSync(join(ROOT, p), "utf-8");

let gruen = 0, rot = 0;
const sage = (ok, text) => { ok ? gruen++ : rot++; console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${text}`); };

const SUFFIX = "workflohpage";
const NAME = "Muster Werbetechnik";

console.log("\n=== SBKIM-Einbau · Muster Werbetechnik ===\n");

// ── 1 · Module vorhanden ────────────────────────────────────────────────────
const MODULE = [
  "01_storage", "02_spore", "03_embedding", "04_match", "05_anastomose",
  "05b_nostr_relay", "07_apoptose", "15_membran", "16_siegel",
  "17_floating_widget", "23_rendezvous", "23_rendezvous_ui", "noble-secp256k1",
];
for (const m of MODULE) sage(existsSync(join(ROOT, `modules/${m}.js`)), `Modul liegt: ${m}`);

// ── 2 · Klebstoff trägt die eigenen Werte ───────────────────────────────────
const KLEBSTOFF = ["storage-init", "rendezvous-init", "schutz-init", "nostr-listen-init", "siegel-inhalt"];
for (const g of KLEBSTOFF) sage(existsSync(join(ROOT, `assets/${g}.js`)), `Klebstoff liegt: ${g}.js`);

const storage = lies("assets/storage-init.js");
const rdv = lies("assets/rendezvous-init.js");
const schutz = lies("assets/schutz-init.js");
const siegel = lies("assets/siegel-inhalt.js");

sage(new RegExp(`DB_SUFFIX = "${SUFFIX}"`).test(storage), `storage-init nennt die eigene Schublade (${SUFFIX})`);
sage(new RegExp(`DB_SUFFIX = "${SUFFIX}"`).test(rdv), "rendezvous-init nennt dieselbe Schublade");
sage(rdv.includes(`nodeName: "${NAME}"`), "rendezvous-init trägt den eigenen Knoten-Namen");
sage(siegel.includes(`nodeName: "${NAME}"`), "siegel-inhalt trägt denselben Knoten-Namen");
sage(/ribbonText: "[A-ZÄÖÜ ]+"/.test(schutz), "schutz-init graviert einen Namen ins Wappen-Band");
sage(schutz.includes("Mein-Workfloh-Page"), "schutz-init zeigt auf das eigene Repo");
sage(siegel.includes(`downloadJson("${SUFFIX}-backup-`), "Sicherungsdatei heißt nach dieser App");

// Keine Vorlagen-Reste — der stille Fehler.
for (const [n, s] of Object.entries({ storage, rdv, schutz, siegel })) {
  sage(!/kimboard|Kimboard|kbdwiz/.test(s), `kein Vorlagen-Rest in ${n}`);
}

// ── 3 · Der Andock-Wizard ist vollständig ───────────────────────────────────
sage(/wechsl|switchWizardIdentity/i.test(siegel), "Siegel-Modal trägt den Identitäts-Wechsler");
sage(/listIdentities/.test(siegel), "Wizard kann vorhandene Identitäten lesen");
sage(/generateOwnSpore|signieren/i.test(siegel), "Wizard kann eine Spore signieren");
sage(/importBackup/.test(siegel), "Wizard kann eine Sicherung zurückholen");
sage(/wiz-idsel/.test(siegel), "Wizard nutzt ein eigenes Element-Präfix");

// ── 4 · Reihenfolge + späte Ladung in index.html ────────────────────────────
const html = lies("index.html");
const pos = (s) => html.indexOf(s);

sage(pos("./modules/01_storage.js") > -1, "index.html lädt die SBKIM-Kette");
sage(pos("./assets/storage-init.js") > -1, "index.html lädt storage-init");

// Reihenfolge — ERST Existenz prüfen, DANN vergleichen. `indexOf(...) < indexOf(...)`
// bleibt sonst wahr, wenn das Gesuchte gar nicht da ist: −1 ist kleiner als alles.
// Genau daran waren am 2026-08-15 fünf Wächter blind.
function vorher(a, b, text) {
  const ia = pos(a), ib = pos(b);
  sage(ia > -1 && ib > -1 && ia < ib, text);
}
vorher("./modules/01_storage.js", "./assets/storage-init.js", "01_storage steht vor storage-init");
vorher("./assets/storage-init.js", "./modules/02_spore.js", "storage-init steht vor der Spore");
vorher("./modules/17_floating_widget.js", "./modules/15_membran.js", "Modul 17 steht vor der Membran");
vorher("./modules/17_floating_widget.js", "./modules/16_siegel.js", "Modul 17 steht vor dem Siegel");
vorher("./modules/16_siegel.js", "./assets/siegel-inhalt.js", "Modul 16 steht vor siegel-inhalt");
vorher("./modules/23_rendezvous.js", "./modules/23_rendezvous_ui.js", "Modul 23 steht vor seiner Oberfläche");

sage(/requestIdleCallback/.test(html), "die Kette wird in der Leerlaufpause geholt");
sage(/s\.onload = s\.onerror/.test(html), "eine fehlende Datei hält die Kette nicht an (fail-soft)");
// Die Module dürfen NICHT als gewöhnliche <script src>-Zeile im Dokument stehen —
// das wäre der kritische Pfad, den das späte Laden gerade vermeidet.
sage(!/<script[^>]+src="\.\/modules\/(01|02|04|15|16|17|23)_/.test(html),
     "kein Kanon-Modul liegt als gewöhnliche <script src>-Zeile im Dokument");

// ── 4b · Die eigene Schublade steht FRÜH ────────────────────────────────────
// Das ist die Prüfung, die am 2026-08-16 gefehlt hat. Modul 01 liest
// `window.SBKIM_DB_SUFFIX` BEIM LADEN und macht daraus seinen Vorgabe-Namen.
// Fehlt die Zeile, ist der Vorgabe-Name die GETEILTE Schublade `sbkim` — und
// alle Apps liegen unter EINER Adresse. `storage-init.js` ruft zwar
// `SbkimStorage.init({dbSuffix})`, aber ASYNCHRON: greift ein Modul vorher zu,
// ist der geteilte Topf längst offen. Modul 01 nennt das in seinem Kopf Fall (B).
//
// Was Klaus davon sah: der Andock-Wizard von Alis Moderaum zeigte die
// Bedeutungs-Beschreibung von Muster Werbetechnik — er las die Spore aus dem
// gemeinsamen Topf. Aus einer falschen Beschreibung entsteht ein falscher
// Vektor, und damit findet der Knoten die falschen Nachbarn.
sage(/window\.SBKIM_DB_SUFFIX\s*=/.test(html), "index.html setzt window.SBKIM_DB_SUFFIX");
sage(new RegExp('window\\.SBKIM_DB_SUFFIX\\s*=\\s*"' + SUFFIX + '"').test(html),
     `der gesetzte Wert ist die eigene Schublade (${SUFFIX})`);
// Die STELLE messen, nicht das Wort. Der Kommentar über der Zeile nennt
// `window.SBKIM_DB_SUFFIX` ebenfalls — und der steht im Kopf. Wer mit
// indexOf auf den bloßen Namen prüft, misst also den Kommentar und bekommt
// „steht früh" gemeldet, während die Zeile selbst ganz unten liegt. Genau
// daran war diese Prüfung blind, und die Gegenprobe hat es gefunden.
const setzStelle = html.search(/<script>\s*window\.SBKIM_DB_SUFFIX\s*=/);
sage(setzStelle > -1 && setzStelle < html.indexOf("./modules/01_storage.js"),
     "die SETZ-ZEILE steht vor dem Speicher-Modul — sonst wirkt sie nicht");
sage(setzStelle > -1 && setzStelle < html.indexOf("</head>"),
     "die SETZ-ZEILE steht im Kopf, nicht irgendwo im Rumpf");

// ── 4c · JEDES Pflicht-Modul ist verdrahtet — namentlich ────────────────────
// Klaus' Befund 2026-08-16: das Netz-Panel meldete „Kein Nostr-Relais-Client
// (Modul 05b) verfügbar". Die alte Prüfung zählte nur, ob Dateien DALIEGEN —
// ob sie auch GELADEN werden, stand nirgends. 05b ist der Sonderfall, an dem
// das auffiel: es ist ein ES-Modul und kann deshalb NICHT über die
// Leerlauf-Kette nachgeladen werden, es braucht eine eigene Zeile. Wer die
// vergisst, hat alle Dateien im Repo und trotzdem kein Relais.
//
// Modul 05 (Anastomose) und 05b (Relais-Client) sind PFLICHT, nicht Zubehör:
// ohne 05 kein Handshake, ohne 05b kein Raum. Beide werden hier namentlich
// verlangt.
const PFLICHT = [
  "01_storage", "02_spore", "03_embedding", "04_match", "05_anastomose",
  "07_apoptose", "15_membran", "16_siegel", "17_floating_widget",
  "23_rendezvous", "23_rendezvous_ui",
];
for (const m of PFLICHT) {
  sage(html.includes(`"./modules/${m}.js"`), `die Kette lädt Modul ${m}`);
}
// 05b geht NICHT über die Kette — es ist ein ES-Modul mit relativem Import.
sage(/<script[^>]+type="module"[^>]+src="\.\/modules\/05b_nostr_relay\.js"/.test(html),
     "Modul 05b ist als ES-Modul eingebunden (eigene Zeile, nicht über die Kette)");
sage(!/"\.\/modules\/05b_nostr_relay\.js"/.test(html.replace(/<script[^>]*>/g, "")),
     "Modul 05b steht NICHT zusätzlich in der Kette (dort liefe es nie)");
sage(/\.\/modules\/noble-secp256k1\.js/.test(html),
     "noble liegt bereit — 05b importiert es relativ");

// ── 4d · Der Offline-Vorrat trägt die Kette ─────────────────────────────────
// Der fetch-Handler antwortet ZUERST aus dem Speicher. Ein Modul, das nie im
// Vorrat war, muss jedes Mal übers Netz kommen — und offline gar nicht. Dann
// ist das Netz-Fenster tot, ohne dass die Seite kaputt aussieht.
if (existsSync(join(ROOT, "sw.js"))) {
  const sw = lies("sw.js");
  for (const m of [...PFLICHT, "05b_nostr_relay", "noble-secp256k1"]) {
    sage(sw.includes(`modules/${m}.js`), `Vorrat enthält Modul ${m}`);
  }
  for (const g of KLEBSTOFF) sage(sw.includes(`assets/${g}.js`), `Vorrat enthält ${g}.js`);
}

// ── 5 · Die App selbst ist unberührt ───────────────────────────────────────
sage(/<script\s+src="effects\.js"/.test(html), "die App lädt weiter effects.js");

console.log(`\nErgebnis: ${gruen} grün, ${rot} rot\n`);
process.exit(rot ? 1 : 0);
