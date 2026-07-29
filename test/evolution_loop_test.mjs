import test from "node:test";
import assert from "node:assert/strict";

import {
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

test("loops back to observe after the fifth stage", () => {
  let state = { stageIndex: 0 };

  for (let step = 0; step < EVOLUTION_STAGES.length; step += 1) {
    state = advanceEvolutionState(state);
  }

  assert.deepEqual(state, { stageIndex: 0 });
});
