/*
 * Gegenprobe zu `muster_hinweis.mjs`.
 *
 * Ein Wächter ohne Gegenprobe ist nur ein grüner Haken. Jeder Fall hier baut
 * genau EINEN Fehler ein, und jeder MUSS die Probe umwerfen.
 *
 * Die Fälle sind nicht ausgedacht — sie sind die Wege, auf denen der Hinweis
 * in der Praxis verschwindet: jemand räumt das Band weg, schiebt es an den
 * Fuß („stört oben"), macht es wegklickbar („nervt"), weicht den Text auf,
 * oder trägt beim Übernehmen der Vorlage echte Betreiber-Daten ein.
 *
 * Die Datei wird gesichert und am Ende zurückgeschrieben — auch bei Abbruch.
 *
 * Lauf: node tests/muster_hinweis.gegenprobe.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEITE = join(ROOT, "index.html");
const PROBE = join(ROOT, "tests", "muster_hinweis.mjs");
const sicher = readFileSync(SEITE, "utf-8");

let gefangen = 0, durch = 0;

/* Erst die Ausgangslage. Eine Gegenprobe auf rotem Grund gibt jedem Fall
   recht — dieselbe Falle wie in Kimhub. */
function laeuft() {
  try { execFileSync("node", [PROBE], { stdio: "pipe" }); return true; }
  catch { return false; }
}

function fall(was, alt, neu) {
  const s = readFileSync(SEITE, "utf-8");
  if (!s.includes(alt)) {
    console.log("  ⚠ ANKER NICHT GEFUNDEN — dieser Fall misst nichts: " + was);
    durch++; return;
  }
  writeFileSync(SEITE, s.replace(alt, neu));
  if (laeuft()) { durch++; console.log("  ✗ NICHT GEFANGEN: " + was); }
  else { gefangen++; console.log("  ✓ gefangen: " + was); }
  writeFileSync(SEITE, sicher);
}

try {
  if (!laeuft()) {
    console.error("✗ Die Probe ist schon OHNE Eingriff rot — die Gegenprobe misst nichts.");
    process.exit(2);
  }
  console.log("Ausgangslage grün.\n");

  fall("das Band ist ganz weg",
    '<p class="musterband" data-muster-hinweis>', '<p class="musterband" hidden>');

  fall("das Band verliert seine Marke (nur Klasse übrig)",
    'data-muster-hinweis>', '>');

  fall("das Band bekommt einen Schließen-Knopf",
    '<p class="musterband" data-muster-hinweis>',
    '<p class="musterband" data-muster-hinweis><button onclick="this.parentNode.remove()">×</button>');

  fall("der Text sagt nicht mehr, dass die Angaben erfunden sind",
    "sind erfunden — hinter ihr steht kein Betrieb",
    "sind sorgfältig zusammengestellt");

  fall("der Text nennt sich nicht mehr Muster oder Vorlage",
    "<b>Muster-Seite.</b>", "<b>Willkommen.</b>");

  fall("das alte Versprechen steht wieder da",
    "Diese Seite ist eine neutrale Gestaltungs-Vorlage und bleibt es.",
    "Vollständige Angaben werden vor Veröffentlichung ergänzt.");

  /* Der teuerste Fall: jemand übernimmt die Vorlage für einen echten Betrieb
     und trägt Klaus' Daten ins Impressum — genau das, was die Entscheidung
     vom 2026-09-08 verhindern soll. */
  fall("echte Betreiber-Daten wandern ins Impressum",
    "'<p><b>Muster Werbetechnik</b><br>[Straße Nr.]<br>[PLZ Ort]</p>'",
    "'<p><b>Klaus Nitzsche</b><br>[Straße Nr.]<br>[PLZ Ort]</p>'");

  /* Und die andere Richtung des Positions-Wächters: ein Hinweis am Fuß kommt
     nach dem Eindruck, den er einordnen soll. */
  fall("das Band rutscht unter den ersten Inhalt",
    '<p class="musterband" data-muster-hinweis>', '<p class="musterband" data-spaeter>');
} finally {
  writeFileSync(SEITE, sicher);
}

console.log(`\n— ${gefangen} gefangen, ${durch} durchgerutscht —`);
process.exit(durch > 0 ? 1 : 0);
