<h1 align="center">CurateCV | ATS Resume Builder</h1>

<p align="center">
   <a href="https://justinjdaniel.github.io/ats-resume-builder-TinyToys/">
      <img src="public/icon.svg" alt="CurateCV logo" width="128" height="128">
   </a>
</p>

<p align="center">
   <a href="https://github.com/Justinjdaniel/ats-resume-builder-TinyToys">GitHub Repository</a>
   &nbsp;&bull;&nbsp;
   <a href="https://justinjdaniel.github.io/ats-resume-builder-TinyToys/">Live Demo</a>
   &nbsp;&bull;&nbsp;
   <a href="https://github.com/Justinjdaniel/ats-resume-builder-TinyToys/issues">Issues</a>
</p>

<p align="center">
   <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License: MIT"></a>
   <a href="#privacy--data-sovereignty"><img src="https://img.shields.io/badge/Privacy-100%25%20Local--First-emerald?style=flat-square" alt="Privacy: 100% Client-Side"></a>
   <a href="#multi-provider-ai--local-ollama"><img src="https://img.shields.io/badge/AI-Ollama%20%7C%20Gemini%20%7C%20OpenAI%20%7C%20Claude%20%7C%20Groq-purple?style=flat-square" alt="AI Providers"></a>
   <a href="#ats-scoring-algorithm"><img src="https://img.shields.io/badge/ATS%20Compatibility-95%25%2B%20Target-blue?style=flat-square" alt="ATS Compatibility"></a>
   <a href="#progressive-web-app-pwa"><img src="https://img.shields.io/badge/PWA-Installable%20Offline-orange?style=flat-square" alt="PWA Ready"></a>
   <a href="#webmcp-agent-tools"><img src="https://img.shields.io/badge/Protocol-WebMCP%20Ready-cyan?style=flat-square" alt="WebMCP Agent"></a>
</p>

---

## The Problem: The AI Resume Screening Bottleneck

In today's hiring landscape, enterprise recruitment platforms rely heavily on **Applicant Tracking Systems (ATS)** such as Workday, Greenhouse, Lever, and Taleo, as well as generative AI pre-screening filters.

Industry data shows that **over 75% of qualified resumes are rejected automatically** before a human recruiter or hiring manager ever reviews them. The primary causes:

- **Missing Exact Keyword Matches**: Modern parsers scan strictly for specific frameworks, certifications, and technical buzzwords present in the job description.
- **Unparseable Visual Clutter**: Non-standard fonts, embedded tables, multi-column tables, text boxes, and complex graphics break parser extractors.
- **Unquantified Bullets**: Generic responsibility descriptions fail to pass impact filters looking for metric-driven accomplishments (e.g., Google's XYZ formula: _"Accomplished [X] as measured by [Y], by doing [Z]"_).
- **Privacy Exploitation**: Candidates turning to third-party online resume builders often have their personal contact details, employment history, and compensation expectations harvested, stored on remote databases, or shared with third parties.

---

## The Solution: CurateCV

**CurateCV** was created by **Justin John D** to solve this exact bottleneck through a **Local-First, Zero-Telemetry architecture**:

1. **Master Career Store**: Maintain a single, comprehensive Master Profile containing all your lifetime experiences, achievements, publications, and skills safely in your own browser (IndexedDB).
2. **Dynamic Role Curation**: When you find a target role, paste the Job Description. CurateCV extracts key requirements, re-ranks your skills taxonomy, tailors your professional headline and summary, and rewrites bullet points to maximize ATS keyword alignment.
3. **Absolute Privacy Sovereignty**: Run curation using **100% Local AI via Ollama** (data never leaves your computer) or direct **BYOK (Bring-Your-Own-Key)** connections (Google Gemini, OpenAI, Claude, Groq, OpenRouter) with zero intermediary backend servers.
4. **Targeted Cover Letters**: Optionally generate a matching, role-specific executive or technical cover letter aligned with the target company's mission.
5. **Clean Multi-Format Export**: Export to **high-fidelity Vector PDF** with physical page break protection, **Microsoft Word (.docx)** for recruiter submissions, or portable **JSON** for lifelong backup.

---

## Key Features

### 1. Privacy & Data Sovereignty

- **Zero Server Uploads**: No backend databases, no analytics trackers, no account logins, and no user surveillance.
- **Local Persistence**: All candidate information, saved job descriptions, and custom settings are stored in browser **IndexedDB** (`idb`) with local storage fallback.
- **No Third-Party Egress with Ollama**: Support for purely local LLM execution via Ollama (`http://localhost:11434`), ensuring sensitive employment information remains strictly on your local device.

### 2. Multi-Provider AI & Local Ollama

Choose the exact AI engine that aligns with your privacy and compute preferences:

| Provider                 | Type                 | Supported Models (Sep 2026 Standards)                                                                                  | Data Destination                           |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Ollama**               | **100% Local AI**    | `llama3.3`, `llama3.2`, `deepseek-r1:8b`, `deepseek-r1:14b`, `qwen2.5`, `phi4`, `mistral-small`                        | **Your Machine Only (Zero Egress)**        |
| **Google Gemini**        | Cloud BYOK           | `gemini-3.8-flash` (Flagship), `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-flash`, `gemini-2.5-pro` | Browser -> Google API directly             |
| **OpenAI**               | Cloud BYOK           | `gpt-4o` (Omni), `gpt-4o-mini`, `o3-mini`, `o3`, `o1`, `chatgpt-4o-latest`                                             | Browser -> OpenAI API directly             |
| **Anthropic Claude**     | Cloud BYOK           | `claude-3-7-sonnet-latest`, `claude-3-5-sonnet-latest`, `claude-3-5-haiku-latest`, `claude-3-opus-latest`              | Browser -> Anthropic API directly          |
| **Groq Cloud**           | Cloud BYOK (Fast)    | `llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`, `llama-3.1-8b-instant`, `qwen-2.5-coder-32b`               | Browser -> Groq API directly               |
| **OpenRouter**           | Cloud BYOK (Gateway) | `deepseek/deepseek-r1`, `meta-llama/llama-3.3-70b-instruct`, `anthropic/claude-3.7-sonnet`, `google/gemini-3.8-flash`  | Browser -> OpenRouter API directly         |
| **Deterministic Engine** | Built-in (No AI)     | Heuristic keyword density & Google XYZ rule engine                                                                     | **Offline in browser memory (Zero Setup)** |

### 3. The 5-Step Guided Workflow

1. **Step 1: Candidate Information**: Manage personal info, professional summary, work history with quantified highlights, education, categorized skills, projects, and certifications. Full JSON export/import and sample profile loading.
2. **Step 2: Target Job Description**: Paste any job description. Automated keyword extraction identifies required technical skills, leadership traits, and certifications. Toggle optional cover letter generation.
3. **Step 3: AI Curation & Synthesis**: Real-time tailoring of headline, executive summary, bullet points, and skills hierarchy against the target role.
4. **Step 4: ATS Match Overview**: In-depth audit calculating overall ATS match score (0-100%), keyword density, category coverage, and one-click injection of missing critical terms.
5. **Step 5: Style Selection, Live Preview & Multi-Format Export**:
   - **Themes**: Modern (clean emerald accents), Professional (high-contrast monochrome serif), Creative (indigo sidebar layout).
   - **Page Formats**: ISO A4 and US Letter sizing with configurable margins (compact, normal, spacious).
   - **Sheet Break Boundaries**: Real-time visual page boundary markers simulating physical print cuts.
   - **Exports**: Vector PDF via native browser print engine, Microsoft Word (.docx), and portable JSON.

---

## Local AI with Ollama Setup Guide

For 100% offline, zero-data-egress resume curation:

1. **Install Ollama**:
   Download from [ollama.com](https://ollama.com) (available for macOS, Linux, and Windows).

2. **Pull a Recommended Model**:

   ```bash
   ollama pull llama3.2
   # or for deep reasoning:
   ollama pull deepseek-r1:8b
   ```

3. **Start Ollama with CORS Enabled**:
   Because CurateCV runs in your web browser, enable cross-origin requests by starting Ollama with `OLLAMA_ORIGINS`:

   ```bash
   # Linux / macOS
   OLLAMA_ORIGINS="*" ollama serve

   # Windows (Command Prompt)
   set OLLAMA_ORIGINS=*
   ollama serve

   # Windows (PowerShell)
   $env:OLLAMA_ORIGINS="*"
   ollama serve
   ```

4. **Connect in CurateCV**:
   - Click the **AI Engine** button in the header.
   - Select **Ollama (Local AI)**.
   - Click **Scan Local Models** to auto-detect models downloaded on your machine.
   - Click **Test Connection** to verify latency and connectivity.
   - Click **Save & Apply**.

---

## WebMCP Agent Tools

CurateCV implements the **WebMCP (Web Model Context Protocol)** specification, enabling browser-based AI coding agents and autonomous assistants to interact with the curation engine:

| Tool Name               | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| `curate_cv_profile`     | Programmatically curates a master profile against a target job description.       |
| `calculate_ats_score`   | Computes quantitative ATS keyword match percentage and identifies missing skills. |
| `generate_cover_letter` | Synthesizes a targeted cover letter for the hiring committee.                     |
| `export_cv_document`    | Triggers document export in Vector PDF, Word (.docx), or JSON.                    |

---

## Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: `motion/react`
- **Icons**: `lucide-react`
- **Storage Layer**: IndexedDB via `idb` with localStorage fallback
- **Document Generation**: `docx` (Word export), Browser Print API (Vector PDF)
- **AI SDK**: `@google/genai` (Gemini) + native `fetch` client (OpenAI, Claude, Groq, Ollama)
- **Offline / PWA**: Web App Manifest, Service Worker, cacheable static bundle

---

## Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/Justinjdaniel/ats-resume-builder-TinyToys.git
cd ats-resume-builder-TinyToys

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Issues & Feature Suggestions

Feedback, bug reports, and feature proposals are warmly welcomed:

- 🐛 **Report a Bug**: [Open an Issue](https://github.com/Justinjdaniel/ats-resume-builder-TinyToys/issues/new?template=bug_report.md&title=%5BBUG%5D%3A+)
- 💡 **Suggest a Feature**: [Feature Request](https://github.com/Justinjdaniel/ats-resume-builder-TinyToys/issues/new?template=feature_request.md&title=%5BFEATURE%5D%3A+)
- ⭐ **GitHub Repository**: [github.com/Justinjdaniel/ats-resume-builder-TinyToys](https://github.com/Justinjdaniel/ats-resume-builder-TinyToys)

---

## Author & Acknowledgments

CurateCV is designed, developed, and maintained by **Justin John D** ([@justinjdaniel](https://github.com/justinjdaniel)).

Dedicated to job seekers worldwide striving for fair, transparent, and privacy-preserving career opportunities.
