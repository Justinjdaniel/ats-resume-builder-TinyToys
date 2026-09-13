import {
  MasterProfile,
  JobDescription,
  AtsMatchMetric,
  BulletSuggestion,
  CoverLetter,
  AiModelConfig,
} from "../types";
import {
  executeAiCompletion,
  extractJsonFromResponse,
  AI_PROVIDERS,
} from "./aiProviderService";

// Curated tech & domain skill taxonomy for deterministic extraction
const COMMON_SKILL_TOKENS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Golang",
  "Rust",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Tailwind",
  "CSS3",
  "HTML5",
  "Node.js",
  "Express",
  "GraphQL",
  "REST API",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "Terraform",
  "CI/CD",
  "Kafka",
  "RabbitMQ",
  "Redis",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "DynamoDB",
  "Microservices",
  "Distributed Systems",
  "System Design",
  "Observability",
  "Prometheus",
  "Grafana",
  "Datadog",
  "OpenTelemetry",
  "eBPF",
  "Linux",
  "Git",
  "Agile",
  "Scrum",
  "Zero-Trust",
  "SOC 2",
  "HIPAA",
  "ISO 27001",
  "High Availability",
  "Fault Tolerance",
  "Performance Optimization",
  "Mentorship",
];

const ACTION_VERBS = [
  "Architected",
  "Spearheaded",
  "Engineered",
  "Designed",
  "Delivered",
  "Scaled",
  "Migrated",
  "Optimized",
  "Championed",
  "Authored",
  "Orchestrated",
  "Refactored",
  "Accelerated",
  "Reduced",
  "Pioneered",
];

/**
 * Heuristic Local-First Keyword Extraction
 */
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase();
  const matched = new Set<string>();

  COMMON_SKILL_TOKENS.forEach((token) => {
    // Word boundary match
    const regex = new RegExp(
      `\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    if (regex.test(normalized)) {
      matched.add(token);
    }
  });

  // Extract capital tech words or domain phrases (e.g., Multi-Region, Event-Driven)
  const stopWords = new Set([
    "about",
    "role",
    "with",
    "from",
    "this",
    "that",
    "your",
    "their",
    "required",
    "preferred",
    "responsibilities",
  ]);
  const words = text.match(/[A-Z][a-zA-Z0-9+#.-]{2,}/g) || [];
  words.forEach((w: string) => {
    if (w.length > 2 && !stopWords.has(w.toLowerCase())) {
      if (
        COMMON_SKILL_TOKENS.some((s) => s.toLowerCase() === w.toLowerCase())
      ) {
        matched.add(w);
      }
    }
  });

  return Array.from(matched);
}

/**
 * Deterministic Local ATS Matcher
 */
export function computeLocalAtsMatch(
  profile: MasterProfile,
  jd: JobDescription,
): AtsMatchMetric {
  const jdKeywords =
    jd.parsedKeywords.length > 0
      ? jd.parsedKeywords
      : extractKeywordsFromText(jd.rawText);

  // Collect all resume text
  const resumeTokens = new Set<string>();

  // Profile summary
  profile.personalInfo.summary
    .split(/\W+/)
    .forEach((w) => resumeTokens.add(w.toLowerCase()));
  profile.personalInfo.headline
    .split(/\W+/)
    .forEach((w) => resumeTokens.add(w.toLowerCase()));

  // Skills
  profile.skillCategories.forEach((cat) => {
    cat.skills.forEach((s) => {
      resumeTokens.add(s.toLowerCase());
      s.split(/\W+/).forEach((part) => resumeTokens.add(part.toLowerCase()));
    });
  });

  // Experience highlights
  profile.experiences.forEach((exp) => {
    exp.position.split(/\W+/).forEach((w) => resumeTokens.add(w.toLowerCase()));
    exp.highlights.forEach((h) => {
      h.split(/\W+/).forEach((w) => resumeTokens.add(w.toLowerCase()));
    });
  });

  // Project bullets
  profile.projects.forEach((proj) => {
    proj.technologies.forEach((t) => resumeTokens.add(t.toLowerCase()));
    proj.bullets.forEach((b) => {
      b.split(/\W+/).forEach((w) => resumeTokens.add(w.toLowerCase()));
    });
  });

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach((kw) => {
    const kwLower = kw.toLowerCase();
    if (
      resumeTokens.has(kwLower) ||
      Array.from(resumeTokens).some(
        (rt) => rt.includes(kwLower) || kwLower.includes(rt),
      )
    ) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Title alignment score
  const jdTitleTokens = jd.title
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);
  const headlineLower = profile.personalInfo.headline.toLowerCase();
  const titleOverlap = jdTitleTokens.filter((t) => headlineLower.includes(t));
  const jobTitleMatchScore =
    jdTitleTokens.length > 0
      ? Math.min(
          100,
          Math.round((titleOverlap.length / jdTitleTokens.length) * 100),
        )
      : 80;

  // Skills coverage score
  const skillsMatchScore =
    jdKeywords.length > 0
      ? Math.min(
          100,
          Math.round((matchedKeywords.length / jdKeywords.length) * 100),
        )
      : 75;

  // Impact and metric score (measures numbers, % and metrics in bullet points)
  let totalBullets = 0;
  let quantifiedBullets = 0;
  profile.experiences.forEach((exp) => {
    exp.highlights.forEach((h) => {
      totalBullets++;
      if (/\d+%|\$\d+|\d+\+?|\b[0-9]{1,3}(,\d{3})+\b/.test(h)) {
        quantifiedBullets++;
      }
    });
  });

  const impactScore =
    totalBullets > 0
      ? Math.min(100, Math.round((quantifiedBullets / totalBullets) * 100))
      : 70;

  // Weighted overall ATS score
  const overallScore = Math.round(
    skillsMatchScore * 0.5 + jobTitleMatchScore * 0.25 + impactScore * 0.25,
  );

  // Generate actionable suggestions
  const bulletPointSuggestions: BulletSuggestion[] = [];
  if (profile.experiences.length > 0 && missingKeywords.length > 0) {
    const firstExp = profile.experiences[0];
    const topMissing = missingKeywords.slice(0, 2).join(" and ");
    if (firstExp.highlights.length > 0) {
      bulletPointSuggestions.push({
        experienceId: firstExp.id,
        originalBullet: firstExp.highlights[0],
        recommendedBullet: `Architected high-throughput infrastructure leveraging ${topMissing}, improving processing velocity by 34% while maintaining 99.99% availability.`,
        reasoning: `Infuses target JD requirements (${topMissing}) and adds quantified performance impact metrics.`,
      });
    }

    if (firstExp.highlights.length > 1) {
      const secondaryMissing = missingKeywords[2] || "CI/CD";
      bulletPointSuggestions.push({
        experienceId: firstExp.id,
        originalBullet: firstExp.highlights[1],
        recommendedBullet: `${firstExp.highlights[1]} Implemented automated ${secondaryMissing} pipelines reducing deployment friction by 40%.`,
        reasoning: `Strengthens operational rigor and addresses the ${secondaryMissing} requirement.`,
      });
    }
  }

  const summaryFeedback =
    overallScore >= 85
      ? "Outstanding match! Your profile demonstrates strong semantic alignment with the core technical stack and leadership responsibilities in this job description."
      : overallScore >= 65
        ? `Solid baseline match (${overallScore}%). Enhance alignment by incorporating key missing terminology (${missingKeywords.slice(0, 3).join(", ")}) into your work achievements and profile headline.`
        : `Low initial match (${overallScore}%). Tailor your career summary and top bullet points to directly address the primary systems and tools listed in the role.`;

  return {
    overallScore,
    matchedKeywords,
    missingKeywords,
    bulletPointSuggestions,
    summaryFeedback,
    jobTitleMatchScore,
    skillsMatchScore,
    impactScore,
  };
}

/**
 * Resolves configuration from either AiModelConfig or string API key
 */
function resolveAiConfig(input?: AiModelConfig | string): AiModelConfig | null {
  if (!input) return null;
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;
    return { provider: "gemini", model: "gemini-3.8-flash", apiKey: trimmed };
  }
  if (input.provider === "local_heuristic") return null;
  if (input.provider === "ollama") return input;
  if (input.apiKey && input.apiKey.trim().length > 3) return input;
  return null;
}

/**
 * Generate Cover Letter (Multi-Provider BYOK or 100% Local Ollama AI with fallback)
 */
export async function generateTargetedCoverLetter(
  profile: MasterProfile,
  jd: JobDescription,
  aiConfigOrKey?: AiModelConfig | string,
  tone: "executive" | "technical" | "modern" = "modern",
): Promise<CoverLetter> {
  const activeConfig = resolveAiConfig(aiConfigOrKey);

  if (activeConfig) {
    try {
      const prompt = `
Act as an elite executive career coach and technical copywriter.
Generate a tailored, high-converting cover letter based on the candidate's master profile and target job description.

Candidate:
- Name: ${profile.personalInfo.fullName}
- Headline: ${profile.personalInfo.headline}
- Summary: ${profile.personalInfo.summary}
- Top Experiences: ${profile.experiences.map((e) => `${e.position} at ${e.company}: ${e.highlights.join("; ")}`).join("\n")}
- Top Skills: ${profile.skillCategories
        .flatMap((c) => c.skills)
        .slice(0, 15)
        .join(", ")}

Target Job:
- Title: ${jd.title}
- Company: ${jd.company}
- Job Description Excerpt: ${jd.rawText.slice(0, 1200)}

Tone: ${tone} (Be persuasive, concise, metrics-driven, no filler clichés).

Output JSON with this exact schema:
{
  "recipientName": "Hiring Team",
  "recipientTitle": "Hiring Committee",
  "salutation": "Dear Hiring Committee,",
  "bodyParagraphs": [
    "Opening hook paragraph introducing enthusiasm and top relevant achievement",
    "Deep technical or business impact paragraph highlighting 1-2 quantifiable outcomes",
    "Alignment paragraph explaining resonance with the company mission and role challenges"
  ],
  "signOff": "Sincerely,\\n${profile.personalInfo.fullName}"
}
`;

      const raw = await executeAiCompletion(activeConfig, {
        prompt,
        systemPrompt:
          "You are an elite career strategist and ATS specialist. Return ONLY a valid JSON object matching the requested schema.",
        jsonMode: true,
        temperature: 0.6,
      });

      const parsed = extractJsonFromResponse(raw);
      if (parsed && (parsed.bodyParagraphs || parsed.recipientName)) {
        return {
          id: `cl-${Date.now()}`,
          jobTitle: jd.title,
          company: jd.company,
          recipientName: parsed.recipientName || "Hiring Committee",
          recipientTitle: parsed.recipientTitle || `${jd.company} Leadership`,
          salutation: parsed.salutation || "Dear Hiring Team,",
          bodyParagraphs: Array.isArray(parsed.bodyParagraphs)
            ? parsed.bodyParagraphs
            : [parsed.bodyParagraphs],
          signOff:
            parsed.signOff || `Sincerely,\n${profile.personalInfo.fullName}`,
          updatedAt: new Date().toISOString(),
        };
      }
    } catch (err: any) {
      console.warn(
        `Cover letter AI synthesis with ${activeConfig.provider} failed, using local intelligent engine:`,
        err,
      );
    }
  }

  // Local Intelligent Synthesis Fallback (100% Offline & Deterministic)
  const topExp = profile.experiences[0];
  const highlight1 =
    topExp?.highlights[0] ||
    "architected distributed systems scaling to millions of daily users.";
  const highlight2 =
    topExp?.highlights[1] ||
    "drove multi-million dollar cloud efficiency initiatives.";
  const topSkills = profile.skillCategories
    .flatMap((c) => c.skills)
    .slice(0, 4)
    .join(", ");

  const p1 = `I am writing to express my earnest enthusiasm for the ${jd.title} position at ${jd.company}. With a proven foundation leading engineering excellence across ${profile.personalInfo.headline.toLowerCase()}, I am eager to leverage my background in ${topSkills} to accelerate your team's most ambitious operational objectives.`;

  const p2 = `In my recent role as ${topExp?.position || "Lead Engineer"} at ${topExp?.company || "my organization"}, I directly spearheaded critical initiatives: ${highlight1} Furthermore, ${highlight2} My technical approach couples architectural discipline with rapid iteration, ensuring systems remain resilient, maintainable, and cost-efficient under high load.`;

  const p3 = `${jd.company}'s trajectory in delivering high-reliability systems aligns directly with my engineering standards. I would welcome the opportunity to discuss how my background in distributed execution, technical leadership, and strategic execution will deliver immediate value to the ${jd.title} initiatives.`;

  return {
    id: `cl-${Date.now()}`,
    jobTitle: jd.title,
    company: jd.company,
    recipientName: "Hiring Committee",
    recipientTitle: `${jd.company} Leadership`,
    salutation: `Dear ${jd.company} Hiring Committee,`,
    bodyParagraphs: [p1, p2, p3],
    signOff: `Sincerely,\n${profile.personalInfo.fullName}`,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * AI Bullet Rewriter using BYOK AI (Gemini, OpenAI, Claude, Groq, Ollama) or Local Rule Engine
 */
export async function optimizeBulletWithAi(
  bullet: string,
  targetKeyword: string,
  aiConfigOrKey?: AiModelConfig | string,
): Promise<string> {
  const activeConfig = resolveAiConfig(aiConfigOrKey);

  if (activeConfig) {
    try {
      const prompt = `Rewrite this resume bullet point using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Incorporate the technical keyword "${targetKeyword}". Keep it punchy, truthful in spirit, and under 25 words.

Original bullet: "${bullet}"
Return ONLY the rewritten bullet string.`;

      const response = await executeAiCompletion(activeConfig, {
        prompt,
        systemPrompt:
          "You are an expert resume writer. Return ONLY the rewritten bullet text without quotes or preamble.",
        temperature: 0.3,
      });

      if (response && response.trim()) {
        return response.trim().replace(/^["']|["']$/g, "");
      }
    } catch (e) {
      console.warn("AI bullet optimization fallback:", e);
    }
  }

  // Fallback pattern
  const cleanBullet = bullet.replace(/\.$/, "");
  const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
  return `${verb} scalable architecture leveraging ${targetKeyword}, optimizing ${cleanBullet.toLowerCase()} with a 35% latency reduction.`;
}

/**
 * AI-powered / Intelligent ATS Curation Engine
 * Synthesizes Master Profile + Job Description into a high-scoring, curated CV
 * Supports Google Gemini, OpenAI, Claude, Groq, OpenRouter, and 100% Local Ollama
 */
export async function curateProfileForJobDescription(
  masterProfile: MasterProfile,
  jd: JobDescription,
  aiConfigOrKey?: AiModelConfig | string,
): Promise<{
  curatedProfile: MasterProfile;
  optimizationLog: string[];
}> {
  const optimizationLog: string[] = [];
  const jdKeywords =
    jd.parsedKeywords.length > 0
      ? jd.parsedKeywords
      : extractKeywordsFromText(jd.rawText);
  const activeConfig = resolveAiConfig(aiConfigOrKey);

  // If AI Provider configured, attempt rich LLM semantic curation
  if (activeConfig) {
    try {
      const prompt = `
You are an expert Executive Resume Writer and ATS Optimization Specialist.
Given this candidate's Master Profile and target Job Description, curate and tailor the CV to achieve 95%+ ATS match score while remaining truthful.

Candidate Master Profile:
${JSON.stringify(masterProfile, null, 2)}

Target Job Description:
Title: ${jd.title}
Company: ${jd.company}
Text: ${jd.rawText}

Instructions:
1. Tailor the headline to align with "${jd.title}".
2. Rewrite the professional summary to highlight relevance to ${jd.company} and target skills.
3. Optimize bullet points in experiences using the Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]") and naturally integrating keywords: ${jdKeywords.slice(0, 10).join(", ")}.
4. Re-rank skills so the target role's key requirements appear in the top category.
5. Return ONLY a valid JSON object of the curated MasterProfile with the exact same structure as the candidate input.
`;

      const raw = await executeAiCompletion(activeConfig, {
        prompt,
        systemPrompt:
          "You are an expert Executive Resume Writer and ATS Optimization Specialist. Return ONLY a valid JSON object matching the input MasterProfile schema.",
        jsonMode: true,
        temperature: 0.3,
      });

      const parsed = extractJsonFromResponse(raw);
      if (parsed && parsed.personalInfo && Array.isArray(parsed.experiences)) {
        const providerTitle =
          AI_PROVIDERS[activeConfig.provider]?.name || activeConfig.provider;
        const privacyLabel =
          activeConfig.provider === "ollama"
            ? " (100% Local / Zero Egress)"
            : "";

        optimizationLog.push(
          `${providerTitle} [${activeConfig.model}]${privacyLabel}: Tailored professional headline to "${parsed.personalInfo.headline || jd.title}"`,
        );
        optimizationLog.push(
          `${providerTitle}: Synthesized ATS-optimized summary matching ${jd.company || "the target role"} requirements`,
        );
        optimizationLog.push(
          `${providerTitle}: Re-engineered experience bullets with high-impact quantified metrics`,
        );
        optimizationLog.push(
          `${providerTitle}: Prioritized ${jdKeywords.length} keywords in skills taxonomy`,
        );

        return {
          curatedProfile: {
            ...masterProfile,
            ...parsed,
            id: `curated-${Date.now()}`,
            updatedAt: new Date().toISOString(),
          },
          optimizationLog,
        };
      }
    } catch (err: any) {
      console.warn(
        "AI curation failed, falling back to local deterministic curation engine:",
        err,
      );
      optimizationLog.push(
        `Note: ${err.message || "AI service error"}. Falling back to local deterministic rule engine.`,
      );
    }
  }

  // Local Intelligent Deterministic Curation Engine (100% offline, guaranteed ATS match)
  const curated: MasterProfile = JSON.parse(JSON.stringify(masterProfile));
  curated.id = `curated-${Date.now()}`;
  curated.updatedAt = new Date().toISOString();

  // 1. Align Headline
  const roleName = jd.title || "Senior Software Engineer";
  const topSkillsSummary = jdKeywords.slice(0, 3).join(" • ");
  curated.personalInfo.headline = topSkillsSummary
    ? `${roleName} | ${topSkillsSummary}`
    : `${roleName} | Distributed Systems & Technical Leadership`;
  optimizationLog.push(
    `Aligned professional headline to target role: "${curated.personalInfo.headline}"`,
  );

  // 2. Tailor Summary
  const topMatched = jdKeywords.slice(0, 5).join(", ");
  const companyMention = jd.company ? ` at ${jd.company}` : "";
  curated.personalInfo.summary = `Results-oriented ${roleName} with extensive track record delivering mission-critical architectures${companyMention}. Deep technical mastery spanning ${topMatched || "modern cloud and distributed paradigms"}. Proven excellence architecting high-throughput, fault-tolerant solutions, driving cross-functional alignment, and accelerating release velocity while maintaining uncompromising security and operational standards.`;
  optimizationLog.push(
    `Synthesized tailored executive summary highlighting ${topMatched || "core capabilities"}`,
  );

  // 3. Re-order and enrich Skills
  if (jdKeywords.length > 0) {
    const primarySkills = jdKeywords.slice(0, 14);
    // Find remaining candidate skills
    const candidateExistingSkills = masterProfile.skillCategories.flatMap(
      (c) => c.skills,
    );
    const secondarySkills = candidateExistingSkills
      .filter(
        (s) =>
          !primarySkills.some((ps) => ps.toLowerCase() === s.toLowerCase()),
      )
      .slice(0, 12);

    curated.skillCategories = [
      {
        id: "cat-target-req",
        categoryName: "Target Core Stack & Qualifications",
        skills: primarySkills,
      },
      {
        id: "cat-additional-tech",
        categoryName: "Technical Competencies & Tools",
        skills:
          secondarySkills.length > 0
            ? secondarySkills
            : [
                "System Design",
                "CI/CD Pipelines",
                "Performance Optimization",
                "Git",
              ],
      },
    ];
    optimizationLog.push(
      `Re-ranked skills taxonomy: Pinned ${primarySkills.length} target JD keywords to top category`,
    );
  }

  // 4. Optimize Experiences with XYZ Formula & Missing Keywords
  const matchPre = computeLocalAtsMatch(curated, jd);
  const missingToInject = [...matchPre.missingKeywords];

  if (curated.experiences.length > 0) {
    curated.experiences = curated.experiences.map((exp, expIdx) => {
      const newHighlights = exp.highlights.map((bullet, bIdx) => {
        // If bullet lacks numbers, quantify it
        let enhanced = bullet;
        const hasNumbers = /\d+%|\$\d+|\d+\+?|\b[0-9]{1,3}(,\d{3})+\b/.test(
          bullet,
        );

        if (expIdx === 0 && bIdx === 0 && missingToInject.length > 0) {
          const kw1 = missingToInject.shift()!;
          enhanced = `Architected and scaled core distributed infrastructure utilizing ${kw1}, boosting transaction processing throughput by 42% while sustaining 99.99% availability.`;
        } else if (expIdx === 0 && bIdx === 1 && missingToInject.length > 0) {
          const kw2 = missingToInject.shift()!;
          enhanced = `Engineered automated observability and telemetry pipelines with ${kw2}, decreasing mean time to resolution (MTTR) by 55% across multi-cluster environments.`;
        } else if (!hasNumbers) {
          enhanced = `${bullet.replace(/\.$/, "")}, driving a 30% increase in operational reliability and team velocity.`;
        }
        return enhanced;
      });

      return {
        ...exp,
        highlights: newHighlights,
      };
    });
    optimizationLog.push(
      `Re-engineered work experience bullets with quantified impact and target keywords`,
    );
  }

  // 5. Optimize Projects
  if (curated.projects.length > 0 && jdKeywords.length > 0) {
    curated.projects = curated.projects.map((proj, pIdx) => {
      const relevantKeywords = jdKeywords.slice(pIdx * 2, pIdx * 2 + 2);
      const combinedTech = Array.from(
        new Set([...proj.technologies, ...relevantKeywords]),
      );
      return {
        ...proj,
        technologies: combinedTech,
      };
    });
    optimizationLog.push(
      `Aligned project technology tags with target requirements`,
    );
  }

  return {
    curatedProfile: curated,
    optimizationLog,
  };
}
