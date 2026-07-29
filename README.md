# 📄 ATS Resume Builder (BYOK)

A privacy-first, client-side web application built with **Vite, React, and TypeScript** that helps job seekers tailor their master profile to specific job descriptions using LLMs (OpenAI & Google Gemini).

### ✨ Features
- 🔑 **Bring Your Own Key (BYOK)**: API keys are stored exclusively in your browser's `localStorage` and never sent to a backend server.
- 📋 **Master Profile Management**: Maintain a single master JSON profile (experiences, education, skills, projects) and export/import back-ups easily.
- 📄 **Job Description (JD) Parsing**: Support for `.pdf`, `.docx`, and `.txt` uploads or direct text pasting.
- 🎯 **ATS Skill Matching**: Real-time evaluation of ATS match scores, highlighted keyword coverage, and identified skill gaps.
- 📥 **ATS-Compliant Exports**:
  - **DOCX**: Single-column typography without tables or floating frames to guarantee reader compatibility with systems like Greenhouse, Lever, and Workday.
  - **PDF**: Clean, structured text rendering via `@react-pdf/renderer`.

### 🛠 Tech Stack
- **Frontend**: Vite, React, TypeScript, Tailwind CSS
- **AI Integrations**: OpenAI SDK, `@google/generative-ai`
- **File Processing**: `pdfjs-dist`, `mammoth`
- **Document Generation**: `docx`, `@react-pdf/renderer`
