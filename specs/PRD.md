# Product Requirements Document (PRD)

## 1. Executive Summary

**Privacy-First Resume & Cover Letter Builder** is a zero-telemetry, local-first web application enabling professionals to curate master career profiles, tailor job-targeted resumes, calculate real-time ATS match scores, generate customized cover letters, and export print-ready A4/US-Letter documents (Vector PDF, Microsoft Word DOCX, Markdown, and TXT).

The application strictly enforces **100% client-side data sovereignty**: all user career histories, resumes, notes, and Bring-Your-Own-Key (BYOK) configurations remain inside the browser's local sandbox using IndexedDB (`idb`) and `localStorage`.

---

## 2. Target Persona & User Journey

1. **The Privacy-Conscious Professional**: Refuses to upload sensitive contact details, work achievements, and proprietary company metrics to unvetted cloud resume SaaS databases.
2. **The Active Job Seeker**: Needs to ingest an existing resume or job description, inspect missing industry keywords, calibrate bullet points against specific roles, and instantly generate targeted cover letters.
3. **The Executive & Creative Applicant**: Demands clean, mathematically proportioned layout themes (Modern, Professional, Creative) with calibrated A4 / US Letter paper dimension modes and precise print margins.
4. **AI-Enabled Browser Agents**: Autonomous or assistive web agents that inspect or interact via the **WebMCP** protocol (`document.modelContext.registerTool`).

---

## 3. Functional Requirements

### 3.1 Master Data Ingestion & Management

- **Client-Side Document Parsing**:
  - Drag-and-drop file ingestion supporting PDF, Word/docx, Markdown (`.md`), and raw text (`.txt`).
  - Native client-side text extraction and structured parsing into career sections.
- **Sectional Data Forms**:
  - Personal Information & Contact (Name, Title, Email, Phone, Location, Portfolio/GitHub/LinkedIn URLs, Executive Summary).
  - Work Experience (Company, Role, Dates, Location, Rich Accomplishment Bullet Points).
  - Education (Institution, Degree, Field of Study, Graduation Year, Honors/GPA).
  - Skills (Categorized: Core Technical, Soft Skills, Tools & Frameworks, Languages).
  - Projects (Title, Role, Tech Stack, Link, Impact Description).
  - Certifications & Awards (Name, Issuing Body, Date, Credential ID/URL).

### 3.2 BYOK AI ATS Matching & Curation

- **Bring-Your-Own-Key (BYOK)**:
  - Users provide their Gemini API key stored strictly in local browser storage (IndexedDB/localStorage) with optional obfuscation/encryption.
  - Zero server relays of private user data. Optional local-fallback rule-based ATS analysis when offline or without an API key.
- **Job Description Analysis & ATS Scoring**:
  - Real-time lexical and semantic analysis comparing resume contents against pasted target JD.
  - Match score (0–100%), extracted matched keywords, critical missing keywords, and contextual bullet-point enhancement suggestions.
- **One-Click Targeted Cover Letter Generator**:
  - Generates cohesive, professional cover letters referencing specific qualifications that bridge user profile highlights with JD requirements.

### 3.3 Dynamic Layout Templates & Paper Engines

- **3 Curated Layout Themes**:
  - **Modern**: Clean, contemporary grid layout with subtle stone accents, clear visual hierarchy, and balanced whitespace.
  - **Professional**: Executive single-column hierarchy, authoritative typography, and conservative margins.
  - **Creative**: Balanced two-column sidebar layout highlighting key skills, contact metadata, and project links.
- **Paper Dimension Engine**:
  - Toggles between **A4** (210mm × 297mm) and **US Letter** (8.5in × 11in).
  - Dynamic margin compensation for screen preview and CSS `@media print` engine.

### 3.4 Multi-Format Export

- **Vector PDF Print Engine**: Native vector fidelity via browser print subsystem with exact paper boundary emulation.
- **Microsoft Word (.docx)**: Client-side binary creation via `docx` library preserving headings, bullet styles, tables, and typography.
- **Markdown & Plain Text**: Instant copy to clipboard and `.md` file download.

### 3.5 WebMCP Agent Tool Registration

- Exposes imperative tools on `document.modelContext.registerTool` and declarative semantic metadata:
  - `populateJobDescription(jdText)`
  - `triggerAtsOptimization()`
  - `generateCoverLetter(tone)`
  - `exportResume(format, template)`
  - `getResumeSummary()`

---

## 4. Non-Functional Requirements & Privacy Contracts

- **Data Sovereignty Contract**: No analytical tracking, telemetry, or server database write.
- **Offline Capability**: Fully functional offline; AI features gracefully fall back to local rule-based ATS heuristic analyzers when no network or key is available.
- **Performance**: Sub-100ms UI interactions, zero sluggish rendering, optimized React 19 rendering.
- **Accessibility**: High-contrast WCAG AA compliant color palettes, keyboard accessibility, semantic landmarks, and full touch support.
