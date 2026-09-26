# System Architecture & Technical Specification

## 1. Technology Stack

- **UI Framework**: React 19 (`react`, `react-dom`) with StrictMode.
- **Build Tool & Bundler**: Vite 6, ESM-native module resolution.
- **Package Manager**: `pnpm` with locked deterministic dependency tree.
- **CSS Engine**: Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";`), CSS variables for themes and print dimensions.
- **Icons & Motion**: `lucide-react`, lightweight motion transitions.
- **Client-Side Persistence**: IndexedDB via `idb` with fallback to `localStorage`.
- **Document Export**:
  - Microsoft Word: Client-side `docx` (Paragraph, TextRun, HeadingLevel, AlignmentType, Document, Packer).
  - Print & Vector PDF: Dynamic CSS print media queries (`@page { size: ...; margin: ... }`) with window.print driver and print preview emulator.
  - Plain Text / Markdown: Custom client-side serializers.
- **AI Integration**:
  - Bring-Your-Own-Key (BYOK) architecture utilizing `@google/genai` on client or server proxy when configured.
  - Fallback local rule-based heuristic tokenizers for offline ATS analysis.

---

## 2. Architectural Topology & Data Flow

```
[User Browser Sandbox]
  ├── [File Ingestor Engine] (Dropzone -> Client FileReader -> Parser -> ResumeState)
  ├── [Local Storage Layer]
  │     ├── IndexedDB ('resume_builder_db', store: 'profiles', 'resumes', 'settings')
  │     └── LocalStorage fallback cache
  ├── [State Management / Hooks]
  │     ├── useResumeStore (Profile, Experiences, Education, Skills, Projects)
  │     ├── useJobDescriptionStore (Target JD, Match Analysis, Suggestions)
  │     └── useSettingsStore (API Key, Active Template, Paper Size)
  ├── [AI & ATS Engine]
  │     ├── Local Heuristic Tokenizer (Frequency, TF-IDF, N-grams, Section density)
  │     └── Gemini BYOK Service (@google/genai, direct client or fallback)
  ├── [Layout & Template Engines]
  │     ├── Modern Layout (Grid-based, minimal accents)
  │     ├── Professional Layout (Executive single-column hierarchy)
  │     └── Creative Layout (Two-column sidebar structure)
  ├── [Export Subsystem]
  │     ├── Docx Generator (docx Packer Blob export)
  │     ├── Vector PDF / Print Engine (A4 & US Letter print media controller)
  │     └── Markdown / Plain Text Serializer
  └── [WebMCP Protocol Bridge]
        ├── document.modelContext.registerTool API
        └── Declarative Schema Tags (JSON-LD)
```

---

## 3. Browser API Integration Map

1. **IndexedDB API / `idb`**: Durable client-side storage for multi-version resumes and cover letter drafts.
2. **File System Access API & File API (`FileReader`, `Blob`)**: Local file reading (PDF/text/markdown) without network transmission.
3. **Clipboard API (`navigator.clipboard.writeText`)**: Instant Markdown and Plain-Text copy.
4. **CSS Paged Media (`@page`, `size: A4`, `size: letter`)**: Exact physical print simulation and vector PDF output.
5. **WebMCP (`document.modelContext`)**: Agent tool registration for browser automation.

---

## 4. Security & Privacy Sandbox Model

- All credentials (e.g. Gemini API Key) are stored exclusively in the user's browser client storage.
- Zero outbound telemetry or third-party tracking scripts.
- Content Security Policy and Sandboxed execution prevent data exfiltration.
