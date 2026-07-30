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

## Resource Map

### Parameters

- [Parameter Learner](https://example.com/parameter) — Updates model weights from held-out rewards.

### Memory

- [Memory Lab](https://example.com/memory) — Refines persistent experience memory from feedback.

### Knowledge

- No verified resources yet.

### Skills

- [Skill Lab](https://example.com/skill) — Builds reusable procedures from scored trajectories.

### Tools

- [Tool Lab](https://example.com/tool) — Retains executable interfaces that pass validation.

### Topology

- [Graph Search](https://example.com/graph) — Optimizes a multi-agent workflow graph.

### Co-evolution

- [Co-Learner](https://example.com/co) — Co-evolves a model and environment curriculum.

## Benchmarks and Evaluation

- [Benchmark](https://example.com/benchmark) — Evaluates agents.
`;

const CHANGELOG_FIXTURE = `
# Changelog

## 2026-07-28

### Field updates

- Added Memory Lab and its feedback-driven memory strategy.

### Repository changes

- Added the community dashboard.
`;

const ROADMAP_FIXTURE = `
# Roadmap

## Phase 1 — Community Foundation

Build accountable governance and a recurring public review process.

- Recruit founding curators.

## Phase 2 — Survey-Ready Evidence

Turn curated links into a versioned, reviewable evidence base.

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

  assert.equal(snapshot.summary.totalResources, 6);
  assert.equal(snapshot.activity.status, "unavailable");
  assert.deepEqual(
    snapshot.landscape.map(({ id }) => id),
    [
      "parameters",
      "memory",
      "knowledge",
      "skills",
      "tools",
      "topology",
      "co-evolution"
    ]
  );
  assert.ok(snapshot.landscape.find(({ id }) => id === "parameters").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "memory").count >= 1);
  assert.equal(snapshot.landscape.find(({ id }) => id === "knowledge").count, 0);
  assert.ok(snapshot.landscape.find(({ id }) => id === "skills").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "tools").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "topology").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "co-evolution").count >= 1);
  assert.match(snapshot.recent[0].text, /Memory Lab/);
  assert.doesNotMatch(snapshot.recent.map(({ text }) => text).join(" "), /dashboard/);
  assert.equal(snapshot.roadmap.length, 2);
  assert.equal(
    snapshot.roadmap[0].summary,
    "Build accountable governance and a recurring public review process."
  );
});

test("keeps wrapped resource descriptions attached to their own bullets", () => {
  const readme = `
## Resource Map

### Parameters

- [Self-Rewarding Language Models](https://example.com/self-rewarding) — Uses the
  model as both instruction follower and judge during iterative training.
- [Agent0](https://example.com/agent0)
  — Co-evolves a tool-aware curriculum and executor.
  **Targets:** Tools, Co-evolution.
- [MemSkill](https://example.com/memskill)
  — Evolves structured routines for memory extraction and consolidation.
  **Targets:** Memory, Skills.

## Benchmarks and Evaluation
`;

  const snapshot = buildRepositorySnapshot({
    readme,
    changelog: CHANGELOG_FIXTURE,
    roadmap: ROADMAP_FIXTURE,
    github: null
  });
  const resources = snapshot.landscape.flatMap(({ highlights }) => highlights);
  const selfRewarding = resources.find(({ title }) => title === "Self-Rewarding Language Models");

  assert.match(selfRewarding.description, /instruction follower and judge/);
  assert.doesNotMatch(selfRewarding.description, /Co-evolves|memory extraction/);
  assert.ok(snapshot.landscape.find(({ id }) => id === "tools").count >= 1);
  assert.ok(snapshot.landscape.find(({ id }) => id === "skills").count >= 1);
});

test("deduplicates titles and reserves scarce highlight slots for category-specific work", () => {
  const readme = `
## Resource Map

### Parameters

- [Param A](https://example.com/param-a) — Updates parameters.
- [Param B](https://example.com/param-b) — Updates parameters.
- [Param C](https://example.com/param-c) — Updates parameters.

### Memory

- [Memory A](https://example.com/memory-a) — Updates memory.
- [Memory B](https://example.com/memory-b) — Updates memory.
- [Memory C](https://example.com/memory-c) — Updates memory.

### Skills

- [Skill A](https://example.com/skill-a) — Updates skills.
- [Skill B](https://example.com/skill-b) — Updates skills.
- [Skill C](https://example.com/skill-c) — Updates skills.

### Topology

- [AgentSquare](https://example.com/agentsquare) — Searches modular agent topology.
  **Targets:** Parameters, Memory, Skills, Topology.
- [Darwin Gödel Machine](https://github.com/example/dgm) — Rewrites agent scaffolding.
- [Darwin Gödel Machine](https://arxiv.org/abs/1234.5678) — Paper for the same system.

### Co-evolution

- [Co A](https://example.com/co-a) — Co-evolves an agent and environment.

## Benchmarks and Evaluation
`;

  const snapshot = buildRepositorySnapshot({
    readme,
    changelog: CHANGELOG_FIXTURE,
    roadmap: ROADMAP_FIXTURE,
    github: null
  });
  const highlights = snapshot.landscape.flatMap(({ highlights }) => highlights);

  assert.equal(
    snapshot.landscape.find(({ id }) => id === "topology").count,
    2,
    "duplicate titles should count once within a category"
  );
  assert.equal(
    highlights.filter(({ title }) => title === "Darwin Gödel Machine").length,
    1,
    "duplicate source links should collapse to one highlight"
  );
  assert.equal(
    highlights.filter(({ title }) => title === "AgentSquare").length,
    1,
    "multi-label resources should not displace category-specific highlights"
  );
});

test("leaves highlight slots empty instead of repeating a multi-target resource", () => {
  const readme = `
## Resource Map

### Skills

- [Voyager](https://example.com/voyager) — Grows a reusable skill library.
  **Targets:** Skills, Tools, Co-evolution.

## Benchmarks and Evaluation
`;

  const snapshot = buildRepositorySnapshot({
    readme,
    changelog: CHANGELOG_FIXTURE,
    roadmap: ROADMAP_FIXTURE,
    github: null
  });
  const titles = snapshot.landscape.flatMap(({ highlights }) =>
    highlights.map(({ title }) => title)
  );

  assert.deepEqual(titles, ["Voyager"]);
});

test("uses wrapped phase summaries instead of gates or operating cadence bullets", () => {
  const roadmap = `
# Roadmap

## Phase 3 — Living Survey

Convert the reviewed evidence base into a manuscript only after the public
maturity gates have been met.

Start a manuscript only when:

- 100–150 core research entries have been verified;

## Phase 4 — Conference Tutorial

Develop and validate a modular tutorial with reproducible demonstrations.

- Prepare foundations, taxonomy, evaluation, and safety modules.

## Operating Cadence

- Daily: automated discovery and deduplication.
`;

  const snapshot = buildRepositorySnapshot({
    readme: README_FIXTURE,
    changelog: CHANGELOG_FIXTURE,
    roadmap,
    github: null
  });

  assert.equal(
    snapshot.roadmap[0].summary,
    "Convert the reviewed evidence base into a manuscript only after the public maturity gates have been met."
  );
  assert.equal(
    snapshot.roadmap[1].summary,
    "Develop and validate a modular tutorial with reproducible demonstrations."
  );
  assert.doesNotMatch(
    snapshot.roadmap.map(({ summary }) => summary).join(" "),
    /100–150|Daily:/
  );
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

test("separates manuscript gates from work items and keeps coverage-gap notes", () => {
  const readme = `
## Resource Map

### Parameters

- [STaR](https://arxiv.org/abs/2203.14465) — Iterative rationale training.
  **Targets:** Parameters.

### Knowledge

No current entry cleanly demonstrates persistent knowledge updates.
This is a documented coverage gap.

## Benchmarks
`;
  const roadmap = `
## Phase 1 — Foundation

Build the base.

- Publish the call.

## Phase 2 — Survey

Write only after gates are met.

Start a manuscript only when:

- entries have been verified;
- the taxonomy has remained stable.
`;
  const snapshot = buildRepositorySnapshot({
    readme,
    changelog: "### Field updates\n\n- Entry one.\n",
    roadmap,
    github: null,
    generatedAt: "2026-01-01T00:00:00.000Z"
  });

  const knowledge = snapshot.landscape.find((target) => target.id === "knowledge");
  assert.equal(knowledge.count, 0);
  assert.match(knowledge.note, /documented coverage gap/);

  const parameters = snapshot.landscape.find((target) => target.id === "parameters");
  assert.equal(parameters.count, 1);
  assert.equal(parameters.note, undefined);

  const [phase1, phase2] = snapshot.roadmap;
  assert.deepEqual(phase1.items, ["Publish the call."]);
  assert.deepEqual(phase1.gates, []);
  assert.deepEqual(phase2.items, []);
  assert.deepEqual(phase2.gates, [
    "entries have been verified;",
    "the taxonomy has remained stable."
  ]);
});
