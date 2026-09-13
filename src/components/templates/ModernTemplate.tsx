import React from "react";
import { MasterProfile, PageMargin } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface TemplateProps {
  profile: MasterProfile;
  fontSize?: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
}

export const ModernTemplate: React.FC<TemplateProps> = ({
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

  // Margin padding calibration
  const marginPadding = {
    compact: "p-8",
    normal: "p-12",
    spacious: "p-16",
  }[pageMargin];

  // Calibrated typography scale for true-to-size paper layout
  const config = {
    sm: {
      container: `${marginPadding} text-[12px]`,
      name: "text-[22px]",
      headline: "text-[12px]",
      headerPadding: "pb-4 mb-4",
      sectionSpacing: "mb-4",
      sectionHeading: "text-[11px] mb-2",
      itemTitle: "text-[13px]",
      metaText: "text-[11px]",
      bulletText: "text-[11.5px] leading-normal",
      bulletSpacing: "space-y-1",
    },
    base: {
      container: `${marginPadding} text-[13px]`,
      name: "text-[26px]",
      headline: "text-[13.5px]",
      headerPadding: "pb-5 mb-5",
      sectionSpacing: "mb-5",
      sectionHeading: "text-[12px] mb-2.5",
      itemTitle: "text-[14px]",
      metaText: "text-[12px]",
      bulletText: "text-[13px] leading-relaxed",
      bulletSpacing: "space-y-1.5",
    },
    lg: {
      container: `${marginPadding} text-[14px]`,
      name: "text-[30px]",
      headline: "text-[15px]",
      headerPadding: "pb-6 mb-6",
      sectionSpacing: "mb-6",
      sectionHeading: "text-[13px] mb-3",
      itemTitle: "text-[15px]",
      metaText: "text-[12.5px]",
      bulletText: "text-[14px] leading-relaxed",
      bulletSpacing: "space-y-2",
    },
  }[fontSize] || {
    container: `${marginPadding} text-[13px]`,
    name: "text-[26px]",
    headline: "text-[13.5px]",
    headerPadding: "pb-5 mb-5",
    sectionSpacing: "mb-5",
    sectionHeading: "text-[12px] mb-2.5",
    itemTitle: "text-[14px]",
    metaText: "text-[12px]",
    bulletText: "text-[13px] leading-relaxed",
    bulletSpacing: "space-y-1.5",
  };

  return (
    <div
      id="resume-modern-template"
      className={`w-full h-full bg-white text-stone-900 ${config.container} font-sans leading-relaxed select-text`}
    >
      {/* Header */}
      <header
        data-page-break-block="true"
        className={`border-b border-stone-200 ${config.headerPadding}`}
      >
        <h1
          className={`${config.name} font-bold tracking-tight text-stone-950 uppercase font-display leading-tight`}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.headline && (
          <p
            className={`${config.headline} font-medium text-stone-600 mt-1 tracking-wide`}
          >
            {personalInfo.headline}
          </p>
        )}

        {/* Contact Links */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-stone-600 mt-3">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{personalInfo.email}</span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="truncate max-w-[180px]">
                {personalInfo.website.replace(/^https?:\/\//, "")}
              </span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="truncate max-w-[180px]">
                {personalInfo.linkedin.replace(/^https?:\/\//, "")}
              </span>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{personalInfo.github.replace(/^https?:\/\//, "")}</span>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section data-page-break-block="true" className={config.sectionSpacing}>
          <h2
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400`}
          >
            Professional Summary
          </h2>
          <p className={`text-stone-700 ${config.bulletText} text-justify`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className={config.sectionSpacing}>
          <h2
            data-page-break-block="true"
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                data-page-break-block="true"
                className="break-inside-avoid"
              >
                <div className="flex items-baseline justify-between gap-x-2">
                  <div
                    className={`font-semibold text-stone-900 ${config.itemTitle}`}
                  >
                    {exp.position}{" "}
                    <span className="text-stone-400 font-normal">|</span>{" "}
                    <span className="text-stone-800">{exp.company}</span>
                  </div>
                  <div
                    className={`${config.metaText} text-stone-500 font-mono`}
                  >
                    {exp.startDate} – {exp.endDate}
                  </div>
                </div>
                {exp.location && (
                  <div
                    className={`${config.metaText} text-stone-500 italic mb-1.5`}
                  >
                    {exp.location}
                  </div>
                )}
                <ul
                  className={`list-disc list-outside ml-4 mt-1 ${config.bulletSpacing} ${config.bulletText} text-stone-700`}
                >
                  {exp.highlights.map((bullet, idx) => (
                    <li key={idx} className="pl-0.5">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <section
          data-page-break-block="true"
          className={`${config.sectionSpacing} break-inside-avoid`}
        >
          <h2
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
          >
            Skills &amp; Technologies
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id} className={config.metaText}>
                <span className="font-semibold text-stone-800">
                  {cat.categoryName}:{" "}
                </span>
                <span className="text-stone-600">{cat.skills.join(", ")}</span>
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
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
          >
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div
                key={edu.id}
                className={`flex items-baseline justify-between gap-x-2 ${config.metaText}`}
              >
                <div>
                  <span className="font-semibold text-stone-900">
                    {edu.degree}
                  </span>{" "}
                  in {edu.fieldOfStudy}
                  <span className="text-stone-600"> — {edu.institution}</span>
                  {edu.gpaOrHonors && (
                    <span className="text-stone-500 italic ml-1">
                      ({edu.gpaOrHonors})
                    </span>
                  )}
                </div>
                <div className="text-stone-500 font-mono text-xs">
                  {edu.endDate}
                </div>
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
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
          >
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-page-break-block="true">
                <div className="flex items-baseline justify-between">
                  <span
                    className={`font-semibold text-stone-900 ${config.metaText}`}
                  >
                    {proj.title}
                  </span>
                  <span
                    className={`${config.metaText} text-stone-500 font-mono`}
                  >
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
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
          >
            Certifications
          </h2>
          <div
            className={`flex flex-wrap gap-x-6 gap-y-1 ${config.metaText} text-stone-700`}
          >
            {certifications.map((cert) => (
              <div key={cert.id}>
                <span className="font-medium text-stone-900">{cert.name}</span>
                <span className="text-stone-500">
                  {" "}
                  ({cert.issuer}, {cert.date})
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
