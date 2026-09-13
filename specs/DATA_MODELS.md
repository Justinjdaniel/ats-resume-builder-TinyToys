# Data Models & TypeScript Specifications

This document outlines the core data models and interfaces governing the application state, storage entities, and agent payloads.

```typescript
// 1. Personal & Contact Information
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

// 2. Work Experience
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // e.g. "2022-03"
  endDate: string; // e.g. "Present" or "2024-01"
  current: boolean;
  highlights: string[]; // Key quantifiable achievements
}

// 3. Education
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

// 4. Skills Categorization
export interface SkillCategory {
  id: string;
  categoryName: string; // e.g., "Languages & Runtimes", "Cloud & DevOps"
  skills: string[]; // e.g., ["TypeScript", "React", "Node.js"]
}

// 5. Projects
export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  technologies: string[];
  link?: string;
  summary: string;
  bullets: string[];
}

// 6. Certifications & Honors
export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

// 7. Master Profile
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

// 8. Target Job Description & ATS Analysis
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  rawText: string;
  parsedKeywords: string[];
  createdAt: string;
}

export interface AtsMatchMetric {
  overallScore: number; // 0 - 100
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletPointSuggestions: {
    experienceId: string;
    originalBullet: string;
    recommendedBullet: string;
    reasoning: string;
  }[];
  summaryFeedback: string;
}

// 9. Cover Letter
export interface CoverLetter {
  id: string;
  jobTitle: string;
  company: string;
  salutation: string;
  bodyParagraphs: string[];
  signOff: string;
  updatedAt: string;
}

// 10. Template & Print Preferences
export type TemplateTheme = "modern" | "professional" | "creative";
export type PaperSize = "a4" | "letter";

export interface AppSettings {
  apiKey?: string;
  selectedTemplate: TemplateTheme;
  paperSize: PaperSize;
  fontSize: "sm" | "base" | "lg";
  themeMode: "light" | "dark" | "system";
}

// 11. WebMCP Tool Payloads
export interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: any) => Promise<any>;
}
```
