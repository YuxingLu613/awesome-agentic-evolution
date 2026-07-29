import test from "node:test";
import assert from "node:assert/strict";

import {
  EVOLUTION_COMPONENTS,
  EVOLUTION_STAGES,
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

test("advances the component after one complete improvement loop", () => {
  let state = { stageIndex: 0, componentIndex: 0 };

  for (let step = 0; step < EVOLUTION_STAGES.length; step += 1) {
    state = advanceEvolutionState(state);
  }

  assert.deepEqual(state, { stageIndex: 0, componentIndex: 1 });
});

test("keeps the component fixed while a loop is in progress", () => {
  assert.deepEqual(
    advanceEvolutionState({ stageIndex: 2, componentIndex: 4 }),
    { stageIndex: 3, componentIndex: 4 }
  );
});
