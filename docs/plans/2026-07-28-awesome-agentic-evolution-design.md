# Awesome Agentic Evolution: Curation Design

## Purpose and Information Architecture

Awesome Agentic Evolution is a high-signal discovery layer rather than an
exhaustive bibliography. It covers systems that convert feedback or experience
into a persistent update to a model, memory, skill, tool, workflow,
environment, or agent implementation. The repository serves researchers who
need a fast map of the field and builders who need concrete, inspectable
systems. The README is the primary reader surface. It begins with surveys,
groups implementations by the component that evolves, separates research from
software, and treats evaluation infrastructure as a distinct concern. Related
awesome lists are credited instead of silently duplicating their breadth.

Every entry uses a canonical link and a short description answering three
questions: what evolves, which signal drives the update, and how improvement is
validated. One-shot self-correction, static vector memory, generic orchestration
frameworks, and marketing-only pages are excluded unless they provide a
specific persistent-learning mechanism. Safety is part of relevance: systems
that execute model-generated code should document sandboxing, provenance, and
rollback. The changelog makes editorial freshness visible, while issue and pull
request templates make community suggestions reviewable. This organization
keeps the initial list compact and allows future expansion into model
evolution, experience-to-skill conversion, architecture search,
agent-environment co-evolution, open-ended discovery, and EvolutionOps without
requiring a structural rewrite.

## Update and Validation Flow

The daily discovery process searches primary research indexes, GitHub, official
institutional blogs, and high-quality community discussions. Social posts are
leads, not evidence: a candidate is promoted only after its canonical paper,
repository, project page, or reproducible artifact is found. Candidates are
deduplicated against the README, checked for topical fit, and assessed for an
explicit update target, feedback signal, persistence mechanism, and evaluation
method.

Accepted entries update both `README.md` and `CHANGELOG.md`. Automated link
checking catches broken references on pull requests, pushes, and a weekly
schedule. Human review remains the gate for relevance and claims. When no new
resource clears the threshold, the correct daily result is no repository
change. This prevents a scheduled process from optimizing for update volume.
For disputed or early-stage resources, the maintainer can retain the candidate
in an issue until code, evaluation, or an authoritative source appears.

The process fails closed on unverifiable claims. It does not infer paper
acceptance from arXiv, project maturity from stars, or persistent learning from
ordinary prompt iteration. Descriptions avoid unverified performance numbers.
For self-modifying systems, review also checks isolation guidance, held-out
evaluation, regression tests, lineage, and rollback. These controls keep the
repository useful as the field moves from single-agent self-improvement toward
co-evolving, open-ended agent ecosystems.
