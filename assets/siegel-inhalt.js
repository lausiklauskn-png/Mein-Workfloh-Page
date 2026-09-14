/*
 * Siegel-Inhalt — DIE IDENTITÄT DIESES KNOTENS, und sonst nichts.
 *
 * ⚠ HIER STEHT KEIN KANON. Der Andock-Wizard, alle Anzeigetexte und alle
 * Prüfungen liegen seit A18 (2026-09-14) in EINER netzweit byte-gleichen
 * Datei — `assets/sbkim-andock-wizard.js`, Kanon `Sage-Protokol/src/modules/16b_andock_wizard.js`.
 * Diese Datei trägt nur noch, was in jedem Knoten ANDERS sein muss.
 *
 * Warum die Trennung: gemessen über die 20 Kopien im Netz standen am 2026-09-14
 * ZWÖLF verschiedene Code-Fassungen desselben Werkzeugs. Jede Verbesserung
 * kostete Handarbeit mal zwanzig und unterblieb deshalb meistens.
 *
 * ⚠ UND DIESE DATEI WIRD NIE VERTEILT. Sie trägt die BEDEUTUNG des Knotens; ein
 * Überschreiben gäbe dieser App den Namen und den Vektor einer fremden — der
 * Schaden vom 2026-08-16 in Alis Moderaum.
 *
 * Vertrag: Sage-Protokol/docs/INTERFACES.md §11.9.
 */
(function () {
  "use strict";
  window.SBKIM_SIEGEL_WIZ = {
    domain: "Vorlage/Werbetechnik-Website/PWA",
    endpoint: "https://lausiklauskn-png.github.io/Mein-Workfloh-Page/",
    nodeType: "hybrid",
    nodeName: "Muster Werbetechnik",
    domainDescription: "Muster Werbetechnik — firmenneutrale Gestaltungs-Vorlage für die Website eines Werbetechnik-Betriebs, als installierbare PWA zum Kopieren und Anpassen. Zeigt Aufbau, Leistungs-Seiten und Kontaktweg eines Handwerksbetriebs: Beschriftung, Folierung, Schilder, Textil, Digitaldruck. Alle Namen und Kontaktdaten sind Platzhalter — es ist eine Vorlage, kein Betrieb. Website-Vorlage, Werbetechnik, Handwerk, Schaufenster, PWA. Diese App ist zugleich ein eigenständiger Knoten im SBKIM-Mycel: Semantisches Bidirektionales KI-Matching nach der offenen Spezifikation aus dem Sage-Protokol. Sie trägt eine eigene Ed25519-Identität, kündigt sich mit einer signierten Spore an und findet über ihren Bedeutungs-Vektor andere Knoten des Netzes — server-los, ohne Konto, der private Schlüssel bleibt im Browser. SBKIM, Mycel, Knoten, Spore, Sage-Protokol, semantisches Matching.",
    domainKeywords: ["Website-Vorlage", "Werbetechnik", "Beschriftung", "Folierung", "Schilder", "Textildruck", "Digitaldruck", "Handwerksbetrieb", "PWA", "Schaufenster-Seite"],
    stammCategories: ["Website-Vorlage", "Werbetechnik-Leistungen", "PWA-Gestaltung"],
    guestCategories: ["Spore-Erzeugung", "Backup", "Handshake"],
    /* ⚠ NACHGETRAGEN BEIM A18-UMBAU (2026-09-14). Vorher stand dieser Name
       HART im Wizard-Code (`downloadJson("workflohpage-backup-…")`) und damit in einer
       Datei, die jetzt netzweit byte-gleich ist. Ohne diesen Eintrag hiesse
       die Sicherung dieser App wie jede andere — die eigene Probe hat es
       gefunden, nicht das Nachdenken. */
    backupPrefix: "workflohpage-backup",
  };
})();
