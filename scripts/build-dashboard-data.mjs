import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_REPOSITORY = "YuxingLu613/awesome-agentic-evolution";

const TARGETS = [
  {
    id: "parameters",
    label: "Parameters",
    description: "Model weights, policies, and other trainable state."
  },
  {
    id: "memory",
    label: "Memory",
    description: "Agent-specific traces, reflections, and experience records."
  },
  {
    id: "knowledge",
    label: "Knowledge",
    description: "External, reusable world knowledge and retrieval assets."
  },
  {
    id: "skills",
    label: "Skills",
    description: "Reusable procedural instructions and callable routines."
  },
  {
    id: "tools",
    label: "Tools",
    description: "Executable interfaces, code modules, APIs, and expert agents."
  },
  {
    id: "topology",
    label: "Topology",
    description: "Control flow, routing, graph structure, roles, and orchestration."
  },
  {
    id: "co-evolution",
    label: "Co-evolution",
    description: "Objectives, evaluators, environments, populations, and update mechanisms."
  }
];

const TARGET_IDS_BY_LABEL = new Map(
  TARGETS.flatMap((target) => [
    [target.label.toLowerCase(), target.id],
    [target.id.toLowerCase(), target.id]
  ])
);

function resolveTargetId(label) {
  return TARGET_IDS_BY_LABEL.get(
    label.trim().replace(/[.;]$/, "").replace(/\s+/g, " ").toLowerCase()
  );
}

function resourceKey(title) {
  return title.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function extractResourceEntries(markdown) {
  const entries = [];
  const entriesByTitle = new Map();
  const notes = new Map();
  let current = null;
  let currentIsDuplicate = false;
  let primaryTarget = null;
  let currentNoteTarget = null;
  let inCatalog = false;

  for (const line of markdown.split("\n")) {
    if (/^## Resource Map\s*$/.test(line)) {
      inCatalog = true;
      continue;
    }
    if (!inCatalog) continue;
    if (/^##\s/.test(line)) break;

    const section = line.match(/^###\s+(.+?)\s*$/);
    if (section) {
      primaryTarget = resolveTargetId(section[1]) ?? null;
      currentNoteTarget = primaryTarget;
      current = null;
      continue;
    }

    const match = line.match(
      /^- \[([^\]]+)\]\((https?:\/\/[^)]+)\)(?:\s+[—-]\s*(.*))?\s*$/
    );
    if (match) {
      const key = resourceKey(match[1]);
      current = entriesByTitle.get(key);
      currentIsDuplicate = Boolean(current);

      if (!current) {
        current = {
          title: match[1].trim(),
          url: match[2],
          description: (match[3] ?? "").trim(),
          primaryTarget,
          targets: primaryTarget ? [primaryTarget] : []
        };
        entriesByTitle.set(key, current);
        entries.push(current);
      } else if (primaryTarget && !current.targets.includes(primaryTarget)) {
        current.targets.push(primaryTarget);
      }
      continue;
    }

    const targets = line.match(/^\s{2,}\*\*Targets:\*\*\s+(.+?)\s*$/);
    if (current && targets) {
      targets[1]
        .split(/\s*(?:,|·)\s*/)
        .map(resolveTargetId)
        .filter(Boolean)
        .forEach((target) => {
          if (!current.targets.includes(target)) current.targets.push(target);
        });
      continue;
    }

    if (current && !currentIsDuplicate && /^\s{2,}\S/.test(line)) {
      const continuation = line.trim().replace(/^—\s*/, "");
      current.description = `${current.description} ${continuation}`.trim();
      continue;
    }
    if (/^-\s/.test(line) || /^#{2,}\s/.test(line)) {
      current = null;
      currentIsDuplicate = false;
      continue;
    }
    if (line.trim() === "") {
      current = null;
      currentIsDuplicate = false;
      continue;
    }
    if (currentNoteTarget && !current && /^\S/.test(line)) {
      const note = notes.get(currentNoteTarget) ?? "";
      notes.set(currentNoteTarget, `${note} ${line.trim()}`.trim());
    }
  }

  return { entries, notes };
}

function extractFieldUpdates(markdown) {
  const items = [];
  let active = false;
  let current = null;

  for (const line of markdown.split("\n")) {
    if (/^### Field updates\s*$/.test(line)) {
      active = true;
      current = null;
      continue;
    }
    if (/^##\s/.test(line) || (active && /^###\s/.test(line))) {
      active = false;
      current = null;
    }
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
  let currentItem = null;
  let currentList = [];
  let summaryStarted = false;
  let summaryComplete = false;

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^## (Phase \d+)\s+—\s+(.+)$/);
    if (heading) {
      current = { phase: heading[1], title: heading[2], summary: "", items: [], gates: [] };
      phases.push(current);
      currentItem = null;
      currentList = current.items;
      summaryStarted = false;
      summaryComplete = false;
      continue;
    }

    if (/^##\s/.test(line)) {
      current = null;
      currentItem = null;
      continue;
    }
    if (!current) continue;

    const item = line.match(/^- (.+)$/);
    if (item) {
      currentItem = item[1].trim();
      currentList.push(currentItem);
      summaryComplete = true;
      continue;
    }

    if (currentItem && /^\s{2,}\S/.test(line)) {
      currentList[currentList.length - 1] =
        `${currentList.at(-1)} ${line.trim()}`;
      continue;
    }

    if (!line.trim()) {
      if (summaryStarted) summaryComplete = true;
      currentItem = null;
      continue;
    }

    if (/(?:when|if|once|met):\s*$/i.test(line.trim())) {
      currentList = current.gates;
      currentItem = null;
      continue;
    }

    if (!summaryComplete) {
      current.summary = `${current.summary} ${line.trim()}`.trim();
      summaryStarted = true;
    } else {
      currentList = current.items;
    }
  }

  phases.forEach((phase) => {
    if (!phase.summary) phase.summary = phase.items[0] ?? "";
  });
  return phases;
}

function allocateHighlights(resources, targets) {
  const used = new Set();
  const candidatesByTarget = new Map(
    targets.map((target) => [
      target.id,
      resources
        .filter((resource) => resource.targets.includes(target.id))
        .sort((left, right) => {
          const leftRank =
            left.targets.length === 1 ? 0 : left.primaryTarget === target.id ? 1 : 2;
          const rightRank =
            right.targets.length === 1 ? 0 : right.primaryTarget === target.id ? 1 : 2;
          return leftRank - rightRank;
        })
    ])
  );

  return new Map(
    targets.map((target) => {
      const candidates = candidatesByTarget.get(target.id);
      const highlights = candidates
        .filter((resource) => !used.has(resourceKey(resource.title)))
        .slice(0, 3);

      highlights.forEach((resource) => used.add(resourceKey(resource.title)));
      return [target.id, highlights];
    })
  );
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
  const { entries: resources, notes } = extractResourceEntries(readme);
  const highlights = allocateHighlights(resources, TARGETS);
  const landscape = TARGETS.map((target) => {
    const matches = resources.filter((resource) => resource.targets.includes(target.id));
    const note = matches.length === 0 ? notes.get(target.id) : undefined;

    return {
      ...target,
      count: matches.length,
      highlights: highlights.get(target.id),
      ...(note ? { note } : {})
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
    recent: extractFieldUpdates(changelog).slice(0, 6),
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
