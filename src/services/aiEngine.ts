import {
  ApiKeyConfig,
  AtsReport,
  ResumeData,
  UploadedFile,
} from '../templates/types';

const BYOK_STORAGE_KEY = 'ats_resume_builder_byok';

export function saveApiKeyConfig(config: ApiKeyConfig): void {
  try {
    sessionStorage.setItem(BYOK_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save API key to sessionStorage:', e);
  }
}

export function getApiKeyConfig(): ApiKeyConfig | null {
  try {
    const raw = sessionStorage.getItem(BYOK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearApiKeyConfig(): void {
  try {
    sessionStorage.removeItem(BYOK_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear API key:', e);
  }
}

/**
 * Main AI Orchestrator
 */
export async function generateOptimizedResume(
  files: UploadedFile[],
  config: ApiKeyConfig | null
): Promise<{ resumeData: ResumeData; atsReport: AtsReport }> {
  const masterFiles = files.filter(
    f => f.role === 'master' || f.role === 'linkedin'
  );
  const jdFiles = files.filter(f => f.role === 'jd');
  const extraFiles = files.filter(f => f.role === 'extra');

  const combinedCandidateInfo = masterFiles
    .map(f => `--- [Source: ${f.name} (${f.role})] ---\n${f.content}`)
    .join('\n\n');

  const combinedJd = jdFiles
    .map(f => `--- [JD: ${f.name}] ---\n${f.content}`)
    .join('\n\n');

  const combinedExtra = extraFiles
    .map(f => `--- [Extra Context: ${f.name}] ---\n${f.content}`)
    .join('\n\n');

  // If no API key or invalid config, run mock/heuristic generator
  if (!config || !config.apiKey) {
    return runHeuristicOptimization(combinedCandidateInfo, combinedJd);
  }

  try {
    if (config.provider === 'openai') {
      return await callOpenAI(
        config,
        combinedCandidateInfo,
        combinedJd,
        combinedExtra
      );
    } else if (config.provider === 'gemini') {
      return await callGemini(
        config,
        combinedCandidateInfo,
        combinedJd,
        combinedExtra
      );
    } else if (config.provider === 'anthropic') {
      return await callAnthropic(
        config,
        combinedCandidateInfo,
        combinedJd,
        combinedExtra
      );
    } else {
      return runHeuristicOptimization(combinedCandidateInfo, combinedJd);
    }
  } catch (error) {
    console.warn(
      'AI API call failed, falling back to smart heuristic optimizer:',
      error
    );
    return runHeuristicOptimization(combinedCandidateInfo, combinedJd);
  }
}

const SYSTEM_PROMPT = `
You are an expert Executive Resume Writer and ATS (Applicant Tracking System) Optimization Specialist.
Your job is to analyze candidate master background data, LinkedIn exports, and target Job Descriptions (JDs), and return a strictly structured JSON object containing:
1. "resumeData": A complete, tailored resume optimized for high ATS keyword density, strong action verbs, and quantifiable achievements.
2. "atsReport": An in-depth ATS compliance report containing match scores and keyword analysis.

JSON Schema format expected:
{
  "resumeData": {
    "fullName": "Candidate Name",
    "targetTitle": "Target Job Title",
    "email": "email@domain.com",
    "phone": "+1 555-0199",
    "location": "City, State / Country",
    "linkedin": "linkedin.com/in/profile",
    "github": "github.com/username",
    "website": "portfolio.com",
    "summary": "Compelling 3-line professional summary packed with core target keywords.",
    "skills": [
      { "category": "Core Technical", "skills": ["Skill 1", "Skill 2"] },
      { "category": "Frameworks & Tools", "skills": ["Tool 1", "Tool 2"] }
    ],
    "experience": [
      {
        "id": "exp-1",
        "company": "Company Name",
        "role": "Job Title",
        "location": "City, State",
        "startDate": "Jan 2021",
        "endDate": "Present",
        "highlights": [
          "Action-oriented bullet point with quantified metrics and target keywords.",
          "Delivered XYZ resulting in 40% performance gain."
        ]
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "institution": "University Name",
        "degree": "B.S. in Computer Science",
        "graduationYear": "2020",
        "details": "Honors / Magna Cum Laude"
      }
    ],
    "projects": [
      {
        "id": "proj-1",
        "name": "Project Title",
        "description": "Short project description with technology stack.",
        "technologies": ["React", "TypeScript", "Node.js"]
      }
    ],
    "certifications": ["AWS Certified Solutions Architect", "PMP"]
  },
  "atsReport": {
    "overallScore": 92,
    "matchPercentage": 88,
    "matchedKeywords": ["React", "TypeScript", "CI/CD", "System Design"],
    "missingKeywords": ["Kubernetes", "GraphQL"],
    "strengths": ["Strong quantifiable impact metrics", "High skill alignment"],
    "recommendations": ["Highlight cloud orchestration experience in recent role"],
    "atsFormattingTips": ["Use standard section headings", "Avoid graphics and tables"]
  }
}
Return ONLY valid JSON with no markdown wrapping.
`;

async function callOpenAI(
  config: ApiKeyConfig,
  candidateData: string,
  jdData: string,
  extraData: string
) {
  const model = config.model || 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `CANDIDATE MASTER DATA:\n${candidateData}\n\nTARGET JOB DESCRIPTION:\n${jdData}\n\nADDITIONAL CONTEXT:\n${extraData}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawJson = data.choices[0].message.content;
  return JSON.parse(rawJson);
}

async function callGemini(
  config: ApiKeyConfig,
  candidateData: string,
  jdData: string,
  extraData: string
) {
  const model = config.model || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              text: `CANDIDATE MASTER DATA:\n${candidateData}\n\nTARGET JOB DESCRIPTION:\n${jdData}\n\nADDITIONAL CONTEXT:\n${extraData}`,
            },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

async function callAnthropic(
  config: ApiKeyConfig,
  candidateData: string,
  jdData: string,
  extraData: string
) {
  const model = config.model || 'claude-3-5-sonnet-20240620';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `CANDIDATE MASTER DATA:\n${candidateData}\n\nTARGET JOB DESCRIPTION:\n${jdData}\n\nADDITIONAL CONTEXT:\n${extraData}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.content[0].text;
  return JSON.parse(text);
}

/**
 * Heuristic/Mock ATS Engine for fast testing or fallback
 */
export function runHeuristicOptimization(
  candidateText: string,
  jdText: string
): { resumeData: ResumeData; atsReport: AtsReport } {
  // Extract potential candidate name
  const nameMatch = candidateText.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
  const fullName = nameMatch ? nameMatch[1] : 'Alex Morgan';

  // Extract email
  const emailMatch = candidateText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  const email = emailMatch ? emailMatch[0] : 'alex.morgan@example.com';

  // Extract phone
  const phoneMatch = candidateText.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  const phone = phoneMatch ? phoneMatch[0] : '+1 (555) 234-5678';

  // Extract keywords from JD
  const defaultJdKeywords = [
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'CI/CD',
    'REST APIs',
    'GraphQL',
    'Agile',
    'System Architecture',
    'Unit Testing',
    'Performance Optimization',
    'Git',
    'Cloud',
    'Docker',
    'Kubernetes',
  ];

  const candidateLower = candidateText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const jdKeywords = defaultJdKeywords.filter(kw =>
    jdLower.includes(kw.toLowerCase())
  );
  const candidateKeywords = defaultJdKeywords.filter(kw =>
    candidateLower.includes(kw.toLowerCase())
  );

  const matchedKeywords = jdKeywords.filter(kw =>
    candidateKeywords.includes(kw)
  );
  const missingKeywords = jdKeywords.filter(
    kw => !matchedKeywords.includes(kw)
  );

  const matchPercentage =
    jdKeywords.length > 0 ?
      Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 75;

  const resumeData: ResumeData = {
    fullName,
    targetTitle: 'Senior Software Engineer / Technical Architect',
    email,
    phone,
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan-tech',
    github: 'github.com/alexmorgan-dev',
    website: 'alexmorgan.dev',
    summary: `Results-driven Senior Engineer with 7+ years of experience engineering scalable web applications and cloud architectures. Proven track record in ${matchedKeywords.slice(0, 3).join(', ')}, driving team productivity, and reducing latency by 45%.`,
    skills: [
      {
        category: 'Core Engineering',
        skills:
          matchedKeywords.length > 0 ?
            matchedKeywords
          : ['React', 'TypeScript', 'Node.js', 'System Architecture'],
      },
      {
        category: 'Tools & Ecosystem',
        skills: ['Git', 'Vite', 'Docker', 'Vitest', 'GitHub Actions', 'AWS'],
      },
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Apex Cloud Technologies',
        role: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        highlights: [
          `Architected high-throughput microservices using ${matchedKeywords[0] || 'TypeScript'} and ${matchedKeywords[1] || 'Node.js'}, reducing system downtime by 35%.`,
          'Automated CI/CD pipelines via GitHub Actions, decreasing release cycle times from 3 days to 15 minutes.',
          'Spearheaded performance optimization initiatives that improved Core Web Vitals (LCP/INP) by 40%.',
          'Mentored 5 junior developers on unit testing, code quality standards, and modern frontend architecture.',
        ],
      },
      {
        id: 'exp-2',
        company: 'Vanguard Digital Solutions',
        role: 'Full Stack Engineer',
        location: 'Oakland, CA',
        startDate: '2019',
        endDate: '2022',
        highlights: [
          'Engineered responsive web applications supporting 200,000+ daily active users.',
          'Designed scalable RESTful APIs and GraphQL endpoints for data-intensive client dashboards.',
          'Collaborated closely with product managers and UI/UX designers to translate requirements into clean code.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science & Engineering',
        graduationYear: '2019',
        details: "Dean's Honor List, GPA 3.8/4.0",
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'ATS Resumaster AI',
        description:
          'Open-source ATS resume optimization suite utilizing client-side file parsers and multi-provider AI.',
        technologies: ['React', 'TypeScript', 'Vite', 'Vitest', 'DOCX.js'],
        link: 'https://github.com/example/ats-resumaster',
      },
    ],
    certifications: [
      'AWS Certified Solutions Architect – Associate',
      'Meta Senior Front-End Developer Professional Certificate',
    ],
  };

  const adjustedScore = Math.min(
    matchPercentage + Math.min(matchedKeywords.length * 4, 15) + 5,
    98
  );
  const atsReport: AtsReport = {
    overallScore: adjustedScore,
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    strengths: [
      'High density of active verbs (Architected, Automated, Engineered, Spearheaded)',
      'Quantifiable impact metrics (35% downtime reduction, 40% CWV improvement)',
      'Clean single-column structure with standard ATS section headings',
    ],
    recommendations: [
      `Incorporate missing JD keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
      'Ensure standard date formats (Month Year - Month Year)',
    ],
    atsFormattingTips: [
      'Avoid tables or multi-column text boxes in Word output',
      'Use bullet points instead of long dense paragraphs',
      'Keep font sizes between 10pt and 12pt for body text',
    ],
  };

  return { resumeData, atsReport };
}
