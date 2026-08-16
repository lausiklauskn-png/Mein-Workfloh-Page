/*
 * Gegenprobe zu `sbkim.smoke.mjs`.
 *
 * Baut nacheinander die Fehler ein, die beim Kopieren eines SBKIM-Einbaus
 * WIRKLICH passieren. **Jeder einzelne MUSS die Probe umwerfen.** Tut er es
 * nicht, ist der Wächter an dieser Stelle blind — und ein blinder Wächter ist
 * schlimmer als keiner, weil sein Grün beruhigt.
 *
 * Die Fälle sind nicht ausgedacht. Sie stammen aus dem, was in diesem Netz
 * schon schiefgegangen ist:
 *   · ein übernommener DB_SUFFIX (zwei Apps, eine Identität)
 *   · Modul 17 hinter 15/16 (Lampe und Siegel hängen ins Leere — lautlos)
 *   · die Kette als gewöhnliche <script src> (drückt die öffentlichen Messwerte)
 *   · ein Wizard ohne Identitäts-Wechsler (gemessen: Kimseek, Private Brain)
 *   · ein Vorlagen-Rest im Namen der Sicherungsdatei
 *
 * Alle Dateien werden gesichert und am Ende zurückgeschrieben — auch wenn der
 * Lauf abbricht (finally).
 *
 * Lauf: node tests/sbkim.gegenprobe.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = (p) => join(ROOT, p);

const AKTEN = [
  "index.html",
  "assets/storage-init.js",
  "assets/rendezvous-init.js",
  "assets/schutz-init.js",
  "assets/siegel-inhalt.js",
  "modules/23_rendezvous_ui.js",
];
const sicher = Object.fromEntries(AKTEN.map((a) => [a, readFileSync(P(a), "utf-8")]));

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P("tests/sbkim.smoke.mjs")], { cwd: ROOT, stdio: "pipe" });
    return true;
  } catch { return false; }
}
const schreib = (a, s) => writeFileSync(P(a), s, "utf-8");

const FAELLE = [
  {
    was: "DB_SUFFIX von der Vorlage übernommen",
    bauen: () => schreib("assets/storage-init.js", sicher["assets/storage-init.js"].replace('DB_SUFFIX = "workflohpage"', 'DB_SUFFIX = "kimboard"')),
  },
  {
    was: "die zwei Schubladen-Werte laufen auseinander",
    bauen: () => schreib("assets/rendezvous-init.js", sicher["assets/rendezvous-init.js"].replace('DB_SUFFIX = "workflohpage"', 'DB_SUFFIX = "workflohpage2"')),
  },
  {
    was: "Modul 17 steht HINTER Membran und Siegel",
    bauen: () => {
      let h = sicher["index.html"].replace('    "./modules/17_floating_widget.js",\n', "");
      h = h.replace('    "./modules/16_siegel.js",\n', '    "./modules/16_siegel.js",\n    "./modules/17_floating_widget.js",\n');
      schreib("index.html", h);
    },
  },
  {
    was: "siegel-inhalt steht VOR Modul 16",
    bauen: () => {
      let h = sicher["index.html"].replace('    "./assets/siegel-inhalt.js"\n', "");
      h = h.replace('    "./modules/16_siegel.js",\n', '    "./assets/siegel-inhalt.js",\n    "./modules/16_siegel.js",\n');
      schreib("index.html", h.replace(/,\n  \];/, "\n  ];"));
    },
  },
  {
    was: "die Kette liegt als gewöhnliche <script src> im Dokument",
    bauen: () => schreib("index.html", sicher["index.html"].replace("</body>", '<script src="./modules/16_siegel.js"></script>\n</body>')),
  },
  {
    was: "kein Leerlauf-Laden mehr (Kette im kritischen Pfad)",
    bauen: () => schreib("index.html", sicher["index.html"].replace(/requestIdleCallback/g, "setTimeout")),
  },
  {
    was: "eine fehlende Datei hält die Kette an (kein fail-soft)",
    bauen: () => schreib("index.html", sicher["index.html"].replace("s.onload = s.onerror =", "s.onload =")),
  },
  {
    was: "Wizard ohne Identitäts-Wechsler",
    bauen: () => schreib("assets/siegel-inhalt.js", sicher["assets/siegel-inhalt.js"].replace(/switchWizardIdentity/g, "xxNichtsxx").replace(/[Ww]echsl\w*/g, "xx").replace(/wiz-idsel/g, "wiz-xxx")),
  },
  {
    was: "Sicherungsdatei heißt noch nach der Vorlage",
    bauen: () => schreib("assets/siegel-inhalt.js", sicher["assets/siegel-inhalt.js"].replace('downloadJson("workflohpage-backup-', 'downloadJson("kimboard-backup-')),
  },
  {
    was: "Wappen-Band ohne Gravur (ribbonText fehlt)",
    bauen: () => schreib("assets/schutz-init.js", sicher["assets/schutz-init.js"].replace(/ribbonText: "[^"]*",/, "")),
  },
  {
    was: "ein Kanon-Modul wurde am Ort abgewandelt",
    bauen: () => schreib("modules/23_rendezvous_ui.js", sicher["modules/23_rendezvous_ui.js"] + "\n// hier hat jemand etwas angepasst\n"),
    zusatz: () => {
      // Das ist der Drift-Guard-Fall; die Smoke-Probe prüft ihn nicht. Also
      // wird HIER der Guard befragt — sonst bliebe der Fall ungeprüft und
      // sähe wie bestanden aus.
      try { execFileSync(process.execPath, [P("tools/drift-guard.mjs")], { cwd: ROOT, stdio: "pipe" }); return true; }
      catch { return false; }
    },
  },
  {
    was: "die App selbst wurde beim Einbau zerschossen",
    bauen: () => schreib("index.html", sicher["index.html"].replace(/<script src="effects\.js"><\/script>/, "")),
  },
];

let blind = 0;
console.log("\n=== Gegenprobe · SBKIM-Einbau Muster Werbetechnik ===\n");

try {
  if (!probeLaeuftDurch()) {
    console.error("✗ Die Probe ist schon vor der Gegenprobe rot. Erst das in Ordnung bringen.");
    process.exit(1);
  }
  console.log("  Ausgangslage: Probe grün.\n");

  for (const f of FAELLE) {
    f.bauen();
    // Standard: die Smoke-Probe muss anschlagen. Hat ein Fall einen eigenen
    // Prüfer (Drift-Guard), zählt dessen Urteil.
    const bemerkt = f.zusatz ? !f.zusatz() : !probeLaeuftDurch();
    if (bemerkt) console.log(`  ✓ bemerkt: ${f.was}`);
    else { blind++; console.log(`  ✗ BLIND — nicht bemerkt: ${f.was}`); }
    for (const a of AKTEN) schreib(a, sicher[a]);
  }
} finally {
  for (const a of AKTEN) schreib(a, sicher[a]);
}

console.log(`\n${FAELLE.length - blind} von ${FAELLE.length} Fehlern bemerkt.` +
  (blind ? `  ${blind} BLINDE STELLE(N).\n` : "  Kein blinder Fleck.\n"));
process.exit(blind ? 1 : 0);
