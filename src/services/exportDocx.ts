import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { LayoutConfig, ResumeData } from '../templates/types';

export async function exportToDocx(data: ResumeData, config: LayoutConfig): Promise<void> {
  const font = config.fontFamily === 'serif' ? 'Georgia' : 'Arial';
  const primaryColorHex = config.primaryColor.replace('#', '') || '1E3A8A';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: [
          // Header - Full Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: data.fullName,
                bold: true,
                size: 32, // 16pt
                font,
                color: primaryColorHex,
              }),
            ],
          }),

          // Target Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.targetTitle,
                bold: true,
                size: 22, // 11pt
                font,
                color: '475569',
              }),
            ],
          }),

          // Contact Details Line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spaceAfter: 200,
            children: [
              new TextRun({
                text: [data.email, data.phone, data.location, data.linkedin, data.github]
                  .filter(Boolean)
                  .join('  |  '),
                size: 18, // 9pt
                font,
                color: '334155',
              }),
            ],
          }),

          // Summary Section
          createSectionHeading('PROFESSIONAL SUMMARY', primaryColorHex, font),
          new Paragraph({
            spaceAfter: 200,
            children: [
              new TextRun({
                text: data.summary,
                size: 20, // 10pt
                font,
              }),
            ],
          }),

          // Skills Section
          createSectionHeading('CORE COMPETENCIES & SKILLS', primaryColorHex, font),
          ...data.skills.map(
            (cat) =>
              new Paragraph({
                spaceAfter: 80,
                children: [
                  new TextRun({
                    text: `${cat.category}: `,
                    bold: true,
                    size: 20,
                    font,
                  }),
                  new TextRun({
                    text: cat.skills.join(', '),
                    size: 20,
                    font,
                  }),
                ],
              })
          ),

          // Experience Section
          createSectionHeading('WORK EXPERIENCE', primaryColorHex, font),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              spaceBefore: 120,
              children: [
                new TextRun({
                  text: exp.role,
                  bold: true,
                  size: 20,
                  font,
                }),
                new TextRun({
                  text: `  —  ${exp.company}`,
                  bold: true,
                  size: 20,
                  font,
                  color: '334155',
                }),
                new TextRun({
                  text: ` (${exp.startDate} - ${exp.endDate})`,
                  size: 18,
                  font,
                  color: '64748B',
                }),
              ],
            }),
            ...exp.highlights.map(
              (hl) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spaceAfter: 40,
                  children: [
                    new TextRun({
                      text: hl,
                      size: 19,
                      font,
                    }),
                  ],
                })
            ),
          ]),

          // Education Section
          createSectionHeading('EDUCATION', primaryColorHex, font),
          ...data.education.map(
            (edu) =>
              new Paragraph({
                spaceAfter: 80,
                children: [
                  new TextRun({
                    text: `${edu.degree}, `,
                    bold: true,
                    size: 20,
                    font,
                  }),
                  new TextRun({
                    text: `${edu.institution} (${edu.graduationYear})`,
                    size: 20,
                    font,
                  }),
                  edu.details
                    ? new TextRun({
                        text: ` - ${edu.details}`,
                        italic: true,
                        size: 18,
                        font,
                      })
                    : new TextRun({ text: '' }),
                ],
              })
          ),

          // Projects Section (if present)
          ...(data.projects && data.projects.length > 0 && config.showProjects
            ? [
                createSectionHeading('KEY PROJECTS', primaryColorHex, font),
                ...data.projects.flatMap((proj) => [
                  new Paragraph({
                    spaceBefore: 80,
                    children: [
                      new TextRun({
                        text: proj.name,
                        bold: true,
                        size: 20,
                        font,
                      }),
                      proj.technologies && proj.technologies.length > 0
                        ? new TextRun({
                            text: ` [${proj.technologies.join(', ')}]`,
                            italic: true,
                            size: 18,
                            font,
                            color: '475569',
                          })
                        : new TextRun({ text: '' }),
                    ],
                  }),
                  new Paragraph({
                    spaceAfter: 80,
                    children: [
                      new TextRun({
                        text: proj.description,
                        size: 19,
                        font,
                      }),
                    ],
                  }),
                ]),
              ]
            : []),

          // Certifications Section (if present)
          ...(data.certifications && data.certifications.length > 0 && config.showCertifications
            ? [
                createSectionHeading('CERTIFICATIONS', primaryColorHex, font),
                ...data.certifications.map(
                  (cert) =>
                    new Paragraph({
                      bullet: { level: 0 },
                      spaceAfter: 40,
                      children: [
                        new TextRun({
                          text: cert,
                          size: 19,
                          font,
                        }),
                      ],
                    })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeFileName = `${data.fullName.replace(/\s+/g, '_')}_ATS_Resume.docx`;
  saveAs(blob, safeFileName);
}

function createSectionHeading(title: string, colorHex: string, font: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spaceBefore: 240,
    spaceAfter: 120,
    border: {
      bottom: {
        color: colorHex,
        space: 4,
        style: BorderStyle.SINGLE,
        size: 12,
      },
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        font,
        color: colorHex,
      }),
    ],
  });
}
