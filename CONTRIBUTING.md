# Contributing

Thank you for helping improve Awesome Agentic Evolution.

## What We Accept

A resource should be directly related to persistent agent improvement,
co-evolution, open-ended learning, or the infrastructure required to evaluate
and govern those processes.

Strong submissions usually provide at least two of the following:

- A clearly described evolution or update loop.
- Public code, data, logs, or reproducible experiments.
- Evaluation on a held-out task, environment, or benchmark.
- Evidence that improvements persist across attempts or sessions.
- Discussion of safety, regressions, rollback, or failure modes.
- A primary source from the authors or responsible institution.

Generic agent frameworks, promotional landing pages, and one-shot
self-correction methods are normally out of scope.

## How to Suggest a Resource

Open a resource-suggestion issue or submit a pull request. Use one bullet per
resource:

```markdown
- [Project or paper](https://canonical-url.example/) — One factual sentence
  explaining what evolves, which signal drives the update, and how it is
  evaluated.
  **Targets:** Memory, Skills.
```

Prefer the canonical project, paper, or author page. Add a code link when the
paper has an official implementation. Do not copy abstracts or marketing text.
List the primary target first, followed only by secondary artifacts that update
independently.
Disclose whether you are an author, maintainer, employee, or otherwise
connected to the submitted work.

Other contribution paths, including verification, reproducibility review,
safety review, section curation, and synthesis, are described in
[CALL_FOR_CONTRIBUTORS.md](CALL_FOR_CONTRIBUTORS.md) and
[COMMUNITY.md](COMMUNITY.md).

## Review Checklist

- [ ] The URL is canonical and reachable.
- [ ] The resource is not already listed.
- [ ] The description is factual and under 30 words.
- [ ] The update target and feedback signal are identifiable.
- [ ] The primary target follows the README taxonomy; secondary targets are
      included only when their artifacts update independently.
- [ ] Evaluation evidence is linked or summarized.
- [ ] Safety-sensitive self-modifying systems include an isolation warning.
- [ ] The entry is placed in the narrowest relevant section.
- [ ] `CHANGELOG.md` records the addition.

## Editorial Policy

Maintainers may remove inactive, misleading, duplicated, or unverifiable
resources. Community posts can be included when they contain original technical
analysis, experiments, or implementation details; popularity alone is not a
quality signal.
