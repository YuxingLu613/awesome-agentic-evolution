# Evidence extraction and comparison protocol

[Survey workspace](README.md) · [Inventory](catalog.md) · [Taxonomy](../TAXONOMY.md)

## 1. Search and screening

The inherited awesome list was incrementally curated, not collected by a
complete systematic-search protocol. Do not retrospectively report a PRISMA
flow, exhaustive coverage, or historical search counts without records.

For each future search batch, record in its PR or dated review note:

- Search date, platform, exact query, time range, and result limit.
- Primary sources searched: arXiv, ACL Anthology, OpenReview, official project
  repositories, and institutional technical reports.
- Social leads separately from the first-party evidence used for inclusion.
- Screened identifiers; include, exclude, merge-with-existing, or defer decision;
  exclusion/defer reason and reviewer.
- Paper/code/project-page relations and relevant source versions.

For methods, require an identifiable update target, feedback signal, retained
artifact, and an evaluation protocol or a clearly labeled evidence gap.
Benchmark, safety-analysis, survey, and infrastructure resources have distinct
roles; do not require them to evolve, and do not count them as proven methods.
Proposed additions with insufficient loop evidence belong in an issue pending
clarification, not in the method count. Legacy gaps remain visible in the queue.

## 2. Identity and deduplication

Use one README entry per work, attaching its official paper, repository, and
first-party explanation. Preserve authors' names and credit in citation
metadata. A preprint and later venue version normally remain one study;
record the version actually inspected. A major follow-up is a separate study
only when its question or evidence changes, with its predecessor documented.

The validator detects repeated normalized titles, canonical URLs, and arXiv IDs
across abs/PDF/HTML/version variants. It cannot discover a renamed repository,
an unrelated same-name project, or an unlinked preprint–venue pair: check these
manually. The catalog `id` is the README primary URL; migrate a review key when
that URL changes. `sourceProfile` only means paper-linked, repository-only, or
web-only; it says nothing about peer review or implementation completeness.

## 3. Extraction fields

Record absent information explicitly as **not reported**, **not assessed**, or
**not applicable**, with a reason. These are different from a negative result.
Do not infer a year from an arXiv ID, publication status from a README badge,
or a released implementation from the existence of an empty repository.

| Field | Required content |
| --- | --- |
| Bibliographic identity | Full title, authors, year, venue/preprint status, DOI or arXiv/Anthology ID, inspected version |
| Source location | URL plus section, table, figure, or code path/revision supporting each claim |
| Artifact and target | Representation, primary class, independently updated secondary artifacts |
| Feedback | Origin, cost, noise, independence, optimizer visibility, and susceptibility to manipulation |
| Update and retention | Proposal operator, selection rule, persistence horizon, rollback and rejected candidates |
| Timing | Training-time, between episodes/sessions, or online/test-time; which model components are frozen |
| Evaluation | Tasks, splits, backbone, baseline, budget, metrics, seeds, uncertainty, transfer and forgetting |
| Reproducibility | Versioned code/data/logs, environment, exact command, what was actually rerun |
| Safety and COI | Threat model, authority boundary, isolation limitations, data provenance, and disclosed relationship |
| Review provenance | Actual extractor/reviewer, date, public review link, disagreements, and unresolved questions |

Keep the README summary at most 30 words excluding source links and Targets.
Put detailed performance claims and caveats in the evidence record, not in a
long promotional bullet. Attach safety warnings when executable self-modification
or attack resources are involved; a warning is not evidence of safe execution.

## 4. Status meanings and promotion

| Status | Meaning | May count toward the verified-core gate? |
| --- | --- | --- |
| `not-extracted` | No structured card is recorded; historical editorial checks are not reconstructed automatically | No |
| `source-checked` | Specified primary-source passages were inspected; card states the limited scope | No |
| `needs-review` | A card exists but an unresolved classification or evidence issue blocks use | No |
| `evidence-reviewed` | Full extraction and a public human review support a bounded evidence claim | Only if it is a unique, in-scope core research study |

Reproduction is an independent field, not a status inferred from code or CI.
Use `not-run` until an actual experiment is rerun. Record failed replications
as findings, not omissions. A source-checked abstract is useful for triage, but
cannot establish train/test separation, statistical validity, or safety.

The version-1 JSON schema requires source locations, artifact, feedback,
retention, evaluation, limitations, reproduction, safety, COI, extractor, and
date for any card. An `evidence-reviewed` card additionally requires a public
GitHub human-review URL and comparison fields: `backbone`, `tasksAndSplits`,
`baseline`, `updateBudget`, `metrics`, `uncertainty`, `transferAndForgetting`.
Passing that schema does not verify the truth of the contents; the reviewer
must check the source. Any “not reported” field must constrain the claim.

## 5. Comparison controls

Before treating two results as comparable, check:

1. Same task definition, benchmark version, split, and metric direction.
2. Same backbone or a clearly stratified model comparison.
3. Frozen-state baseline and equalized inference, update, and evaluator budgets.
4. No optimizer access to final held-out labels, graders, or evaluation traces.
5. Multiple seeds/task orders, denominators, uncertainty, and all-run summaries.
6. Retention beyond the update cycle, transfer, forgetting, and regression tests.
7. Independent acceptance controls when the evaluator itself evolves.

An online test stream used for updates is not an untouched test set. Label
prequential/online scores separately from final frozen evaluation. Without a
reset-state control, do not attribute every gain to persistent learning.

## 6. Maintenance

README is the index source of truth; `reviews.json` contains evidence absent
from the short summaries. Generated catalog/matrix files are never edited by
hand. On source, title, classification, or claim changes, inspect any existing
card for staleness, update its provenance or set `needs-review`, regenerate,
and run the [local checks](../../CONTRIBUTING.md#local-checks).

When a source is withdrawn, inaccessible, or superseded, record the reason and
successor in a PR/queue before moving or archiving it. Preserve the public
decision trail. This protocol does not authorize executing untrusted code,
changing external evaluations, or overriding contributor credit.
