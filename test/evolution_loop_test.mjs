import test from "node:test";
import assert from "node:assert/strict";

import {
  EVOLUTION_SCENARIOS,
  EVOLUTION_STAGES,
  advanceEvolutionState
} from "../site/evolution-loop.js";

test("models the five evidence-gated stages of persistent improvement", () => {
  assert.deepEqual(
    EVOLUTION_STAGES.map((stage) => stage.id),
    ["observe", "reflect", "modify", "evaluate", "retain"]
  );
});

test("cycles through agent components with both retention and rollback outcomes", () => {
  assert.deepEqual(
    EVOLUTION_SCENARIOS.map((scenario) => scenario.component),
    ["Memory", "Skills", "Tools", "Workflow", "Code"]
  );
  assert.ok(EVOLUTION_SCENARIOS.some((scenario) => scenario.outcome === "retain"));
  assert.ok(EVOLUTION_SCENARIOS.some((scenario) => scenario.outcome === "rollback"));
  assert.ok(
    EVOLUTION_SCENARIOS.every(
      (scenario) =>
        scenario.before &&
        scenario.after &&
        Number.isFinite(scenario.scoreBefore) &&
        Number.isFinite(scenario.scoreAfter)
    )
  );
});

test("advances the scenario only after one complete five-stage cycle", () => {
  let state = { stageIndex: 0, scenarioIndex: 0, cycle: 1 };

  for (let step = 0; step < EVOLUTION_STAGES.length - 1; step += 1) {
    state = advanceEvolutionState(state);
    assert.equal(state.scenarioIndex, 0);
  }

  assert.equal(state.stageIndex, EVOLUTION_STAGES.length - 1);
  state = advanceEvolutionState(state);

  assert.deepEqual(state, { stageIndex: 0, scenarioIndex: 1, cycle: 2 });
});
