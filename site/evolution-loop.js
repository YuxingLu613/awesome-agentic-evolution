export const EVOLUTION_STAGES = [
  { id: "observe", label: "Observe", detail: "Signals & traces" },
  { id: "reflect", label: "Reflect", detail: "Distill experience" },
  { id: "modify", label: "Modify", detail: "Update the agent" },
  { id: "evaluate", label: "Evaluate", detail: "Test & compare" },
  { id: "retain", label: "Retain", detail: "Keep what works" }
];

export const EVOLUTION_COMPONENTS = [
  "Parameters",
  "Memory",
  "Skills",
  "Tools",
  "Workflow",
  "Code"
];

export function advanceEvolutionState({ stageIndex, componentIndex }) {
  const nextStageIndex = (stageIndex + 1) % EVOLUTION_STAGES.length;

  return {
    stageIndex: nextStageIndex,
    componentIndex: nextStageIndex === 0
      ? (componentIndex + 1) % EVOLUTION_COMPONENTS.length
      : componentIndex
  };
}
