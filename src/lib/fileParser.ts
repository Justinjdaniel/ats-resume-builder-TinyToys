import {
  EducationItem,
  MasterProfile,
  PersonalInfo,
  ProjectItem,
  WorkExperience,
} from "../types";

/**
 * Parse text or markdown into a structured MasterProfile
 */
export function parseResumeTextToProfile(
  rawText: string,
  currentProfile: MasterProfile,
): MasterProfile {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return currentProfile;

  // Clone currentProfile deeply to prevent mutating React state
  const newProfile: MasterProfile = {
    ...currentProfile,
    personalInfo: { ...currentProfile.personalInfo },
    experiences: currentProfile.experiences.map((e) => ({
      ...e,
      highlights: [...e.highlights],
    })),
    education: currentProfile.education.map((ed) => ({
      ...ed,
      highlights: ed.highlights ? [...ed.highlights] : [],
    })),
    skillCategories: currentProfile.skillCategories.map((c) => ({
      ...c,
      skills: [...c.skills],
    })),
    projects: currentProfile.projects.map((p) => ({
      ...p,
      technologies: [...p.technologies],
      bullets: [...p.bullets],
    })),
    certifications: currentProfile.certifications.map((c) => ({ ...c })),
    updatedAt: new Date().toISOString(),
  };

  // Check if it's exported JSON
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && typeof parsed === "object") {
      return mergeProfileData(currentProfile, parsed);
    }
  } catch {
    // Continue with markdown / text parsing
  }

  // Attempt header extraction
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^#+\s*/, "").trim();
    if (
      firstLine.length < 50 &&
      !firstLine.includes(":") &&
      !firstLine.includes("@")
    ) {
      newProfile.personalInfo.fullName = firstLine;
    }
  }

  // Email regex
  const emailMatch = rawText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  if (emailMatch) {
    newProfile.personalInfo.email = emailMatch[0];
  }

  // Phone regex
  const phoneMatch = rawText.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  );
  if (phoneMatch) {
    newProfile.personalInfo.phone = phoneMatch[0];
  }

  // LinkedIn
  const linkedinMatch = rawText.match(/(?:linkedin\.com\/in\/[\w-]+)/i);
  if (linkedinMatch) {
    newProfile.personalInfo.linkedin = linkedinMatch[0];
  }

  // GitHub
  const githubMatch = rawText.match(/(?:github\.com\/[\w-]+)/i);
  if (githubMatch) {
    newProfile.personalInfo.github = githubMatch[0];
  }

  // Sections extraction via headings
  let currentSection:
    "summary" | "experience" | "education" | "skills" | "projects" | null =
    null;
  const experiences: WorkExperience[] = [];
  const education: EducationItem[] = [];
  const skillsList: string[] = [];
  const projectList: ProjectItem[] = [];
  let summaryLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = line.toLowerCase().replace(/^[#*-_\s]+/, "");

    if (
      heading.startsWith("summary") ||
      heading.startsWith("objective") ||
      heading.startsWith("about")
    ) {
      currentSection = "summary";
      continue;
    } else if (
      heading.startsWith("experience") ||
      heading.startsWith("work") ||
      heading.startsWith("employment")
    ) {
      currentSection = "experience";
      continue;
    } else if (
      heading.startsWith("education") ||
      heading.startsWith("academic")
    ) {
      currentSection = "education";
      continue;
    } else if (
      heading.startsWith("skill") ||
      heading.startsWith("technolog") ||
      heading.startsWith("stack")
    ) {
      currentSection = "skills";
      continue;
    } else if (
      heading.startsWith("project") ||
      heading.startsWith("portfolio")
    ) {
      currentSection = "projects";
      continue;
    }

    if (currentSection === "summary") {
      summaryLines.push(line);
    } else if (currentSection === "skills") {
      // Split by commas or bullet points
      const tokens = line
        .replace(/^[•*-]\s*/, "")
        .split(/[,|•]/)
        .map((t) => t.trim())
        .filter(Boolean);
      skillsList.push(...tokens);
    } else if (currentSection === "experience") {
      if (
        line.startsWith("•") ||
        line.startsWith("-") ||
        line.startsWith("*")
      ) {
        const bullet = line.replace(/^[•*-]\s*/, "").trim();
        if (experiences.length > 0 && bullet.length > 5) {
          experiences[experiences.length - 1].highlights.push(bullet);
        }
      } else if (line.length > 3 && !line.startsWith("#")) {
        // Probable company/role line
        const parts = line.split(/[-|–,]/).map((p) => p.trim());
        if (parts.length >= 2) {
          experiences.push({
            id: `parsed-exp-${experiences.length + 1}`,
            position: parts[0],
            company: parts[1],
            location: parts[2] || "",
            startDate: "2021",
            endDate: "Present",
            current: true,
            highlights: [],
          });
        }
      }
    } else if (currentSection === "education") {
      if (line.length > 4 && !line.startsWith("•")) {
        const parts = line.split(/[-|–,]/).map((p) => p.trim());
        education.push({
          id: `parsed-edu-${education.length + 1}`,
          institution: parts[0] || "University",
          degree: parts[1] || "Bachelor of Science",
          fieldOfStudy: parts[2] || "Computer Science",
          endDate: "2020",
          highlights: [],
        });
      }
    } else if (currentSection === "projects") {
      if (
        line.startsWith("•") ||
        line.startsWith("-") ||
        line.startsWith("*")
      ) {
        const bullet = line.replace(/^[•*-]\s*/, "").trim();
        if (projectList.length > 0 && bullet.length > 5) {
          projectList[projectList.length - 1].bullets.push(bullet);
        }
      } else if (line.length > 3 && !line.startsWith("#")) {
        const parts = line.split(/[-|–,]/).map((p) => p.trim());
        if (parts.length >= 1) {
          projectList.push({
            id: `parsed-proj-${projectList.length + 1}`,
            title: parts[0],
            role: parts[1] || "Contributor",
            technologies: parts
              .slice(2)
              .flatMap((t) => t.split(/\s+/))
              .filter(Boolean),
            summary: parts[1] || parts[0],
            bullets: [],
          });
        }
      }
    }
  }

  const parsedIncoming: Partial<MasterProfile> = {
    personalInfo: {
      ...newProfile.personalInfo,
      ...(summaryLines.length > 0
        ? { summary: summaryLines.slice(0, 3).join(" ") }
        : {}),
    },
    experiences,
    education,
    skillCategories:
      skillsList.length > 0
        ? [
            {
              id: "cat-imported",
              categoryName: "Imported Skills & Technologies",
              skills: Array.from(new Set(skillsList))
                .filter((s) => s.length < 30)
                .slice(0, 24),
            },
          ]
        : [],
    projects: projectList,
    certifications: [],
  };

  return mergeProfileData(currentProfile, parsedIncoming);
}

/**
 * Reads a File object and extracts plain text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split(".").pop()?.toLowerCase();

  return new Promise((resolve, reject) => {
    if (fileType === "pdf" || fileType === "docx" || fileType === "doc") {
      reject(
        new Error(
          `Direct binary extraction for .${fileType} is not supported locally in browser sandbox. Please upload as plain text, Markdown (.md), or exported JSON, or paste the content directly.`,
        ),
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        resolve(content);
      } else {
        resolve("");
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/**
 * Merge two profiles intelligently without duplication
 */
export function mergeProfileData(
  base: MasterProfile,
  incoming: Partial<MasterProfile>,
): MasterProfile {
  if (!incoming || typeof incoming !== "object") return base;

  const incPersonal: Partial<PersonalInfo> = incoming.personalInfo || {};
  const basePersonal: Partial<PersonalInfo> = base.personalInfo || {};

  const incSummary =
    typeof incPersonal.summary === "string" ? incPersonal.summary : "";
  const baseSummary =
    typeof basePersonal.summary === "string" ? basePersonal.summary : "";

  const merged: MasterProfile = {
    ...base,
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName: incPersonal.fullName || basePersonal.fullName || "",
      headline: incPersonal.headline || basePersonal.headline || "",
      email: incPersonal.email || basePersonal.email || "",
      phone: incPersonal.phone || basePersonal.phone || "",
      location: incPersonal.location || basePersonal.location || "",
      website: incPersonal.website || basePersonal.website,
      linkedin: incPersonal.linkedin || basePersonal.linkedin,
      github: incPersonal.github || basePersonal.github,
      summary:
        incSummary.length > baseSummary.length ? incSummary : baseSummary,
    },
    experiences: base.experiences ? [...base.experiences] : [],
    education: base.education ? [...base.education] : [],
    skillCategories: base.skillCategories
      ? base.skillCategories.map((c) => ({ ...c, skills: [...c.skills] }))
      : [],
    projects: base.projects ? [...base.projects] : [],
    certifications: base.certifications ? [...base.certifications] : [],
  };

  // Merge experiences by matching BOTH company AND position
  if (Array.isArray(incoming.experiences)) {
    incoming.experiences.forEach((incExp) => {
      if (!incExp || !incExp.company || !incExp.position) return;
      const incCompany = incExp.company.trim().toLowerCase();
      const incPosition = incExp.position.trim().toLowerCase();

      const existingIdx = merged.experiences.findIndex(
        (e) =>
          e.company.trim().toLowerCase() === incCompany &&
          e.position.trim().toLowerCase() === incPosition,
      );

      if (existingIdx >= 0) {
        // Merge unique highlights
        const existing = merged.experiences[existingIdx];
        const existingHighlights = Array.isArray(existing.highlights)
          ? existing.highlights
          : [];
        const incHighlights = Array.isArray(incExp.highlights)
          ? incExp.highlights
          : [];
        const allHighlights = Array.from(
          new Set([...existingHighlights, ...incHighlights]),
        );
        merged.experiences[existingIdx] = {
          ...existing,
          startDate: incExp.startDate || existing.startDate,
          endDate: incExp.endDate || existing.endDate,
          location: incExp.location || existing.location,
          current:
            incExp.current !== undefined ? incExp.current : existing.current,
          highlights: allHighlights,
        };
      } else {
        merged.experiences.push({
          ...incExp,
          id:
            incExp.id ||
            `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          highlights: Array.isArray(incExp.highlights)
            ? [...incExp.highlights]
            : [],
        });
      }
    });
  }

  // Merge education by institution/degree
  if (Array.isArray(incoming.education)) {
    incoming.education.forEach((incEdu) => {
      if (!incEdu || !incEdu.institution) return;
      const incInst = incEdu.institution.trim().toLowerCase();
      const incDegree = (incEdu.degree || "").trim().toLowerCase();
      const existingIdx = merged.education.findIndex(
        (e) =>
          e.institution.trim().toLowerCase() === incInst &&
          (!incDegree || (e.degree || "").trim().toLowerCase() === incDegree),
      );
      if (existingIdx < 0) {
        merged.education.push({
          ...incEdu,
          id:
            incEdu.id ||
            `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          highlights: Array.isArray(incEdu.highlights)
            ? [...incEdu.highlights]
            : [],
        });
      }
    });
  }

  // Merge skills
  if (Array.isArray(incoming.skillCategories)) {
    const allExistingSkills = new Set(
      merged.skillCategories.flatMap((c) =>
        c.skills.map((s) => s.toLowerCase()),
      ),
    );
    incoming.skillCategories.forEach((incCat) => {
      if (!incCat || !Array.isArray(incCat.skills)) return;
      const newSkills = incCat.skills.filter(
        (s) =>
          s &&
          typeof s === "string" &&
          !allExistingSkills.has(s.trim().toLowerCase()),
      );
      if (newSkills.length > 0) {
        if (merged.skillCategories.length > 0) {
          merged.skillCategories[0].skills.push(...newSkills);
        } else {
          merged.skillCategories.push({
            id: `cat-${Date.now()}`,
            categoryName: incCat.categoryName || "Technical Skills",
            skills: newSkills,
          });
        }
        newSkills.forEach((s) => allExistingSkills.add(s.trim().toLowerCase()));
      }
    });
  }

  // Merge projects
  if (Array.isArray(incoming.projects)) {
    incoming.projects.forEach((incProj) => {
      if (!incProj || !incProj.title) return;
      const incTitle = incProj.title.trim().toLowerCase();
      if (
        !merged.projects.some((p) => p.title.trim().toLowerCase() === incTitle)
      ) {
        merged.projects.push({
          ...incProj,
          id:
            incProj.id ||
            `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          technologies: Array.isArray(incProj.technologies)
            ? [...incProj.technologies]
            : [],
          bullets: Array.isArray(incProj.bullets) ? [...incProj.bullets] : [],
        });
      }
    });
  }

  // Merge certifications
  if (Array.isArray(incoming.certifications)) {
    incoming.certifications.forEach((incCert) => {
      if (!incCert || !incCert.name) return;
      const incName = incCert.name.trim().toLowerCase();
      if (
        !merged.certifications.some(
          (c) => c.name.trim().toLowerCase() === incName,
        )
      ) {
        merged.certifications.push({
          ...incCert,
          id:
            incCert.id ||
            `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        });
      }
    });
  }

  return merged;
}

/**
 * Parses multiple text files (MD, TXT, JSON) and synthesizes a unified Master Data Profile
 */
export async function parseMultipleFilesToMasterData(
  files: File[],
  currentProfile: MasterProfile,
): Promise<{
  profile: MasterProfile;
  fileDetails: {
    name: string;
    size: number;
    textLength: number;
    error?: string;
  }[];
}> {
  let accumulatedProfile = { ...currentProfile };
  const fileDetails: {
    name: string;
    size: number;
    textLength: number;
    error?: string;
  }[] = [];

  for (const file of files) {
    try {
      const text = await extractTextFromFile(file);
      fileDetails.push({
        name: file.name,
        size: file.size,
        textLength: text.length,
      });

      if (text && text.trim().length > 10) {
        const parsedOne = parseResumeTextToProfile(text, accumulatedProfile);
        accumulatedProfile = mergeProfileData(accumulatedProfile, parsedOne);
      }
    } catch (err) {
      console.warn(`Error extracting text from ${file.name}:`, err);
      fileDetails.push({
        name: file.name,
        size: file.size,
        textLength: 0,
        error: err instanceof Error ? err.message : "Failed to read file",
      });
    }
  }

  return {
    profile: accumulatedProfile,
    fileDetails,
  };
}
