/*
 * Werbetechnik-Vorlage — Partikel-/Netz-Hintergrund (echtes three.js).
 * Umgefärbt auf die Vorlagen-Farben (Rot / Schwarz / Weiß / Grau).
 * Punkt-Wolke mit Funkel-/Stern-Shader + Hyphen-Linien, AdditiveBlending.
 * Themen via window.MycelBg.setTheme('light'|'dark'|'contrast').
 *
 * ── NACHGEZOGEN 2026-08-15 ──────────────────────────────────────────────────
 * Diese Datei war die EINZIGE im Netz, die noch die Fassung von vor den beiden
 * Härtungen trug. Die Schwestern hatten sie längst:
 *
 *   Datei                       Grafikchip-Wächter   Selbst-Bremse   Leistung
 *   Tomys Hub                          –                  ✅            94
 *   family-project                     ✅                 ✅            89
 *   diese hier (vorher)                –                  –             62
 *
 * Der Befund, der es zeigte (PageSpeed, Computer): FCP 0,3 s · LCP 0,4 s ·
 * CLS 0,028 — alles grün. Und Blockierzeit **23.490 ms**. Der Seitenaufbau war
 * längst in Ordnung; es war allein die Dauer-Renderschleife.
 *
 * Beide Schutzstufen sind aus `family-project/assets/mycel-bg.js` übernommen,
 * mit den dort gemessenen Zahlen. Die Farben dieser Vorlage bleiben unberührt.
 * ────────────────────────────────────────────────────────────────────────────
 */

/* Gibt es überhaupt einen echten Grafikchip? (Klaus' Entscheid 2026-08-08)
 *
 * Die Selbst-Bremse weiter unten misst die BILDRATE — sie merkt also erst,
 * dass es hoffnungslos ist, nachdem sie ein paar Bilder gerechnet hat. Auf
 * einem Gerät ohne Grafikbeschleunigung kostet jedes davon rund 1,4 s.
 * Gemessen an der Schwester-Seite Mein-Rezeptbuch-Page: Blockierzeit 10,3 s
 * TROTZ Bremse; ganz ohne Hintergrund 0 ms, bei Leistung 87 statt 48.
 *
 * Diese Prüfung stellt die Frage vorher und beantwortet sie in Mikrosekunden:
 * WebGL sagt selbst, wer zeichnet. Steht dort ein Software-Rasterizer
 * (SwiftShader, llvmpipe, Mesa offscreen — so läuft JEDES Prüfgerät bei
 * PageSpeed und manches alte Handy), wird der Hintergrund GAR NICHT aufgebaut:
 * kein three.js, keine 8000 Punkte, kein Schattierer. Die Seite zeigt dann ihre
 * eigene Farbe, alles andere bleibt wie es ist.
 *
 * Auf einem Gerät mit echtem Chip ändert sich nichts.
 *
 * FAIL-SOFT IN BEIDE RICHTUNGEN: verrät der Browser den Namen nicht (manche
 * Datenschutz-Einstellungen verbergen ihn), läuft der Hintergrund normal
 * weiter — Vorsicht darf keine Bestrafung sein. Gibt es gar kein WebGL, könnte
 * er ohnehin nicht laufen.                                                  */
function keinGrafikchip() {
  try {
    var c = document.createElement('canvas');
    var gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;                                  // kein WebGL: ginge sowieso nicht
    var dbg = gl.getExtension('WEBGL_debug_renderer_info');
    var name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '';
    // Kein Name preisgegeben -> im Zweifel laufen lassen.
    return /swiftshader|llvmpipe|software|mesa offscreen|microsoft basic/i.test(name);
  } catch (_e) { return true; }
}

function mycelBgStarten(THREE) {
const canvas = document.getElementById('bg');
if (canvas) {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 900px)').matches;
  const MAX_DPR = (window.matchMedia && matchMedia('(pointer: coarse)').matches) ? 1.5 : 2;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); canvas.style.visibility = 'hidden'; }, false);
  canvas.addEventListener('webglcontextrestored', () => { canvas.style.visibility = ''; }, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const grp = new THREE.Group();
  scene.add(grp);

  const PARTICLE_COUNT = isMobile ? 8000 : 20000;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT);
  const sizes = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = Math.pow(Math.random(), 0.7) * 14;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = Math.sin(ph) * Math.cos(th) * r;
    positions[i * 3 + 1] = Math.cos(ph) * r * 0.35 - 1.2;
    positions[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r * 0.6;
    seeds[i] = Math.random();
    sizes[i] = 0.45 + Math.random() * 1.7;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:      { value: 0 },
      uColorWarm: { value: new THREE.Color(0xff4a40) },
      uColorCool: { value: new THREE.Color(0xE0231B) },
      uColorMid:  { value: new THREE.Color(0x9aa0a6) },
      uAlpha:     { value: 0.42 },
      uMouse:     { value: new THREE.Vector2(2, 2) },
      uPxRatio:   { value: renderer.getPixelRatio() }
    },
    vertexShader: /* glsl */`
      uniform float uTime; uniform float uPxRatio; uniform vec2 uMouse;
      attribute float aSeed; attribute float aSize;
      varying float vMix; varying float vAlpha;
      void main() {
        vec3 p = position;
        float t = uTime * 0.18 + aSeed * 6.283;
        p.x += sin(t * 0.7 + p.y * 0.4) * 0.35;
        p.y += cos(t * 0.9 + p.z * 0.3) * 0.22;
        p.z += sin(t * 0.5 + p.x * 0.5) * 0.28;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float breath = 0.85 + 0.25 * sin(t * 1.4);
        gl_Position = projectionMatrix * mv;
        vec2 ndc = gl_Position.xy / gl_Position.w;
        float nearC = smoothstep(0.5, 0.0, distance(ndc, uMouse));
        gl_PointSize = aSize * breath * (220.0 / -mv.z) * uPxRatio * (1.0 + nearC * 0.9);
        vMix = aSeed;
        float pulse = sin(t * 2.4 + aSeed * 31.4159);
        vAlpha = 0.10 + 0.55 * pow(max(pulse, 0.0), 4.0) + nearC * 0.75;
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColorWarm; uniform vec3 uColorCool; uniform vec3 uColorMid;
      uniform float uAlpha;
      varying float vMix; varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        vec3 col = mix(uColorCool, uColorWarm, vMix);
        col = mix(col, uColorMid, 0.30);
        float core = smoothstep(0.45, 0.0, d);
        float vRay = smoothstep(0.5, 0.0, abs(c.x) * 7.5) * smoothstep(0.5, 0.0, abs(c.y) * 1.4);
        float hRay = smoothstep(0.5, 0.0, abs(c.y) * 7.5) * smoothstep(0.5, 0.0, abs(c.x) * 1.4);
        float star = core + (vRay + hRay) * vAlpha * 0.9;
        gl_FragColor = vec4(col, star * vAlpha * uAlpha);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geo, mat);
  grp.add(points);

  const LINK_COUNT = isMobile ? 200 : 560;
  const linkPos = new Float32Array(LINK_COUNT * 2 * 3);
  for (let i = 0; i < LINK_COUNT; i++) {
    const a = Math.floor(Math.random() * PARTICLE_COUNT);
    let b = a + 1 + Math.floor(Math.random() * 200);
    if (b >= PARTICLE_COUNT) b = PARTICLE_COUNT - 1;
    for (let k = 0; k < 3; k++) {
      linkPos[i * 6 + k]     = positions[a * 3 + k];
      linkPos[i * 6 + 3 + k] = positions[b * 3 + k];
    }
  }
  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
  const linkMat = new THREE.LineBasicMaterial({ color: 0x7a1410, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
  const links = new THREE.LineSegments(linkGeo, linkMat);
  grp.add(links);

  // Farben pro Thema — Vorlagen-Farben (Rot/Schwarz/Weiß/Grau)
  const THEME_COLORS = {
    dark:     { warm: 0xff4a40, cool: 0xE0231B, mid: 0x9aa0a6, link: 0x7a1410, alpha: 0.42, linkOpa: 0.18, additive: true },
    contrast: { warm: 0xff2a20, cool: 0xff6b62, mid: 0xffffff, link: 0xE0231B, alpha: 0.52, linkOpa: 0.22, additive: true },
    light:    { warm: 0xE0231B, cool: 0xb41a10, mid: 0x6b7280, link: 0xc0392b, alpha: 0.7,  linkOpa: 0.14, additive: false }
  };
  function setTheme(name) {
    const c = THEME_COLORS[name] || THEME_COLORS.dark;
    mat.uniforms.uColorWarm.value.setHex(c.warm);
    mat.uniforms.uColorCool.value.setHex(c.cool);
    mat.uniforms.uColorMid.value.setHex(c.mid);
    mat.uniforms.uAlpha.value = c.alpha;
    mat.blending = c.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    mat.needsUpdate = true;
    linkMat.color.setHex(c.link);
    linkMat.opacity = c.linkOpa;
    linkMat.blending = c.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    linkMat.needsUpdate = true;
    if (reduce) renderOnce();
  }
  window.MycelBg = { setTheme };

  (function () {
    let k = 'light';
    try { k = localStorage.getItem('tpl-theme') || 'light'; } catch (_e) {}
    setTheme(k);
  })();

  let scrollY = window.scrollY || 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; if (reduce) requestAnimationFrame(renderOnce); }, { passive: true });

  window.addEventListener('pointermove', (e) => {
    mat.uniforms.uMouse.value.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    if (reduce) requestAnimationFrame(renderOnce);
  }, { passive: true });
  window.addEventListener('pointerleave', () => { mat.uniforms.uMouse.value.set(2, 2); if (reduce) requestAnimationFrame(renderOnce); }, { passive: true });

  let curScale = 1;
  function applyScroll() {
    const aim = 1 + Math.min(scrollY, 2200) / 2600;
    curScale += (aim - curScale) * 0.06;
    grp.scale.setScalar(curScale);
  }
  function renderOnce() { applyScroll(); renderer.render(scene, camera); }

  let last = performance.now();
  /* Ruht, solange der Reiter im Hintergrund liegt. Ohne das rechnete der
     Hintergrund weiter, während niemand hinsieht — auf einem Handy heißt das
     Akku für ein Bild, das gar nicht auf dem Schirm ist. Beim Zurückkommen
     wird die Uhr neu gestellt, sonst springt die Drehung um die ganze
     verpasste Zeit auf einmal weiter. */
  let laeuft = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { laeuft = false; return; }
    if (!laeuft) { laeuft = true; last = performance.now(); if (!reduce && !gebremst) requestAnimationFrame(tick); }
  });

  /* ── Selbst-Bremse (Klaus' Entscheid 2026-08-02, hier nachgezogen) ────────
   * Auf einem Gerät MIT Grafikbeschleunigung kostet ein Bild ~2 ms. Ohne
   * (alte Handys, und jedes Prüfgerät bei PageSpeed) sind es 180–255 ms.
   * Genau das stand in Klaus' Bericht vom 2026-08-15: die zwanzig längsten
   * Aufgaben waren alle diese Datei, Blockierzeit 23.490 ms.
   *
   * Dort ruckelt die Bewegung ohnehin nur und blockiert dabei die Bedienung.
   * Wird es dauerhaft zu langsam, bleibt ein STATISCHES Bild stehen — genau
   * dasselbe, das Geräte mit „Bewegung reduzieren" von jeher bekommen. Der
   * Hintergrund verschwindet nicht, er hört nur auf, sich zu drehen.
   *
   * Auf einem echten Gerät greift die Bremse nie: dort liegt dt bei ~0,016 s,
   * die Schwelle bei 0,05 s. Die ersten Bilder zählen nicht mit (der erste
   * Aufbau ist immer teurer), und ein einzelner Ausreißer setzt den Zähler
   * zurück — es braucht fünf langsame Bilder HINTEREINANDER.
   *
   * Gemessen an der Schwester-Seite (Lighthouse, gedrosselt, ohne Grafik):
   * Blockierzeit 163.000 ms -> 7.480 ms, Leistung 49 -> 59.                */
  const BREMS_SCHWELLE = 0.05;   // Sekunden pro Bild = 20 Bilder/s
  const BREMS_GEDULD   = 5;      // so viele langsame Bilder hintereinander
  const AUFWAERM_BILDER = 3;     // erste Bilder nicht bewerten
  let langsamInFolge = 0, bilderGezaehlt = 0, gebremst = false;

  function tick() {
    if (!laeuft) return;
    const now = performance.now();
    const dt = (now - last) / 1000; last = now;

    if (bilderGezaehlt++ >= AUFWAERM_BILDER) {
      if (dt > BREMS_SCHWELLE) langsamInFolge++; else langsamInFolge = 0;
      if (langsamInFolge >= BREMS_GEDULD) {
        gebremst = true;
        renderOnce();            // ein letztes, stehendes Bild
        return;                  // Schleife endet — kein Dauerlauf mehr
      }
    }

    mat.uniforms.uTime.value = now / 1000;
    grp.rotation.y += dt * 0.02;
    applyScroll();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  if (reduce) renderOnce(); else requestAnimationFrame(tick);
}
}

/* Der Anstoß: erst nach „load", und dann erst, wenn der Hauptfaden Luft hat.
 *
 * Ohne Grafikchip wird three.js GAR NICHT GEHOLT — 165 KiB, die auf so einem
 * Gerät nichts mehr ausrichten könnten. Das ist der Grund, warum der Wächter
 * hier oben steht und nicht erst im Renderer: eine Bibliothek, die man nicht
 * braucht, lädt man auch nicht.
 *
 * Schlägt das Nachladen fehl, bleibt die Seite voll benutzbar — nur ohne
 * bewegten Hintergrund (fail-soft). */
(function () {
  const los = () => {
    if (keinGrafikchip()) return;
    import('three')
      .then((m) => {
        mycelBgStarten(m);
        /* Das Thema MIT NAMEN nachreichen. `setTheme()` ohne Argument fiele auf
           `dark` zurück (THEME_COLORS[undefined] || THEME_COLORS.dark) — die
           Seite startet aber hell, und der Hintergrund stünde in den falschen
           Farben da. Zu diesem Zeitpunkt hat die Seite ihr Thema längst ans
           <html> geschrieben, also wird es dort abgelesen. */
        if (window.MycelBg) {
          try { window.MycelBg.setTheme(document.documentElement.getAttribute('data-theme') || 'light'); }
          catch (_e) {}
        }
      })
      .catch(() => {});
  };
  const gleich = () => (window.requestIdleCallback
    ? requestIdleCallback(los, { timeout: 2000 })
    : setTimeout(los, 200));
  if (document.readyState === 'complete') gleich();
  else window.addEventListener('load', gleich, { once: true });
})();
