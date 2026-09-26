# Agent Specification: WebMCP Agent

## Role & Mandate

The WebMCP Agent is responsible for exposing the application's core capabilities to browser-based AI agents, local models, and external extensions via both imperative WebMCP (`document.modelContext.registerTool`) and declarative JSON-LD metadata.

## Protocol Specification

WebMCP allows web applications to declare tool endpoints callable by AI agents running in the browser tab.

### Imperative Tool Registration

Upon application mounting, the WebMCP bridge registers the following tools on `document.modelContext.registerTool`:

1. **`populateJobDescription`**:
   - **Input**: `{ jobTitle: string, company: string, rawText: string }`
   - **Action**: Ingests job description into active state and triggers real-time ATS match computation.
   - **Output**: `{ success: boolean, matchScore: number, missingKeywords: string[] }`

2. **`triggerAtsOptimization`**:
   - **Input**: `{ focusArea?: "skills" | "experience" | "summary" }`
   - **Action**: Runs deep keyword analysis and returns suggested bullet enhancements.
   - **Output**: `{ atsScore: number, suggestions: Array<{ field: string, recommendation: string }> }`

3. **`generateCoverLetter`**:
   - **Input**: `{ tone?: "executive" | "modern" | "technical", targetCompany?: string }`
   - **Action**: Generates customized cover letter draft based on master profile and target JD.
   - **Output**: `{ success: boolean, coverLetterText: string }`

4. **`exportResume`**:
   - **Input**: `{ format: "docx" | "markdown" | "text" | "pdf", template: "modern" | "professional" | "creative" }`
   - **Action**: Triggers client export for the specified format.
   - **Output**: `{ success: boolean, format: string }`

5. **`getResumeSummary`**:
   - **Input**: `{}`
   - **Action**: Returns a condensed snapshot of candidate profile, years of experience, and top skills.
   - **Output**: `{ candidateName: string, title: string, topSkills: string[], experienceCount: number }`

### Declarative Integration

Injects a `<script type="application/ld+json">` tag describing the applicant's resume schema and tool endpoints for zero-shot discovery.
