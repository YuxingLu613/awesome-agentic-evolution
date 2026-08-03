# Changelog

All notable editorial updates are recorded here.

## 2026-08-03

### Field updates

- Indexed WebEvolver, which co-trains an agent policy and world model from real
  web trajectories, then reuses model-generated trajectories for persistent
  policy improvement.

## 2026-08-02

### Field updates

- Added PerMemSafe, an ACL 2026 benchmark for implicit personalized safety in
  long-horizon self-evolving memory, with public data, logs, and evaluation code.

## 2026-08-01

### Field updates

- Indexed Living-Harness, which converts evaluated trajectories into bounded
  episodic-memory and state-graph repairs that persist across future episodes.
- Indexed SEAL, which exposes failures in self-authored verification and uses a
  sealed external audit plus whole-state retention to block clear regressions.

## 2026-07-31

### Field updates

- Indexed ARIA, which turns targeted human corrections into timestamped
  external knowledge and resolves contradictions on changing-domain tasks.
- Indexed Double Ratchet, which co-evolves an inspectable evaluation metric
  with lifecycle-managed skills and validates metric integrity on locked sets.
- Indexed Group-Evolving Agents, which turns populations of agent workflows
  into the evolutionary unit and retains improvements shared across lineages.

## 2026-07-30

### Field updates

- Indexed Retrospective Harness Optimization, which uses self-validation,
  self-consistency, and self-preference over past trajectories to update a
  persistent agent harness without labeled validation data.
- Added RSIBench-Data, a controlled and auditable benchmark for whether
  researcher agents can iteratively improve training-data strategies from
  checkpoint feedback while preserving the strongest candidate.

## 2026-07-29

### Field updates

- Indexed SAGE, an ACL 2026 framework that learns a persistent skill library from
  sequential task experience using outcome-grounded reinforcement signals.

### Repository changes

- Reorganized the public index around Parameters, Memory, Knowledge, Skills,
  Tools, Topology, and Co-evolution, with explicit multi-target annotations.
- Rebuilt the dashboard's persistent improvement loop as an accessible
  four-stage Act–Assess–Revise–Retain simulation spanning six inner evolution
  targets and five co-evolution factors. Each iteration can revise one or more
  components, distinguishes accepted write-backs from rejected variants, and
  advances the agent version only after retention; the outer ecosystem evolves
  on a slower seven-iteration cadence.

## 2026-07-28

### Field updates

- Indexed SelfMem, a feedback-driven method for optimizing reusable agent memory
  strategies with long-context benchmark evaluation.

### Repository changes

- Created the repository and curation policy.
- Added the initial surveys, frameworks, research papers, benchmarks, and
  technical articles.
- Added contribution templates and automated Markdown link checking.
- Added the community contributor call, governance model, and staged roadmap
  toward a structured evidence base, living survey, and conference tutorial.
- Expanded resource submissions to capture evolution targets, feedback,
  persistent artifacts, evaluation, reproducibility, safety, and conflicts of
  interest.
- Clarified that sustained, substantive community contributions can qualify
  contributors for future survey-paper authorship.
- Added a repository-linked GitHub Pages dashboard with research-landscape,
  activity, contribution, and roadmap views; it refreshes on repository updates
  and on a daily schedule.
