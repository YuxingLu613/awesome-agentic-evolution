import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(relativePath) {
  try {
    return readFileSync(path.join(ROOT, relativePath), "utf8");
  } catch {
    return "";
  }
}

test("publishes an accessible repo-linked dashboard using Pages-safe relative paths", () => {
  const index = readProjectFile("site/index.html");

  assert.match(index, /<title>Awesome Agentic Evolution/);
  assert.match(index, /id="metrics"/);
  assert.match(index, /id="landscape"/);
  assert.match(index, /id="recent"/);
  assert.match(index, /id="opportunities"/);
  assert.match(index, /id="roadmap"/);
  assert.match(index, /https:\/\/github\.com\/YuxingLu613\/awesome-agentic-evolution/);
  assert.match(index, /<script type="module" src="\.\/app\.js"><\/script>/);
  assert.doesNotMatch(index, /(?:href|src)="\//);
});

test("deploys the dashboard from main and refreshes its GitHub snapshot daily", () => {
  const workflow = readProjectFile(".github/workflows/pages.yml");

  assert.match(workflow, /branches:\s*\n\s+- main/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /node scripts\/build-dashboard-data\.mjs/);
});

test("ships a GitHub-compatible social preview and absolute Open Graph metadata", () => {
  const index = readProjectFile("site/index.html");
  const preview = path.join(ROOT, "site", "og.jpg");

  assert.match(
    index,
    /property="og:image" content="https:\/\/yuxinglu613\.github\.io\/awesome-agentic-evolution\/og\.jpg"/
  );
  assert.match(
    index,
    /name="twitter:image" content="https:\/\/yuxinglu613\.github\.io\/awesome-agentic-evolution\/og\.jpg"/
  );
  assert.ok(statSync(preview).size < 1_000_000, "Social preview must stay under 1 MB");
});

test("links readers from the repository README to the living dashboard", () => {
  const readme = readProjectFile("README.md");

  assert.match(
    readme,
    /https:\/\/yuxinglu613\.github\.io\/awesome-agentic-evolution\//
  );
  assert.match(readme, /living research dashboard/i);
});

test("uses the evidence-stage taxonomy consistently across the README and homepage", () => {
  const readme = readProjectFile("README.md");
  const index = readProjectFile("site/index.html");

  [
    "Parameters",
    "Memory",
    "Knowledge",
    "Skills",
    "Tools",
    "Topology",
    "Co-evolution"
  ].forEach((target) => assert.match(readme, new RegExp(`### ${target}`)));
  assert.match(index, /Community-curated · Evidence-first/);
  assert.doesNotMatch(index, /Survey-ready|Become a curator/);
  assert.match(index, /Read the taxonomy/);
});

test("presents one integrated inner-evolution and co-evolution simulator", () => {
  const index = readProjectFile("site/index.html");
  const app = readProjectFile("site/app.js");
  const styles = readProjectFile("site/styles.css");

  assert.match(index, /id="evolution-status"[^>]*aria-live="polite"/);
  assert.match(index, /id="loop-control"[^>]*aria-pressed="false"/);
  assert.match(index, /class="evolution-simulator"/);
  assert.match(index, /Inner evolution · every iteration/);
  assert.match(index, /Co-evolution · every 7 iterations/);
  assert.match(
    index,
    /class="status-iteration">Iteration <strong id="iteration-count">01<\/strong><\/span>/
  );
  assert.match(index, /class="agent-panel"/);
  assert.equal((index.match(/class="loop-stage /g) ?? []).length, 4);
  assert.equal((index.match(/class="loop-stage [^"]*" data-stage=/g) ?? []).length, 4);
  assert.match(index, /data-stage="act"/);
  assert.match(index, /data-stage="assess"/);
  assert.match(index, /data-stage="revise"/);
  assert.match(index, /data-stage="retain"/);
  assert.match(index, /id="agent-version"/);
  assert.match(index, /aria-label="Six agent evolution target categories"/);
  assert.doesNotMatch(index, /mutually exclusive/);
  assert.equal((index.match(/class="component-row /g) ?? []).length, 6);
  assert.equal((index.match(/data-inner-target=/g) ?? []).length, 6);
  assert.match(index, /data-inner-target="knowledge"/);
  assert.match(index, /data-inner-target="topology"/);
  assert.doesNotMatch(index, /data-inner-target="workflow"|data-inner-target="code"/);
  assert.equal((index.match(/class="ecosystem-node /g) ?? []).length, 5);
  assert.equal((index.match(/data-outer-target=/g) ?? []).length, 5);
  assert.match(index, /data-outer-target="environment"/);
  assert.match(index, /data-outer-target="objectives"/);
  assert.match(index, /data-outer-target="evaluators"/);
  assert.match(index, /data-outer-target="mechanism"/);
  assert.match(index, /data-outer-target="population"/);
  assert.doesNotMatch(index, /Example system|id="preset-select"|<option value=|data-preset=/);
  assert.doesNotMatch(index, /<span>0[1-4]<\/span>/);
  assert.doesNotMatch(index, /id="selected-targets"|One or more targets may change/);
  assert.doesNotMatch(index, /id="coevolution-caption"|Co-evolution activates every seventh iteration/);
  assert.doesNotMatch(index, /six targets · mutually exclusive/);
  assert.match(index, /id="agent-verdict"[^>]*aria-live="polite"/);
  assert.match(index, /class="governance-lines"/);
  assert.match(index, /class="writeback-arrow"/);
  assert.match(index, /viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(index, /preserveAspectRatio="none"/);
  assert.match(index, /markerWidth="6" markerHeight="6"/);
  assert.match(index, /M300 90 A150 150 0 0 1 406\.07 133\.93 A150 150 0 0 1 450 240/);
  assert.match(index, /M150 240 A150 150 0 0 1 193\.93 133\.93 A150 150 0 0 1 300 90/);
  assert.match(index, /id="target-detail"[^>]*hidden/);
  assert.doesNotMatch(index, /class="simulator-controls"/);
  assert.match(app, /STAGE_DWELL_MS/);
  assert.match(app, /advanceEvolutionState\(state\)/);
  assert.match(app, /formatEvolutionCount/);
  assert.match(
    app,
    /const reduceMotion = window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/
  );
  assert.match(app, /let userPaused = reduceMotion/);
  assert.doesNotMatch(app, /presetSelect|PRESETS|createEvolutionState\([^)]/);
  assert.doesNotMatch(app, /selectedTargetsCaption|#selected-targets|#coevolution-caption/);
  assert.match(app, /agentVerdict\.hidden/);
  assert.match(
    app,
    /writebackArrow\.textContent = state\.verdict === "rejected" \? "↶" : "→"/
  );
  assert.match(app, /event\.key === "Escape"/);
  assert.match(styles, /\.evolution-simulator/);
  assert.match(styles, /\.agent-panel/);
  assert.match(styles, /\.component-row\.is-candidate/);
  assert.match(styles, /\.component-row\.is-written/);
  assert.match(styles, /\.component-row\.is-rejected/);
  assert.match(styles, /\.agent-verdict\.is-accepted/);
  assert.match(styles, /\.agent-verdict\.is-rejected/);
  assert.match(styles, /\.loop-stage\.is-active/);
  assert.match(styles, /\.ecosystem-node\.is-governing/);
  assert.match(styles, /\.ecosystem-node\.is-coevolving/);
  assert.match(styles, /@keyframes target-ripple/);
  assert.match(styles, /@keyframes accepted-write/);
  assert.match(styles, /@keyframes rejected-return/);
  assert.doesNotMatch(styles, /@keyframes orbit-signal/);
  assert.doesNotMatch(styles, /@keyframes coevolution-up/);
  assert.doesNotMatch(styles, /@keyframes coevolution-down/);
  assert.match(styles, /--system-surface:\s*var\(--surface\);/);
  assert.match(styles, /--inner-accent:\s*var\(--inner\);/);
  assert.match(styles, /--outer-accent:\s*var\(--outer\);/);
  assert.match(styles, /--accept-accent:\s*var\(--accept\);/);
  assert.match(styles, /--reject-accent:\s*var\(--reject\);/);
  assert.match(styles, /\.loop-arcs path\s*{[^}]*marker-mid:\s*url\("#loop-arrow"\);/s);
  assert.match(styles, /\.loop-arcs path\s*{[^}]*stroke-width:\s*1\.4;/s);
  assert.match(styles, /\.evolution-simulator \.stage-act\s*{[^}]*top:\s*18\.75%;/s);
  assert.match(styles, /\.evolution-simulator \.stage-revise\s*{[^}]*top:\s*81\.25%;/s);
  assert.match(styles, /\.evolution-simulator \.stage-assess\s*{[^}]*top:\s*50%;[^}]*left:\s*75%;/s);
  assert.match(styles, /\.evolution-simulator \.stage-retain\s*{[^}]*top:\s*50%;[^}]*left:\s*25%;/s);
  // every stage sits on the circle: same transform, no ad-hoc pixel offsets
  assert.equal(
    (styles.match(/\.evolution-simulator \.stage-\w+\s*{[^}]*transform:\s*translate\(-50%, -50%\);/gs) ?? []).length,
    4
  );
  assert.doesNotMatch(styles, /calc\(25% - 36px\)/);
  assert.match(styles, /\.ecosystem-node\s*{[^}]*min-width:\s*var\(--node-w\);/s);
  assert.match(styles, /\.agent-panel\s*{[^}]*width:\s*var\(--panel-w\);[^}]*top:\s*50%;/s);
  assert.match(styles, /\.component-row span\s*{[^}]*font-size:\s*var\(--fs-sm\);/s);
  assert.match(
    styles,
    /\.writeback-arrow\s*{[^}]*right:\s*calc\(50% \+ var\(--panel-w\) \/ 2 \+ 3px\);[^}]*background:\s*var\(--inner-accent\);[^}]*visibility:\s*hidden;[^}]*opacity:\s*0;/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="accepted"\] \.writeback-arrow\s*{[^}]*visibility:\s*visible;[^}]*opacity:\s*1;[^}]*animation:\s*writeback-accepted/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="rejected"\] \.writeback-arrow\s*{[^}]*color:\s*var\(--reject-accent\);[^}]*animation:\s*writeback-rejected/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="rejected"\] \.writeback-arrow::after\s*{[^}]*display:\s*none;/s
  );
  assert.match(styles, /@keyframes writeback-accepted/);
  assert.match(styles, /@keyframes writeback-rejected/);
  assert.doesNotMatch(styles, /\.hero-system\[data-stage="retain"\] \.writeback-arrow/);
  assert.doesNotMatch(styles, /\.hero-system\[data-verdict="accepted"\] \.writeback-arrow/);
  assert.doesNotMatch(styles, /\.hero-system\[data-verdict="rejected"\] \.writeback-arrow/);
  assert.match(styles, /\.simulator-canvas::before\s*{[^}]*border:\s*1px dashed/s);
  assert.match(styles, /\.evolution-simulator\s*{[^}]*background:\s*transparent;[^}]*border:\s*0;/s);
  assert.match(styles, /\.hero-system\s*{[^}]*border:\s*0;/s);
  assert.doesNotMatch(styles, /--system-surface:\s*#(?:101a2e|111827);/);
  assert.match(styles, /\.simulator-canvas\s*{[^}]*aspect-ratio:\s*600 \/ 480;/s);
  assert.match(styles, /\.simulator-canvas\s*{[^}]*--panel-w:/s);
  assert.match(styles, /\.writeback-arrow\s*{[^}]*right:\s*calc\(50% \+ var\(--panel-w\)/s);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test("uses a neutral editorial shell and reserves semantic colors for the figure", () => {
  const index = readProjectFile("site/index.html");
  const styles = readProjectFile("site/styles.css");

  assert.match(index, /name="theme-color" content="#f5f6f7"/);
  assert.match(styles, /--paper:\s*#f5f6f7;/);
  assert.match(styles, /--paper-deep:\s*#eceff1;/);
  assert.match(styles, /--ink:\s*#172033;/);
  assert.match(styles, /--accent:\s*#b56d46;/);
  assert.match(styles, /body\s*{[^}]*background:\s*var\(--paper\);/s);
  assert.match(styles, /h1\s*{[^}]*font-size:\s*var\(--fs-display\);/s);
  assert.match(
    styles,
    /@media \(max-width:\s*680px\)\s*{[\s\S]*?h1\s*{[^}]*font-size:\s*var\(--fs-h1\);/
  );
  assert.match(styles, /h1 em\s*{[^}]*color:\s*inherit;/s);
  assert.match(
    styles,
    /\.hero\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*0\.9fr\) minmax\(0,\s*1\.1fr\);[^}]*align-items:\s*center;/s
  );
  assert.match(styles, /\.hero-copy\s*{[^}]*justify-content:\s*center;/s);
  // the ring survives on phones instead of collapsing into a list
  assert.match(styles, /@media \(max-width:\s*560px\)\s*{[\s\S]*?aspect-ratio:\s*600 \/ 700;/);
  assert.match(
    styles,
    /@media \(max-width:\s*560px\)[\s\S]*?\.loop-arcs\s*{[^}]*display:\s*block;[^}]*transform:\s*scale\(1\.68\);/s
  );
  assert.match(
    styles,
    /@media \(max-width:\s*560px\)[\s\S]*?\.simulator-canvas::before\s*{[^}]*display:\s*block;/s
  );
  assert.match(
    styles,
    /@media \(max-width:\s*560px\)[\s\S]*?\.governance-lines\s*{[^}]*display:\s*none;/s
  );
  assert.match(styles, /@media \(max-width:\s*320px\)/);
  assert.doesNotMatch(styles, /@media \(max-width:\s*360px\)/);
  assert.doesNotMatch(styles, /@media \(max-width:\s*520px\)/);
  const widths = [...styles.matchAll(/@media \(max-width:\s*(\d+)px\)/g)].map((m) => Number(m[1]));
  assert.deepEqual(widths, [...widths].sort((a, b) => b - a), "media queries must be ordered widest first");
  // figure geometry scales with its own container instead of hard-coded pixels
  assert.match(styles, /\.simulator-canvas\s*{[^}]*container-type:\s*inline-size;/s);
  assert.match(styles, /--panel-w:\s*30cqw;/);
  assert.match(styles, /@media \(max-width:\s*560px\)[\s\S]*?\.stage-nodes\s*{[^}]*border-radius:\s*50%;/);
  assert.match(styles, /\.button\s*{[^}]*border-radius:\s*var\(--r-sm\);/s);
  assert.doesNotMatch(styles, /--green:\s*#315fcb;|--amber:\s*#3db9a7;/);
  assert.doesNotMatch(styles, /prefers-color-scheme:\s*dark/);
  assert.match(
    styles,
    /\.contribute-panel \.loading-message\s*{[^}]*color:\s*color-mix\(in srgb, var\(--surface\) 72%, transparent\);/s
  );
});

test("routes every visual value through the design tokens", () => {
  const index = readProjectFile("site/index.html");
  const styles = readProjectFile("site/styles.css");

  // the sans stack is actually loaded, not just named
  assert.match(index, /fonts\.googleapis\.com\/css2\?family=Inter/);
  assert.match(styles, /--font-sans: Inter,/);

  const body = styles.slice(styles.indexOf("\n}", styles.indexOf(":root {")) + 2);

  // no raw hex or literal font/radius values escape the token layer
  assert.deepEqual(body.match(/#[0-9a-fA-F]{3,8}/g) ?? [], []);
  assert.deepEqual(body.match(/font-weight: (?!var)[^;]+/g) ?? [], []);
  assert.deepEqual(body.match(/letter-spacing: (?!var|0;)[^;]+/g) ?? [], []);

  // one scale, and nothing below 11px
  const sizes = new Set(
    (body.match(/font-size:\s*var\(--fs-[a-z0-9]+\)/g) ?? []).map((d) => d.trim())
  );
  assert.ok(sizes.size <= 11, `expected <= 11 font sizes, got ${sizes.size}`);
  assert.deepEqual(body.match(/font-size:\s*0\.[0-5]?[0-9]*rem/g) ?? [], []);

  // three meaningful hues only: blue is not one of them
  assert.doesNotMatch(styles, /49,\s*95,\s*203/);
  assert.match(styles, /--inner:/);
  assert.match(styles, /--outer:/);
  assert.match(styles, /--accent:/);

  // no leftovers from the retired figure generations
  for (const dead of [
    "evolution-figure", "execution-orbit", "component-orbit", "coevolution-bridge",
    "agent-hub", "process-rail", "component-code", "component-workflow", "legacy-orbit-signal",
  ]) {
    assert.ok(!styles.includes(dead), `dead selector still present: ${dead}`);
  }
});
