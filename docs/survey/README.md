# Survey workspace

This is a working evidence base for a future survey, not a finished systematic
review. The [inventory](catalog.md) covers every indexed resource; the
[matrix](EVIDENCE.md) contains only entries with recorded extraction. An entry
without a card is **not-extracted**, not implicitly verified or rejected.

## Read and work in this order

1. Use the [taxonomy](../TAXONOMY.md) to identify the retained update and its
   boundaries. Do not classify by paper title alone.
2. Search the [inventory](catalog.md) or [JSON export](catalog.json), then read
   the paper and associated implementation together.
3. Apply the [protocol](PROTOCOL.md), record source locations and limitations
   in [reviews.json](reviews.json), and regenerate the evidence matrix.
4. Resolve the [review queue](REVIEW_QUEUE.md) before using uncertain entries
   as examples or quantitative evidence.
5. Synthesize comparable groups. Keep paper-reported, reproduced, and
   deployment-only evidence separate.

## Research questions and outline

The intended contribution is a comparison of **retained artifacts, feedback
quality, and evidence for persistence**, rather than another list of systems.
This is a proposed framing, not a claim of novelty over existing surveys.

| Chapter | Research question | Evidence to extract | Planned output |
| --- | --- | --- | --- |
| 1. Scope and review method | What separates persistent evolution from transient correction? | Unit of analysis, search dates, inclusion/exclusion reasons | Search and screening log; scope diagram |
| 2. What evolves | Which of the six internal artifacts is updated? | Primary/secondary targets, representations, granularity | Taxonomy with counterexamples |
| 3. How updates are proposed and retained | Which operators and gates preserve useful changes? | Reflection, RL, search, distillation, selection, rollback | Operator × artifact comparison |
| 4. Coupled adaptation | What changes alongside the agent, and why? | Coupling direction, evaluator/curriculum drift, frozen controls | Co-evolution relationship table |
| 5. Does improvement persist? | Is the gain attributable to retained state? | Reset baselines, ID/OOD transfer, task order, forgetting, compute | Matched-protocol evidence tables |
| 6. Reliability and governance | When do updates contaminate, regress, or evade evaluation? | Threat model, isolation, provenance, recovery, external side effects | Failure taxonomy and mitigation evidence |
| 7. Open problems | Which conclusions generalize beyond one model or benchmark? | Replication gaps, incompatible protocols, costs, uncertainty | Evidence-backed research agenda |

Before claiming a distinct survey contribution, compare the four surveys in
[Start Here](../../README.md#start-here) by coverage dates, taxonomy, evidence
coding, safety treatment, and evaluation methodology. Record differences with
section/table citations; do not infer novelty from their titles.

## Tables to build before manuscript prose

- **Method table:** citation/version, artifact, feedback, update operator,
  retention gate, update timing, and backbone changes.
- **Evaluation table:** task family, train/development/test exposure, fixed-state
  control, compute budget, seeds, uncertainty, transfer, and forgetting.
- **Reproducibility table:** exact revision, dependency/environment record,
  released splits and logs, rerun status, and replication discrepancy.
- **Safety table:** attacker/control boundary, persistence channel, detection,
  acceptance authority, sandbox limitations, rollback, and residual risk.

Do not combine raw scores from different models, budgets, splits, or benchmark
versions into a leaderboard. A repository-only implementation can inform the
engineering section without supplying a verified effectiveness claim.

## Current maturity

The 2026-09-08 restructuring introduces a complete generated inventory and
seven source-checked seed records spanning the six targets and Co-evolution.
The seed checks cover bibliographic pages and abstracts, **not full-paper
extraction or experimental reproduction**. Counts in the inventory measure
index coverage and extraction status, not scientific quality.

The [Roadmap](../../ROADMAP.md) still requires verified core research entries,
stable taxonomy reviews, active section leads, comparable evidence tables, and
a differentiated contribution before a living-survey claim. None of those
gates is satisfied merely by reorganizing the repository.

## Ownership and credit

Use focused PRs for extraction and review. Each record names the actual
extractor, date, and evidence locations; AI-assisted extraction is labeled as
such and does not invent a human reviewer. Public review links and substantive
synthesis contributions support the CRediT process in
[COMMUNITY](../../COMMUNITY.md#credit-and-authorship). Git commit authorship is
not a substitute for paper attribution or future survey authorship assessment.
