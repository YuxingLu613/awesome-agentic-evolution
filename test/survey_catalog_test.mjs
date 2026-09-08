import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { buildCatalog, generateCatalog } from "../scripts/build-survey-catalog.mjs";

const readme = `# Example
## Start Here
- [Survey](https://arxiv.org/abs/2401.00001) — Maps the field.
## Resource Map
### Memory
- [Memory A](https://github.com/example/memory) — [Paper](https://arxiv.org/abs/2401.00002).
  Retains feedback from trials.
  **Targets:** Memory, Skills.
### Tools
- [Tool B](https://github.com/example/tool) — Retains tested interfaces.
  **Targets:** Tools.
## Benchmarks and Evaluation
### Safety
- [Audit](https://arxiv.org/abs/2401.00003) — Tests poisoning.
## Contributing
- [Not a resource](https://example.com/contributing)
`;

test("exports every resource once, preserves attached sources, and excludes navigation", () => {
  const result = buildCatalog(readme);
  assert.equal(result.resources.length, 4);
  const memory = result.resources[1];
  assert.equal(memory.description, "Retains feedback from trials.");
  assert.deepEqual(memory.targets, ["Memory", "Skills"]);
  assert.equal(memory.sources.length, 2);
  assert.equal(memory.sourceProfile, "paper-linked");
  assert.equal(result.resources[2].sourceProfile, "repository-only");
  assert.equal(result.resources[3].section, "Benchmarks and Evaluation");
  assert.equal(memory.evidenceStatus, "not-extracted");
  assert.equal(memory.review, null);
});

test("rejects primary targets that disagree with the category", () => {
  assert.throws(() => buildCatalog(readme.replace("Memory, Skills.", "Skills, Memory.")), /primary target/i);
});

test("rejects unknown and repeated secondary labels", () => {
  for (const labels of ["Memory, Invalid.", "Memory, Memory."]) {
    assert.throws(() => buildCatalog(readme.replace("Memory, Skills.", labels)), /targets/i);
  }
});

test("rejects duplicate papers across different names, PDF URLs, and arXiv versions", () => {
  assert.throws(() => buildCatalog(readme.replace("2401.00003", "2401.00002v2").replace("abs/2401.00002v2", "pdf/2401.00002v2.pdf")), /duplicate source/i);
});

test("rejects duplicate normalized titles even with different links", () => {
  assert.throws(() => buildCatalog(readme.replace("Tool B", "  MEMORY A  ")), /duplicate title/i);
});

test("rejects one canonical URL listed under two different names", () => {
  assert.throws(() => buildCatalog(readme.replace("https://github.com/example/tool", "https://github.com/example/memory")), /duplicate source/i);
});

test("refuses a malformed resource bullet instead of silently dropping it", () => {
  assert.throws(() => buildCatalog(readme.replace("- [Tool B]", "- Tool B")), /malformed resource/i);
});

test("rejects missing targets and overlong descriptions without counting paper links", () => {
  assert.throws(() => buildCatalog(readme.replace("  **Targets:** Tools.\n", "")), /targets/i);
  assert.throws(() => buildCatalog(readme.replace("Retains tested interfaces.", "word ".repeat(31))), /30 words/i);
});

test("rejects orphaned review records and unsubstantiated verification status", () => {
  assert.throws(() => buildCatalog(readme, {"https://example.com/absent": {}}), /orphan/i);
  assert.throws(() => buildCatalog(readme, {"https://github.com/example/memory": {status: "verified"}}), /review/i);
});

test("exports recorded source checks without turning them into reproduction claims", () => {
  const review = {
    status: "source-checked", reviewedAt: "2026-09-08", reviewer: "Test curator",
    sources: [{url: "https://arxiv.org/abs/2401.00002", locator: "Abstract"}],
    artifact: "Experience", feedback: "Task result", retention: "Next trial",
    evaluation: "Author-reported trial comparison", limitations: ["Splits not extracted"],
    reproducibility: "not-run", safety: "not-assessed", conflictOfInterest: "not-assessed"
  };
  const resource = buildCatalog(readme, {"https://github.com/example/memory": review}).resources[1];
  assert.equal(resource.evidenceStatus, "source-checked");
  assert.equal(resource.review.reproducibility, "not-run");
});

test("writes deterministic exports and reports staleness without modifying files", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "survey-catalog-test-"));
  context.after(() => rm(root, {recursive: true, force: true}));
  await mkdir(path.join(root, "docs/survey"), {recursive: true});
  await writeFile(path.join(root, "README.md"), readme);
  await writeFile(path.join(root, "docs/survey/reviews.json"), "{}");
  await generateCatalog({root});
  const before = await readFile(path.join(root, "docs/survey/catalog.json"), "utf8");
  assert.equal(JSON.parse(before).resources.length, 4);
  await generateCatalog({root, check: true});
  await writeFile(path.join(root, "README.md"), readme.replace("Retains tested interfaces.", "Retains validated interfaces."));
  await assert.rejects(generateCatalog({root, check: true}), /stale survey export/i);
  assert.equal(await readFile(path.join(root, "docs/survey/catalog.json"), "utf8"), before);
  await generateCatalog({root});
  await generateCatalog({root, check: true});
});
