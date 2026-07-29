import test from "node:test";
import assert from "node:assert/strict";

import {
  EVOLUTION_COMPONENTS,
  EVOLUTION_STAGES,
  EVOLUTION_TARGETS,
  advanceEvolutionState
} from "../site/evolution-loop.js";

test("models the five evidence-gated stages of persistent improvement", () => {
  assert.deepEqual(
    EVOLUTION_STAGES.map((stage) => stage.id),
    ["observe", "reflect", "modify", "evaluate", "retain"]
  );
});

test("keeps each diagram stage concise", () => {
  assert.ok(EVOLUTION_STAGES.every((stage) => stage.label && stage.detail));
  assert.ok(EVOLUTION_STAGES.every((stage) => stage.detail.length <= 24));
});

test("names the evolvable agent components", () => {
  assert.deepEqual(
    EVOLUTION_COMPONENTS,
    ["Parameters", "Memory", "Skills", "Tools", "Workflow", "Code"]
  );
});

test("supports both single-component and multi-component evolution targets", () => {
  assert.deepEqual(EVOLUTION_TARGETS, [
    ["Parameters"],
    ["Memory", "Skills"],
    ["Tools", "Workflow"],
    ["Code"]
  ]);
  assert.ok(EVOLUTION_TARGETS.some((target) => target.length === 1));
  assert.ok(EVOLUTION_TARGETS.some((target) => target.length > 1));
});

test("advances the target after one complete improvement loop", () => {
  let state = { stageIndex: 0, targetIndex: 0 };

  for (let step = 0; step < EVOLUTION_STAGES.length; step += 1) {
    state = advanceEvolutionState(state);
  }

  assert.deepEqual(state, { stageIndex: 0, targetIndex: 1 });
});

test("keeps the target fixed while a loop is in progress", () => {
  assert.deepEqual(
    advanceEvolutionState({ stageIndex: 2, targetIndex: 2 }),
    { stageIndex: 3, targetIndex: 2 }
  );
});
