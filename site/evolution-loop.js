export const EVOLUTION_STAGES = [
  { id: "observe", label: "Observe", detail: "Signals & traces" },
  { id: "reflect", label: "Reflect", detail: "Distill experience" },
  { id: "modify", label: "Modify", detail: "Update the agent" },
  { id: "evaluate", label: "Evaluate", detail: "Test & compare" },
  { id: "retain", label: "Retain", detail: "Keep what works" }
];

export function advanceEvolutionState({ stageIndex }) {
  return { stageIndex: (stageIndex + 1) % EVOLUTION_STAGES.length };
}
