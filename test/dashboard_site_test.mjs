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

test("presents a concise animated agent evolution diagram", () => {
  const index = readProjectFile("site/index.html");
  const app = readProjectFile("site/app.js");
  const styles = readProjectFile("site/styles.css");

  assert.match(index, /id="evolution-status"[^>]*aria-live="polite"/);
  assert.match(index, /id="loop-control"[^>]*aria-pressed="false"/);
  assert.match(index, /class="loop-diagram"/);
  assert.match(index, /class="agent-core"/);
  assert.equal((index.match(/data-stage=/g) ?? []).length, 5);
  assert.doesNotMatch(index, /agent-components|mutation-card|agent-score/);
  assert.match(app, /const LOOP_INTERVAL_MS = 800;/);
  assert.match(styles, /\.loop-orbit/);
  assert.match(styles, /min-height:\s*560px;/);
  assert.match(styles, /width:\s*min\(100%, 300px\);/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});
