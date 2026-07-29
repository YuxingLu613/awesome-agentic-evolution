import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDashboardSite,
  buildRepositorySnapshot,
  normalizeGitHubActivity
} from "../scripts/build-dashboard-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const README_FIXTURE = `
# Awesome Agentic Evolution

## Frameworks and Repositories

### Whole-Agent and Code Evolution

- [Darwin Machine](https://example.com/darwin) — Rewrites agent code and validates descendants.

### Workflow and Architecture Evolution

- [Graph Search](https://example.com/graph) — Optimizes a multi-agent workflow graph.

### Memory, Experience, and Skill Evolution

- [Memory Lab](https://example.com/memory) — Refines persistent memory skills from feedback.

## Research

### Model, Curriculum, and Skill Co-Evolution

- [Co-Learner](https://example.com/co) — Co-evolves a model and environment curriculum.

## Benchmarks and Evaluation

- [Benchmark](https://example.com/benchmark) — Evaluates agents.
`;

const CHANGELOG_FIXTURE = `
# Changelog

## 2026-07-28

- Added Memory Lab and its feedback-driven memory strategy.
- Added the community dashboard.
`;

const ROADMAP_FIXTURE = `
# Roadmap

## Phase 1 — Community Foundation

- Recruit founding curators.

## Phase 2 — Survey-Ready Evidence

- Introduce a structured resource catalog.
`;

test("builds the dashboard research landscape from repository Markdown", () => {
  const snapshot = buildRepositorySnapshot({
    readme: README_FIXTURE,
    changelog: CHANGELOG_FIXTURE,
    roadmap: ROADMAP_FIXTURE,
    github: null,
    generatedAt: "2026-07-28T20:00:00.000Z"
  });

  assert.equal(snapshot.summary.totalResources, 4);
  assert.equal(snapshot.activity.status, "unavailable");
  assert.deepEqual(
    snapshot.landscape.map(({ id }) => id),
    ["model", "memory", "skill", "workflow", "environment", "code", "co-evolution"]
  );
  assert.ok(snapshot.landscape.find(({ id }) => id === "memory").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "workflow").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "code").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "co-evolution").count >= 1);
  assert.match(snapshot.recent[0].text, /Memory Lab/);
  assert.equal(snapshot.roadmap.length, 2);
});

test("normalizes GitHub repository activity without counting pull requests as issues", () => {
  const activity = normalizeGitHubActivity({
    repository: {
      stargazers_count: 42,
      forks_count: 7,
      open_issues_count: 9,
      updated_at: "2026-07-28T19:00:00Z"
    },
    pullRequests: [{ number: 2 }, { number: 3 }],
    contributors: [{ login: "curator-a" }, { login: "curator-b" }],
    opportunities: [
      {
        number: 11,
        title: "Curate memory evolution",
        html_url: "https://github.com/example/repo/issues/11",
        labels: [{ name: "good first issue" }]
      }
    ]
  });

  assert.deepEqual(activity, {
    status: "available",
    stars: 42,
    forks: 7,
    contributors: 2,
    openIssues: 7,
    openPullRequests: 2,
    updatedAt: "2026-07-28T19:00:00Z",
    opportunities: [
      {
        number: 11,
        title: "Curate memory evolution",
        url: "https://github.com/example/repo/issues/11",
        labels: ["good first issue"]
      }
    ]
  });
});

test("builds a self-contained GitHub Pages artifact without invoking Jekyll", async (context) => {
  const output = await mkdtemp(path.join(tmpdir(), "agentic-evolution-pages-"));
  context.after(() => rm(output, { recursive: true, force: true }));

  const snapshot = await buildDashboardSite({
    root: ROOT,
    outputDirectory: output,
    skipGitHub: true
  });
  const [index, data, noJekyll] = await Promise.all([
    readFile(path.join(output, "index.html"), "utf8"),
    readFile(path.join(output, "data", "dashboard.json"), "utf8"),
    readFile(path.join(output, ".nojekyll"), "utf8")
  ]);

  assert.match(index, /Awesome Agentic Evolution/);
  assert.equal(JSON.parse(data).summary.totalResources, snapshot.summary.totalResources);
  assert.equal(noJekyll, "");
});
