import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SECTIONS = ["Start Here", "Resource Map", "Benchmarks and Evaluation", "Articles and Technical Posts", "Related Awesome Lists"];
const TARGETS = ["Parameters", "Memory", "Knowledge", "Skills", "Tools", "Topology", "Co-evolution"];
const LINKS = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

function sourceKey(value) {
  const url = new URL(value);
  const arxiv = value.match(/(?:arxiv\.org\/(?:abs|pdf|html)\/|doi\.org\/10\.48550\/arXiv\.)(\d{4}\.\d{4,5})/i);
  if (arxiv) return `arxiv:${arxiv[1]}`;
  url.hash = "";
  url.pathname = url.pathname.replace(/\/$/, "");
  if (url.hostname === "github.com") {
    const parts = url.pathname.split("/");
    parts[1] = parts[1]?.toLowerCase();
    parts[2] = parts[2]?.replace(/\.git$/, "").toLowerCase();
    url.pathname = parts.join("/");
  }
  return url.toString().replace(/\/$/, "");
}

function validateReview(review, id) {
  const fields = ["reviewer", "artifact", "feedback", "retention", "evaluation", "reproducibility", "safety", "conflictOfInterest"];
  if (!["source-checked", "needs-review", "evidence-reviewed"].includes(review.status)
      || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt ?? "")
      || fields.some((key) => typeof review[key] !== "string" || !review[key].trim())
      || !Array.isArray(review.sources) || !review.sources.length
      || !Array.isArray(review.limitations) || !review.limitations.length) {
    throw new Error(`Incomplete review for ${id}`);
  }
  for (const source of review.sources) {
    if (!/^https?:\/\//.test(source.url) || !source.locator?.trim()) throw new Error(`Missing review source locator: ${id}`);
  }
  if (review.status === "evidence-reviewed") {
    const comparisonFields = ["backbone", "tasksAndSplits", "baseline", "updateBudget", "metrics", "uncertainty", "transferAndForgetting"];
    if (!/^https:\/\/github\.com\//.test(review.humanReviewUrl ?? "")
        || comparisonFields.some((key) => !review.comparison?.[key]?.trim())) {
      throw new Error(`Evidence-reviewed record needs comparison fields and a public human review: ${id}`);
    }
  }
}

export function buildCatalog(readme, reviews = {}) {
  const blocks = [];
  let section = "", category = null, current = null;
  for (const line of readme.split("\n")) {
    if (line.startsWith("## ")) { section = line.slice(3).trim(); category = null; current = null; }
    else if (line.startsWith("### ")) { category = line.slice(4).trim(); current = null; }
    else if (!SECTIONS.includes(section)) continue;
    else if (line.startsWith("- [")) {
      current = { section, category, text: line };
      blocks.push(current);
    } else if (/^-\s/.test(line)) throw new Error(`Malformed resource: ${line}`);
    else if (current && /^\s{2,}\S/.test(line)) current.text += ` ${line.trim()}`;
    else current = null;
  }
  const titles = new Set(), sources = new Map();
  const resources = blocks.map(({section, category, text}) => {
    const linked = [...text.matchAll(LINKS)].map((m) => ({label: m[1], url: m[2]}));
    if (!/^- \[[^\]]+\]\(https?:\/\/[^)]+\)/.test(text)) throw new Error(`Malformed resource: ${text}`);
    const title = linked[0].label.trim().replace(/\s+/g, " ");
    const titleKey = title.normalize("NFKC").toLowerCase();
    if (titles.has(titleKey)) throw new Error(`Duplicate title: ${title}`);
    titles.add(titleKey);
    const id = linked[0].url;
    for (const source of linked) {
      const key = sourceKey(source.url);
      if (sources.has(key) && sources.get(key) !== title) throw new Error(`Duplicate source: ${source.url} (${title})`);
      sources.set(key, title);
    }
    const metadata = text.match(/\*\*Targets:\*\*\s*(.+?)\s*$/);
    const targets = metadata ? metadata[1].replace(/\.$/, "").split(/,\s*/) : [];
    if (section === "Resource Map") {
      if (!targets.length || targets.some(t => !TARGETS.includes(t)) || new Set(targets).size !== targets.length) throw new Error(`Invalid targets: ${title}`);
      if (targets[0] !== category) throw new Error(`Inconsistent primary target: ${title}`);
    } else if (targets.length) throw new Error(`Targets belong in the Resource Map: ${title}`);
    const description = text.split(/\*\*Targets:\*\*/)[0].replace(LINKS, "").replace(/^\s*-\s*[—-]?\s*/, "").replace(/^[.·\s]+/, "").trim();
    if (section !== "Related Awesome Lists" && (!description || description.split(/\s+/).length > 30)) throw new Error(`Description must contain 1–30 words: ${title}`);
    const paperLinked = linked.some(s => s.label === "Paper" || /(?:arxiv\.org|aclanthology\.org|openreview\.net)/.test(new URL(s.url).hostname) || /\.pdf(?:$|\?)/.test(s.url));
    const sourceProfile = paperLinked ? "paper-linked" : linked.some(s => new URL(s.url).hostname === "github.com") ? "repository-only" : "web-only";
    const review = reviews[id] ?? null;
    if (review) validateReview(review, id);
    return { id, title, section, category, primaryTarget: section === "Resource Map" ? category : null, targets, description, sources: linked, sourceProfile, evidenceStatus: review?.status ?? "not-extracted", review };
  });
  if (!resources.length) throw new Error("No resources found in README");
  for (const id of Object.keys(reviews)) {
    if (!resources.some(r => r.id === id)) throw new Error(`Orphan review: ${id}`);
  }
  return { schemaVersion: 1, source: "README.md + docs/survey/reviews.json", resources };
}

const cell = value => String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");

function renderInventory(catalog) {
  const { resources } = catalog;
  let result = "# Resource inventory\n\nGenerated from [README](../../README.md) and [evidence records](reviews.json).\nDo not edit directly: run `node scripts/build-survey-catalog.mjs`.\n\n";
  result += `${resources.length} distinct entries. Source profiles describe linked artifacts, not\npublication status or evidence quality. Not-extracted means no structured\nextraction is recorded here; earlier editorial checks may still exist in GitHub.\n\n`;
  result += "| Section | Entries | Source-checked | Evidence-reviewed |\n| --- | ---: | ---: | ---: |\n";
  for (const section of SECTIONS) {
    const items = resources.filter(r => r.section === section);
    result += `| ${section} | ${items.length} | ${items.filter(r => r.evidenceStatus === "source-checked").length} | ${items.filter(r => r.evidenceStatus === "evidence-reviewed").length} |\n`;
  }
  for (const section of SECTIONS) {
    result += `\n## ${section}\n\n| Resource | Primary category / role | Source profile | Evidence status |\n| --- | --- | --- | --- |\n`;
    for (const r of resources.filter(r => r.section === section)) {
      result += `| [${cell(r.title)}](${r.id}) | ${cell(r.category ?? section)} | ${r.sourceProfile} | ${r.evidenceStatus} |\n`;
    }
  }
  return result;
}

function renderEvidence(catalog) {
  const items = catalog.resources.filter(r => r.review);
  let result = "# Evidence matrix and source notes\n\nGenerated from [reviews.json](reviews.json). See the [protocol](PROTOCOL.md).\nSource-checked records establish only what the inspected passages say.\nThey are not full-paper audits, independent replications, or manuscript-ready comparisons.\nAll unextracted entries remain in the [complete inventory](catalog.md).\n\n";
  result += "| Work | Target | Persistent artifact | Feedback | Reported evaluation |\n| --- | --- | --- | --- | --- |\n";
  for (const r of items) result += `| [${cell(r.title)}](${r.id}) | ${r.primaryTarget ?? r.section} | ${cell(r.review.artifact)} | ${cell(r.review.feedback)} | ${cell(r.review.evaluation)} |\n`;
  for (const r of items) {
    const v = r.review;
    result += `\n## ${r.title}\n\nStatus: ${r.evidenceStatus}; checked ${v.reviewedAt} by ${v.reviewer}.\n\n`;
    if (v.bibliography) result += `Citation identity: ${v.bibliography.title} (${v.bibliography.year}).\n\n`;
    result += `Retention: ${v.retention}\n\nReproduction: ${v.reproducibility}. Safety: ${v.safety}. COI: ${v.conflictOfInterest}.\n\nSources inspected:\n\n`;
    for (const s of v.sources) result += `- [${s.locator}](${s.url})\n`;
    result += "\nLimitations / next extraction:\n\n" + v.limitations.map(s => `- ${s}`).join("\n") + "\n";
  }
  return result;
}

export async function generateCatalog({ root = process.cwd(), check = false } = {}) {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  const reviews = JSON.parse(await readFile(path.join(root, "docs/survey/reviews.json"), "utf8"));
  const catalog = buildCatalog(readme, reviews);
  const outputs = { "catalog.json": JSON.stringify(catalog, null, 2) + "\n", "catalog.md": renderInventory(catalog), "EVIDENCE.md": renderEvidence(catalog) };
  for (const [name, contents] of Object.entries(outputs)) {
    const destination = path.join(root, "docs/survey", name);
    if (check) {
      let existing;
      try { existing = await readFile(destination, "utf8"); } catch (error) { if (error.code !== "ENOENT") throw error; }
      if (existing !== contents) throw new Error(`Stale survey export: ${name}; run node scripts/build-survey-catalog.mjs`);
    } else await writeFile(destination, contents, "utf8");
  }
  return catalog;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateCatalog({check: process.argv.includes("--check")}).then(catalog => {
    console.log(`Survey catalog: ${catalog.resources.length} entries; structure and exports valid.`);
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
