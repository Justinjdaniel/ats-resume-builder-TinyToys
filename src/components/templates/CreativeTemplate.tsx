import React from "react";
import { MasterProfile, PageMargin } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface TemplateProps {
  profile: MasterProfile;
  fontSize?: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({
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

  const marginSidebar = {
    compact: "p-5",
    normal: "p-7",
    spacious: "p-9",
  }[pageMargin];

  const marginMain = {
    compact: "p-6",
    normal: "p-8",
    spacious: "p-11",
  }[pageMargin];

  const config = {
    sm: {
      sidebar: marginSidebar,
      main: marginMain,
      name: "text-[22px]",
      headline: "text-[12px]",
      sectionHeading: "text-[11px] mb-2",
      itemTitle: "text-[13px]",
      metaText: "text-[11px]",
      bulletText: "text-[11.5px]",
      bulletSpacing: "space-y-1",
    },
    base: {
      sidebar: marginSidebar,
      main: marginMain,
      name: "text-[26px]",
      headline: "text-[13.5px]",
      sectionHeading: "text-[12px] mb-2.5",
      itemTitle: "text-[14px]",
      metaText: "text-[12px]",
      bulletText: "text-[13px]",
      bulletSpacing: "space-y-1.5",
    },
    lg: {
      sidebar: marginSidebar,
      main: marginMain,
      name: "text-[30px]",
      headline: "text-[15px]",
      sectionHeading: "text-[13px] mb-3",
      itemTitle: "text-[15px]",
      metaText: "text-[12.5px]",
      bulletText: "text-[14px]",
      bulletSpacing: "space-y-2",
    },
  }[fontSize] || {
    sidebar: marginSidebar,
    main: marginMain,
    name: "text-[26px]",
    headline: "text-[13.5px]",
    sectionHeading: "text-[12px] mb-2.5",
    itemTitle: "text-[14px]",
    metaText: "text-[12px]",
    bulletText: "text-[13px]",
    bulletSpacing: "space-y-1.5",
  };

  return (
    <div
      id="resume-creative-template"
      className={`w-full h-full bg-white text-stone-900 grid grid-cols-12 min-h-full font-sans leading-relaxed select-text`}
    >
      {/* Left Sidebar (35% width) */}
      <aside
        className={`col-span-4 bg-stone-100 ${config.sidebar} border-r border-stone-200 flex flex-col gap-6 text-stone-800`}
      >
        {/* Contact info block */}
        <div data-page-break-block="true" className="break-inside-avoid">
          <h3
            className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1`}
          >
            Contact
          </h3>
          <div className={`space-y-2 ${config.metaText}`}>
            {personalInfo.email && (
              <div className="flex items-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span className="break-all">
                  {personalInfo.website.replace(/^https?:\/\//, "")}
                </span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span className="break-all">
                  {personalInfo.linkedin.replace(/^https?:\/\//, "")}
                </span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-start gap-1.5">
                <Github className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span className="break-all">
                  {personalInfo.github.replace(/^https?:\/\//, "")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills block */}
        {skillCategories.length > 0 && (
          <div data-page-break-block="true" className="break-inside-avoid">
            <h3
              className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1`}
            >
              Skills
            </h3>
            <div className="space-y-3">
              {skillCategories.map((cat) => (
                <div key={cat.id}>
                  <div
                    className={`${config.metaText} font-semibold text-stone-900 mb-1`}
                  >
                    {cat.categoryName}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((skill, i) => (
                      <span
                        key={i}
                        className={`inline-block bg-white text-stone-800 ${config.metaText} px-2 py-0.5 rounded border border-stone-200`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education block */}
        {education.length > 0 && (
          <div data-page-break-block="true" className="break-inside-avoid">
            <h3
              className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1`}
            >
              Education
            </h3>
            <div className={`space-y-3 ${config.metaText}`}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-stone-900">{edu.degree}</div>
                  <div className="text-stone-700">{edu.fieldOfStudy}</div>
                  <div className="text-stone-500">{edu.institution}</div>
                  <div className="text-stone-400 font-mono text-[11px]">
                    {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications block */}
        {certifications.length > 0 && (
          <div data-page-break-block="true" className="break-inside-avoid">
            <h3
              className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1`}
            >
              Certifications
            </h3>
            <div className={`space-y-2 ${config.metaText}`}>
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold text-stone-900">{c.name}</div>
                  <div className="text-stone-500 text-[11px]">
                    {c.issuer} ({c.date})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content (65% width) */}
      <main className={`col-span-8 ${config.main} flex flex-col gap-6`}>
        {/* Header */}
        <header
          data-page-break-block="true"
          className="border-b border-stone-200 pb-4"
        >
          <h1
            className={`${config.name} font-extrabold text-stone-950 tracking-tight leading-tight`}
          >
            {personalInfo.fullName}
          </h1>
          {personalInfo.headline && (
            <p className={`${config.headline} font-medium text-stone-600 mt-1`}>
              {personalInfo.headline}
            </p>
          )}
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section data-page-break-block="true">
            <h2
              className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400`}
            >
              Career Profile
            </h2>
            <p
              className={`text-stone-700 ${config.bulletText} leading-normal text-justify`}
            >
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2
              data-page-break-block="true"
              className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  data-page-break-block="true"
                  className="break-inside-avoid"
                >
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`font-bold text-stone-900 ${config.itemTitle}`}
                    >
                      {exp.position}
                    </span>
                    <span
                      className={`${config.metaText} text-stone-500 font-mono`}
                    >
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div
                    className={`${config.metaText} font-medium text-stone-600 mb-1.5`}
                  >
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  <ul
                    className={`list-disc list-outside ml-4 ${config.bulletSpacing} text-stone-700 ${config.bulletText}`}
                  >
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="break-inside-avoid">
            <h2
              data-page-break-block="true"
              className={`${config.sectionHeading} font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1`}
            >
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  data-page-break-block="true"
                  className={config.metaText}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-stone-900">
                      {proj.title}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      [{proj.technologies.join(", ")}]
                    </span>
                  </div>
                  <p className="text-stone-700 mt-0.5">{proj.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
