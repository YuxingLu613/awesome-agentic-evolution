import {
  EVOLUTION_STAGES,
  GOVERNANCE,
  INNER_TARGETS,
  OUTER_TARGETS,
  STAGE_DWELL_MS,
  advanceEvolutionState,
  createEvolutionState,
  formatEvolutionCount
} from "./evolution-loop.js";

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
    item.append(
      createElement(
        "p",
        "",
        phase.summary || phase.items[0] || "Milestone details are being refined."
      )
    );
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

function initEvolutionLoop() {
  const root = document.querySelector(".hero-system");
  const control = document.querySelector("#loop-control");
  if (!root || !control) return;

  const stageNodes = [...root.querySelectorAll("[data-stage]")];
  const innerNodes = [...root.querySelectorAll("[data-inner-target]")];
  const outerNodes = [...root.querySelectorAll("[data-outer-target]")];
  const governanceLines = [...root.querySelectorAll("[data-governs-stage]")];
  const targetDetail = root.querySelector("#target-detail");
  const agentVerdict = root.querySelector("#agent-verdict");
  const writebackArrow = root.querySelector("#writeback-arrow");
  const detailButtons = [...innerNodes, ...outerNodes];
  const targetDetails = new Map(
    [...INNER_TARGETS, ...OUTER_TARGETS].map((target) => [target.id, target])
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state = createEvolutionState();
  let userPaused = reduceMotion;
  let detailTarget = null;
  let resumeAfterDetail = false;
  let timer = null;

  function setText(selector, value) {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  }

  function setCounter(node, count) {
    if (!node) return;
    const label = formatEvolutionCount(count);
    node.textContent = label;
    node.classList.toggle("has-count", Boolean(label));
  }

  function targetLabel(targetIds, separator = " + ") {
    return targetIds
      .map((id) => targetDetails.get(id)?.label ?? id)
      .join(separator);
  }

  function verdictCaption() {
    if (state.stage === "assess") return "Assessing outcomes against objectives and evaluators";
    if (state.stage === "revise") return `candidate: ${targetLabel(state.candidates)}`;
    if (state.stage === "retain" && state.verdict === "accepted") {
      return `accepted: ${targetLabel(state.lastTargets)} · retained in Agent v${state.version}`;
    }
    if (state.stage === "retain" && state.verdict === "rejected") {
      return `rejected: ${targetLabel(state.lastTargets)} · Agent v${state.version} unchanged`;
    }
    return "Acting with the current agent configuration";
  }

  function renderDetail() {
    const details = detailTarget ? targetDetails.get(detailTarget) : null;
    root.classList.toggle("has-target-focus", Boolean(details));
    if (targetDetail) targetDetail.hidden = !details;

    detailButtons.forEach((node) => {
      const nodeTarget = node.dataset.innerTarget ?? node.dataset.outerTarget;
      node.classList.toggle("is-focused", nodeTarget === detailTarget);
      node.classList.toggle("is-dimmed", Boolean(details) && nodeTarget !== detailTarget);
    });

    setText("#detail-label", details?.label ?? "Click any component or co-evolution factor");
    setText(
      "#detail-criterion",
      details?.criterion ?? "The animation pauses while its definition and examples are open."
    );
    setText(
      "#detail-systems",
      details ? `Representative systems · ${details.systems.join(" · ")}` : ""
    );
  }

  function renderVerdict() {
    const visible = state.stage === "retain" && Boolean(state.verdict);
    if (agentVerdict) {
      agentVerdict.hidden = !visible;
      agentVerdict.classList.toggle("is-accepted", state.verdict === "accepted");
      agentVerdict.classList.toggle("is-rejected", state.verdict === "rejected");
      agentVerdict.textContent =
        state.verdict === "accepted"
          ? "✓ Accepted"
          : state.verdict === "rejected"
            ? "× Rejected"
            : "";
    }
    if (writebackArrow) {
      writebackArrow.textContent = state.verdict === "rejected" ? "↶" : "→";
    }
  }

  function renderEvolution({ announce = false } = {}) {
    const stage = EVOLUTION_STAGES.find(({ id }) => id === state.stage);
    const governingTargets = GOVERNANCE[state.stage];

    stageNodes.forEach((node) => {
      const active = node.dataset.stage === state.stage;
      node.classList.toggle("is-active", active);
      if (active) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });

    innerNodes.forEach((node) => {
      const target = node.dataset.innerTarget;
      const candidate = state.candidates.includes(target);
      const written =
        state.stage === "retain" &&
        state.verdict === "accepted" &&
        state.lastTargets.includes(target);
      node.classList.toggle("is-candidate", candidate);
      node.classList.toggle("is-written", written);
      node.classList.toggle(
        "is-rejected",
        state.stage === "retain" &&
          state.verdict === "rejected" &&
          state.lastTargets.includes(target)
      );
      setCounter(node.querySelector("[data-inner-count]"), state.retained[target]);
      node.setAttribute(
        "aria-label",
        `${targetDetails.get(target).label}, retained ${state.retained[target]} times`
      );
    });

    outerNodes.forEach((node) => {
      const target = node.dataset.outerTarget;
      const governing = governingTargets.includes(target) && state.coEvolving !== target;
      node.classList.toggle("is-governing", governing);
      node.classList.toggle("is-coevolving", state.coEvolving === target);
      setCounter(node.querySelector("[data-outer-count]"), state.outerRetained[target]);
      node.setAttribute(
        "aria-label",
        `${targetDetails.get(target).label}, retained ${state.outerRetained[target]} co-evolution changes`
      );
    });

    governanceLines.forEach((line) => {
      const active =
        line.dataset.governsStage === state.stage &&
        line.dataset.governsTarget !== state.coEvolving;
      line.classList.toggle("is-active", active);
    });

    root.dataset.stage = state.stage;
    root.dataset.verdict = state.verdict ?? "";
    root.dataset.cycle = String(state.cycle);
    setText("#agent-version", `v${state.version}`);
    setText("#iteration-count", String(state.cycle + 1).padStart(2, "0"));
    setText("#evolution-stage", stage.label);
    setText("#evolution-detail", stage.detail);
    renderVerdict();
    renderDetail();

    if (announce) {
      root.querySelector("#evolution-status")?.setAttribute(
        "aria-label",
        `${stage.label}: ${stage.detail}. ${verdictCaption()}.`
      );
    }
  }

  function tick() {
    state = advanceEvolutionState(state);
    renderEvolution({ announce: true });
  }

  function syncPlayback() {
    const paused = userPaused || Boolean(detailTarget) || document.hidden;
    window.clearInterval(timer);
    timer = paused ? null : window.setInterval(tick, STAGE_DWELL_MS);
    state = { ...state, running: !paused };
    control.setAttribute("aria-pressed", String(userPaused));
    control.querySelector("b").textContent = userPaused ? "Play" : "Pause";
    root.classList.toggle("is-paused", paused);
  }

  control.addEventListener("click", () => {
    if (detailTarget) {
      detailTarget = null;
      resumeAfterDetail = false;
      renderDetail();
    }
    userPaused = !userPaused;
    syncPlayback();
  });

  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.innerTarget ?? button.dataset.outerTarget;
      if (detailTarget === selected) {
        detailTarget = null;
        if (resumeAfterDetail) userPaused = false;
        resumeAfterDetail = false;
      } else {
        if (!detailTarget) resumeAfterDetail = !userPaused;
        detailTarget = selected;
        userPaused = true;
      }
      renderDetail();
      syncPlayback();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && detailTarget) {
      detailTarget = null;
      if (resumeAfterDetail) userPaused = false;
      resumeAfterDetail = false;
      renderDetail();
      syncPlayback();
    }
  });
  document.addEventListener("visibilitychange", syncPlayback);

  renderEvolution({ announce: true });
  syncPlayback();
}

initEvolutionLoop();
loadDashboard();
