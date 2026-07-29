const REPOSITORY_URL = "https://github.com/YuxingLu613/awesome-agentic-evolution";
const numberFormat = new Intl.NumberFormat("en", { notation: "compact" });

function setMetric(name, value) {
  const node = document.querySelector(`[data-metric="${name}"]`);
  if (node) node.textContent = Number.isFinite(value) ? numberFormat.format(value) : "—";
}

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderLandscape(targets) {
  const grid = document.querySelector("#landscape-grid");
  grid.replaceChildren();

  targets.forEach((target, index) => {
    const card = createElement("article", "target-card");
    card.append(createElement("span", "target-index", `0${index + 1}`));
    card.append(createElement("strong", "target-count", String(target.count)));
    card.append(createElement("h3", "", target.label));
    card.append(createElement("p", "", target.description));

    if (target.highlights.length) {
      const links = createElement("ul", "target-links");
      target.highlights.forEach((resource) => {
        const item = document.createElement("li");
        const link = createElement("a", "", `${resource.title} ↗`);
        link.href = resource.url;
        link.target = "_blank";
        link.rel = "noreferrer";
        item.append(link);
        links.append(item);
      });
      card.append(links);
    }

    grid.append(card);
  });
}

function renderRecent(items) {
  const list = document.querySelector("#recent-list");
  list.replaceChildren();

  if (!items.length) {
    list.append(createElement("li", "", "No editorial updates have been recorded yet."));
    return;
  }

  items.forEach(({ text }) => list.append(createElement("li", "", text)));
}

function renderOpportunities(activity) {
  const list = document.querySelector("#opportunity-list");
  list.replaceChildren();

  const opportunities = activity.status === "available" ? activity.opportunities : [];
  const visible = opportunities.length
    ? opportunities.slice(0, 3)
    : [{
        number: 1,
        title: "Call for Contributors and Founding Curators",
        url: `${REPOSITORY_URL}/issues/1`,
        labels: ["community"]
      }];

  visible.forEach((opportunity) => {
    const link = createElement("a", "opportunity-card");
    link.href = opportunity.url;
    link.append(
      createElement(
        "span",
        "",
        `Issue #${opportunity.number} · ${opportunity.labels[0] ?? "open"}`
      ),
      createElement("strong", "", opportunity.title)
    );
    list.append(link);
  });
}

function renderRoadmap(phases) {
  const list = document.querySelector("#roadmap-list");
  list.replaceChildren();

  phases.forEach((phase, index) => {
    const item = createElement("li", `roadmap-card${index === 0 ? " is-active" : ""}`);
    item.append(createElement("h3", "", phase.title));
    item.append(createElement("p", "", phase.items[0] ?? "Milestone details are being refined."));
    item.append(createElement("span", "phase-label", index === 0 ? "In progress" : phase.phase));
    list.append(item);
  });
}

function renderSnapshot(snapshot) {
  setMetric("resources", snapshot.summary.totalResources);
  setMetric("targets", snapshot.summary.coveredTargets);

  const activityAvailable = snapshot.activity.status === "available";
  setMetric("stars", activityAvailable ? snapshot.activity.stars : null);
  setMetric("contributors", activityAvailable ? snapshot.activity.contributors : null);
  setMetric("pulls", activityAvailable ? snapshot.activity.openPullRequests : null);
  setMetric("issues", activityAvailable ? snapshot.activity.openIssues : null);

  const generated = new Date(snapshot.generatedAt);
  const readableDate = Number.isNaN(generated.valueOf())
    ? "the latest build"
    : generated.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });

  document.querySelector("#snapshot-status").textContent =
    `Repository snapshot generated ${readableDate}`;
  document.querySelector("#metric-availability").textContent = activityAvailable
    ? "Synced from GitHub"
    : "Repository content available · GitHub activity temporarily unavailable";

  renderLandscape(snapshot.landscape);
  renderRecent(snapshot.recent);
  renderOpportunities(snapshot.activity);
  renderRoadmap(snapshot.roadmap);
}

async function loadDashboard() {
  try {
    const response = await fetch("./data/dashboard.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Dashboard snapshot returned ${response.status}`);
    renderSnapshot(await response.json());
  } catch (error) {
    document.querySelector("#snapshot-status").textContent =
      "The dashboard snapshot is temporarily unavailable. The repository remains accessible.";
    document.querySelector("#metric-availability").textContent = "Snapshot unavailable";
    document.querySelector("#landscape-grid").replaceChildren(
      createElement("p", "loading-message", "Open the GitHub repository to explore the current index.")
    );
    document.querySelector("#recent-list").replaceChildren(
      createElement("li", "", "Open the changelog for the latest editorial updates.")
    );
    renderOpportunities({ status: "unavailable" });
    document.querySelector("#roadmap-list").replaceChildren(
      createElement("li", "loading-message", "Open the repository roadmap for current milestones.")
    );
    console.error(error);
  }
}

loadDashboard();
