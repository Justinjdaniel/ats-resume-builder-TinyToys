import React from "react";
import { MasterProfile, PageMargin } from "../../types";

interface TemplateProps {
  profile: MasterProfile;
  fontSize?: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({
  profile,
  fontSize = "base",
  pageMargin = "normal",
}) => {
  const {
    personalInfo,
    experiences,
    education,
    skillCategories,
    projects,
    certifications,
  } = profile;

  const marginPadding = {
    compact: "p-8",
    normal: "p-12",
    spacious: "p-16",
  }[pageMargin];

  const config = {
    sm: {
      container: `${marginPadding} text-[12px]`,
      name: "text-[22px]",
      headline: "text-[12px]",
      headerPadding: "pb-4 mb-4",
      sectionSpacing: "mb-4",
      sectionHeading: "text-[11px] pb-0.5 mb-2",
      itemTitle: "text-[13px]",
      metaText: "text-[11px]",
      bulletText: "text-[11.5px]",
      bulletSpacing: "space-y-1",
    },
    base: {
      container: `${marginPadding} text-[13px]`,
      name: "text-[26px]",
      headline: "text-[13.5px]",
      headerPadding: "pb-5 mb-5",
      sectionSpacing: "mb-5",
      sectionHeading: "text-[12px] pb-0.5 mb-2.5",
      itemTitle: "text-[14px]",
      metaText: "text-[12px]",
      bulletText: "text-[13px]",
      bulletSpacing: "space-y-1.5",
    },
    lg: {
      container: `${marginPadding} text-[14px]`,
      name: "text-[30px]",
      headline: "text-[15px]",
      headerPadding: "pb-6 mb-6",
      sectionSpacing: "mb-6",
      sectionHeading: "text-[13px] pb-1 mb-3",
      itemTitle: "text-[15px]",
      metaText: "text-[12.5px]",
      bulletText: "text-[14px]",
      bulletSpacing: "space-y-2",
    },
  }[fontSize] || {
    container: `${marginPadding} text-[13px]`,
    name: "text-[26px]",
    headline: "text-[13.5px]",
    headerPadding: "pb-5 mb-5",
    sectionSpacing: "mb-5",
    sectionHeading: "text-[12px] pb-0.5 mb-2.5",
    itemTitle: "text-[14px]",
    metaText: "text-[12px]",
    bulletText: "text-[13px]",
    bulletSpacing: "space-y-1.5",
  };

  const contactList = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin
      ? personalInfo.linkedin.replace(/^https?:\/\//, "")
      : "",
    personalInfo.website
      ? personalInfo.website.replace(/^https?:\/\//, "")
      : "",
  ].filter(Boolean);

  return (
    <div
      id="resume-professional-template"
      className={`w-full h-full bg-white text-stone-900 ${config.container} font-sans leading-relaxed select-text`}
    >
      {/* Centered Executive Header */}
      <header
        data-page-break-block="true"
        className={`text-center ${config.headerPadding} border-b-2 border-stone-800`}
      >
        <h1
          className={`${config.name} font-serif font-bold text-stone-950 tracking-tight leading-tight`}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.headline && (
          <p
            className={`${config.headline} font-serif italic text-stone-700 mt-1`}
          >
            {personalInfo.headline}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-stone-600 mt-2.5">
          {contactList.map((item, i) => (
            <React.Fragment key={i}>
              <span>{item}</span>
              {i < contactList.length - 1 && (
                <span className="text-stone-300">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Executive Summary */}
      {personalInfo.summary && (
        <section data-page-break-block="true" className={config.sectionSpacing}>
          <h2
            className={`${config.sectionHeading} font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300`}
          >
            Executive Summary
          </h2>
          <p
            className={`text-stone-800 ${config.bulletText} leading-normal text-justify`}
          >
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <section className={config.sectionSpacing}>
          <h2
            data-page-break-block="true"
            className={`${config.sectionHeading} font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300`}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                data-page-break-block="true"
                className="break-inside-avoid"
              >
                <div className="flex flex-wrap justify-between items-baseline">
                  <span
                    className={`font-bold text-stone-900 ${config.itemTitle}`}
                  >
                    {exp.company}
                  </span>
                  <span
                    className={`${config.metaText} text-stone-600 font-serif italic`}
                  >
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-baseline ${config.metaText} text-stone-700 font-serif italic mb-1`}
                >
                  <span>{exp.position}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <ul
                  className={`list-disc list-outside ml-4 ${config.bulletSpacing} ${config.bulletText} text-stone-800`}
                >
                  {exp.highlights.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {skillCategories.length > 0 && (
        <section
          data-page-break-block="true"
          className={`${config.sectionSpacing} break-inside-avoid`}
        >
          <h2
            className={`${config.sectionHeading} font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300`}
          >
            Key Competencies &amp; Technical Expertise
          </h2>
          <div className={`space-y-1.5 ${config.metaText}`}>
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-stone-900">
                  {cat.categoryName}:{" "}
                </span>
                <span className="text-stone-700">{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section
          data-page-break-block="true"
          className={`${config.sectionSpacing} break-inside-avoid`}
        >
          <h2
            className={`${config.sectionHeading} font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300`}
          >
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div
                key={edu.id}
                className={`flex justify-between items-baseline ${config.metaText}`}
              >
                <div>
                  <span className="font-bold text-stone-900">
                    {edu.institution}
                  </span>
                  <span className="text-stone-700">
                    {" "}
                    — {edu.degree}, {edu.fieldOfStudy}
                  </span>
                  {edu.gpaOrHonors && (
                    <span className="italic text-stone-600 ml-1">
                      ({edu.gpaOrHonors})
                    </span>
                  )}
                </div>
                <span className="text-stone-600 font-serif italic">
                  {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={`${config.sectionSpacing} break-inside-avoid`}>
          <h2
            data-page-break-block="true"
            className={`${config.sectionHeading} font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300`}
          >
            Key Projects &amp; Architecture
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} data-page-break-block="true">
                <div
                  className={`flex justify-between items-baseline ${config.metaText}`}
                >
                  <span className="font-bold text-stone-900">{proj.title}</span>
                  <span className="text-stone-600 italic">
                    [{proj.technologies.join(", ")}]
                  </span>
                </div>
                <p className={`text-stone-700 ${config.metaText} mt-0.5`}>
                  {proj.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section data-page-break-block="true" className="break-inside-avoid">
          <h2
            className={`${config.sectionHeading} font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300`}
          >
            Certifications
          </h2>
          <div className={`space-y-1 ${config.metaText} text-stone-700`}>
            {certifications.map((c) => (
              <div key={c.id}>
                <span className="font-bold text-stone-900">{c.name}</span>
                <span>
                  {" "}
                  — {c.issuer} ({c.date})
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
