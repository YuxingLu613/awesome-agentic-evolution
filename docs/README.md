# Documentation map

| File or directory | Purpose | Edit directly? |
| --- | --- | --- |
| [README](../README.md) | Human-maintained resource index; short descriptions and primary categories | Yes |
| [TAXONOMY](TAXONOMY.md) | Definitions, boundary tests, and dated classification decisions | Yes |
| [survey/README](survey/README.md) | Research questions, manuscript outline, and evidence coverage | Yes |
| [survey/PROTOCOL](survey/PROTOCOL.md) | Search, screening, extraction, and comparison rules | Yes |
| [survey/reviews.json](survey/reviews.json) | Source-located evidence records and explicit limitations | Yes |
| [survey/catalog.md](survey/catalog.md) / [catalog.json](survey/catalog.json) | Complete index and extraction-status export | No; regenerate |
| [survey/EVIDENCE](survey/EVIDENCE.md) | Comparative view generated from recorded evidence | No; regenerate |
| [survey/REVIEW_QUEUE](survey/REVIEW_QUEUE.md) | Unresolved classification and evidence tasks | Yes |
| [CONTRIBUTING](../CONTRIBUTING.md) | Submission format and validation commands | Yes |
| [COMMUNITY](../COMMUNITY.md) | Review responsibility and contribution credit | Yes |
| [ROADMAP](../ROADMAP.md) | Delivery stages and manuscript maturity gates | Yes |
| [CHANGELOG](../CHANGELOG.md) | Dated editorial changes, newest first | Append new dated changes |
| [plans](plans/) | Historical design decisions, not current evidence or project status | Preserve as history |

The dashboard and survey exports both derive resource identity and classification
from the README. Do not maintain a second independent list. Run the commands in
[CONTRIBUTING](../CONTRIBUTING.md#local-checks) after changing resources or reviews.
