---
name: Agentic Orchestration and Test Requirements
description: "Use when planning or executing agentic orchestration, delegating work, updating agent specifications or task tracking, or implementing features in this repository. Requires explicit test cases and validation evidence for every task."
---

# Agentic Orchestration

## Task Contracts

- Before delegating work, define the task's scope, owning agent, affected interfaces, acceptance criteria, and test cases.
- Every task must include at least one positive case and one failure, boundary, or privacy case appropriate to the behavior.
- For changes that cross agents or modules, include contract tests for the data passed between those boundaries.
- Preserve the project's local-first privacy contract: tests must verify that candidate data is not sent to an unintended remote service.

## Delegation and Handoffs

- Assign each task one clear owner and record dependencies in `agent-tasks.md`.
- The delegated agent must return the implementation summary, files changed, test cases added or run, commands executed, and any remaining risks.
- Do not mark a task `[DONE]` until its acceptance criteria and test cases have been checked.
- Mark incomplete validation as `[BLOCKED]` or leave the task in progress; do not treat a passing build as proof that behavior is correct.

## Required Test Coverage

- Unit-test deterministic logic such as parsing, ATS scoring, transformations, storage adapters, and export data preparation.
- Add component or integration tests for workflow transitions, persistence, import/export, AI-provider boundaries, and WebMCP tool registration.
- Add end-to-end or browser checks for user-critical flows: candidate profile entry, job-description ingestion, curation, ATS review, and document export.
- Include regression tests for every bug fix and test both valid and invalid input paths for user-controlled data.
- Test loading, empty, error, cancellation, offline, and permission-denied states wherever the feature can encounter them.

## Validation and Reporting

- Run the narrowest relevant test first, then the repository checks (`pnpm lint` and `pnpm build`) when the change affects shared or user-facing code.
- Use deterministic fixtures and avoid real API keys, personal candidate data, network calls, or nondeterministic model output in automated tests.
- When an AI provider is involved, test the request shape, response parsing, fallback behavior, and failure handling with mocked responses.
- Record the exact validation commands and their outcomes with the task deliverable.
- If a test cannot be added or run, document why, identify the residual risk, and keep the task from being reported as fully verified.

## Orchestrator Checklist

For each delegated task, confirm:

- Scope and acceptance criteria are explicit.
- Positive and negative or boundary test cases are listed.
- Cross-agent contracts have tests where applicable.
- Privacy and offline behavior are covered where applicable.
- Tests were added or an existing test was identified.
- Focused validation passed.
- `agent-tasks.md` reflects the current status and validation evidence.
