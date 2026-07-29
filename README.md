# Awesome Agentic Evolution

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![Link check](https://github.com/YuxingLu613/awesome-agentic-evolution/actions/workflows/links.yml/badge.svg)](https://github.com/YuxingLu613/awesome-agentic-evolution/actions/workflows/links.yml)
[![Research dashboard](https://img.shields.io/badge/research_dashboard-explore-2e654b)](https://yuxinglu613.github.io/awesome-agentic-evolution/)

> From self-improving agents to co-evolving, open-ended agent ecosystems.

A high-signal, continuously curated collection of tools, repositories, papers,
articles, and discussions about agents that improve through feedback,
experience, self-modification, or co-evolution.

中文简介：聚焦能够从反馈、轨迹、记忆、工具和环境中持续进化的 AI
agents，以及从单体自我改进走向协同进化和开放式智能体生态的研究与工具。

[Explore the living research dashboard →](https://yuxinglu613.github.io/awesome-agentic-evolution/)

**Last editorial review:** 2026-07-28

## Contents

- [Scope](#scope)
- [Start Here](#start-here)
- [Frameworks and Repositories](#frameworks-and-repositories)
- [Research](#research)
- [Benchmarks and Evaluation](#benchmarks-and-evaluation)
- [Articles and Technical Posts](#articles-and-technical-posts)
- [Related Awesome Lists](#related-awesome-lists)
- [Community and Long-Term Outputs](#community-and-long-term-outputs)
- [Contributing](#contributing)

## Scope

Agentic evolution means that an agent commits an improvement that can influence
future behavior. The update target may be:

- **Model:** parameters, policies, or generated training data.
- **Memory:** distilled experience, structured knowledge, or retrieval policy.
- **Skill or tool:** reusable procedures, code, APIs, or expert agents.
- **Workflow:** prompts, control flow, topology, or collaboration protocol.
- **Environment:** tasks, curricula, evaluators, or simulated worlds.
- **Agent code:** implementation, scaffolding, and even the improvement process.

Included resources must expose a concrete update loop, evaluation signal, or
persistent learning mechanism. Generic agent frameworks, one-shot
self-correction, and static memory stores are out of scope unless they are
directly used to support persistent improvement.

## Start Here

- [Self-Improvements in Modern Agentic Systems: A Survey](https://arxiv.org/abs/2607.13104)
  — A 2026 system-level view of self-induced updates to foundation models and
  agent scaffolds.
- [A Survey of Self-Evolving Agents: What, When, How, and Where to Evolve](https://arxiv.org/abs/2507.21046)
  — Organizes the field by update target, timing, feedback, and application.
- [A Comprehensive Survey of Self-Evolving AI Agents](https://arxiv.org/abs/2508.07407)
  — A unified feedback-loop perspective spanning models, workflows, and
  domain-specific evolution.
- [A Survey on Self-Evolution of Large Language Models](https://arxiv.org/abs/2404.14387)
  — Useful background on self-generated experience and model-level updates.

## Frameworks and Repositories

### Whole-Agent and Code Evolution

- [A-Evolve](https://github.com/A-EVO-Lab/a-evolve) — Infrastructure for
  applying evolution algorithms to agents across domains.
- [Agent0](https://github.com/aiming-lab/Agent0) — Co-evolves a curriculum
  agent and a tool-using executor without human-curated task data.
- [AgentEvolver](https://github.com/modelscope/AgentEvolver) — A framework for
  efficient self-evolution through task generation, experience synthesis, and
  reinforcement learning.
- [Darwin Gödel Machine](https://github.com/jennyzzt/dgm) — Evolves coding
  agents by modifying their own code and empirically validating descendants.
  Run only in a strongly isolated sandbox.
- [EvoAgentX](https://github.com/EvoAgentX/EvoAgentX) — Builds, evaluates, and
  evolves multi-agent workflows with pluggable optimization algorithms.
- [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve) —
  An open-source evolutionary coding agent inspired by AlphaEvolve.

### Workflow and Architecture Evolution

- [ADAS](https://github.com/ShengranHu/ADAS) — Meta Agent Search discovers
  agent designs expressed as code and maintains an archive of candidates.
- [AgentSquare](https://github.com/tsinghua-fib-lab/AgentSquare) — Searches a
  modular space of planning, reasoning, tool-use, and memory components.
- [GPTSwarm](https://github.com/metauto-ai/GPTSwarm) — Represents language
  agents as graphs and optimizes prompts and graph connectivity.
- [SkillOpt](https://github.com/microsoft/SkillOpt) — Optimizes reusable
  natural-language skills from scored trajectories with validation-gated
  updates.

### Memory, Experience, and Skill Evolution

- [ExpeL](https://github.com/LeapLabTHU/ExpeL) — Extracts transferable natural
  language insights from training-task experience without weight updates.
- [MemSkill](https://github.com/ViktorAxelsen/MemSkill) — Learns memory-skill
  selection and evolves the skill set from difficult cases.
- [Mem²Evolve](https://buaa-irip-llm.github.io/Mem2Evolve/) — Co-evolves
  experience memory and reusable capability assets.
- [Reflexion](https://github.com/noahshinn/reflexion) — Stores verbal
  reflections in episodic memory to improve subsequent trials.
- [Voyager](https://github.com/MineDojo/Voyager) — Combines an automatic
  curriculum, iterative environment feedback, and a growing executable skill
  library in Minecraft.

## Research

### Reflection and Experience

- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
  — Converts feedback into persistent verbal reflections.
- [Self-Refine: Iterative Refinement with Self-Feedback](https://selfrefine.info/)
  — A foundational generate-feedback-refine loop.
- [ExpeL: LLM Agents Are Experiential Learners](https://arxiv.org/abs/2308.10144)
  — Distills reusable insights from successes and failures across tasks.
- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)
  — Demonstrates open-ended, in-context lifelong skill acquisition.

### Architecture and Recursive Improvement

- [Automated Design of Agentic Systems](https://arxiv.org/abs/2408.08435)
  — Introduces ADAS and Meta Agent Search.
- [Language Agents as Optimizable Graphs](https://arxiv.org/abs/2402.16823)
  — Optimizes node prompts and graph connectivity.
- [AgentSquare: Automatic LLM Agent Search in Modular Design Space](https://arxiv.org/abs/2410.06153)
  — Evolves and recombines modular agent components.
- [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) — Combines
  self-modification, empirical evaluation, and open-ended archives.
- [Agentic Evolution is the Path to Evolving LLMs](https://arxiv.org/abs/2602.00359)
  — Positions the agent scaffold as a primary target of evolution.

### Model, Curriculum, and Skill Co-Evolution

- [STaR: Bootstrapping Reasoning With Reasoning](https://arxiv.org/abs/2203.14465)
  — Iteratively generates and learns from successful rationales.
- [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) — Uses the
  model as both instruction follower and judge during iterative training.
- [Agent0: Unleashing Self-Evolving Agents from Zero Data](https://arxiv.org/abs/2511.16043)
  — Co-evolves tool-aware curricula and an executor through multi-step
  interaction.
- [MemSkill: Learning and Evolving Memory Skills for Self-Evolving Agents](https://arxiv.org/abs/2602.02474)
  — Evolves structured routines for memory extraction and consolidation.
- [Mem²Evolve](https://arxiv.org/abs/2604.10923) — Couples experience
  distillation with dynamic creation of tools and expert agents.
- [SelfMem: Self-Optimizing Memory for AI Agents](https://arxiv.org/abs/2607.03726)
  — Uses memory tools and feedback signals to explore, evaluate, and refine a
  reusable memory strategy; reports BEAM results from 100K to 1M-token
  conversations.
- [MUSE-Autoskill](https://arxiv.org/abs/2605.27366) — Treats skills as
  testable, reusable, and continuously refined assets.
- [SkillOpt](https://arxiv.org/abs/2605.23904) — Trains natural-language
  procedures while keeping the target model and harness fixed.
- [From Memory to Skills](https://arxiv.org/abs/2607.16621) — Governs
  evidence-grounded conversion of traces into callable skills.

## Benchmarks and Evaluation

These resources are not evolution methods by themselves. They provide
environments or held-out signals for measuring whether an update is real.

- [Experience-driven Lifelong Learning](https://arxiv.org/abs/2508.19005) —
  Proposes a lifelong-learning framework and benchmark for continuous agent
  growth.
- [SWE-bench](https://github.com/SWE-bench/SWE-bench) — Real-world software
  issues used by self-improving coding-agent systems.
- [AgentBench](https://github.com/THUDM/AgentBench) — Evaluates agents across
  multiple interactive environments.
- [GAIA](https://huggingface.co/gaia-benchmark) — Tests general assistants on
  questions requiring reasoning, tools, and multimodal information.

For credible evolution claims, prefer:

1. A frozen held-out set that is not visible to the optimizer.
2. Multiple seeds and learning curves, not only the best final run.
3. Ablations separating extra inference compute from persistent improvement.
4. Regression, safety, and capability-retention checks.
5. Versioned artifacts with provenance, rollback, and rejected candidates.

## Articles and Technical Posts

- [The Darwin Gödel Machine: AI that improves itself by rewriting its own code](https://sakana.ai/dgm/)
  — An accessible explanation of open-ended self-modification, validation, and
  reward-hacking risks.
- [AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)
  — Describes an evolutionary loop combining LLM proposals with automated
  evaluators.
- [AlphaEvolve: How our coding agent is scaling impact across fields](https://deepmind.google/blog/alphaevolve-impact/)
  — A 2026 update on deployments and scientific applications.
- [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)
  — A clear foundation for reflection, memory, planning, and tool use.

## Related Awesome Lists

- [Awesome Self-Evolving Agents — EvoAgentX](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents)
- [Awesome Self-Evolving Agents — XMUDeepLIT](https://github.com/XMUDeepLIT/Awesome-Self-Evolving-Agents)
- [Awesome Self-Improving Agents](https://github.com/selfimproving-agent/Awesome-Self-Improving-Agents)
- [Awesome Self-Evolution of LLM](https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/Awesome-Self-Evolution-of-LLM)

## Community and Long-Term Outputs

The repository is community-first and survey-ready. We aim to turn verified
curation into a structured evidence base, a living survey, and eventually a
conference tutorial with reproducible demonstrations.

- [Call for Contributors](CALL_FOR_CONTRIBUTORS.md)
- [Community Roles and Governance](COMMUNITY.md)
- [Roadmap](ROADMAP.md)

Repository contributions are credited publicly. Sustained, substantive work in
curation, reproducibility, analysis, writing, software, visualization, or
revision can qualify contributors for survey-paper authorship. Decisions will
follow transparent CRediT-style roles rather than maintainer status.

## Contributing

Suggestions and pull requests are welcome. Please read
[CONTRIBUTING.md](CONTRIBUTING.md) before submitting a resource.

This list favors evidence over hype. A large star count is neither necessary
nor sufficient; a resource should make the evolution loop and its validation
legible.

## License

[MIT](LICENSE)
