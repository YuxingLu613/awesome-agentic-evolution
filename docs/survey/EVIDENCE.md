# Evidence matrix and source notes

Generated from [reviews.json](reviews.json). See the [protocol](PROTOCOL.md).
Source-checked records establish only what the inspected passages say.
They are not full-paper audits, independent replications, or manuscript-ready comparisons.
All unextracted entries remain in the [complete inventory](catalog.md).

| Work | Target | Persistent artifact | Feedback | Reported evaluation |
| --- | --- | --- | --- | --- |
| [STaR](https://arxiv.org/abs/2203.14465) | Parameters | Model parameters trained on generated correct-answer rationales. | Answer correctness; failed generations are retried with the correct answer. | Authors compare iterative rationale training with direct-answer fine-tuning on reasoning datasets, including CommonsenseQA. |
| [Reflexion](https://github.com/noahshinn/reflexion) | Memory | Reflective text in an episodic memory buffer; model weights are unchanged. | Scalar or linguistic task feedback, external or internally simulated. | Authors report sequential decision-making, coding, and reasoning experiments with feedback ablations. |
| [Adaptive Reflective Interactive Agent (ARIA)](https://aclanthology.org/2025.emnlp-industry.115/) | Knowledge | Timestamped domain-knowledge repository. | Targeted human explanations and corrections requested after uncertainty assessment. | Authors report customer due-diligence name screening and public dynamic-knowledge tasks. |
| [Voyager](https://github.com/MineDojo/Voyager) | Skills | Growing library of reusable executable skills, alongside an adaptive curriculum. | Environment observations, execution errors, and self-verification. | Authors report exploration, milestone acquisition, and new-world skill reuse in Minecraft. |
| [AgentFactory](https://github.com/zzatpku/AgentFactory) | Tools | Documented callable Python subagents. | Execution outcomes used to refine saved solutions. | Authors demonstrate capability accumulation and reduced effort for similar tasks. |
| [ADAS](https://github.com/ShengranHu/ADAS) | Topology | Code-defined agent designs and an archive of discoveries. | Evaluation of candidate agent designs in Meta Agent Search. | Authors report coding, science, and mathematics experiments plus cross-domain/model transfer. |
| [Agent0](https://github.com/aiming-lab/Agent0) | Co-evolution | Learned executor and curriculum-agent state. | Executor capability and task difficulty drive competitive curriculum/executor learning. | Authors report mathematical and general reasoning benchmarks for a Qwen3-8B-Base starting model. |

## STaR

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: STaR: Bootstrapping Reasoning With Reasoning (2022).

Retention: Fine-tuned weights seed subsequent generation and training rounds.

Reproduction: not-run. Safety: not-assessed. COI: not-assessed.

Sources inspected:

- [Abstract and submission metadata, v2](https://arxiv.org/abs/2203.14465v2)

Limitations / next extraction:

- Abstract-level extraction only; extract splits, models, compute, seeds, and result tables before comparison.
- Foundational parameter self-improvement, not by itself evidence about deployed multi-tool agents.

## Reflexion

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: Reflexion: Language Agents with Verbal Reinforcement Learning (2023).

Retention: Reflections condition decisions in subsequent trials.

Reproduction: not-run. Safety: not-assessed. COI: not-assessed.

Sources inspected:

- [Abstract and submission metadata, v4](https://arxiv.org/abs/2303.11366v4)

Limitations / next extraction:

- Extract trial/reset boundaries before treating repeated-attempt gains as cross-task transfer.
- Abstract-level screening does not establish matched inference budgets or independent feedback quality.

## Adaptive Reflective Interactive Agent (ARIA)

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: Enabling Self-Improving Agents to Learn at Test Time With Human-In-The-Loop Guidance (2025).

Retention: Knowledge updates and conflict resolution support later changing-domain decisions.

Reproduction: not-run. Safety: not-assessed. COI: not-assessed.

Sources inspected:

- [Abstract and EMNLP Industry 2025 metadata (ARIA)](https://aclanthology.org/2025.emnlp-industry.115/)

Limitations / next extraction:

- Human guidance is part of the method; extract annotation cost and availability rather than labeling it autonomous.
- Public and industrial evaluations require separate access and protocol checks; only the abstract was screened.

## Voyager

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: Voyager: An Open-Ended Embodied Agent with Large Language Models (2023).

Retention: Stored skills support subsequent exploration and tasks in a new Minecraft world.

Reproduction: not-run. Safety: Execution requires isolation; sandbox effectiveness not assessed. COI: not-assessed.

Sources inspected:

- [Abstract and submission metadata, v2](https://arxiv.org/abs/2305.16291v2)

Limitations / next extraction:

- One executable skill library is not two independently evolving Skills and Tools artifacts.
- Abstract-level screening only; inspect curriculum persistence, task splits, trial budgets, and generalization outside Minecraft.

## AgentFactory

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: AgentFactory: A Self-Evolving Framework Through Executable Subagent Accumulation and Reuse (2026).

Retention: The executable subagent library accumulates and is reused for later tasks.

Reproduction: not-run. Safety: Execution requires isolation; sandbox effectiveness not assessed. COI: not-assessed.

Sources inspected:

- [Abstract and ACL 2026 System Demonstrations metadata](https://aclanthology.org/2026.acl-demo.81/)

Limitations / next extraction:

- A demonstration claim does not establish held-out effectiveness; extract tasks, baselines, and budgets from the paper.
- Only abstract and bibliographic metadata were screened; code portability is author-reported.

## ADAS

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: Automated Design of Agentic Systems (2024).

Retention: The meta-agent proposes later designs using the accumulated archive.

Reproduction: not-run. Safety: Generated code requires isolation; sandbox effectiveness not assessed. COI: not-assessed.

Sources inspected:

- [Abstract and submission metadata; first submitted 2024, inspected v2 revised 2025](https://arxiv.org/abs/2408.08435v2)

Limitations / next extraction:

- The abstract motivates the loop; extract selection rules, search/test separation, and evaluation budgets from the full method.
- Do not equate code-defined design search with arbitrary safe self-modification.

## Agent0

Status: source-checked; checked 2026-09-08 by Codex (AI-assisted extraction; no independent human review).

Citation identity: Agent0: Unleashing Self-Evolving Agents from Zero Data via Tool-Integrated Reasoning (2025).

Retention: Successive co-evolution rounds build on learned agents and generated curricula.

Reproduction: not-run. Safety: Tool execution requires isolation; sandbox effectiveness not assessed. COI: not-assessed.

Sources inspected:

- [Abstract and submission metadata, v1](https://arxiv.org/abs/2511.16043v1)

Limitations / next extraction:

- Tool integration is not evidence of tool evolution; classification is Co-evolution plus Parameters.
- Abstract-level screening only; extract reward equations, contamination controls, training cost, and evaluation splits before comparison.
