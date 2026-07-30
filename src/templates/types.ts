export type FileRole = 'master' | 'linkedin' | 'jd' | 'extra';

export interface UploadedFile {
  id: string;
  name: string;
  extension: string;
  role: FileRole;
  content: string;
  size: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location?: string;
  graduationYear: string;
  details?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeData {
  fullName: string;
  targetTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
}

export interface AtsReport {
  overallScore: number;
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  recommendations: string[];
  atsFormattingTips: string[];
}

export type TemplateId = 'modern' | 'executive' | 'tech' | 'compact';

export interface LayoutConfig {
  templateId: TemplateId;
  primaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  showProjects: boolean;
  showCertifications: boolean;
}

export type ApiProvider = 'openai' | 'gemini' | 'anthropic';

export interface ApiKeyConfig {
  provider: ApiProvider;
  apiKey: string;
  model: string;
}
