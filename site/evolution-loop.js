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

export const EVOLUTION_TARGETS = [
  ["Parameters"],
  ["Memory", "Skills"],
  ["Tools", "Workflow"],
  ["Code"]
];

export function advanceEvolutionState({ stageIndex, targetIndex }) {
  const nextStageIndex = (stageIndex + 1) % EVOLUTION_STAGES.length;

  return {
    stageIndex: nextStageIndex,
    targetIndex: nextStageIndex === 0
      ? (targetIndex + 1) % EVOLUTION_TARGETS.length
      : targetIndex
  };
}
