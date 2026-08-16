/*
 * Drift-Guard — wacht per SHA-256 darüber, dass die byte-1:1 aus dem
 * Sage-Kanon kopierten SBKIM-Module hier NICHT abgewandelt werden.
 *
 * WARUM. Die Leitplanke heißt „kopieren, nicht klonen". Wer eine Kopie am Ort
 * anpasst, erzeugt eine weitere Modul-Generation — und dann laufen im Netz
 * mehrere Fassungen desselben Moduls, ohne dass jemand es sieht. Am
 * 2026-08-16 waren es beim Netz-Fenster zwei Generationen und beim Siegel
 * VIER. Reift ein Modul, wird die Quelle in Sage-Protokol gepflegt und hier
 * NEU kopiert, dann der Fingerabdruck unten nachgezogen — nie umgekehrt.
 *
 * Quelle: Sage-Protokol/src/modules/<datei> (Stand 2026-08-16)
 *
 * Lauf: node tools/drift-guard.mjs
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ERWARTET = [
  { datei: "modules/01_storage.js",          sha: "5a5a4bf64dfcc107da7ed70fb755d7db5cce7d80e963b3e2fbc2004537747820" },
  { datei: "modules/02_spore.js",            sha: "6789fe6e903ad2e53f39b2dee576c640698555ef71ef4e9134eb75573fdb7d68" },
  { datei: "modules/03_embedding.js",        sha: "e4bb8bd6a237914e7841cab5165912daf636adf0ee90c5d4ffd0c74cc5d706e5" },
  { datei: "modules/04_match.js",            sha: "5de95923c3f62f141e94f576feebcac0eecc55c60e40b564540a56420436a4cd" },
  { datei: "modules/05_anastomose.js",       sha: "255ac79aeb3b0203e92f0cebd0a905e47c488b43efe18f41332a7d35520bbf23" },
  { datei: "modules/05b_nostr_relay.js",     sha: "030aa2d260149f5627b84694a0b55e916cc186158009e260117d1e4f60d429bd" },
  { datei: "modules/07_apoptose.js",         sha: "0acdd6ab2d95e131fa6953061cc0e95a2396e05fff091a7dc690b2668a4c035a" },
  { datei: "modules/15_membran.js",          sha: "f88b5d04bc089192b39c9c8bd667e44928c817a7d8c1e2641ddaf921fe848199" },
  { datei: "modules/16_siegel.js",           sha: "95003d2088921ef49c521883fa8d9d6bd912ad7ad2ad4710d190930fc502006d" },
  { datei: "modules/17_floating_widget.js",  sha: "dd3e0d7fb5963904bab9257b1353344944ecd8675ca3c78897264c8a621aff82" },
  { datei: "modules/23_rendezvous.js",       sha: "3caa0bb1fbe7bf5293c90b6a59a74cccf8600bff45095a892b1f048244c61fcf" },
  { datei: "modules/23_rendezvous_ui.js",    sha: "b496bc86b5b23ce07e155b5f03615bf4e21cb208670a1c4d78b497f214ea7530" },
  { datei: "modules/noble-secp256k1.js",     sha: "8f3879ca422c4fdfe7ca0361688636fa7cc550a59bd94d512ed6ec79aa3d55d1" },
];

let ok = 0, ab = 0;
for (const e of ERWARTET) {
  let ist;
  try { ist = createHash("sha256").update(readFileSync(join(ROOT, e.datei))).digest("hex"); }
  catch (err) { console.error(`  ✗ ${e.datei} — nicht lesbar (${err.code})`); ab++; continue; }
  if (ist === e.sha) ok++;
  else { ab++; console.error(`  ✗ ABGEWICHEN: ${e.datei}\n      erwartet ${e.sha}\n      ist      ${ist}`); }
}
console.log(`Drift-Guard: ${ok} byte-1:1, ${ab} abgewichen`);
process.exit(ab ? 1 : 0);
