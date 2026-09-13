import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import {
  MasterProfile,
  CoverLetter,
  TemplateTheme,
  PaperSize,
  PageMargin,
} from "../types";

/**
 * Generate and download a Microsoft Word (.docx) file
 */
export async function exportResumeToDocx(
  profile: MasterProfile,
  template: TemplateTheme = "modern",
  paperSize: PaperSize = "a4",
  pageMargin: PageMargin = "normal",
): Promise<void> {
  const {
    personalInfo,
    experiences,
    education,
    skillCategories,
    projects,
    certifications,
  } = profile;

  // Twip margins based on selection
  const marginTwips = {
    compact: 567, // 10mm (~0.4in)
    normal: 850, // 15mm (~0.6in)
    spacious: 1134, // 20mm (~0.8in)
  }[pageMargin];

  // Build Document paragraphs
  const children: Paragraph[] = [];

  // Header - Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: personalInfo.fullName,
          bold: true,
          size: 36, // 18pt
          font: template === "professional" ? "Georgia" : "Arial",
          color: "1c1917",
        }),
      ],
    }),
  );

  // Headline
  if (personalInfo.headline) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: personalInfo.headline,
            italics: true,
            size: 22,
            font: "Arial",
            color: "44403c",
          }),
        ],
      }),
    );
  }

  // Contact line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 260 },
        children: [
          new TextRun({
            text: contactParts.join("  •  "),
            size: 18,
            font: "Arial",
            color: "57534e",
          }),
        ],
        border: {
          bottom: {
            color: "d6d3d1",
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    );
  }

  // Summary
  if (personalInfo.summary) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: "PROFESSIONAL SUMMARY",
            bold: true,
            size: 20,
            font: "Arial",
            color: "0c0a09",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 20,
            font: "Arial",
            color: "292524",
          }),
        ],
      }),
    );
  }

  // Work Experience
  if (experiences.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "WORK EXPERIENCE",
            bold: true,
            size: 20,
            font: "Arial",
            color: "0c0a09",
          }),
        ],
      }),
    );

    experiences.forEach((exp) => {
      // Company and Position line
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 20,
              font: "Arial",
              color: "1c1917",
            }),
            new TextRun({
              text: ` — ${exp.company}`,
              bold: true,
              size: 20,
              font: "Arial",
              color: "44403c",
            }),
            new TextRun({
              text: `  (${exp.startDate} - ${exp.endDate})`,
              italics: true,
              size: 18,
              font: "Arial",
              color: "78716c",
            }),
          ],
        }),
      );

      // Highlights
      exp.highlights.forEach((h) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: h,
                size: 19,
                font: "Arial",
                color: "292524",
              }),
            ],
          }),
        );
      });
    });
  }

  // Skills
  if (skillCategories.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "CORE COMPETENCIES & SKILLS",
            bold: true,
            size: 20,
            font: "Arial",
            color: "0c0a09",
          }),
        ],
      }),
    );

    skillCategories.forEach((cat) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${cat.categoryName}: `,
              bold: true,
              size: 19,
              font: "Arial",
              color: "292524",
            }),
            new TextRun({
              text: cat.skills.join(", "),
              size: 19,
              font: "Arial",
              color: "44403c",
            }),
          ],
        }),
      );
    });
  }

  // Education
  if (education.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "EDUCATION",
            bold: true,
            size: 20,
            font: "Arial",
            color: "0c0a09",
          }),
        ],
      }),
    );

    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.fieldOfStudy}`,
              bold: true,
              size: 20,
              font: "Arial",
              color: "1c1917",
            }),
            new TextRun({
              text: ` — ${edu.institution}`,
              size: 19,
              font: "Arial",
              color: "44403c",
            }),
            new TextRun({
              text: ` (${edu.endDate}${edu.gpaOrHonors ? ` | ${edu.gpaOrHonors}` : ""})`,
              italics: true,
              size: 18,
              font: "Arial",
              color: "78716c",
            }),
          ],
        }),
      );
    });
  }

  // Projects
  if (projects.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "PROJECTS & ARCHITECTURAL CONTRIBUTIONS",
            bold: true,
            size: 20,
            font: "Arial",
            color: "0c0a09",
          }),
        ],
      }),
    );

    projects.forEach((p) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: p.title,
              bold: true,
              size: 19,
              font: "Arial",
              color: "1c1917",
            }),
            new TextRun({
              text: ` [${p.technologies.join(", ")}]`,
              italics: true,
              size: 18,
              font: "Arial",
              color: "78716c",
            }),
            new TextRun({
              text: p.link ? ` - ${p.link}` : "",
              size: 17,
              font: "Arial",
              color: "0284c7",
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: p.summary,
              size: 19,
              font: "Arial",
              color: "292524",
            }),
          ],
        }),
      );
    });
  }

  // Document Config
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: paperSize === "letter" ? 12240 : 11906,
              height: paperSize === "letter" ? 15840 : 16838,
            },
            margin: {
              top: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
              right: marginTwips,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName =
    profile.personalInfo.fullName.replace(/\s+/g, "_") || "Resume";
  triggerFileDownload(blob, `${cleanName}_CV.docx`);
}

/**
 * Generate and download Word (.docx) for Cover Letter
 */
export async function exportCoverLetterToDocx(
  profile: MasterProfile,
  cl: CoverLetter,
  paperSize: PaperSize = "a4",
  pageMargin: PageMargin = "normal",
): Promise<void> {
  const marginTwips = {
    compact: 567, // 10mm (~0.4in)
    normal: 850, // 15mm (~0.6in)
    spacious: 1134, // 20mm (~0.8in)
  }[pageMargin];

  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: profile.personalInfo.fullName,
          bold: true,
          size: 32,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${profile.personalInfo.email} | ${profile.personalInfo.phone} | ${profile.personalInfo.location}`,
          size: 18,
          font: "Arial",
          color: "57534e",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: cl.recipientName || "Hiring Committee",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: `${cl.company}`,
          size: 20,
          font: "Arial",
          color: "44403c",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: cl.salutation,
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
  ];

  cl.bodyParagraphs.forEach((para) => {
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: para,
            size: 20,
            font: "Arial",
          }),
        ],
      }),
    );
  });

  children.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: cl.signOff,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: paperSize === "letter" ? 12240 : 11906,
              height: paperSize === "letter" ? 15840 : 16838,
            },
            margin: {
              top: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
              right: marginTwips,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName =
    profile.personalInfo.fullName.replace(/\s+/g, "_") || "Candidate";
  triggerFileDownload(blob, `${cleanName}_CoverLetter.docx`);
}

/**
 * Format Resume into standard clean Markdown
 */
export function formatResumeAsMarkdown(profile: MasterProfile): string {
  const {
    personalInfo,
    experiences,
    education,
    skillCategories,
    projects,
    certifications,
  } = profile;
  let md = `# ${personalInfo.fullName}\n\n`;

  if (personalInfo.headline) {
    md += `*${personalInfo.headline}*\n\n`;
  }

  const contacts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  if (contacts.length > 0) {
    md += `${contacts.join(" | ")}\n\n---\n\n`;
  }

  if (personalInfo.summary) {
    md += `## Professional Summary\n\n${personalInfo.summary}\n\n`;
  }

  if (experiences.length > 0) {
    md += `## Work Experience\n\n`;
    experiences.forEach((exp) => {
      md += `### ${exp.position} - ${exp.company}\n`;
      md += `*${exp.startDate} - ${exp.endDate} | ${exp.location || "Remote"}*\n\n`;
      exp.highlights.forEach((h) => {
        md += `- ${h}\n`;
      });
      md += `\n`;
    });
  }

  if (skillCategories.length > 0) {
    md += `## Technical Skills & Core Competencies\n\n`;
    skillCategories.forEach((cat) => {
      md += `- **${cat.categoryName}:** ${cat.skills.join(", ")}\n`;
    });
    md += `\n`;
  }

  if (education.length > 0) {
    md += `## Education\n\n`;
    education.forEach((edu) => {
      md += `### ${edu.degree}, ${edu.fieldOfStudy}\n`;
      md += `*${edu.institution} | ${edu.endDate}${edu.gpaOrHonors ? ` | ${edu.gpaOrHonors}` : ""}*\n\n`;
    });
  }

  if (projects.length > 0) {
    md += `## Key Projects & Architecture\n\n`;
    projects.forEach((p) => {
      md += `### ${p.title} (${p.technologies.join(", ")})\n`;
      if (p.link) md += `[Project Link](${p.link})\n\n`;
      md += `${p.summary}\n\n`;
      p.bullets.forEach((b) => {
        md += `- ${b}\n`;
      });
      md += `\n`;
    });
  }

  if (certifications.length > 0) {
    md += `## Certifications\n\n`;
    certifications.forEach((c) => {
      md += `- **${c.name}** - ${c.issuer} (${c.date})\n`;
    });
  }

  return md;
}

/**
 * Format Resume into Plain Text
 */
export function formatResumeAsPlainText(profile: MasterProfile): string {
  return formatResumeAsMarkdown(profile)
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/**
 * Native Browser File Downloader
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
