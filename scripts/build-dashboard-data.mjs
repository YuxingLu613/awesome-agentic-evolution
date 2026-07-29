import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_REPOSITORY = "YuxingLu613/awesome-agentic-evolution";

const TARGETS = [
  {
    id: "model",
    label: "Model",
    description: "Parameters, policies, and generated training data.",
    keywords: ["model", "policy", "parameter", "training", "reasoning"]
  },
  {
    id: "memory",
    label: "Memory",
    description: "Experience, reflection, and structured knowledge.",
    keywords: ["memory", "experience", "reflection", "episodic"]
  },
  {
    id: "skill",
    label: "Skill & Tool",
    description: "Reusable procedures, tools, and expert agents.",
    keywords: ["skill", "tool", "procedure", "expert agent"]
  },
  {
    id: "workflow",
    label: "Workflow",
    description: "Prompts, control flow, topology, and architecture.",
    keywords: ["workflow", "architecture", "graph", "prompt", "topology", "modular"]
  },
  {
    id: "environment",
    label: "Environment",
    description: "Tasks, curricula, evaluators, and simulated worlds.",
    keywords: ["environment", "curriculum", "evaluator", "world", "embodied", "task generation"]
  },
  {
    id: "code",
    label: "Agent Code",
    description: "Implementation, scaffolding, and self-modification.",
    keywords: ["agent code", " code ", "rewrit", "self-modification", "program"]
  },
  {
    id: "co-evolution",
    label: "Co-evolution",
    description: "Multi-agent systems and open-ended ecosystems.",
    keywords: ["co-evol", "multi-agent", "ecosystem", "swarm"]
  }
];

function extractResourceEntries(markdown) {
  const entries = [];
  let current = null;
  let inCatalog = false;

  for (const line of markdown.split("\n")) {
    if (/^## Frameworks and Repositories/.test(line)) {
      inCatalog = true;
      continue;
    }
    if (/^## Benchmarks and Evaluation/.test(line)) {
      break;
    }
    if (!inCatalog) continue;

    const match = line.match(/^- \[([^\]]+)\]\((https?:\/\/[^)]+)\)\s+[—-]\s*(.*)$/);
    if (match) {
      current = { title: match[1], url: match[2], description: match[3].trim() };
      entries.push(current);
      continue;
    }

    if (current && /^\s{2,}\S/.test(line)) {
      current.description = `${current.description} ${line.trim()}`.trim();
    } else if (/^#{2,}\s/.test(line) || line.trim() === "") {
      current = null;
    }
  }

  return entries;
}

function extractBulletItems(markdown, headingPattern) {
  const items = [];
  let active = false;
  let current = null;

  for (const line of markdown.split("\n")) {
    if (headingPattern.test(line)) {
      active = true;
      continue;
    }
    if (active && /^##\s/.test(line)) break;
    if (!active) continue;

    const match = line.match(/^- (.+)$/);
    if (match) {
      current = { text: match[1].trim() };
      items.push(current);
    } else if (current && /^\s{2,}\S/.test(line)) {
      current.text = `${current.text} ${line.trim()}`;
    }
  }

  return items;
}

function extractRoadmap(markdown) {
  const phases = [];
  let current = null;

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^## (Phase \d+)\s+—\s+(.+)$/);
    if (heading) {
      current = { phase: heading[1], title: heading[2], items: [] };
      phases.push(current);
      continue;
    }

    const item = line.match(/^- (.+)$/);
    if (current && item) current.items.push(item[1].trim());
  }

  return phases;
}

export function normalizeGitHubActivity({
  repository,
  pullRequests,
  contributors,
  opportunities
}) {
  return {
    status: "available",
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    contributors: contributors.length,
    openIssues: Math.max(repository.open_issues_count - pullRequests.length, 0),
    openPullRequests: pullRequests.length,
    updatedAt: repository.updated_at,
    opportunities: opportunities.map((issue) => ({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      labels: issue.labels.map((label) => label.name)
    }))
  };
}

async function fetchJson(url, token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "awesome-agentic-evolution-dashboard"
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} for ${url}`);
  }
  return response.json();
}

export async function fetchGitHubActivity(repositoryName, token) {
  const baseUrl = `https://api.github.com/repos/${repositoryName}`;
  const [repository, pullRequests, contributors, issues] = await Promise.all([
    fetchJson(baseUrl, token),
    fetchJson(`${baseUrl}/pulls?state=open&per_page=100`, token),
    fetchJson(`${baseUrl}/contributors?per_page=100&anon=1`, token),
    fetchJson(`${baseUrl}/issues?state=open&per_page=20`, token)
  ]);

  return normalizeGitHubActivity({
    repository,
    pullRequests,
    contributors,
    opportunities: issues.filter((issue) => !issue.pull_request).slice(0, 6)
  });
}

export function buildRepositorySnapshot({
  readme,
  changelog,
  roadmap,
  github,
  generatedAt = new Date().toISOString()
}) {
  const resources = extractResourceEntries(readme);
  const landscape = TARGETS.map(({ keywords, ...target }) => {
    const matches = resources.filter((resource) => {
      const haystack = ` ${resource.title} ${resource.description} `.toLowerCase();
      return keywords.some((keyword) => haystack.includes(keyword));
    });

    return {
      ...target,
      count: matches.length,
      highlights: matches.slice(0, 3)
    };
  });

  return {
    generatedAt,
    summary: {
      totalResources: resources.length,
      coveredTargets: landscape.filter(({ count }) => count > 0).length
    },
    activity: github ?? { status: "unavailable" },
    landscape,
    recent: extractBulletItems(changelog, /^## \d{4}-\d{2}-\d{2}$/).slice(0, 6),
    roadmap: extractRoadmap(roadmap)
  };
}

export async function buildDashboardSite({
  root = process.cwd(),
  outputDirectory = "_site",
  repositoryName = process.env.GITHUB_REPOSITORY || DEFAULT_REPOSITORY,
  token = process.env.GITHUB_TOKEN,
  skipGitHub = process.env.DASHBOARD_SKIP_GITHUB === "1"
} = {}) {
  const output = path.resolve(root, outputDirectory);
  const [readme, changelog, roadmap] = await Promise.all([
    readFile(path.join(root, "README.md"), "utf8"),
    readFile(path.join(root, "CHANGELOG.md"), "utf8"),
    readFile(path.join(root, "ROADMAP.md"), "utf8")
  ]);

  let github = null;
  if (!skipGitHub) {
    try {
      github = await fetchGitHubActivity(repositoryName, token);
    } catch (error) {
      console.warn(`GitHub activity unavailable: ${error.message}`);
    }
  }

  await mkdir(output, { recursive: true });
  await cp(path.join(root, "site"), output, { recursive: true, force: true });
  await mkdir(path.join(output, "data"), { recursive: true });
  await writeFile(path.join(output, ".nojekyll"), "", "utf8");

  const snapshot = buildRepositorySnapshot({
    readme,
    changelog,
    roadmap,
    github
  });
  await writeFile(
    path.join(output, "data", "dashboard.json"),
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf8"
  );

  return snapshot;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  buildDashboardSite({ outputDirectory: process.argv[2] || "_site" }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
