# Community, Survey, and Tutorial Design

## Decision

Awesome Agentic Evolution will optimize first for community and field impact.
The repository will remain a high-signal curated resource while accumulating
the structured evidence needed for a future living survey and conference
tutorial.

The selected operating model is community-first and survey-ready:

1. an awesome list for discovery;
2. a reviewed evidence base for comparison;
3. periodic synthesis for a living survey; and
4. tutorial modules and reproducible demonstrations derived from the same
   evidence.

## Goals

- Make it easy to contribute one small, verifiable improvement.
- Preserve quality as the number of contributors grows.
- Give substantial community work a clear path to publication authorship.
- Capture evidence in a form that supports taxonomy, comparison, and synthesis.
- Reuse reviewed material across the repository, survey, and tutorial.

## Non-Goals

- Maximizing the number of links or GitHub stars.
- Treating generic agent frameworks as self-evolving systems.
- Equating one-shot self-correction with persistent improvement.
- Automatically granting paper authorship for a single repository submission.
- Building manuscript or tutorial infrastructure before the evidence is ready.

## Community Flywheel

The primary flow is:

```text
discover → structure → verify → merge → recognize → synthesize
    ↑                                                ↓
    └────────────── new questions and gaps ──────────┘
```

Contributors submit resources or corrections. Curators maintain focused
sections. Evidence, reproducibility, and safety reviewers verify claims.
Section leads synthesize mature areas and identify open questions.

## Recruitment Model

The project uses an invited-core, open-contribution model.

First, invite 6–10 researchers or maintainers as founding curators across the
main taxonomy. Their role is scoped and does not imply a long-term commitment
or future authorship. Second, publish an open call for resource submission,
verification, replication, safety review, section curation, and synthesis.

Recognition includes public contribution history, contributor listings, and
monthly highlights. Authors may submit their own work with a conflict-of-
interest disclosure.

## Review and Governance

Ordinary additions require one curator or maintainer review. Strong empirical
claims, recursive self-modification, and safety-sensitive systems should
receive a second evidence or safety review.

Disputed entries are labeled `needs discussion` and remain unfeatured until
resolved. Broken or superseded resources are archived with context. Inactive
curator areas are reopened for ownership. Maintainers document significant
objections and make the final editorial decision.

## Survey-Ready Evidence Architecture

The README remains the reader-facing view. A later structured catalog will
become the evidence source of truth. Each record should capture:

- canonical metadata and resource type;
- evolution target and update mechanism;
- feedback or optimization signal;
- persistent artifact;
- evaluation protocol and evidence;
- reproducibility status;
- safety, regression, rollback, and isolation information;
- open questions; and
- contributors, reviewers, and last verification date.

The planned data flow is:

```text
issue or PR → schema validation → curator review → evidence record
            → README entry → monthly and quarterly synthesis
```

Automated checks cover required fields, enumerations, duplicate URLs, broken
links, and changelog updates. Human review determines whether improvement is
persistent and whether the evidence supports the stated claim.

## Survey Conversion

A manuscript begins only after the repository reaches the gates in
`ROADMAP.md`. Its intended novelty is a system-level account of the transition
from individual self-improvement to co-evolving and open-ended agent
ecosystems.

Contribution records will follow CRediT-style roles. Resource submissions
receive repository credit and acknowledgement. Sustained evidence curation,
reproducibility work, section leadership, cross-category analysis, writing,
software, visualization, and revision can qualify contributors for
survey-paper authorship. Maintainer status or invitation is not required. The
evaluation process is published before formal writing begins and the criteria
are frozen before manuscript submission.

## Tutorial Conversion

The tutorial reuses the evidence base and is organized into:

1. foundations and terminology;
2. evolution-target taxonomy;
3. feedback and optimization mechanisms;
4. memory, workflow, and code-evolution demonstrations;
5. evaluation and safety; and
6. co-evolution, open-endedness, and open problems.

Every demo pins dependencies, inputs, and expected results and includes a clean-
environment smoke test. Self-modifying code runs only in an isolated sandbox.

## Operations and Success Criteria

Discovery runs daily, curator triage weekly, community highlights monthly, and
landscape synthesis quarterly. The first 90 days are evaluated using external
and returning contributors, verified records, review latency, taxonomy
coverage, and reproducible demos. Stars and impressions are secondary.

## Validation

Repository checks verify that community entry points exist, the README links to
them, the resource issue form collects survey-ready evidence, YAML parses, and
GitHub Actions runs the structural test. Later schema and demo features must add
their own failing tests before implementation.
