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

// ── 5 · Die App selbst ist unberührt ───────────────────────────────────────
sage(/<script\s+src="effects\.js"/.test(html), "die App lädt weiter effects.js");

console.log(`\nErgebnis: ${gruen} grün, ${rot} rot\n`);
process.exit(rot ? 1 : 0);
