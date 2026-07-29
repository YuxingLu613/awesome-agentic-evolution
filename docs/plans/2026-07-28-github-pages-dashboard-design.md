# GitHub Pages Dashboard Design

## Goal

Create a public GitHub Pages site that turns the repository into an explorable,
automatically refreshed dashboard. The repository remains the source of truth:
the site must not introduce a second manually maintained resource catalog.

## Architecture

The site is a dependency-free static application under `site/`. A Node.js
builder reads `README.md`, `CHANGELOG.md`, `ROADMAP.md`, and the public GitHub
API, then writes a single JSON snapshot into the deployment artifact. GitHub
Actions rebuilds the snapshot on pushes to `main`, on manual runs, and once per
day. A dedicated Pages deployment job publishes the artifact to the
`github-pages` environment.

No browser-side API token or persistent backend is required. Local builds use
the committed repository content and may omit remote activity metrics. In CI,
the workflow supplies the repository-scoped `GITHUB_TOKEN` only to the build
step.

## Dashboard

The first viewport explains the field and provides direct links to explore the
map, contribute, and open the GitHub repository. The dashboard then presents:

1. repository activity: stars, forks, contributors, open issues, open pull
   requests, and last update;
2. research landscape: counts and representative resources across model,
   memory, skill/tool, workflow, environment, code, and co-evolution targets;
3. community progress: recent additions, contribution opportunities, and
   survey/tutorial roadmap milestones.

The visual direction is editorial and research-oriented: warm paper surfaces,
dark ink, restrained green and amber accents, strong typography, and compact
data cards. It must remain usable on phones, support reduced motion, and expose
clear focus states.

## Failure Handling

Repository parsing is deterministic and fails the build when required source
sections disappear. Remote GitHub API failures produce an explicit
`unavailable` activity state instead of invented zero values. Links remain
useful even when live metrics are unavailable.

## Verification

Tests cover Markdown extraction, activity fallback behavior, required dashboard
regions, relative Pages paths, and the deployment workflow. Validation includes
the existing Ruby suite, Node tests, a production artifact build, and a local
browser smoke check before publication.
