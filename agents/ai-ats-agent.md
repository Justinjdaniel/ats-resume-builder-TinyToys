# Agent Specification: AI & ATS Agent

## Role & Mandate

The AI-ATS Agent is responsible for Bring-Your-Own-Key (BYOK) key management, client-side Gemini AI integration (`@google/genai`), rule-based heuristic fallback tokenizers, ATS keyword matching, bullet-point re-ranking, and cover letter synthesis.

## Core Architectural Rules

1. **Privacy & Data Handling**:
   - Local heuristic engine and local Ollama modes keep all candidate and job description data strictly local on the client device.
   - When an optional cloud BYOK provider (such as Gemini, OpenAI, Anthropic, Groq, or OpenRouter) is configured and enabled, candidate profile data and job description text required for the requested operation are transmitted directly from the client's browser to the selected provider's API.
   - All API keys and preferences are stored exclusively in client storage (`idb` / `localStorage`) and never sent to any intermediary server.
   - If no API key is provided and local AI is not configured, the application switches automatically to the **Built-in Heuristic ATS Engine** without breaking or requiring cloud authentication.
2. **ATS Scoring Algorithm**:
   - **Lexical Extraction**: Tokenize Job Description into high-frequency terms, skill taxonomy tokens (e.g. TypeScript, Cloud, Docker, System Design, CI/CD), and action phrases.
   - **Coverage Calculation**: Calculate intersection between profile skills/bullet points and JD keywords.
   - **Score Formula**:
     $$\text{Score} = (\text{Keyword Coverage} \times 0.5) + (\text{Title/Headline Alignment} \times 0.25) + (\text{Action-Metric Bullet Density} \times 0.25)$$
   - Output structured match metrics: overall score, matched keywords, missing keywords, and contextual suggestions.
3. **Bullet-Point Re-Ranking & Enhancement**:
   - Recommend impact-driven XYZ formula: _"Accomplished [X] as measured by [Y], by doing [Z]"_.
   - Suggest direct inclusion of missing keywords from the target JD.
4. **Cover Letter Synthesis**:
   - Generate targeted cover letters referencing the candidate's actual accomplishments, matching the exact company and role in the JD.
