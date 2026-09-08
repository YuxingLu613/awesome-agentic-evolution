# Evidence and classification review queue

Opened 2026-09-08 during repository organization. These are editorial questions,
not findings of invalidity. No resource was removed for lack of a new extraction
card. Claim a task in a focused PR and link the resulting evidence card/review.

## Priority 1 — Classification and scope

| Resource or group | Question to resolve | Completion evidence |
| --- | --- | --- |
| [AgentSquare](https://arxiv.org/abs/2410.06153) | Does searching a memory/tool-use module change memory contents or tools, or only topology? | Map each secondary label to an independently retained artifact |
| [APEx](https://arxiv.org/abs/2609.02253), [MemSkill](https://arxiv.org/abs/2602.02474), [From Memory to Skills](https://arxiv.org/abs/2607.16621) | Where does episodic memory end and a learned procedure begin? Which trainable components also update? | Method-section and artifact-level classification |
| [MCE](https://arxiv.org/abs/2601.21557) | Are context artifacts factual knowledge, procedural skills, or harness functions? | Separate bi-level operators and offline versus online evaluation |
| [Mem²Evolve](https://arxiv.org/abs/2604.10923), [SciToolAgent-Evo](https://arxiv.org/abs/2607.28692) | Are skill, memory, graph, and tool updates distinct artifacts? | Per-artifact update/retention evidence |
| [COBRA-Skills](https://github.com/Jerry-LuP/COBRA-Skills), [skill-up](https://github.com/alibaba/skill-up) | Does the retained process establish coupled adaptation, rather than skill search or an editable test suite alone? | Identify both changing parties and their coupling; keep or remove Co-evolution accordingly |
| [CORAL](https://arxiv.org/abs/2604.01658), [HELIX](https://arxiv.org/abs/2608.13951), [SafeEvolve](https://arxiv.org/abs/2609.02786) | Which internal targets and external processes actually co-adapt? | Source-located coupling diagram and frozen controls |
| [Meta-Harness](https://github.com/davidyang07/Meta-Harness) | Distinguish this implementation from the research it builds upon; bound replay, isolation, and effectiveness claims | Upstream citation, exact revision, and inspected evaluation/limitations |
| [RubSE](https://arxiv.org/abs/2608.24138), [SkillZip](https://arxiv.org/abs/2608.11079), [SkillZip Pro](https://arxiv.org/abs/2608.30785) | Is the contribution cross-cycle agent improvement, within-output repair, or supporting compression infrastructure? | Persistence horizon and role decision; relocate if needed |
| [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve), [Astar](https://arxiv.org/abs/2608.27287) | Does the evolved program/model constitute an agent update or broader optimization background? | Explicit scope decision and downstream agent relevance |

## Priority 2 — Comparable evidence, not more links

- Complete full-paper extraction for the seven [seed cards](EVIDENCE.md).
- Prioritize Knowledge and Tools coverage using the [inventory](catalog.md),
  without expanding tags merely to balance category counts.
- Separate research evidence from repository-only demos; inspect whether
  released code, data, and logs actually implement the claimed loop.
- Recheck numeric gains, held-out claims, and “reproducible” wording before
  quoting inherited summaries in a manuscript.
- Resolve preprint/venue duplicates and study families that URL matching cannot
  detect. Related benchmark implementations may share lineage without being
  identical studies; record that relationship before combining counts.
- Assess harmful persistence and evaluator manipulation under a consistent
  threat model. Do not run self-modifying or red-team code as part of screening.

## Priority 3 — Synthesis and stewardship

- Compare the existing survey literature before deciding the manuscript's novelty.
- Assign section leads and record two monthly taxonomy reviews; no assignments
  are implied by this document.
- Record actual human evidence reviews and sustained contributions in public
  PRs/issues; do not nominate authors solely from commit counts or AI extraction.
- Turn resolved items into dated decisions in [TAXONOMY](../TAXONOMY.md) and
  [CHANGELOG](../../CHANGELOG.md). Keep disagreement and negative findings visible.
