import React from 'react';
import { LayoutConfig, ResumeData } from './types';

interface TemplateProps {
  data: ResumeData;
  config: LayoutConfig;
}

export const ModernMinimalist: React.FC<TemplateProps> = ({ data, config }) => {
  const { primaryColor, fontSize, spacing } = config;

  const fontClass = config.fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const sizeMultiplier = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.1 : 1.0;
  const paddingClass = spacing === 'compact' ? 'p-6 gap-3' : spacing === 'spacious' ? 'p-12 gap-6' : 'p-8 gap-4';

  return (
    <div
      id="resume-preview-document"
      className={`resume-paper ${fontClass} ${paddingClass}`}
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontSize: `${0.95 * sizeMultiplier}rem`,
        lineHeight: '1.5',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
        <h1
          style={{
            color: primaryColor,
            fontSize: `${1.8 * sizeMultiplier}rem`,
            fontWeight: '800',
            letterSpacing: '-0.02em',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
          }}
        >
          {data.fullName}
        </h1>
        <div style={{ fontSize: `${1.05 * sizeMultiplier}rem`, fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          {data.targetTitle}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: `${0.85 * sizeMultiplier}rem`,
            color: '#64748b',
          }}
        >
          {data.email && <span>📧 {data.email}</span>}
          {data.phone && <span>📱 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.github && <span>💻 {data.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitleStyle(primaryColor, sizeMultiplier)}>PROFESSIONAL SUMMARY</h2>
          <p style={{ color: '#334155', margin: 0 }}>{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitleStyle(primaryColor, sizeMultiplier)}>CORE COMPETENCIES & SKILLS</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {data.skills.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', color: '#1e293b', minWidth: '150px' }}>{cat.category}:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: `${0.82 * sizeMultiplier}rem`,
                        fontWeight: '500',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitleStyle(primaryColor, sizeMultiplier)}>WORK EXPERIENCE</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ fontSize: `${1.02 * sizeMultiplier}rem`, color: '#0f172a' }}>{exp.role}</strong>
                  <span style={{ color: primaryColor, fontWeight: '600', marginLeft: '8px' }}>@ {exp.company}</span>
                </div>
                <div style={{ fontSize: `${0.82 * sizeMultiplier}rem`, color: '#64748b', fontWeight: '500' }}>
                  {exp.startDate} – {exp.endDate} {exp.location ? `| ${exp.location}` : ''}
                </div>
              </div>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', color: '#334155' }}>
                {exp.highlights.map((item, hIdx) => (
                  <li key={hIdx} style={{ marginBottom: '4px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitleStyle(primaryColor, sizeMultiplier)}>EDUCATION</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>{edu.degree}</strong> —{' '}
                <span style={{ color: '#475569' }}>{edu.institution}</span>
                {edu.details && <span style={{ color: '#64748b', fontSize: '0.85em', marginLeft: '6px' }}>({edu.details})</span>}
              </div>
              <div style={{ fontSize: `${0.82 * sizeMultiplier}rem`, color: '#64748b' }}>{edu.graduationYear}</div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {config.showProjects && data.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={sectionTitleStyle(primaryColor, sizeMultiplier)}>KEY PROJECTS</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <strong style={{ color: '#0f172a' }}>{proj.name}</strong>
                {proj.technologies && proj.technologies.length > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                    [{proj.technologies.join(', ')}]
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0 0', color: '#334155', fontSize: `${0.9 * sizeMultiplier}rem` }}>
                {proj.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {config.showCertifications && data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle(primaryColor, sizeMultiplier)}>CERTIFICATIONS</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155' }}>
            {data.certifications.map((cert, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>
                {cert}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const sectionTitleStyle = (primaryColor: string, sizeMultiplier: number) => ({
  color: primaryColor,
  fontSize: `${1.05 * sizeMultiplier}rem`,
  fontWeight: '700',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  borderBottom: `1.5px solid ${primaryColor}`,
  paddingBottom: '4px',
  marginBottom: '10px',
});
