export const EVOLUTION_STAGES = [
  { id: "observe", label: "Observe", detail: "Signals & traces" },
  { id: "reflect", label: "Reflect", detail: "Distill experience" },
  { id: "modify", label: "Modify", detail: "Change one component" },
  { id: "evaluate", label: "Evaluate", detail: "Test & compare" },
  { id: "retain", label: "Retain", detail: "Version or roll back" }
];

export const EVOLUTION_SCENARIOS = [
  {
    component: "Memory",
    signal: "Retrieval misses repeat across long tasks",
    before: "episodic cache v2",
    after: "strategy graph v3",
    scoreBefore: 71,
    scoreAfter: 84,
    outcome: "retain"
  },
  {
    component: "Skills",
    signal: "Source checks fail on ambiguous claims",
    before: "source-check v1",
    after: "source-check v2",
    scoreBefore: 76,
    scoreAfter: 88,
    outcome: "retain"
  },
  {
    component: "Tools",
    signal: "A new verifier adds latency without accuracy",
    before: "search only",
    after: "search + verifier",
    scoreBefore: 82,
    scoreAfter: 79,
    outcome: "rollback"
  },
  {
    component: "Workflow",
    signal: "Single-pass plans miss dependency conflicts",
    before: "single pass",
    after: "critic gate",
    scoreBefore: 68,
    scoreAfter: 86,
    outcome: "retain"
  },
  {
    component: "Code",
    signal: "Unbounded retries hide persistent failures",
    before: "retry loop v1",
    after: "bounded retry v2",
    scoreBefore: 74,
    scoreAfter: 91,
    outcome: "retain"
  }
];

export function advanceEvolutionState({ stageIndex, scenarioIndex, cycle }) {
  const nextStageIndex = (stageIndex + 1) % EVOLUTION_STAGES.length;
  const completedCycle = nextStageIndex === 0;

  return {
    stageIndex: nextStageIndex,
    scenarioIndex: completedCycle
      ? (scenarioIndex + 1) % EVOLUTION_SCENARIOS.length
      : scenarioIndex,
    cycle: completedCycle ? cycle + 1 : cycle
  };
}
