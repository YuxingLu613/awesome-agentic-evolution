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
  assert.equal((index.match(/class="loop-arc"/g) ?? []).length, 4);
  assert.equal((index.match(/class="transition-arc" data-transition=/g) ?? []).length, 4);
  assert.equal((index.match(/class="transition-arc"[^>]*pathLength="1"/g) ?? []).length, 4);
  assert.match(index, /data-transition="act-assess"/);
  assert.match(index, /data-transition="assess-revise"/);
  assert.match(index, /data-transition="revise-retain"/);
  assert.match(index, /data-transition="retain-act"/);
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
  assert.match(index, /class="writeback-reject-icon" viewBox="0 0 32 28"/);
  assert.match(
    index,
    /d="M6 22 H20 C25\.5 22 28 18\.5 28 14 C28 9\.5 25\.5 6 20 6 H6"/
  );
  assert.match(index, /d="M10 2 L6 6 L10 10"/);
  assert.doesNotMatch(index, /↶/);
  assert.match(index, /viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(index, /preserveAspectRatio="none"/);
  assert.match(
    index,
    /id="loop-arrow" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" overflow="visible"/
  );
  assert.match(
    index,
    /id="loop-arrow-active" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" overflow="visible"/
  );
  assert.equal((index.match(/<path d="M0,0 L0,10 L9,5 z"><\/path>/g) ?? []).length, 2);
  assert.doesNotMatch(index, /M0,0 L0,8 L7\.5,4 z/);
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
  assert.match(app, /let visualPhase = "stage"/);
  assert.match(
    app,
    /const transitionArcs = \[\.\.\.root\.querySelectorAll\("\[data-transition\]"\)\]/
  );
  assert.match(
    app,
    /node\.classList\.toggle\("is-active", active && visualPhase === "stage"\)/
  );
  assert.match(
    app,
    /const arriving = node\.dataset\.stage === nextStage\.id && visualPhase === "transition";/
  );
  assert.match(app, /node\.classList\.toggle\("is-arriving", arriving\)/);
  assert.match(app, /const pendingState = advanceEvolutionState\(state\);/);
  assert.match(app, /root\.dataset\.nextStage = pendingState\.stage;/);
  assert.match(app, /root\.dataset\.nextVerdict = pendingState\.verdict \?\? "";/);
  assert.match(
    app,
    /arc\.classList\.toggle\(\s*"is-transition-active",\s*visualPhase === "transition" && arc\.dataset\.transition === transitionId\s*\)/s
  );
  assert.match(app, /window\.setTimeout\(advanceVisualPhase, delay\)/);
  assert.doesNotMatch(app, /presetSelect|PRESETS|createEvolutionState\([^)]/);
  assert.doesNotMatch(app, /selectedTargetsCaption|#selected-targets|#coevolution-caption/);
  assert.match(app, /agentVerdict\.hidden/);
  assert.match(app, /event\.key === "Escape"/);
  assert.match(styles, /\.evolution-simulator/);
  assert.match(styles, /\.agent-panel/);
  assert.match(styles, /\.component-row\.is-candidate/);
  assert.match(styles, /\.component-row\.is-written/);
  assert.match(styles, /\.component-row\.is-rejected/);
  assert.match(styles, /\.agent-verdict\.is-accepted/);
  assert.match(styles, /\.agent-verdict\.is-rejected/);
  assert.match(styles, /\.loop-stage\.is-active/);
  assert.match(
    styles,
    /\.loop-stage\.is-active\s*{[^}]*color:\s*white;[^}]*background:\s*var\(--stage-active\);[^}]*transform:\s*translate\(-50%, -50%\) scale\(1\.08\);/s
  );
  assert.match(
    styles,
    /\.loop-stage\.is-active strong\s*{[^}]*font-weight:\s*var\(--fw-black\);/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="accepted"\]\s*{[^}]*--retain-accent:\s*var\(--accept-accent\);/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="rejected"\]\s*{[^}]*--retain-accent:\s*var\(--reject-accent\);/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-visual-phase="stage"\] \.stage-retain\s*{[^}]*background:\s*var\(--retain-accent\);[^}]*border-color:\s*var\(--retain-accent\);/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-visual-phase="stage"\] #evolution-stage\s*{[^}]*color:\s*var\(--retain-accent\);/s
  );
  assert.match(
    styles,
    /\.transition-arc\.is-transition-active\s*{[^}]*animation:\s*transition-flow 1500ms linear both;/s
  );
  assert.match(
    styles,
    /\.loop-arcs #loop-arrow-active path\s*{[^}]*fill:\s*var\(--stage-tone\);[^}]*opacity:\s*0;[^}]*transform-box:\s*fill-box;[^}]*transform-origin:\s*100% 50%;/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-visual-phase="transition"\] \.loop-arcs #loop-arrow-active path\s*{[^}]*animation:\s*transition-arrow-arrival 1500ms linear both;/s
  );
  assert.match(
    styles,
    /@keyframes transition-arrow-arrival\s*{[\s\S]*?20%\s*{[^}]*fill:\s*var\(--stage-tone\);[^}]*opacity:\s*1;[^}]*transform:\s*scale\(1\);[\s\S]*?34%\s*{[^}]*fill:\s*var\(--stage-active\);[^}]*opacity:\s*1;[^}]*transform:\s*scale\(1\.32\);[\s\S]*?60%\s*{[^}]*fill:\s*var\(--stage-active\);[^}]*opacity:\s*1;[^}]*transform:\s*scale\(1\.32\);[\s\S]*?76%\s*{[^}]*fill:\s*color-mix\(in srgb, var\(--stage-active\) 68%, var\(--stage-tone\)\);[^}]*transform:\s*scale\(1\.22\);[\s\S]*?92%\s*{[^}]*fill:\s*color-mix\(in srgb, var\(--stage-active\) 24%, var\(--stage-tone\)\);[^}]*opacity:\s*0\.5;[^}]*transform:\s*scale\(1\.06\);[\s\S]*?100%\s*{[^}]*fill:\s*var\(--stage-tone\);[^}]*opacity:\s*0;[^}]*transform:\s*scale\(1\);/s
  );
  assert.match(
    styles,
    /@keyframes transition-flow\s*{[\s\S]*?53%\s*{[^}]*stroke-dashoffset:\s*0;[\s\S]*?60%\s*{[^}]*stroke-dashoffset:\s*0;[\s\S]*?76%\s*{[^}]*stroke:\s*color-mix\(in srgb, var\(--stage-active\) 68%, var\(--stage-tone\)\);[^}]*stroke-width:\s*2\.7;[\s\S]*?92%\s*{[^}]*stroke:\s*color-mix\(in srgb, var\(--stage-active\) 24%, var\(--stage-tone\)\);[^}]*stroke-width:\s*1\.8;[\s\S]*?100%\s*{[^}]*stroke-dashoffset:\s*-1;[^}]*stroke:\s*var\(--stage-tone\);[^}]*stroke-width:\s*1\.4;[^}]*opacity:\s*0;/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-next-stage="retain"\]\[data-next-verdict="accepted"\]\s*{[^}]*--arrival-active:\s*var\(--accept-accent\);/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-next-stage="retain"\]\[data-next-verdict="rejected"\]\s*{[^}]*--arrival-active:\s*var\(--reject-accent\);/s
  );
  assert.match(
    styles,
    /\.loop-stage\.is-arriving\s*{[^}]*animation:\s*stage-approach 1500ms linear both;/s
  );
  assert.match(
    styles,
    /@keyframes stage-approach\s*{[\s\S]*?48%\s*{[^}]*background:\s*var\(--sim-stage\);[\s\S]*?76%\s*{[^}]*background:\s*color-mix\(in srgb, var\(--arrival-active\) 10%, var\(--sim-stage\)\);[\s\S]*?100%\s*{[^}]*background:\s*color-mix\(in srgb, var\(--arrival-active\) 28%, var\(--sim-stage\)\);/s
  );
  assert.match(
    styles,
    /\.loop-stage\.is-active\s*{[^}]*animation:\s*stage-arrival 520ms cubic-bezier\(0\.22, 1, 0\.36, 1\) both;/s
  );
  assert.match(styles, /@keyframes stage-arrival\s*{/);
  assert.match(
    styles,
    /@keyframes stage-arrival\s*{[\s\S]*?0%\s*{[^}]*background:\s*color-mix\(in srgb, var\(--node-active\) 28%, var\(--sim-stage\)\);[\s\S]*?100%\s*{[^}]*background:\s*var\(--node-active\);/s
  );
  assert.doesNotMatch(
    styles,
    /\.transition-arc\.is-transition-active\s*{[^}]*filter:\s*drop-shadow/s
  );
  assert.doesNotMatch(
    styles,
    /\.transition-arc\.is-transition-active\s*{[^}]*animation:[^;}]*infinite/s
  );
  assert.match(styles, /@keyframes transition-flow/);
  assert.match(styles, /\.ecosystem-node\.is-governing/);
  assert.match(styles, /\.ecosystem-node\.is-coevolving/);
  assert.match(styles, /@keyframes target-ripple/);
  assert.match(styles, /@keyframes accepted-write/);
  assert.match(styles, /@keyframes rejected-return/);
  assert.match(
    styles,
    /\.writeback-reject-icon\s*{[^}]*display:\s*none;[^}]*width:\s*32px;[^}]*height:\s*28px;[^}]*fill:\s*none;[^}]*stroke:\s*currentColor;[^}]*stroke-linecap:\s*round;[^}]*stroke-linejoin:\s*round;/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="rejected"\] \.writeback-reject-icon\s*{[^}]*display:\s*block;/s
  );
  assert.match(
    styles,
    /@keyframes writeback-rejected\s*{[\s\S]*?0%\s*{[^}]*transform:\s*translateY\(-50%\) scale\(0\.72\);[\s\S]*?100%\s*{[^}]*transform:\s*translateY\(-50%\) scale\(1\);/s
  );
  assert.doesNotMatch(app, /writebackArrow\.textContent/);
  assert.doesNotMatch(styles, /@keyframes orbit-signal/);
  assert.doesNotMatch(styles, /@keyframes coevolution-up/);
  assert.doesNotMatch(styles, /@keyframes coevolution-down/);
  assert.match(styles, /--system-surface:\s*var\(--surface\);/);
  assert.match(styles, /--inner-accent:\s*var\(--inner\);/);
  assert.match(styles, /--outer-accent:\s*var\(--outer\);/);
  assert.match(styles, /--accept-accent:\s*var\(--accept\);/);
  assert.match(styles, /--reject-accent:\s*var\(--reject\);/);
  assert.match(
    styles,
    /\.loop-arcs > \.loop-arc\s*{[^}]*marker-mid:\s*url\("#loop-arrow"\);[^}]*stroke-width:\s*1\.4;/s
  );
  assert.match(
    styles,
    /\.loop-arcs > \.transition-arc\s*{[^}]*stroke-dasharray:\s*1;[^}]*stroke-dashoffset:\s*1;[^}]*opacity:\s*0;/s
  );
  assert.doesNotMatch(styles, /\.loop-arcs path\s*{/);
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
  assert.match(styles, /\.agent-panel\s*{[^}]*padding:\s*0\.44rem 0\.58rem;/s);
  assert.match(styles, /\.agent-panel header\s*{[^}]*margin-bottom:\s*0\.28rem;/s);
  assert.match(styles, /\.component-list\s*{[^}]*gap:\s*2px;/s);
  assert.match(styles, /\.component-row\s*{[^}]*min-height:\s*26px;/s);
  assert.match(styles, /\.component-row span\s*{[^}]*font-size:\s*var\(--fs-sm\);/s);
  assert.match(
    styles,
    /\.writeback-arrow\s*{[^}]*right:\s*calc\(50% \+ var\(--panel-w\) \/ 2 \+ 3px\);[^}]*background:\s*var\(--inner-accent\);[^}]*visibility:\s*hidden;[^}]*opacity:\s*0;/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-visual-phase="stage"\]\[data-verdict="accepted"\] \.writeback-arrow\s*{[^}]*visibility:\s*visible;[^}]*opacity:\s*1;[^}]*animation:\s*writeback-accepted/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-verdict="rejected"\] \.writeback-arrow\s*{[^}]*width:\s*32px;[^}]*height:\s*28px;[^}]*color:\s*var\(--reject-accent\);[^}]*background:\s*transparent;/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-visual-phase="stage"\]\[data-verdict="rejected"\] \.writeback-arrow\s*{[^}]*visibility:\s*visible;[^}]*opacity:\s*1;[^}]*animation:\s*writeback-rejected/s
  );
  assert.match(
    styles,
    /\.hero-system\[data-stage="retain"\]\[data-visual-phase="transition"\]\[data-verdict\] \.writeback-arrow\s*{[^}]*visibility:\s*visible;[^}]*opacity:\s*0;[^}]*animation:\s*none;/s
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
  assert.match(styles, /\.hero-system\s*{[^}]*border:\s*1px solid var\(--line\);/s);
  assert.doesNotMatch(styles, /--system-surface:\s*#(?:101a2e|111827);/);
  assert.match(styles, /\.simulator-canvas\s*{[^}]*aspect-ratio:\s*600 \/ 480;/s);
  assert.match(styles, /\.simulator-canvas\s*{[^}]*--panel-w:/s);
  assert.match(styles, /\.writeback-arrow\s*{[^}]*right:\s*calc\(50% \+ var\(--panel-w\)/s);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test("uses the Graphite Plum living-system shell and reserves semantic colors for the figure", () => {
  const index = readProjectFile("site/index.html");
  const styles = readProjectFile("site/styles.css");

  assert.match(index, /name="theme-color" content="#f5f4f7"/);
  assert.match(
    index,
    /<span class="brand-mark" aria-hidden="true">\s*<svg class="brand-evolution-loops" viewBox="0 0 52 52">[\s\S]*?class="brand-loop brand-loop-inner"[\s\S]*?class="brand-loop-signal brand-loop-signal-inner"[\s\S]*?class="brand-loop brand-loop-outer"[\s\S]*?class="brand-loop-signal brand-loop-signal-outer"[\s\S]*?class="brand-agent-core"[\s\S]*?<\/svg>\s*<\/span>/s
  );
  assert.match(
    index,
    /<span class="brand-copy">\s*<strong>Agentic Evolution<\/strong>\s*<small>Field guide to evolving agents<\/small>/s
  );
  assert.match(index, /<div class="hero-statement">[\s\S]*?<div class="hero-support">/s);
  assert.doesNotMatch(index, /class="brand-mark"[^>]*>AE</);
  assert.doesNotMatch(index, /brand-core/);
  assert.match(styles, /--paper:\s*#f5f4f7;/);
  assert.match(styles, /--paper-deep:\s*#ece9ef;/);
  assert.match(styles, /--ink:\s*#202027;/);
  assert.match(styles, /--ink-soft:\s*#696671;/);
  assert.match(styles, /--accent:\s*#854f7d;/);
  assert.match(styles, /--inner:\s*#6659c7;/);
  assert.match(styles, /--outer:\s*#39766c;/);
  assert.match(styles, /--fs-display:\s*clamp\(2\.85rem,\s*5\.2vw,\s*4\.8rem\);/);
  assert.doesNotMatch(styles, /#(?:b56d46|d39b7b|f4e7df)/i);
  assert.match(
    styles,
    /\.brand-mark\s*{[^}]*position:\s*relative;[^}]*width:\s*52px;[^}]*color:\s*var\(--accent\);/s
  );
  assert.match(
    styles,
    /\.brand-evolution-loops\s*{[^}]*display:\s*block;[^}]*width:\s*100%;[^}]*height:\s*100%;/s
  );
  assert.match(
    styles,
    /\.brand-loop-inner\s*{[^}]*opacity:\s*0\.42;/s
  );
  assert.match(
    styles,
    /\.brand-loop-outer\s*{[^}]*opacity:\s*0\.22;/s
  );
  assert.match(
    styles,
    /\.brand-agent-core\s*{[^}]*fill:\s*currentColor;/s
  );
  assert.equal((index.match(/class="brand-stage-tick"/g) ?? []).length, 4);
  assert.doesNotMatch(index, /brand-version-/);
  assert.match(
    styles,
    /\.brand strong\s*{[^}]*font-family:\s*var\(--font-sans\);[^}]*font-weight:\s*var\(--fw-bold\);/s
  );
  assert.match(styles, /\.contribute-panel\s*{[^}]*background:\s*var\(--ink\);/s);
  assert.match(styles, /\.target-card\s*{[^}]*background:\s*var\(--surface\);/s);
  assert.match(styles, /body\s*{[^}]*background:\s*var\(--paper\);/s);
  assert.match(styles, /h1\s*{[^}]*font-size:\s*var\(--fs-display\);/s);
  assert.match(
    styles,
    /@media \(max-width:\s*680px\)\s*{[\s\S]*?h1\s*{[^}]*font-size:\s*var\(--fs-h1\);/
  );
  assert.match(styles, /h1\s*{[^}]*line-height:\s*1\.08;/s);
  assert.match(styles, /h1 em\s*{[^}]*color:\s*var\(--accent\);/s);
  assert.match(
    styles,
    /\.hero\s*{[^}]*grid-template-columns:\s*1fr;[^}]*gap:\s*0;/s
  );
  assert.match(
    styles,
    /\.hero-copy\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.15fr\) minmax\(320px,\s*0\.85fr\);[^}]*align-items:\s*start;/s
  );
  assert.match(styles, /\.hero-system\s*{[^}]*box-shadow:\s*none;/s);
  assert.match(styles, /\.simulator-canvas\s*{[^}]*max-width:\s*720px;/s);
  assert.match(styles, /\.metrics-section\s*{[^}]*border-radius:\s*0;[^}]*box-shadow:\s*none;/s);
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

  // the plum brand stays distinct from the inner and outer evolution semantics
  assert.match(styles, /--inner:\s*#6659c7;/);
  assert.match(styles, /--accent:\s*#854f7d;/);
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

test("animates inner evolution each cycle and co-evolution at one seventh speed", () => {
  const styles = readProjectFile("site/styles.css");

  assert.match(
    styles,
    /\.brand-loop-signal-inner\s*{[^}]*animation:\s*brand-inner-cycle 3200ms linear infinite;/s
  );
  assert.match(
    styles,
    /\.brand-loop-signal-outer\s*{[^}]*animation:\s*brand-outer-cycle 22400ms linear infinite;/s
  );
  assert.match(styles, /@keyframes brand-inner-cycle/);
  assert.match(styles, /@keyframes brand-outer-cycle/);
  assert.doesNotMatch(styles, /brand-version-rise|brand-signal-run|brand-branch-breathe|brand-return-breathe|brand-node-pulse/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.brand-loop-signal\s*{[^}]*animation:\s*none;/s
  );
});
