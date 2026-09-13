import {
  MasterProfile,
  WorkExperience,
  EducationItem,
  SkillCategory,
  ProjectItem,
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

  const newProfile: MasterProfile = {
    ...currentProfile,
    updatedAt: new Date().toISOString(),
  };

  // Check if it's exported JSON
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && (parsed.personalInfo || parsed.experiences)) {
      return {
        ...currentProfile,
        ...parsed,
        id: currentProfile.id,
        updatedAt: new Date().toISOString(),
      };
    }
  } catch {
    // Continue with markdown / text parsing
  }

  // Attempt header extraction
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^#+\s*/, "").trim();
    if (firstLine.length < 50 && !firstLine.includes(":")) {
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
    }
  }

  if (summaryLines.length > 0) {
    newProfile.personalInfo.summary = summaryLines.slice(0, 3).join(" ");
  }

  if (experiences.length > 0) {
    newProfile.experiences = experiences;
  }

  if (education.length > 0) {
    newProfile.education = education;
  }

  if (skillsList.length > 0) {
    const uniqueSkills = Array.from(new Set(skillsList)).filter(
      (s) => s.length < 30,
    );
    newProfile.skillCategories = [
      {
        id: "cat-imported",
        categoryName: "Imported Skills & Technologies",
        skills: uniqueSkills.slice(0, 24),
      },
    ];
  }

  return newProfile;
}

/**
 * Reads a File object and extracts plain text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split(".").pop()?.toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        resolve(content);
      } else if (content instanceof ArrayBuffer) {
        // Try decoding as UTF-8
        try {
          const decoder = new TextDecoder("utf-8");
          const decoded = decoder.decode(content);
          // If word docx, strip binary xml tags to extract raw text
          if (fileType === "docx") {
            const textOnly = decoded
              .replace(/<[^>]+>/g, " ")
              .replace(/[^\x20-\x7E\n]/g, " ")
              .replace(/\s+/g, " ");
            resolve(textOnly);
          } else {
            resolve(decoded);
          }
        } catch {
          resolve("");
        }
      } else {
        resolve("");
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));

    if (fileType === "pdf" || fileType === "docx") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

/**
 * Merge two profiles intelligently without duplication
 */
export function mergeProfileData(
  base: MasterProfile,
  incoming: MasterProfile,
): MasterProfile {
  const merged: MasterProfile = {
    ...base,
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName: incoming.personalInfo.fullName || base.personalInfo.fullName,
      headline: incoming.personalInfo.headline || base.personalInfo.headline,
      email: incoming.personalInfo.email || base.personalInfo.email,
      phone: incoming.personalInfo.phone || base.personalInfo.phone,
      location: incoming.personalInfo.location || base.personalInfo.location,
      website: incoming.personalInfo.website || base.personalInfo.website,
      linkedin: incoming.personalInfo.linkedin || base.personalInfo.linkedin,
      github: incoming.personalInfo.github || base.personalInfo.github,
      summary:
        incoming.personalInfo.summary.length > base.personalInfo.summary.length
          ? incoming.personalInfo.summary
          : base.personalInfo.summary,
    },
    experiences: [...base.experiences],
    education: [...base.education],
    skillCategories: [...base.skillCategories],
    projects: [...base.projects],
    certifications: [...base.certifications],
  };

  // Merge experiences by company/position
  incoming.experiences.forEach((incExp) => {
    const existingIdx = merged.experiences.findIndex(
      (e) =>
        e.company.toLowerCase() === incExp.company.toLowerCase() ||
        (e.position.toLowerCase() === incExp.position.toLowerCase() &&
          incExp.company.length > 2),
    );
    if (existingIdx >= 0) {
      // Merge unique highlights
      const existing = merged.experiences[existingIdx];
      const allHighlights = Array.from(
        new Set([...existing.highlights, ...incExp.highlights]),
      );
      merged.experiences[existingIdx] = {
        ...existing,
        position: incExp.position || existing.position,
        startDate: existing.startDate || incExp.startDate,
        endDate: existing.endDate || incExp.endDate,
        highlights: allHighlights,
      };
    } else {
      merged.experiences.push(incExp);
    }
  });

  // Merge education by institution/degree
  incoming.education.forEach((incEdu) => {
    const existingIdx = merged.education.findIndex(
      (e) => e.institution.toLowerCase() === incEdu.institution.toLowerCase(),
    );
    if (existingIdx < 0) {
      merged.education.push(incEdu);
    }
  });

  // Merge skills
  const allExistingSkills = new Set(
    merged.skillCategories.flatMap((c) => c.skills.map((s) => s.toLowerCase())),
  );
  incoming.skillCategories.forEach((incCat) => {
    const newSkills = incCat.skills.filter(
      (s) => !allExistingSkills.has(s.toLowerCase()),
    );
    if (newSkills.length > 0) {
      if (merged.skillCategories.length > 0) {
        merged.skillCategories[0].skills.push(...newSkills);
      } else {
        merged.skillCategories.push({
          id: `cat-${Date.now()}`,
          categoryName: incCat.categoryName,
          skills: newSkills,
        });
      }
      newSkills.forEach((s) => allExistingSkills.add(s.toLowerCase()));
    }
  });

  // Merge projects
  incoming.projects.forEach((incProj) => {
    if (
      !merged.projects.some(
        (p) => p.title.toLowerCase() === incProj.title.toLowerCase(),
      )
    ) {
      merged.projects.push(incProj);
    }
  });

  // Merge certifications
  incoming.certifications.forEach((incCert) => {
    if (
      !merged.certifications.some(
        (c) => c.name.toLowerCase() === incCert.name.toLowerCase(),
      )
    ) {
      merged.certifications.push(incCert);
    }
  });

  return merged;
}

/**
 * Parses multiple files (PDF, DOCX, MD, TXT, JSON) and synthesizes a unified Master Data Profile
 */
export async function parseMultipleFilesToMasterData(
  files: File[],
  currentProfile: MasterProfile,
): Promise<{
  profile: MasterProfile;
  fileDetails: { name: string; size: number; textLength: number }[];
}> {
  let accumulatedProfile = { ...currentProfile };
  const fileDetails: { name: string; size: number; textLength: number }[] = [];

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
    }
  }

  return {
    profile: accumulatedProfile,
    fileDetails,
  };
}
