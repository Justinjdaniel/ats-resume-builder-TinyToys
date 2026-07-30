import React from 'react';
import { LayoutConfig, ResumeData } from './types';

interface TemplateProps {
  data: ResumeData;
  config: LayoutConfig;
}

export const TechClean: React.FC<TemplateProps> = ({ data, config }) => {
  const { primaryColor, fontSize } = config;
  const sizeMultiplier = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.1 : 1.0;

  return (
    <div
      id="resume-preview-document"
      className="resume-paper font-sans p-8"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontSize: `${0.92 * sizeMultiplier}rem`,
        lineHeight: '1.45',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#f8fafc',
          padding: '16px 20px',
          borderRadius: '6px',
          borderLeft: `5px solid ${primaryColor}`,
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: `${1.75 * sizeMultiplier}rem`, fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
          {data.fullName}
        </h1>
        <div style={{ color: primaryColor, fontWeight: '700', fontSize: '1rem', marginBottom: '8px' }}>
          {data.targetTitle}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.82rem', color: '#475569' }}>
          {data.email && <span>email: {data.email}</span>}
          {data.phone && <span>tel: {data.phone}</span>}
          {data.github && <span>github: {data.github}</span>}
          {data.linkedin && <span>linkedin: {data.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={techHeadingStyle(primaryColor)}>&lt;SUMMARY&gt;</h2>
          <p style={{ margin: 0, color: '#334155' }}>{data.summary}</p>
        </section>
      )}

      {/* Tech Stack Matrix */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={techHeadingStyle(primaryColor)}>&lt;TECHNICAL_SKILLS&gt;</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {data.skills.map((cat, idx) => (
              <div key={idx} style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '4px' }}>
                <div style={{ fontWeight: '700', color: primaryColor, fontSize: '0.85rem', marginBottom: '4px' }}>
                  // {cat.category}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{cat.skills.join(', ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={techHeadingStyle(primaryColor)}>&lt;EXPERIENCE&gt;</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{exp.role}</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <div style={{ color: primaryColor, fontWeight: '600', fontSize: '0.88rem', marginBottom: '4px' }}>
                {exp.company} {exp.location ? `(${exp.location})` : ''}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#334155' }}>
                {exp.highlights.map((hl, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={techHeadingStyle(primaryColor)}>&lt;PROJECTS&gt;</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#0f172a' }}>{proj.name}</strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {proj.technologies ? proj.technologies.join(' · ') : ''}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', color: '#334155', fontSize: '0.88rem' }}>{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section>
          <h2 style={techHeadingStyle(primaryColor)}>&lt;EDUCATION&gt;</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong>{edu.degree}</strong>, {edu.institution}
              </span>
              <span style={{ color: '#64748b' }}>{edu.graduationYear}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

const techHeadingStyle = (color: string) => ({
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  fontWeight: '700' as const,
  color,
  letterSpacing: '0.05em',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '4px',
  marginBottom: '10px',
});
