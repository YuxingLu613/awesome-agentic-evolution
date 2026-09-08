# Contributing

Thank you for helping improve Awesome Agentic Evolution.

## What We Accept

A resource should be directly related to persistent agent improvement,
co-evolution, open-ended learning, or the infrastructure required to evaluate
and govern those processes.

Method submissions must identify the updated artifact, feedback signal, and
retention into future behavior. Supporting evidence should include:

- A clearly described evolution or update loop.
- Public code, data, logs, or reproducible experiments.
- Evaluation on a held-out task, environment, or benchmark.
- Evidence that improvements persist across attempts or sessions.
- Discussion of safety, regressions, rollback, or failure modes.
- A primary source from the authors or responsible institution.

Linking a paper or releasing code alone is not proof of persistent improvement.
Benchmarks, safety analyses, and infrastructure are welcome in their designated
sections with their role stated explicitly. Uncertain method submissions should
remain in an issue pending evidence, not enter the index as verified methods.

Generic agent frameworks, promotional landing pages, and one-shot
self-correction methods are normally out of scope.

## How to Suggest a Resource

Open a resource-suggestion issue or submit a pull request. Use one bullet per
resource:

```markdown
- [Project or paper](https://canonical-url.example/) — [Paper](https://paper-url.example/).
  Updates reusable procedures from task feedback and retains evaluated revisions.
  **Targets:** Skills.
```

Prefer the canonical project, paper, or author page. Add a code link when the
paper has an official implementation. Do not copy abstracts or marketing text.
List the primary target first, followed only by secondary artifacts that update
independently.
Keep `Targets` on its own line. Place the entry alphabetically in the narrowest
section; attach related sources to the same entry. Do not count paper and code
separately. See [classification boundaries](docs/TAXONOMY.md).
Disclose whether you are an author, maintainer, employee, or otherwise
connected to the submitted work.

Other contribution paths, including verification, reproducibility review,
safety review, section curation, and synthesis, are described in
[CALL_FOR_CONTRIBUTORS.md](CALL_FOR_CONTRIBUTORS.md) and
[COMMUNITY.md](COMMUNITY.md).

## Review Checklist

- [ ] The URL is canonical and reachable.
- [ ] The resource is not already listed.
- [ ] The description is factual and at most 30 words (excluding source links
      and Targets); numeric claims have source locations in an evidence card.
- [ ] The update target and feedback signal are identifiable.
- [ ] The primary target follows the README taxonomy; secondary targets are
      included only when their artifacts update independently.
- [ ] Evaluation evidence is linked or summarized.
- [ ] Safety-sensitive self-modifying systems include an isolation warning.
- [ ] The entry is placed in the narrowest relevant section.
- [ ] `CHANGELOG.md` records the addition.
- [ ] Any existing evidence card is rechecked when classification or claims change.
- [ ] Generated survey exports are current and all local checks pass.

## Contributing Survey Evidence

Follow the [extraction protocol](docs/survey/PROTOCOL.md). Add a record keyed by
the exact README primary URL to [reviews.json](docs/survey/reviews.json), using
the seed records as examples. Record actual source locations, date, extractor,
limitations, reproduction status, safety, and COI. Do not relabel abstract-level
screening as a full evidence review. Missing cards remain `not-extracted`.

For a full evidence review, also record bibliographic authors/version, matched
comparison fields, and the public human-review URL. Explain negative results,
missing controls, and unresolved disagreements. Public PRs preserve credit;
do not create fictitious reviewer endorsements or experiment runs.

## Local Checks

Use Node.js 22 or later and Ruby with its standard-library YAML support. No
package installation is needed for these checks:

```sh
node scripts/build-survey-catalog.mjs
node scripts/build-survey-catalog.mjs --check
node --test test/*_test.mjs
ruby test/community_structure_test.rb
ruby -ryaml -e 'Dir.glob(".github/**/*.{yml,yaml}").each { |f| YAML.load_file(f) }'
DASHBOARD_SKIP_GITHUB=1 node scripts/build-dashboard-data.mjs
git diff --check
```

The first command regenerates `catalog.json`, `catalog.md`, and `EVIDENCE.md`;
include those generated diffs in the same PR. `--check` never writes files and
fails for stale exports, duplicate identities, malformed target labels,
overlong summaries, or incomplete review cards. It validates structure, not
scientific truth. Review the generated category counts after a move or merge.

GitHub's **Check links** workflow checks Markdown links with Lychee. If Lychee
is installed locally, run `lychee --no-progress --max-retries 2 --timeout 20
'./**/*.md'`. Investigate failures; do not suppress them to make a merge pass.
The dashboard still reads README, so ordinary additions keep the existing
daily curation workflow; regeneration is one additional required step.

## Editorial Policy

Maintainers may remove inactive, misleading, duplicated, or unverifiable
resources. Community posts can be included when they contain original technical
analysis, experiments, or implementation details; popularity alone is not a
quality signal.
