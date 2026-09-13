# Agent Task Tracking & Project Status

_Maintained by Orchestrator Agent_
_Last Updated: 2026-09-13_

## Backlog & Execution Status

| ID          | Module / Task                                                                        | Assigned Agent     |     Status      | Notes                                                                                                              |
| :---------- | :----------------------------------------------------------------------------------- | :----------------- | :-------------: | :----------------------------------------------------------------------------------------------------------------- |
| **TASK-01** | Repository specs framework (`specs/PRD.md`, `ARCHITECTURE.md`, `DATA_MODELS.md`)     | Orchestrator Agent |    `[DONE]`     | Completed architecture and PRD documentation                                                                       |
| **TASK-02** | Agent specification framework (`agents/*.md`)                                        | Orchestrator Agent |    `[DONE]`     | Orchestrator, UI/UX, AI-ATS, Exporter, WebMCP agents documented                                                    |
| **TASK-03** | Local-First Storage Subsystem (IndexedDB via `idb` + `localStorage` fallback)        | Orchestrator Agent |    `[DONE]`     | Full schema v1, offline caching, reactive state synchronization                                                    |
| **TASK-04** | Master Profile Editor UI (Contact, Experience, Education, Skills, Projects, Certs)   | UI/UX Agent        |    `[DONE]`     | Multi-tab ergonomic editing controls with drag-and-drop parsing                                                    |
| **TASK-05** | Real-time ATS Matching Engine & JD Input Pane                                        | AI-ATS Agent       |    `[DONE]`     | Lexical tokenizer + BYOK Gemini AI analysis + 1-click bullet point suggestions                                     |
| **TASK-06** | Targeted Cover Letter Generator with Tone Selectors                                  | AI-ATS Agent       |    `[DONE]`     | One-click synthesis and Markdown, plain text, and docx export                                                      |
| **TASK-07** | 3 Visual Template Layout Engines (Modern, Professional, Creative)                    | UI/UX Agent        |    `[DONE]`     | A4 and US Letter dimensional scaling with optical parity                                                           |
| **TASK-08** | Client-Side Multi-Format Export Engine (Word .docx, Vector PDF print, Markdown, TXT) | Exporter Agent     |    `[DONE]`     | `docx` binary generation and CSS paged print media                                                                 |
| **TASK-09** | WebMCP Protocol Tool Registration (`document.modelContext.registerTool`)             | WebMCP Agent       |    `[DONE]`     | Ingest JD, ATS optimize, export, summary tools + UI simulator                                                      |
| **TASK-10** | GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)                           | Orchestrator Agent | `[IN_PROGRESS]` | pnpm frozen install, dependency cache, format/lint/build gates; verify on push and pull request                    |
| **TASK-11** | Visual Page Break Guides & Physical Paper Emulation (`PageBreakIndicator.tsx`)       | UI/UX Agent        |    `[DONE]`     | Dynamic A4/Letter dashed break guides, split-content warnings, 1-click fit                                         |
| **TASK-12** | GitHub Pages Deployment (`.github/workflows/deploy.yml`)                             | Orchestrator Agent | `[IN_PROGRESS]` | Build with repository base path, upload Pages artifact, deploy only after format, type-check, and build gates pass |

## Active Orchestration Loop

The Orchestrator Agent keeps TASK-10 and TASK-12 active until the following evidence is recorded:

| Check                                      | Expected Result                                                                  |  Status  |
| :----------------------------------------- | :------------------------------------------------------------------------------- | :------: |
| `pnpm install --frozen-lockfile`           | Reproducible, non-interactive install using the pnpm lockfile                    | `[TODO]` |
| `pnpm format:check`                        | All repository files pass Prettier                                               | `[TODO]` |
| `pnpm lint`                                | TypeScript validation passes                                                     | `[TODO]` |
| `pnpm build`                               | Default production build succeeds                                                | `[TODO]` |
| `VITE_BASE_PATH=/<repository>/ pnpm build` | GitHub Pages project-path build succeeds and emits a deployable `dist/` artifact | `[TODO]` |
| Workflow review                            | CI runs format before lint/build; deployment requires the validated artifact     | `[TODO]` |

Required regression cases for TASK-12:

- A normal root-path build continues to emit working assets.
- A repository-path build prefixes Vite and PWA assets with `/<repository>/`.
- A formatting failure prevents lint, build, and deployment steps from running.
- A type-check or build failure prevents the Pages artifact from being deployed.
- The deployment workflow has only the minimum Pages and OIDC permissions needed.
