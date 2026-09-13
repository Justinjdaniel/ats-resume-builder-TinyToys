export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate: string;
  gpaOrHonors?: string;
  highlights?: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  technologies: string[];
  link?: string;
  summary: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface MasterProfile {
  id: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  rawText: string;
  parsedKeywords: string[];
  createdAt: string;
}

export interface BulletSuggestion {
  experienceId: string;
  originalBullet: string;
  recommendedBullet: string;
  reasoning: string;
}

export interface AtsMatchMetric {
  overallScore: number; // 0 to 100
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletPointSuggestions: BulletSuggestion[];
  summaryFeedback: string;
  jobTitleMatchScore: number;
  skillsMatchScore: number;
  impactScore: number;
}

export interface CoverLetter {
  id: string;
  jobTitle: string;
  company: string;
  recipientName?: string;
  recipientTitle?: string;
  salutation: string;
  bodyParagraphs: string[];
  signOff: string;
  updatedAt: string;
}

export type TemplateTheme = "modern" | "professional" | "creative";
export type PaperSize = "a4" | "letter";
export type PageMargin = "compact" | "normal" | "spacious";

export type AiProvider =
  | "gemini"
  | "openai"
  | "anthropic"
  | "groq"
  | "openrouter"
  | "ollama"
  | "local_heuristic";

export interface AiModelConfig {
  provider: AiProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
}

export interface AppSettings {
  apiKey?: string;
  aiConfig?: AiModelConfig;
  selectedTemplate: TemplateTheme;
  paperSize: PaperSize;
  fontSize: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
  themeMode: "light" | "dark" | "system";
  showPageNumbers?: boolean;
  requireCoverLetter?: boolean;
}

export interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: any) => Promise<any>;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  toolName: string;
  status: "invoked" | "success" | "error";
  details: string;
}
