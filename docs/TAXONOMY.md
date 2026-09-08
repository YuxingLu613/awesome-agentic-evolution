# Classification guide

[Resource index](../README.md#resource-map) · [Survey protocol](survey/PROTOCOL.md)

## Unit of analysis

Classify the **retained behavioral change**, not the system's marketing name,
implementation language, application domain, or components it merely uses.
Describe one loop as: current agent → feedback → candidate update → selection
or retention → future behavior. Record rejected candidates and regression tests
when the source provides them. A paper, its code, and its project page normally
constitute one resource, not three observations.

## Six internal targets plus a coupled-adaptation relation

| Target | What must actually change and persist | Do not infer it from |
| --- | --- | --- |
| Parameters | Weights, adapters, or trainable policy state | A frozen model generating new text |
| Memory | Agent-specific experience, reflections, traces, or summaries reused later | A fixed context window or a static retrieval store |
| Knowledge | Reusable facts, external evidence, schemas, or a knowledge base updated with provenance | Experience called “knowledge”; static RAG |
| Skills | Reusable task procedures, instructions, or behavioral routines, possibly expressed as code | A skill selector using an unchanged library |
| Tools | Newly created or revised callable interfaces, executable subagents, or utility modules | Calling a fixed tool; a code implementation of an already-counted skill |
| Topology | Agent prompts, roles, routing, control flow, or orchestration designs retained after evaluation | A transient plan or one answer revision |
| Co-evolution | Coupled adaptation of an agent and a curriculum, evaluator, environment, population, or update mechanism | Multiple agents; an unchanged evaluator; ordinary search over candidates |

Co-evolution describes a **relationship**, unlike the six internal targets.
The README retains a dedicated section for work whose central contribution is
coupled adaptation. Record which parties change and how feedback connects them;
also record the applicable internal targets. Other sections may carry a
secondary Co-evolution tag. Do not add category counts: multi-target coverage
counts are non-exclusive.

## Boundary tests

1. **Memory versus Knowledge:** is it a record of this agent's experience, or
   a reusable factual asset with external provenance? A filename such as
   `knowledge.md` is not evidence of Knowledge evolution.
2. **Memory versus Skills:** a retrieved episode remains Memory; a distilled
   procedure executed across tasks is Skills. Annotate both only when the
   source exposes distinct retained artifacts, not two names for one object.
3. **Skills versus Tools:** a procedure's code representation does not earn a
   second tag. Use Tools for the callable capability/interface under study,
   Skills for the reusable task procedure. State the unit in the evidence card.
4. **Topology versus outputs:** changing an agent's future routing or prompt is
   Topology; repairing its current output is not. Persisting repair data for
   model training may instead be Parameters.
5. **Training versus deployment:** record *when* the update happens separately
   from *what* changes. Test-time updates do not imply held-out evaluation.
6. **Method versus evaluation:** place measurement protocols, poisoning audits,
   and recovery analyses in Benchmarks and Evaluation when measurement is the
   principal contribution. Tagged targets describe the method, not the attack
   surface of an audit.

Choose one primary category based on the central retained artifact. Put that
label first on the `Targets` line. Additional labels require their own updated
artifact and source locator. If that cannot be established, record a question
in the [review queue](survey/REVIEW_QUEUE.md), not a speculative tag expansion.

## Decisions recorded on 2026-09-08

These are editorial interpretations of the linked sources, not new empirical
claims. Source-level screening is not a complete experimental audit.

| Resource | Decision | Basis |
| --- | --- | --- |
| [A-Evolve](https://arxiv.org/abs/2602.00359) | Attach its position paper to the existing A-Evolve entry | Abstract names A-Evolve and links its code; not a second method |
| [EvoUndo](https://arxiv.org/abs/2608.28363) | Move from Topology to safety/recoverability evaluation | Abstract studies recoverability across counterfactual states and one-shot mutations |
| [WebWorld](https://arxiv.org/abs/2608.30530) | Move from Topology to Parameters | Certified web-code transitions become SFT supervision; browser feedback does not itself establish harness evolution |
| [GeoForge](https://arxiv.org/abs/2608.10494) | Move from Knowledge to Memory, with Skills and Topology | Abstract describes trajectory-derived experience, SOPs, and workflow-graph memory, not a world-fact corpus |
| [Agent0](https://arxiv.org/abs/2511.16043) | Co-evolution + Parameters; remove Tools | Curriculum and executor learn jointly; integrated tools are not stated to evolve |
| [Voyager](https://arxiv.org/abs/2305.16291) | Keep Skills + Co-evolution; remove duplicate Tools tag | Retained executable skills are one artifact; the adaptive curriculum remains separately described |
| [AgentFactory](https://aclanthology.org/2026.acl-demo.81/) | Tools; remove duplicate Skills tag | Its explicit unit of retained improvement is callable Python subagents |

Other primary-first reorderings repair metadata consistency without claiming
that all inherited secondary tags have been re-audited. See the review queue.
