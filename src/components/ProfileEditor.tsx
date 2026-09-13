import React, { useState } from "react";
import {
  MasterProfile,
  WorkExperience,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
} from "../types";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  profile: MasterProfile;
  onChange: (profile: MasterProfile) => void;
}

export const ProfileEditor: React.FC<Props> = ({ profile, onChange }) => {
  const [activeSection, setActiveSection] = useState<
    | "personal"
    | "experience"
    | "skills"
    | "education"
    | "projects"
    | "certifications"
  >("personal");

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        [field]: value,
      },
    });
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "New Company",
      position: "Senior Engineer",
      location: "City, ST",
      startDate: "2023",
      endDate: "Present",
      current: true,
      highlights: [
        "Led core architectural initiative improving performance by 25%.",
      ],
    };
    onChange({
      ...profile,
      experiences: [newExp, ...profile.experiences],
    });
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: any,
  ) => {
    onChange({
      ...profile,
      experiences: profile.experiences.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    });
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...profile,
      experiences: profile.experiences.filter((e) => e.id !== id),
    });
  };

  const addHighlight = (expId: string) => {
    onChange({
      ...profile,
      experiences: profile.experiences.map((e) => {
        if (e.id === expId) {
          return {
            ...e,
            highlights: [
              ...e.highlights,
              "Engineered new scalable subsystem resulting in 30% latency reduction.",
            ],
          };
        }
        return e;
      }),
    });
  };

  const updateHighlight = (expId: string, index: number, value: string) => {
    onChange({
      ...profile,
      experiences: profile.experiences.map((e) => {
        if (e.id === expId) {
          const newHighlights = [...e.highlights];
          newHighlights[index] = value;
          return { ...e, highlights: newHighlights };
        }
        return e;
      }),
    });
  };

  const deleteHighlight = (expId: string, index: number) => {
    onChange({
      ...profile,
      experiences: profile.experiences.map((e) => {
        if (e.id === expId) {
          return {
            ...e,
            highlights: e.highlights.filter((_, i) => i !== index),
          };
        }
        return e;
      }),
    });
  };

  // Skill Handlers
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      categoryName: "Specialized Technologies",
      skills: ["GraphQL", "WebAssembly"],
    };
    onChange({
      ...profile,
      skillCategories: [...profile.skillCategories, newCat],
    });
  };

  const updateSkillCategoryName = (id: string, name: string) => {
    onChange({
      ...profile,
      skillCategories: profile.skillCategories.map((c) =>
        c.id === id ? { ...c, categoryName: name } : c,
      ),
    });
  };

  const updateSkillTokens = (id: string, tokensString: string) => {
    const skills = tokensString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({
      ...profile,
      skillCategories: profile.skillCategories.map((c) =>
        c.id === id ? { ...c, skills } : c,
      ),
    });
  };

  const deleteSkillCategory = (id: string) => {
    onChange({
      ...profile,
      skillCategories: profile.skillCategories.filter((c) => c.id !== id),
    });
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "University Name",
      degree: "B.S.",
      fieldOfStudy: "Computer Science",
      endDate: "2020",
      highlights: [],
    };
    onChange({
      ...profile,
      education: [...profile.education, newEdu],
    });
  };

  const updateEducation = (
    id: string,
    field: keyof EducationItem,
    value: any,
  ) => {
    onChange({
      ...profile,
      education: profile.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    });
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...profile,
      education: profile.education.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {/* Section Navigation Pills */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200">
        <button
          id="tab-btn-personal"
          onClick={() => setActiveSection("personal")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSection === "personal"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>
        <button
          id="tab-btn-experience"
          onClick={() => setActiveSection("experience")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSection === "experience"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience ({profile.experiences.length})</span>
        </button>
        <button
          id="tab-btn-skills"
          onClick={() => setActiveSection("skills")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSection === "skills"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Skills ({profile.skillCategories.length})</span>
        </button>
        <button
          id="tab-btn-education"
          onClick={() => setActiveSection("education")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSection === "education"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education ({profile.education.length})</span>
        </button>
      </div>

      {/* 1. Personal & Contact Form */}
      {activeSection === "personal" && (
        <div
          id="form-personal-section"
          className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4"
        >
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-semibold text-stone-900">
              Personal &amp; Contact Details
            </h3>
            <p className="text-xs text-stone-500">
              Core identifying metadata displayed across all resume templates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Name
              </label>
              <input
                id="input-full-name"
                type="text"
                value={profile.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Professional Headline
              </label>
              <input
                id="input-headline"
                type="text"
                value={profile.personalInfo.headline}
                onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                id="input-email"
                type="email"
                value={profile.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                id="input-phone"
                type="text"
                value={profile.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Location / Mobility
              </label>
              <input
                id="input-location"
                type="text"
                value={profile.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Website / Portfolio
              </label>
              <input
                id="input-website"
                type="text"
                value={profile.personalInfo.website || ""}
                onChange={(e) => updatePersonalInfo("website", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                id="input-linkedin"
                type="text"
                value={profile.personalInfo.linkedin || ""}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                GitHub / Code Repository
              </label>
              <input
                id="input-github"
                type="text"
                value={profile.personalInfo.github || ""}
                onChange={(e) => updatePersonalInfo("github", e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Executive Summary / Profile Overview
            </label>
            <textarea
              id="input-summary"
              rows={4}
              value={profile.personalInfo.summary}
              onChange={(e) => updatePersonalInfo("summary", e.target.value)}
              className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* 2. Experience Section */}
      {activeSection === "experience" && (
        <div id="form-experience-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Work Experience
              </h3>
              <p className="text-xs text-stone-500">
                Add chronological roles and impact-focused accomplishment
                bullets.
              </p>
            </div>
            <button
              id="btn-add-experience"
              onClick={addExperience}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs font-bold text-stone-700 font-mono">
                    Role #{idx + 1}
                  </span>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Delete Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Position Title
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, "position", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                      placeholder="e.g. 2022-04"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                      placeholder="Present or 2024-01"
                    />
                  </div>
                </div>

                {/* Highlights list */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                      Key Accomplishments (XYZ Formula)
                    </span>
                    <button
                      onClick={() => addHighlight(exp.id)}
                      className="text-[11px] text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {exp.highlights.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-stone-400 font-mono text-xs mt-1.5">
                          •
                        </span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) =>
                            updateHighlight(exp.id, bIdx, e.target.value)
                          }
                          className="flex-1 text-xs p-2 border border-stone-200 rounded-md bg-stone-50/40 leading-relaxed"
                        />
                        <button
                          onClick={() => deleteHighlight(exp.id, bIdx)}
                          className="text-stone-400 hover:text-red-500 mt-2 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Skills Section */}
      {activeSection === "skills" && (
        <div id="form-skills-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Technical Skills &amp; Competencies
              </h3>
              <p className="text-xs text-stone-500">
                Organize skills into logical categories. Comma-separated
                entries.
              </p>
            </div>
            <button
              onClick={addSkillCategory}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.skillCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cat.categoryName}
                    onChange={(e) =>
                      updateSkillCategoryName(cat.id, e.target.value)
                    }
                    className="text-xs font-semibold text-stone-900 px-2 py-1 border border-transparent hover:border-stone-200 focus:border-stone-400 rounded-md"
                  />
                  <button
                    onClick={() => deleteSkillCategory(cat.id)}
                    className="text-stone-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                    Skills (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={cat.skills.join(", ")}
                    onChange={(e) => updateSkillTokens(cat.id, e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-100 text-stone-700 text-[11px] px-2 py-0.5 rounded border border-stone-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Education Section */}
      {activeSection === "education" && (
        <div id="form-education-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Education
              </h3>
              <p className="text-xs text-stone-500">
                Degrees, institutions, honors, and graduation years.
              </p>
            </div>
            <button
              onClick={addEducation}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    {edu.institution}
                  </span>
                  <button
                    onClick={() => deleteEducation(edu.id)}
                    className="text-stone-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        updateEducation(edu.id, "fieldOfStudy", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, "institution", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Year / Honors
                    </label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(edu.id, "endDate", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50/50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
