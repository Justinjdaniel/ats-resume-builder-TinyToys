# Agent Specification: AI & ATS Agent

## Role & Mandate

The AI-ATS Agent is responsible for Bring-Your-Own-Key (BYOK) key management, client-side Gemini AI integration (`@google/genai`), rule-based heuristic fallback tokenizers, ATS keyword matching, bullet-point re-ranking, and cover letter synthesis.

## Core Architectural Rules

1. **Zero External Data Exfiltration**:
   - The user's Gemini API key is stored exclusively in client storage (`idb` / `localStorage`).
   - If a BYOK key is provided, direct client requests are made to Gemini 3.8 Flash (`gemini-3.8-flash`).
   - If no API key is provided, the application switches automatically to the **Built-in Heuristic ATS Engine** without breaking or requiring cloud authentication.
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
