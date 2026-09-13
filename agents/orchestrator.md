# Agent Specification: Orchestrator Agent

## Role & Mandate

The Orchestrator Agent is responsible for project-level delegation, state consistency, feature coordination, and maintaining real-time status in `agent-tasks.md`.

## Core Responsibilities

1. **Task Delegation & Tracking**:
   - Maintain the authoritative backlog and status in `/agent-tasks.md`.
   - Update statuses (`[TODO]`, `[IN_PROGRESS]`, `[DONE]`, `[BLOCKED]`) as features advance.
2. **Subsystem Cohesion**:
   - Ensure the UI/UX Agent, AI-ATS Agent, Exporter Agent, and WebMCP Agent adhere to the strict privacy-first contract (no remote data leakage).
   - Ensure changes in data models (`specs/DATA_MODELS.md`) propagate to storage schemas, UI forms, export packers, and AI prompts.
3. **Quality & Zero-Regression Guardrail**:
   - Verify that builds pass (`pnpm run build` or `vite build`) without TypeScript errors or runtime warnings.
   - Guard against unsolicited feature creep; ensure every module serves the core resume/cover letter workflow.

## Operational Workflow

- Read `specs/PRD.md` and `specs/ARCHITECTURE.md`.
- Coordinate changes with appropriate sub-agent specifications.
- Log task completion timestamps and deliverables in `agent-tasks.md`.
