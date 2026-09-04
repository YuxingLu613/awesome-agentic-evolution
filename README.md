# Awesome Agentic Evolution

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![Link check](https://github.com/YuxingLu613/awesome-agentic-evolution/actions/workflows/links.yml/badge.svg)](https://github.com/YuxingLu613/awesome-agentic-evolution/actions/workflows/links.yml)
[![Research dashboard](https://img.shields.io/badge/research_dashboard-explore-2e654b)](https://yuxinglu613.github.io/awesome-agentic-evolution/)

> From self-improving agents to co-evolving, open-ended agent ecosystems.

A community-curated index of agents that preserve improvements across attempts,
sessions, or generations. The collection maps what changes, what feedback drives
the change, what persists, and how the claimed improvement is evaluated.

[Explore the living research dashboard →](https://yuxinglu613.github.io/awesome-agentic-evolution/)

<p align="center">
  <a href="https://yuxinglu613.github.io/awesome-agentic-evolution/">
    <img
      src="./site/assets/persistent-agent-evolution-v1-v3-loop.gif"
      width="680"
      alt="Persistent agent evolution from v1 to v3 across Act, Assess, Revise, and Retain"
    >
  </a>
</p>

**Last editorial review:** 2026-09-04

## Contents

- [Scope](#scope)
- [Taxonomy](#taxonomy)
- [Start Here](#start-here)
- [Resource Map](#resource-map)
- [Benchmarks and Evaluation](#benchmarks-and-evaluation)
- [Articles and Technical Posts](#articles-and-technical-posts)
- [Related Awesome Lists](#related-awesome-lists)
- [Community and Long-Term Outputs](#community-and-long-term-outputs)
- [Contributing](#contributing)

## Scope

Agentic evolution requires a persistent update: an artifact changed during one
improvement cycle must influence future behavior. A resource is in scope when
it makes at least three elements legible:

1. the artifact being updated;
2. the feedback, reward, evaluator, or environmental signal driving the update;
3. the retained result and an evaluation showing whether it helped.

Generic agent frameworks, static retrieval systems, and one-shot
self-correction are out of scope unless they participate in a persistent
improvement loop. Benchmarks and evaluators are listed separately because they
measure evolution but do not necessarily evolve themselves.

## Taxonomy

The primary classification question is **which persistent artifact is edited**,
not which mechanism a paper uses or which application it studies.

- **Parameters:** model weights, policies, adapters, or other trainable state.
- **Memory:** agent-specific traces, reflections, summaries, and experience
  records retained across future attempts.
- **Knowledge:** external or decontextualized world knowledge, retrieval
  corpora, knowledge bases, schemas, and reusable factual assets.
- **Skills:** reusable procedural instructions, routines, and callable
  strategies for completing classes of tasks.
- **Tools:** executable interfaces, APIs, code modules, and expert agents the
  agent can invoke.
- **Topology:** prompts, routing, control flow, graph connectivity, role
  decomposition, and run-time orchestration.
- **Co-evolution:** coupled change in the agent and one or more external factors:
  objectives, evaluators, environments, update mechanisms, or populations.

Resources may have multiple targets, but each is listed once under its primary
target. The `Targets` line records other independently editable artifacts.
Implementation code is not a separate category: classify the behavioral
artifact that the code changes—for example, a generated tool under **Tools** or
a rewritten control graph under **Topology**.

**Boundary rule:** self-history belongs to **Memory**; externally reusable world
information belongs to **Knowledge**. When a system bundles both, annotate both
only if they can be updated independently.

## Start Here

- [Self-Improvements in Modern Agentic Systems: A Survey](https://arxiv.org/abs/2607.13104)
  — A 2026 system-level view of self-induced updates to foundation models and
  agent scaffolds.
- [A Survey of Self-Evolving Agents: What, When, How, and Where to Evolve](https://arxiv.org/abs/2507.21046)
  — Organizes the field by update target, timing, feedback, and application.
- [A Comprehensive Survey of Self-Evolving AI Agents](https://arxiv.org/abs/2508.07407)
  — Presents a feedback-loop perspective spanning models, workflows, and
  domain-specific evolution.
- [A Survey on Self-Evolution of Large Language Models](https://arxiv.org/abs/2404.14387)
  — Background on self-generated experience and parameter-level updates.

## Resource Map

Entries are grouped by their primary persistent target. Official repositories
are preferred as the main link; papers and first-party explanations are
attached to the same entry instead of being counted again.

### Parameters

- [STaR](https://arxiv.org/abs/2203.14465) — Iteratively generates successful
  rationales and updates model parameters on the retained examples.
  **Targets:** Parameters.
- [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) — Uses the
  model as both instruction follower and judge during iterative training.
  **Targets:** Parameters.
- [AgentEvolver](https://github.com/modelscope/AgentEvolver) — Couples task
  generation, experience synthesis, and reinforcement learning for persistent
  agent improvement.
  **Targets:** Parameters, Memory, Co-evolution.
- [Benchmark-as-Teacher](https://github.com/AutoMedBench/Benchmark-as-Teacher)
  — [Paper](https://arxiv.org/abs/2608.16211). Uses held-out-safe stage states
  and stage rubrics to select curricula, updates the policy with GRPO, and
  gates each checkpoint on the fixed benchmark contract.
  **Targets:** Parameters, Co-evolution.
- [Astar](https://arxiv.org/abs/2608.27287) — Trains an evolution-guiding model
  from industrial iteration histories, uses a surrogate reward evaluator, and
  guides 20 consecutive iterations with offline and online gains.
  **Targets:** Parameters.
- [RecurSE: Bounded Recursive Self-Evaluation for LLM Rubric Judges](https://arxiv.org/abs/2608.24231)
  — Co-evolves a rubric judge and checker with decoupled self-reward,
  validation-based early stopping, held-out generalization, and ablations
  against frozen-checker and teacher baselines.
  **Targets:** Parameters, Co-evolution.
- [CAFE: Self-Improving Search Agents Need Co-Evolving Feedback](https://arxiv.org/abs/2608.24794)
  — Co-evolves a search agent and critic from matched failures, alternating
  online and offline feedback updates with gains across seven search benchmarks
  and six out-of-domain sets.
  **Targets:** Parameters, Co-evolution.
- [ARISE-RL: Reward-Gated Self-Evolution](https://arxiv.org/abs/2609.01058)
  — Co-evolves a rubric/task generator and tool-using solver, gating
  memory-augmented self-distillation on reward improvement across deep-research
  and travel-planning tasks.
  **Targets:** Parameters, Co-evolution.
- [GenRubric](https://github.com/foggpoy/GenRubric) — [Paper](https://arxiv.org/abs/2608.29856).
  Uses rubric-induced self-consistency rewards to evolve rubric-generation
  parameters from unlabeled queries, with agreement gains on human-annotated
  benchmarks and held-out domains.
  **Targets:** Parameters.
- [FlowBalance](https://arxiv.org/abs/2609.03241) — Reweights policy updates
  from verifier-derived group advantage and calibrated self-guidance, retaining
  or reversing on-policy signals to improve reasoning reward and training
  stability.
  **Targets:** Parameters.

### Memory

- [Reflexion](https://github.com/noahshinn/reflexion) — [Paper](https://arxiv.org/abs/2303.11366).
  Stores verbal reflections in episodic memory for later trials.
  **Targets:** Memory.
- [Luclas](https://github.com/LuclasM/Luclas) — Learns from task outcomes through
  persistent SQLite episodes and lessons plus versioned self-updating policies,
  with daily compression, explicit corrections, and inspectable drift
  safeguards.
  **Targets:** Memory, Topology.
- [ExpeL](https://github.com/LeapLabTHU/ExpeL) — [Paper](https://arxiv.org/abs/2308.10144).
  Distills transferable insights from successes and failures without updating
  model weights.
  **Targets:** Memory.
- [SelfMem](https://arxiv.org/abs/2607.03726) — Uses memory tools and feedback signals
  to evaluate and refine a reusable long-context memory strategy.
  **Targets:** Memory.
- [DiagEvo](https://arxiv.org/abs/2609.00768) — Extracts recurring failure causes
  into hierarchical error memory, targets challenger generation at active
  weaknesses, and improves nine benchmarks across three solvers.
  **Targets:** Memory.
- [APEx: Distillation of Agent Procedural Experience](https://arxiv.org/abs/2609.02253)
  — Distills trajectory memories into procedural skills, then adapts a research
  planner with reward-guided test-time reinforcement learning across seven
  benchmarks.
  **Targets:** Memory, Parameters.
- [CHIME: Credit-Aware Hierarchical Memory Evolution](https://arxiv.org/abs/2609.02074)
  — Separates planning and execution memory banks, attributes outcomes before
  retention, and transfers credit-aware memories across four long-horizon
  benchmarks and backbone models.
  **Targets:** Memory.
- [SimSkill](https://github.com/qiliuchn/SimSkill-V1) — [Paper](https://arxiv.org/abs/2609.03753).
  Explores SUMO traffic tasks, verifies solutions with action–critic feedback,
  and consolidates episodic, procedural, and semantic memories into a reusable
  library evaluated on two held-out benchmarks.
  **Targets:** Memory, Knowledge, Skills.
- [MemSkill](https://github.com/ViktorAxelsen/MemSkill) — [Paper](https://arxiv.org/abs/2602.02474).
  Learns memory-skill selection and evolves reusable routines from difficult
  cases.
  **Targets:** Memory, Skills.
- [Living-Harness](https://arxiv.org/abs/2607.26598) — Converts evaluated
  trajectories into bounded episodic-memory and state-graph repairs that
  persist across episodes and improve interactive benchmark performance.
  **Targets:** Memory, Topology.
- [CrystalMem](https://arxiv.org/abs/2608.00303) — Reversibly demotes and
  verifies memory entries under changing byte budgets, using influence-aware
  retention and evaluation across seven environments, seventeen methods, and
  six backbones.
  **Targets:** Memory.
- [RoMeRL](https://github.com/YOUNG-fnxm/RoMeRL) —
  [Paper](https://arxiv.org/abs/2608.02508). Uses bounded task-slot memory
  states whose contents and utilities update from environment rewards,
  reducing persistent reward contamination across lifelong benchmarks.
  **Targets:** Memory.
- [Tree-of-Experience](https://arxiv.org/abs/2608.09044) — Organizes reusable
  experience as a reasoning-aligned tree, calibrates path reliability from
  environmental outcomes, and evaluates transfer on Game of 24 and
  FinEvolveBench.
  **Targets:** Memory.
- [Evolve](https://github.com/AgentToolkit/altk-evolve) — [Paper](https://arxiv.org/abs/2603.10600).
  Learns reusable memory guidelines from trajectories with conflict resolution,
  feeds them into later sessions, and reports AppWorld reliability gains with
  provenance-aware storage.
  **Targets:** Memory.
- [Areev](https://github.com/AreevAI/areev) — Uses deterministic, evidence-citing
  analyzers to propose memory changes, requires named approval, stores inverse
  records, and remeasures outcomes so regressions can be reverted.
  **Targets:** Memory, Tools.
- [AutoMem](https://arxiv.org/abs/2608.14621) — Searches task-adaptive memory
  architectures from historical trajectories and failure-guided module
  feedback, reporting gains across three benchmarks and two backbones.
  **Targets:** Memory, Topology.
- [KOPE: Experience-Driven Workflow and Experience Graph Memory](https://arxiv.org/abs/2608.25570)
  — Records hardware-kernel optimization decisions and correctness/performance
  feedback in an experience graph, then retrieves it under a fixed budget for
  continual optimization.
  **Targets:** Memory.
- [OpenViking](https://github.com/volcengine/OpenViking) — Stores memories,
  resources, and skills in a browsable context filesystem; commits session
  experience to long-term memory and reports LoCoMo/tau2-bench gains with
  reproducible scripts.
  **Targets:** Memory, Knowledge, Skills.
- [MemOS](https://github.com/MemTensor/MemOS) — Applies natural-language
  feedback and correction to persistent memory, adds tiered skill evolution,
  and publishes LoCoMo, LongMemEval, and OmniMemEval results.
  **Targets:** Memory, Skills, Knowledge.
- [Membrane](https://github.com/brightjade/membrane) — [Paper](https://arxiv.org/abs/2606.05743).
  Evolves a contrastive safety-memory store from paired harmful/safe prompts
  and label-free test-time review, with HarmBench and AgentHarm evaluations.
  **Targets:** Memory.
- [A Self-Evolving Multi-Agent Framework Defense against LLM Jailbreak Attacks](https://arxiv.org/abs/2608.26008)
  — Abstracts successful jailbreaks into reusable method-level rules, retains
  them across interactions, and reduces attack success across four families
  while preserving benign utility.
  **Targets:** Memory.
- [Recuris](https://github.com/Gen-Verse/Recuris) — [Paper](https://arxiv.org/abs/2608.24876).
  Evolves targeted Skill Memory from structured traces with paired held-out
  validation, releases frozen splits, and reports cross-task transfer across
  37 model–benchmark pairs.
  **Targets:** Memory, Skills.
- [EvolveBank](https://github.com/C10udsea/evolvebank) — Distills success and
  failure trajectories into a deduplicated strategy bank, tracks downstream win
  rates, freezes the bank for held-out τ-bench evaluation, and reports a parity
  result.
  **Targets:** Memory.
- [Reflexio](https://github.com/ReflexioAI/reflexio) — Turns user corrections and
  successful interactions into persistent profiles and playbooks, aggregates
  approved cross-user lessons, and reports a warm-baseline GDPVal comparison
  across two host agents.
  **Targets:** Memory, Skills.
- [earcon](https://github.com/370540009gg-cmd/earcon) — A local
  OpenAI-compatible proxy that distills session outcomes into SQLite experience
  cards and injects them into future tasks, with a discrete-action maze
  evaluation.
  **Targets:** Memory.
- [Rudder](https://github.com/Undertone0809/rudder) — Preserves reviewed lessons,
  decisions, and skills from agent work in durable context for future runs,
  with a documented local-case-equal GDPVal harness comparison.
  **Targets:** Memory, Skills, Topology.
- [SSE-Bio](https://github.com/ZhaohanM/SSE-Bio) — [Paper](https://arxiv.org/abs/2608.22132).
  Maintains structured reasoning and template memory, trains a retrieval proxy
  from decision-contrastive feedback, and reports gains on three biomedical QA
  benchmarks.
  **Targets:** Memory, Parameters.

### Knowledge

- [Adaptive Reflective Interactive Agent (ARIA)](https://aclanthology.org/2025.emnlp-industry.115/)
  — Maintains a timestamped knowledge repository from targeted human guidance,
  detects conflicts, and evaluates adaptation on changing-domain tasks.
  **Targets:** Knowledge.
- [CoEvoKG](https://github.com/lazzy1225/CoEvoKG) — [Paper](https://arxiv.org/abs/2608.01904).
  Writes verified search evidence back into a knowledge graph that co-evolves
  with a proposer–solver loop and is evaluated on six multi-hop QA benchmarks.
  **Targets:** Knowledge, Co-evolution.
- [Knowledge-Centric Self-Improvement](https://github.com/recursive-knowledge/KSI)
  — [Paper](https://arxiv.org/abs/2607.19592). Runs disposable agents that
  distill evidence-grounded forums into shared knowledge, then seeds later
  attempts; gains transfer across held-out tasks and model families.
  **Targets:** Knowledge.
- [GeoForge](https://arxiv.org/abs/2608.10494) — Converts grounded trajectories
  into workflow-graph, action-experience, and SOP memories, then safety-gated
  distillation reuses them for tool planning across geospatial benchmarks.
  **Targets:** Knowledge, Topology.
- [VISA: Agentic Self-Evolving Data Synthesis for Multimodal Instruction Following](https://arxiv.org/abs/2608.26013)
  — Synthesizes multimodal instructions from persistent constraint memory,
  writes verifier and target-model failures back into later rounds, and improves
  MM-IFEval while preserving general capability across seven public benchmarks.
  **Targets:** Knowledge, Memory.
- [ProofEvolve: Neuro-Symbolic Evolution for Formal Automated Theorem Proving](https://arxiv.org/abs/2608.26334)
  — Evolves Lean-verified proof DAGs with neural variation operators, retaining
  checked schemas across problems and exposing residual subgoals for typed
  recombination across three benchmarks.
  **Targets:** Knowledge, Topology.

### Skills

- [SkillZip](https://arxiv.org/abs/2608.11079) — Compresses evolving skills with
  typed structural sharing and coverage constraints; its Zip-on-Write mode
  incorporates each patch without replaying tasks or reparsing history.
  **Targets:** Skills.
- [SkillZip Pro](https://arxiv.org/abs/2608.30785) — Continually compresses
  progressively loaded skill bundles after each evolution patch, preserving
  routes and reporting 38% bundle-token reduction without quality loss in a
  production moderation harness.
  **Targets:** Skills.
- [SkillProx](https://github.com/Steven011018/SkillProx) — [Paper](https://arxiv.org/abs/2608.07449).
  Runs a closed-loop forward/backward skill-evolution process: measured outcomes
  roll back regressions, and utility audits gate consolidation or removal before
  held-out evaluation; official code is forthcoming.
  **Targets:** Skills.
- [SkillHEX](https://arxiv.org/abs/2608.05628) — Uses falsifiable self-tests
  and evidence-guided tree search to explore persistent skill revisions under
  sparse feedback, evaluated on 87 SkillsBench tasks.
  **Targets:** Skills.
- [Learning Globally Reusable Skills for Coding Agents](https://arxiv.org/abs/2608.06153)
  — Co-evolves a skill-relation graph with global skill consolidation and replay
  verification, reporting cross-task and regression-aware gains on coding-agent
  tasks.
  **Targets:** Skills, Topology.
- [OpenSkill](https://openlair.github.io/openskill/) — [Paper](https://arxiv.org/abs/2606.06741).
  Builds and refines reusable skills against self-created, evidence-grounded
  virtual tests, then evaluates frozen skills on held-out target tasks.
  **Targets:** Skills.
- [AgentDescent](https://github.com/Birfy/agentdescent) — [Paper](https://github.com/Birfy/agentdescent/blob/main/paper/main.pdf).
  Evolves skills, prompts, harness modules, and verifiers through parallel
  proposals, reward scoring, and asynchronous aggregator merges, with live-model
  results and per-run raw data.
  **Targets:** Skills, Tools, Topology.
- [CoEvoSkills](https://github.com/Zhang-Henry/CoEvoSkills) — [Paper](https://arxiv.org/abs/2604.01687).
  Builds multi-file Skills through a generate–verify–refine loop, co-evolving a
  skill generator and surrogate verifier before isolated fresh-agent transfer tests.
  **Targets:** Skills, Co-evolution.
- [SkillOpt](https://github.com/microsoft/SkillOpt) — [Paper](https://arxiv.org/abs/2605.23904).
  Optimizes natural-language procedures from scored trajectories with
  validation-gated updates.
  **Targets:** Skills.
- [PRACTICE](https://arxiv.org/abs/2608.30760) — Trains a dedicated learner to
  add, refine, merge, and remove a persistent skill library from trajectories,
  improving successive rounds for frozen embodied executors.
  **Targets:** Skills.
- [SkillGLoW: Procedural-Family Skill Consolidation](https://arxiv.org/abs/2609.02217)
  — Aggregates task-local skills into procedural-family priors, admits them only
  after non-degradation checks, and transfers compact procedures across four
  continual task domains.
  **Targets:** Skills.
- [HypoForge](https://arxiv.org/abs/2608.25770) — Learns reusable scientific
  skills from stage-specific critique and execution outcomes, enabling
  continual improvement without fine-tuning and outperforming framework and
  skill-level baselines.
  **Targets:** Skills.
- [WikiSkill](https://arxiv.org/abs/2608.27454) — Consolidates execution
  experience into a persistent wiki that guides later skill updates, with
  cross-model transfer and ablations showing knowledge accumulation matters.
  **Targets:** Skills, Knowledge.
- [PILOT in the Loop](https://arxiv.org/abs/2608.26530) — Steers active workers
  during execution and distills procedures and failure modes into reusable
  skills and memory, improving three long-horizon benchmarks.
  **Targets:** Skills, Memory.
- [RedEvoAgent](https://arxiv.org/abs/2608.27439) — Distills cross-case red-team
  trajectories into attack skills, retains only validation-improving updates
  through a ratchet, and transfers across target harnesses. Run only in an
  isolated sandbox.
  **Targets:** Skills.
- [Voyager](https://github.com/MineDojo/Voyager) — [Paper](https://arxiv.org/abs/2305.16291).
  Grows an executable skill library through environment feedback and an
  automatic curriculum.
  **Targets:** Skills, Tools, Co-evolution.
- [MUSE-Autoskill](https://arxiv.org/abs/2605.27366) — Treats skills as
  testable, reusable assets that are refined across tasks.
  **Targets:** Skills.
- [SAGE](https://aclanthology.org/2026.acl-long.69/) — Accumulates a persistent
  skill library and trains skill generation and use with outcome-grounded
  rewards.
  **Targets:** Parameters, Skills.
- [From Memory to Skills](https://arxiv.org/abs/2607.16621) — Governs the
  evidence-grounded conversion of retained traces into callable skills.
  **Targets:** Memory, Skills.
- [Retrospective Harness Optimization](https://github.com/wbopan/retro-harness)
  — [Paper](https://arxiv.org/abs/2606.05922). Uses unlabeled past trajectories
  and self-preference to retain skill and tool updates that improve held-out
  behavior.
  **Targets:** Skills, Tools.
- [Search2Skill](https://arxiv.org/abs/2608.05245) — Searches for capability
  gaps, distills external evidence into a persistent skill library with
  rubric-based reinforcement learning, and improves streaming and held-out
  expert-domain evaluation.
  **Targets:** Skills, Parameters.
- [When Self-Evolution Backfires](https://arxiv.org/abs/2608.05810) — Shows
  skill pools can contaminate later skills and proposes pre-commit heterogeneous
  critics plus marginal-gain subset selection, evaluated on Terminal-Bench 2.
  **Targets:** Skills.
- [SESA: Self-Evolving Search Agents](https://github.com/Zenghuang-Fu/SESA-Self-Evolving-Search-Agents)
  — [Paper](https://arxiv.org/abs/2607.29468). Distills informative self-play
  failures into bounded skill memory that reshapes the solver and challenger
  frontier across held-out QA benchmarks.
  **Targets:** Skills, Memory, Parameters, Co-evolution.
- [SkillHone](https://github.com/Tencent/SkillHone) —
  [Paper](https://arxiv.org/abs/2606.08671). Evolves whole skill folders through
  persistent decision history, practice probes, and regression-gated PRs, with
  validation-gated deep-research evaluation. Run only in an isolated sandbox.
  **Targets:** Skills.
- [RethinkSkill](https://github.com/HKUST-KnowComp/rethinkskill) —
  [Paper](https://arxiv.org/abs/2608.02636). Provides a reproducible controlled
  skill-evolution harness that compares success-only, failure-only, and mixed
  feedback across 42 matched runs with held-out, robustness, and transfer checks.
  **Targets:** Skills.
- [self-evolve](https://github.com/DaizeDong/self-evolve) — Runs multi-round
  skill or repository self-iteration in an isolated worktree with deterministic
  acceptance, heterogeneous signals, archive lineage, and rollback; its tests
  cover 555 cases.
  **Targets:** Skills, Tools.
- [cambium](https://github.com/debarshi29/cambium) — Admission-gates evolving
  skill, tool, and prompt libraries, measures retrieval separately, rejects
  reward-hacking candidates, and reports held-out transfer from a reproducible
  27-task demo. **Targets:** Skills, Tools, Topology.
- [Evo-Harness](https://github.com/A-EVO-Lab/a-evolve/tree/release/evo-harness)
  — [Paper](https://arxiv.org/abs/2608.15071). Compiles noisy one-shot
  trajectories into reusable skill harnesses for cross-task adaptation,
  evaluating a frozen agent across five realistic benchmarks.
  **Targets:** Skills, Topology.
- [xskill](https://github.com/SkillNerds/xskill) — [Paper](https://github.com/SkillNerds/xskill/blob/main/paper/xskill_v4.pdf).
  Distills anonymized agent trajectories into versioned team skills, canary-tests
  revisions on real traffic, and reports benchmark gains with rollback-ready
  lineage.
  **Targets:** Skills, Memory.
- [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness) — Agents
  evaluate and optimize their own Skills from benchmark feedback, snapshot each
  round, and expose observable traces for review.
  **Targets:** Skills.
- [TRACE](https://github.com/Darwin-Agent/Car-bench-TRACE) — [Paper](https://arxiv.org/abs/2608.22793).
  Refines a persistent Skill Bank by contrasting successful and failed
  trajectories, then reports Pass^3 gains on public and hidden CAR-bench sets.
  **Targets:** Skills.
- [Coalition-Aware Skill Reliability](https://arxiv.org/abs/2608.22610) — Audits
  coalition-level skill contributions and masks transfer-harmful entries,
  improving LoCoMo, LongMemEval, HotpotQA, and ALFWorld while exposing
  isolation-evaluation failures.
  **Targets:** Skills.

### Tools

- [AgentFactory](https://github.com/zzatpku/AgentFactory) —
  [Paper](https://aclanthology.org/2026.acl-demo.81/). Stores successful
  solutions as executable Python subagents, refines them from execution
  feedback, and evaluates reusable capability growth across later tasks. Run
  only in an isolated sandbox.
  **Targets:** Tools, Skills.
- [Mem²Evolve](https://buaa-irip-llm.github.io/Mem2Evolve/) — [Paper](https://arxiv.org/abs/2604.10923).
  Couples experience distillation with dynamic creation of tools and expert
  agents.
  **Targets:** Memory, Skills, Tools, Co-evolution.
- [SciToolAgent-Evo](https://arxiv.org/abs/2607.28692) — Evolves an
  ontology-backed scientific tool graph and skill/experience memory through
  contrastive trajectories and bandit-gated acquisition, evaluated on 900
  OpenSciToolBench tasks. **Targets:** Knowledge, Memory, Tools.

### Topology

- [ADAS](https://github.com/ShengranHu/ADAS) — [Paper](https://arxiv.org/abs/2408.08435).
  Searches agent designs expressed as code and retains an archive of evaluated
  candidates.
  **Targets:** Topology.
- [AgentSquare](https://github.com/tsinghua-fib-lab/AgentSquare) — [Paper](https://arxiv.org/abs/2410.06153).
  Searches a modular space of planning, reasoning, tool-use, and memory
  components.
  **Targets:** Memory, Skills, Tools, Topology.
- [GPTSwarm](https://github.com/metauto-ai/GPTSwarm) — [Paper](https://arxiv.org/abs/2402.16823).
  Represents language agents as graphs and optimizes node prompts and
  connectivity.
  **Targets:** Topology.
- [Open-Ended Optimization (OEO)](https://arxiv.org/abs/2608.09629) — Composes
  the improvement route online under fixed objectives, budgets, data boundaries,
  and evaluators, comparing persistent skill updates with SkillOpt and GEPA.
  **Targets:** Skills, Topology.
- [MANTA: Multi-Agent Network Topology Adaptation](https://arxiv.org/abs/2607.28527)
  — Adapts roles, links, execution order, and visibility from trace audits
  during execution, retains a cross-run topology playbook, and evaluates
  transfer across five benchmarks.
  **Targets:** Topology, Memory.
- [A-SR: Self-Evolving Agentic LLMs for Symbolic Regression](https://arxiv.org/abs/2608.04872)
  — Routes evaluator feedback through role policies and process memory, adapts
  coordination within runs, and distills trajectories across runs with held-out
  symbolic-regression evaluation.
  **Targets:** Topology, Memory, Parameters.
- [MetaVideoAgent](https://github.com/Alibaba-VELLDEPTH/MetaVideoAgent) —
  [Paper](https://arxiv.org/abs/2608.04587). Profiles a video distribution,
  diagnoses trajectory failures, and evolves responsible modules across four
  rounds with evolution and held-out VA-EvoBench splits. Run only in an
  isolated sandbox.
  **Targets:** Topology.
- [EMAS: Evolving Multi-Agent System](https://github.com/cf3i/Evolving-Multi-Agent-System)
  — [Paper](https://arxiv.org/abs/2608.07196). Converts recurring trace diagnoses
  into prompt or topology revisions, paired-validates each candidate, and
  persists accepted versions while retaining rejected proposals for audit.
  **Targets:** Topology.
- [AutoDesign](https://github.com/Yaxin9Luo/AutoDesign) —
  [Paper](https://arxiv.org/abs/2608.13560). Learns a reusable design harness
  around fixed models, retaining one-component updates only when training
  improves without regressing an independent development set, then evaluates
  matched configurations on PosterBench.
  **Targets:** Topology, Tools, Skills.
- [CausalForge](https://github.com/Jiyuan-Tan/CausalForge) —
  [Paper](https://arxiv.org/abs/2607.22511). Uses Lean-checked proofs and
  statement audits in a self-improving theorem pipeline, with public formal
  libraries and run records.
  **Targets:** Topology.
- [EvoAgentX](https://github.com/EvoAgentX/EvoAgentX) — Builds, evaluates, and
  evolves multi-agent workflows with pluggable optimization algorithms.
  **Targets:** Topology.
- [Naive Prompt Optimization](https://arxiv.org/abs/2608.27266) — Iteratively
  revises prompts from teacher-model rollout feedback and transfers
  single-lineage improvements across tasks and interactive games.
  **Targets:** Topology.
- [HarnessLens](https://github.com/jhxu5214/HarnessLens) — [Paper](https://arxiv.org/abs/2608.27311).
  Evolves OpenCode, Codex CLI, and Pi harnesses through behavior-aware diagnosis
  and selective verification, with blind-test entrypoints, pinned
  reproducibility, and four-benchmark evaluation. Run only in an isolated
  sandbox.
  **Targets:** Topology.
- [Proteus](https://github.com/proteus-evolve/Proteus) — Provides a
  harness-agnostic, snapshot-based evolution loop with evaluator gates,
  crystallization tests, rollback, and git histories for measuring persistent
  change. Run only in an isolated sandbox.
  **Targets:** Topology.
- [AegisEvo](https://github.com/ETOLucy/AegisEvo) — Governs sandboxed harness
  search with statistical quality, safety, canary, promotion, and rollback
  gates, publishing deterministic fixtures and reproducible reports.
  **Targets:** Topology.
- [RSIHub](https://github.com/simple-agent-lab/RSIHub) — Runs evaluator-driven
  evolution over prompts, skills, harnesses, and agent code with frozen scoring,
  bounded mutation, Git lineage, rollback, and reproducible benchmark recipes.
  Run only in an isolated sandbox.
  **Targets:** Topology, Skills.
- [EvoUndo](https://arxiv.org/abs/2608.28363) — Evaluates recoverability of
  model-generated prompt, tool, middleware, and harness mutations across
  counterfactual states on 600 unseen tasks, exposing grounding and
  recovery-language bottlenecks.
  **Targets:** Topology.
- [Darwin Gödel Machine](https://github.com/jennyzzt/dgm) — [Paper](https://arxiv.org/abs/2505.22954)
  · [Article](https://sakana.ai/dgm/). Rewrites coding-agent implementations
  and empirically validates descendants. Run only in an isolated sandbox.
  **Targets:** Skills, Tools, Topology.
- [A-Evolve](https://github.com/A-EVO-Lab/a-evolve) — Applies evolutionary
  search to agent implementations across domains.
  **Targets:** Topology.
- [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve) —
  Provides an open evolutionary coding loop inspired by AlphaEvolve.
  **Targets:** Topology.
- [Agentic Evolution is the Path to Evolving LLMs](https://arxiv.org/abs/2602.00359)
  — Positions the agent scaffold as a primary target of evolution.
  **Targets:** Topology.
- [From General Agents to RCA Experts: A Self-Evolving Harness for Root Cause Analysis](https://arxiv.org/abs/2608.25661)
  — Converts successful and failed RCA trajectories into atomic expertise
  updates, admits them through dual-gate verification, and reports gains on two
  public benchmarks plus an industrial deployment.
  **Targets:** Knowledge, Topology.
- [JIT-Agent](https://bingreeky.github.io/JIT-site) — [Paper](https://arxiv.org/abs/2608.25593).
  Distills performance signals from an archive of prior harness configurations
  to synthesize, repair, and improve task-adaptive harnesses across model
  families and benchmarks.
  **Targets:** Topology.
- [RubSE](https://tyxiong23.github.io/rubse) — [Paper](https://arxiv.org/abs/2608.24138).
  Generates UI code with typed rubrics as visual feedback, retains selected repair
  history across rounds, and evaluates six VLMs on three UI-to-code benchmarks
  for stable iterative improvement.
  **Targets:** Topology, Memory.
- [Factory](https://github.com/watt-mind/factory) — Provides tracker-controlled
  coding-agent loops with isolated worktrees, repeatable verification, CI/review
  gates, Git lineage, and offline regression demos. Run only in an isolated
  sandbox.
  **Targets:** Topology.
- [Self-Improving Agent Ecosystem](https://github.com/Git-on-my-level/self-improving-agent-ecosystem)
  — Provides contracts, schemas, deterministic fixtures, and validation for
  evaluator-driven loops with isolated candidates, evidence lineage, promotion
  gates, rollback, and external health checks.
  **Targets:** Topology.
- [Raven](https://github.com/EverMind-AI/Raven) — Combines terminal execution,
  tracing, durable memory, skills, reusable workflows, and an opt-in Evolver with
  independent benchmark harnesses for long-running agent improvement. Run only
  in an isolated sandbox.
  **Targets:** Topology, Memory, Skills.
- [ROSClaw](https://github.com/ros-claw/rosclaw) — Provides a simulation-first
  physical-agent control plane that turns feedback into hashed controller
  candidates, fail-closed gates, and rollback targets; real-hardware activation
  is blocked. Run only in an isolated sandbox.
  **Targets:** Topology.
- [yoyo](https://github.com/yologdev/yoyo-evolve) — Runs an autonomous
  coding-agent loop that reads source and community issues, test-gates commits
  or reverts, and synthesizes durable memory across sessions. Run only in an
  isolated sandbox.
  **Targets:** Topology, Memory.
- [VideoHarness-RSI: Recursive Harness Self-Improvement for Long-Video Understanding](https://arxiv.org/abs/2608.24302)
  — Searches executable context constructors around a frozen VLM, retaining
  evaluation-selected variants and transferring the selected harness to
  additional long-video benchmarks.
  **Targets:** Topology.
- [Meta^n: Recursive Self-Improvement through Emergent Depth](https://github.com/minnesotanlp/meta-n)
  — [Paper](https://arxiv.org/abs/2608.24735). Recursively writes executable
  helpers and pre-processors from lower-layer traces, archives evaluated chains,
  and reports gains across eight benchmark families. Run only in an isolated
  sandbox.
  **Targets:** Topology, Skills.
- [CineForge: Self-Improving Agents for Long-Horizon Video Generation](https://arxiv.org/abs/2608.29621)
  — Consolidates production trajectories into bounded, stage-local policy
  patches, validates them by structural replay and paired evaluation, and
  improves scores on a 100-script suite plus two public benchmarks.
  **Targets:** Topology.
- [HarnessEvolve](https://arxiv.org/abs/2609.00829) — Aligns failed runs with
  reference trajectories, then quality- and performance-gates harness
  snapshots against held-out validation to reduce shortcut learning and
  forgetting.
  **Targets:** Topology.
- [WebWorld](https://arxiv.org/abs/2608.30530) — Uses browser-issued acceptance
  certificates to ratchet verified web-code transitions into training data,
  improving HTMLBench and MiniAppBench under matched training.
  **Targets:** Topology.

### Co-evolution

- [SafeEvolve](https://github.com/MaoPopovich/SafeEvolve) — [Paper](https://arxiv.org/abs/2609.02786).
  Turns on-policy safety trajectories into bounded safety-prompt and SkillBank
  revisions, then trains policy use with SFT and GRPO under safety and utility
  gates. Run only in an isolated sandbox.
  **Targets:** Parameters, Skills, Co-evolution.
- [MEGA: Self-Evolving Agent Optimization Infrastructure via Wisdom Graph](https://arxiv.org/abs/2608.10504)
  — Distills sessions into durable wisdom assets and a typed graph, then feeds
  controlled operational evidence back into workflow optimization and the
  evolving curation strategy.
  **Targets:** Knowledge, Topology, Co-evolution.
- [SBCO: Self-Supervised, Verifier-Grounded Harness Optimization](https://arxiv.org/abs/2608.10157)
  — Jointly updates a decomposed verifier bank and planning-agent harness from
  self-graded feedback via block-coordinate ascent, without human labels.
  **Targets:** Topology, Co-evolution.
- [WebEvolver](https://github.com/Tencent/SelfEvolvingAgent/tree/main/WebEvolver) —
  [Paper](https://aclanthology.org/2025.emnlp-main.454/). Co-trains a policy
  and world model from real trajectories, then uses the model for synthetic
  training and look-ahead evaluation.
  **Targets:** Parameters, Co-evolution.
- [Double Ratchet](https://github.com/amazon-science/Self-Evolving-Agents-Double-Ratchet)
  — [Paper](https://arxiv.org/abs/2607.12790). Co-evolves an inspectable
  drawback-detector metric with a lifecycle-managed skill library, using
  anchored references and locked-set validation to expose evaluator collapse.
  **Targets:** Skills, Co-evolution.
- [Group-Evolving Agents (GEA)](https://github.com/UCSB-AI/GEA) —
  [Paper](https://arxiv.org/abs/2602.04837). Evolves populations of agent
  workflows and tools through archived experience sharing, retaining
  cross-lineage improvements on held-out coding benchmarks. Run only in an
  isolated sandbox.
  **Targets:** Topology, Tools, Co-evolution.
- [Agent0](https://github.com/aiming-lab/Agent0) — [Paper](https://arxiv.org/abs/2511.16043).
  Co-evolves a task curriculum and a tool-using executor without human-curated
  task data.
  **Targets:** Tools, Co-evolution.
- [Self-Modifying Lean Proof Agents](https://arxiv.org/abs/2607.17352) —
  Co-evolves a Lean proof workflow and benchmark curriculum, using compiler and
  Lean verification feedback across 15 generations with a held-out miniF2F split.
  **Targets:** Topology, Tools, Co-evolution.
- [Task-CoEvolve](https://arxiv.org/abs/2608.20169) — Co-evolves harness code and
  validation-task sampling, focusing evaluation on discriminative tasks while
  retaining unbiased full-set estimates and reducing evaluation cost.
  **Targets:** Topology, Co-evolution.
- [CORAL](https://github.com/Human-Agent-Society/CORAL) — [Paper](https://arxiv.org/abs/2604.01658).
  Runs autonomous coding-agent organizations in isolated worktrees, sharing
  persistent attempts, notes, and skills while a grader scores commits and agents
  iterate on open-ended tasks.
  **Targets:** Topology, Tools, Co-evolution.
- [HELIX](https://github.com/HKUDS/HELIX) — [Paper](https://arxiv.org/abs/2608.13951).
  Composes source-traceable harness variants, evaluates sibling rollouts, and
  turns verified successes, regressions, and preferences into data for later
  model updates; reports LiveCodeBench and SWE-Bench results.
  **Targets:** Topology, Co-evolution.
- [J-Zero](https://arxiv.org/abs/2608.26582) — Co-evolves challenger, solver,
  and judge from zero data, using known-order preference pairs and adversarial
  tasks to improve through ten iterations.
  **Targets:** Parameters, Co-evolution.

This section uses **Co-evolution** only when an external factor changes with the
agent. Multi-agent execution by itself is not sufficient.

## Benchmarks and Evaluation

These resources provide environments or held-out signals for testing whether a
persistent update is real.

- [SEAGym: An Evaluation Environment for Self-Evolving LLM Agents](https://github.com/antropy-research/SEAGym)
  — [Paper](https://arxiv.org/abs/2606.17546). Measures persistent harness
  updates across train, frozen validation, held-out ID/OOD transfer, replay, and
  cost views, with checkpointed states and reproducible configurations.
- [Continual Skill Bench](https://github.com/gtynnn060110-hash/continual-skill-bench-final)
  — [Paper](https://arxiv.org/abs/2608.03874). Evaluates continual skill reuse
  across five domains and 100-task sequences, comparing in-context adaptation
  with explicit skill maintenance.
- [Evo-Bench](https://github.com/RUCAIBox/Evo-Bench) —
  [Paper](https://arxiv.org/abs/2608.09096). Holds policy, seed harness, and
  budget fixed while scoring autonomous harness evolution on disjoint
  validation and evaluation suites.
- [PACE-Bench](https://github.com/thunlp/PACE-Bench) —
  [Paper](https://arxiv.org/abs/2608.14441). Tests whether code-driven designs
  adapt after source-to-target physics mutations, with diagnostic sandbox
  feedback across 144 pairs and 180 evaluation environments.
- [HarnessRisk](https://github.com/Baiyajing/HarnessRisk) —
  [Paper](https://arxiv.org/abs/2608.17597). Benchmarks agent-harness safety
  across configuration, capability extension, runtime, persistence, action
  control, and recovery using sandboxed cases with trajectory evidence and
  explicit utility, attack, persistence, and detection metrics.
- [EVOMAL: Self-Poisoning in Self-Evolving Coding Agents](https://arxiv.org/abs/2608.25776)
  — Measures self-poisoning propagation in evolving skill libraries across six
  models and 153 SWE-bench tasks, and evaluates a counter-prompt defense
  without task-completion loss.
- [On the Fragility of Self-Improving Agents](https://github.com/SalesforceAIResearch/self-improve-fragility)
  — [Paper](https://arxiv.org/abs/2608.18066). Re-evaluates memory-based
  self-improving agents across repeated runs and shuffled task orders, releasing
  trajectories to measure variance, order sensitivity, and specification effects.
- [Auditing Self-Evolution in Financial Agents](https://arxiv.org/abs/2608.17684)
  — Audits three self-evolving agents with sealed endpoints, state replay,
  execution-grounded checks, and security metrics, exposing capability gains
  that increase exposure and unauthorized state changes.
- [When Experience Becomes Instruction](https://arxiv.org/abs/2608.05563)
  — Demonstrates trajectory-poisoning attacks that promote malicious behaviors
  into persistent skill banks, with transfer tests across six LLM evolvers and
  two architectures.
- [tide-eval](https://github.com/Human-Agent-Society/tide-eval) — An Apache-2.0
  evaluation infrastructure for self-evolving agents on Harbor: carries memory,
  skills, or harness state across task streams with per-step snapshots, and
  reports anytime, forgetting, and transfer metrics.
- [AI4AI-Bench](https://arxiv.org/abs/2608.20318) — Releases 10 frozen research
  repositories, hidden evaluators, 29 configurations, and every scored submission
  for testing whether agents can rewrite training algorithms.
- [Phantom Gains](https://arxiv.org/abs/2608.20290) — Audits self-improvement
  claims against measured frozen controls, replacing noisy transition statistics
  with per-problem tests and false-discovery-rate control.
- [Cheap Verifiers, Large Blind Spots](https://arxiv.org/abs/2609.01345) — Audits
  self-improving verifier cascades with true-error controls, showing in-loop
  metrics can improve while delivered quality degrades under blind-spot feedback.
- [PerMemSafe](https://github.com/Greysahy/permemsafe) —
  [Paper](https://aclanthology.org/2026.findings-acl.320/). Benchmarks implicit
  personalized safety across evolving long-horizon memory, with committed data,
  evaluation logs, and a risk-aware memory baseline.
- [Sealed Exogenous Acceptance Loop (SEAL)](https://arxiv.org/abs/2607.24300)
  — Keeps its audit hidden from evolving policies and self-tests, returning
  only accept/reject and retaining the whole incumbent after a clear regression.
- [RSIBench-Data](https://github.com/evolvent-ai/RSIBench-Data) —
  [Paper](https://arxiv.org/abs/2607.25886). Audits whether researcher agents
  turn checkpoint feedback into reusable training-data strategies under fixed
  training, evaluation, and budget controls.
- [FinEvo-Bench](https://arxiv.org/abs/2608.06144) — A longitudinal benchmark
  with 120 financial workflow tasks, interleaved streams, paired state-reset
  controls, expert-validated rubrics, and compliance metrics for retained-
  experience gains.
- [reef-eval](https://github.com/Human-Agent-Society/reef-eval) — Provides
  Harbor-compatible autoresearch and continual task streams with state
  snapshots, tamper-resistant scoring, and anytime, forgetting, and transfer
  metrics.
- [AgentStream](https://github.com/Jasper-Yan/AgentStream) — [Paper](https://arxiv.org/abs/2608.00155).
  Evaluates five self-evolving methods in isolated, sequential, and interleaved
  task streams across three models, exposing model-, method-, and
  stream-dependent reliability.
- [StudyBench](https://github.com/thunlp/StudyBench) — [Paper](https://arxiv.org/abs/2609.00787).
  Releases fixed textbook materials, application/transfer splits, and
  evaluation scripts to measure whether self-evolution converts study material
  into transferable capability.
- [ASPIRE](https://arxiv.org/abs/2608.31111) — Hides expert-authored tasks behind
  vague goals and scores whether agents choose data, updates, and validation
  signals, exposing transfer and stability failures.
- [S3Gym](https://arxiv.org/abs/2608.31100) — Separates permissive exploration
  from held-out game evaluation while comparing history, summary-memory, and
  parameter updates for self-improvement.
- [Auditing Harness Tampering](https://arxiv.org/abs/2609.00069) — Audits
  authorization, provenance, and completeness violations in self-modifying
  harnesses using tampered-benign pairs, localization tasks, and real-trajectory
  persistence analysis.
- [EvoSkill Injection](https://arxiv.org/abs/2608.30429) — Defines a red-team
  threat model, EvoSkillBench trajectories, and post-attack safety tests for
  persistent malicious-skill formation and repeated activation. Run only in an
  isolated sandbox.
- [SkillJack](https://github.com/Tencent/AI-Infra-Guard/tree/main/Research/SkillJack)
  — [Paper](https://arxiv.org/abs/2608.03509). Releases poisoned-trajectory
  data and cross-system experiments showing experience-to-skill backdoors
  survive source deletion and can activate on benign queries. Run only in an
  isolated sandbox.
- [ECLIPSE](https://arxiv.org/abs/2608.30441) — Builds and iteratively verifies
  stealthy tool-chain injections, releasing LASE-Bench for long-horizon safety
  evaluation. Run only in an isolated sandbox.
- [SIR: Self-Improving Red Teaming](https://arxiv.org/abs/2608.30207) — Distills
  failed computer-use attacks into reusable principles with deterministic
  filesystem, service, and permission oracles; report transfer evidence and
  run only in an isolated sandbox.
- [Experience-driven Lifelong Learning](https://arxiv.org/abs/2508.19005) —
  Proposes a framework and benchmark for continuous agent growth.
- [SWE-bench](https://github.com/SWE-bench/SWE-bench) — Supplies real-world
  software issues used by self-improving coding-agent systems.
- [AgentBench](https://github.com/THUDM/AgentBench) — Evaluates agents across
  multiple interactive environments.
- [GAIA](https://huggingface.co/gaia-benchmark) — Tests assistants on tasks
  requiring reasoning, tools, and multimodal information.

For credible evolution claims, prefer:

1. a frozen held-out set that is not visible to the optimizer;
2. multiple seeds and learning curves, not only the best final run;
3. ablations separating extra inference compute from persistent improvement;
4. regression, safety, and capability-retention checks;
5. versioned artifacts with provenance, rollback, and rejected candidates.

## Articles and Technical Posts

- [AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)
  — A first-party description of an evolutionary loop combining proposals with
  automated evaluators.
- [AlphaEvolve: How our coding agent is scaling impact across fields](https://deepmind.google/blog/alphaevolve-impact/)
  — A 2026 first-party update on deployments and scientific applications.
- [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)
  — A foundation for reflection, memory, planning, and tool use.

## Related Awesome Lists

- [Awesome Self-Evolving Agents — EvoAgentX](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents)
- [Awesome Self-Evolving Agents — XMUDeepLIT](https://github.com/XMUDeepLIT/Awesome-Self-Evolving-Agents)
- [Awesome Self-Improving Agents](https://github.com/selfimproving-agent/Awesome-Self-Improving-Agents)
- [Awesome Self-Evolution of LLM](https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/Awesome-Self-Evolution-of-LLM)

## Community and Long-Term Outputs

The repository is community-first and is building a structured evidence base.
The evidence may support a living survey and conference tutorial after the
public maturity gates in the [Roadmap](ROADMAP.md) are met.

- [Call for Contributors](CALL_FOR_CONTRIBUTORS.md)
- [Community Roles and Governance](COMMUNITY.md)
- [Roadmap](ROADMAP.md)

Repository contributions are credited publicly. Sustained, substantive work in
curation, reproducibility, analysis, writing, software, visualization, or
revision can qualify contributors for survey-paper authorship. Decisions follow
transparent CRediT-style roles rather than maintainer status.

## Contributing

Suggestions and pull requests are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) before submitting a resource.

This index favors evidence over hype. A large star count is neither necessary
nor sufficient; a resource should make the update target, feedback loop,
persistent artifact, and evaluation legible.

## License

[MIT](LICENSE)
