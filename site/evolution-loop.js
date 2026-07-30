export const STAGE_DWELL_MS = 1400;
export const TRANSITION_DWELL_MS = 1500;
export const OUTER_CADENCE = 7;

export const EVOLUTION_STAGES = [
  { id: "act", label: "Act", detail: "Agent acts in the current environment" },
  { id: "assess", label: "Assess", detail: "Objectives and evaluators score the result" },
  { id: "revise", label: "Revise", detail: "Mechanism proposes component changes" },
  { id: "retain", label: "Retain", detail: "Population keeps accepted variants" }
];

export const INNER_TARGETS = [
  {
    id: "parameters",
    label: "Parameters",
    criterion: "Persistent changes to weights, adapters, or learned policy values.",
    systems: ["STaR", "Self-Rewarding Language Models", "AgentEvolver"]
  },
  {
    id: "memory",
    label: "Memory",
    criterion: "Experience traces that remain available across tasks or episodes.",
    systems: ["Reflexion", "ExpeL", "SelfMem"]
  },
  {
    id: "knowledge",
    label: "Knowledge",
    criterion: "Persistent edits to an external knowledge base or grounded world model.",
    systems: ["ExpeL", "Mem²Evolve", "SelfMem"]
  },
  {
    id: "skills",
    label: "Skills",
    criterion: "Reusable instructions, procedures, or policies distilled from experience.",
    systems: ["Voyager", "MemSkill", "SkillOpt"]
  },
  {
    id: "tools",
    label: "Tools",
    criterion: "The callable tool inventory, interfaces, or executable capabilities.",
    systems: ["Agent0", "AgentSquare", "Mem²Evolve"]
  },
  {
    id: "topology",
    label: "Topology",
    criterion: "Agent roles, connections, routing, and workflow structure.",
    systems: ["ADAS", "GPTSwarm", "EvoAgentX"]
  }
];

export const OUTER_TARGETS = [
  {
    id: "environment",
    label: "Environment",
    question: "What the agent faces",
    criterion: "Tasks, simulators, curricula, and interaction conditions evolve.",
    systems: ["Voyager", "Agent0", "Experience-driven Lifelong Learning"]
  },
  {
    id: "objectives",
    label: "Objectives",
    question: "What counts as better",
    criterion: "Goals, reward definitions, and success criteria are revised.",
    systems: ["Self-Rewarding Language Models", "SkillOpt", "OpenEvolve"]
  },
  {
    id: "evaluators",
    label: "Evaluators",
    question: "Who judges",
    criterion: "Critics, tests, rubrics, or feedback models improve with the agent.",
    systems: ["Self-Rewarding Language Models", "AlphaEvolve", "OpenEvolve"]
  },
  {
    id: "mechanism",
    label: "Mechanism",
    question: "How variation happens",
    criterion: "Search, mutation, reflection, and update operators themselves evolve.",
    systems: ["Darwin Gödel Machine", "ADAS", "OpenEvolve"]
  },
  {
    id: "population",
    label: "Population",
    question: "Who persists",
    criterion: "Candidate pools, selection pressure, lineage, and reproduction evolve.",
    systems: ["Darwin Gödel Machine", "ADAS", "EvoAgentX"]
  }
];

export const GOVERNANCE = {
  act: ["environment"],
  assess: ["objectives", "evaluators"],
  revise: ["mechanism"],
  retain: ["population"]
};

function zeroCounts(targets) {
  return Object.fromEntries(targets.map(({ id }) => [id, 0]));
}

export function createEvolutionState() {
  return {
    stage: "act",
    cycle: 0,
    version: 1,
    candidates: [],
    lastTargets: [],
    retained: zeroCounts(INNER_TARGETS),
    outerRetained: zeroCounts(OUTER_TARGETS),
    coEvolving: null,
    verdict: null,
    running: true,
    outerCursor: 0
  };
}

export function formatEvolutionCount(count) {
  if (!count) return "";
  return count > 99 ? "99+" : String(count);
}

function candidatesFor(state) {
  const targetIds = INNER_TARGETS.map(({ id }) => id);
  const count = [1, 3, 2][state.cycle % 3];
  const start = state.cycle % targetIds.length;
  return Array.from(
    { length: count },
    (_, offset) => targetIds[(start + offset) % targetIds.length]
  );
}

function retainCandidates(state) {
  const accepted = state.cycle % 3 !== 2;
  const retained = { ...state.retained };

  if (accepted) {
    state.candidates.forEach((target) => {
      retained[target] += 1;
    });
  }

  return {
    ...state,
    stage: "retain",
    candidates: [],
    lastTargets: [...state.candidates],
    retained,
    verdict: accepted ? "accepted" : "rejected",
    version: accepted ? state.version + 1 : state.version
  };
}

function beginNextCycle(state) {
  const outerRetained = { ...state.outerRetained };
  let outerCursor = state.outerCursor;

  if (state.coEvolving) {
    outerRetained[state.coEvolving] += 1;
    outerCursor = (outerCursor + 1) % OUTER_TARGETS.length;
  }

  return {
    ...state,
    stage: "act",
    cycle: state.cycle + 1,
    candidates: [],
    lastTargets: [],
    outerRetained,
    coEvolving: null,
    verdict: null,
    outerCursor
  };
}

export function advanceEvolutionState(state) {
  if (state.stage === "act") {
    return { ...state, stage: "assess" };
  }

  if (state.stage === "assess") {
    const startsOuterChange = state.cycle % OUTER_CADENCE === OUTER_CADENCE - 1;
    return {
      ...state,
      stage: "revise",
      candidates: candidatesFor(state),
      coEvolving: startsOuterChange ? OUTER_TARGETS[state.outerCursor].id : null
    };
  }

  if (state.stage === "revise") {
    return retainCandidates(state);
  }

  return beginNextCycle(state);
}
