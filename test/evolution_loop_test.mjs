import test from "node:test";
import assert from "node:assert/strict";

import {
  EVOLUTION_STAGES,
  GOVERNANCE,
  INNER_TARGETS,
  OUTER_CADENCE,
  OUTER_TARGETS,
  STAGE_DWELL_MS,
  TRANSITION_DWELL_MS,
  advanceEvolutionState,
  createEvolutionState,
  formatEvolutionCount
} from "../site/evolution-loop.js";

function advanceIteration(state) {
  let next = state;
  for (let step = 0; step < EVOLUTION_STAGES.length; step += 1) {
    next = advanceEvolutionState(next);
  }
  return next;
}

test("models the four-stage persistent improvement loop", () => {
  assert.deepEqual(
    EVOLUTION_STAGES.map((stage) => stage.id),
    ["act", "assess", "revise", "retain"]
  );
  assert.equal(STAGE_DWELL_MS, 1400);
  assert.equal(TRANSITION_DWELL_MS, 1500);
});

test("defines six inner target categories", () => {
  assert.deepEqual(
    INNER_TARGETS.map((target) => target.id),
    ["parameters", "memory", "knowledge", "skills", "tools", "topology"]
  );
  assert.ok(INNER_TARGETS.every((target) => target.label && target.criterion));
  assert.ok(INNER_TARGETS.every((target) => target.systems.length >= 2));
});

test("maps five outer targets to the stages they govern", () => {
  assert.deepEqual(
    OUTER_TARGETS.map((target) => target.id),
    ["environment", "objectives", "evaluators", "mechanism", "population"]
  );
  assert.deepEqual(GOVERNANCE, {
    act: ["environment"],
    assess: ["objectives", "evaluators"],
    revise: ["mechanism"],
    retain: ["population"]
  });
  assert.ok(OUTER_TARGETS.every((target) => target.criterion && target.systems.length >= 2));
});

test("selects one or more generic targets only when revise begins", () => {
  let state = createEvolutionState();

  state = advanceEvolutionState(state);
  assert.equal(state.stage, "assess");
  assert.deepEqual(state.candidates, []);

  state = advanceEvolutionState(state);
  assert.equal(state.stage, "revise");
  assert.deepEqual(state.candidates, ["parameters"]);

  state = advanceEvolutionState(state);
  assert.equal(state.stage, "retain");
  assert.equal(state.verdict, "accepted");
  assert.deepEqual(state.candidates, []);
  assert.deepEqual(state.lastTargets, ["parameters"]);
  assert.equal(state.retained.parameters, 1);
  assert.equal(state.version, 2);
});

test("rejects every third iteration without changing counters or version", () => {
  let state = createEvolutionState();

  state = advanceIteration(state);
  state = advanceIteration(state);
  assert.equal(state.version, 3);
  assert.equal(state.retained.parameters, 1);
  assert.equal(state.retained.memory, 1);
  assert.equal(state.retained.knowledge, 1);
  assert.equal(state.retained.skills, 1);

  state = advanceEvolutionState(state);
  state = advanceEvolutionState(state);
  state = advanceEvolutionState(state);

  assert.equal(state.stage, "retain");
  assert.equal(state.verdict, "rejected");
  assert.deepEqual(state.lastTargets, ["knowledge", "skills"]);
  assert.equal(state.version, 3);
  assert.equal(state.retained.knowledge, 1);
  assert.equal(state.retained.skills, 1);
});

test("retains one outer change every seven inner iterations", () => {
  let state = createEvolutionState();

  for (let cycle = 0; cycle < OUTER_CADENCE - 1; cycle += 1) {
    state = advanceIteration(state);
  }
  assert.equal(state.cycle, 6);
  assert.equal(state.coEvolving, null);
  assert.equal(state.outerRetained.environment, 0);

  state = advanceEvolutionState(state);
  state = advanceEvolutionState(state);
  assert.equal(state.stage, "revise");
  assert.equal(state.coEvolving, "environment");

  state = advanceEvolutionState(state);
  assert.equal(state.stage, "retain");
  assert.equal(state.coEvolving, "environment");

  state = advanceEvolutionState(state);
  assert.equal(state.stage, "act");
  assert.equal(state.cycle, 7);
  assert.equal(state.coEvolving, null);
  assert.equal(state.outerRetained.environment, 1);
});

test("caps visible retained counters at 99", () => {
  assert.equal(formatEvolutionCount(0), "");
  assert.equal(formatEvolutionCount(4), "4");
  assert.equal(formatEvolutionCount(99), "99");
  assert.equal(formatEvolutionCount(100), "99+");
});
