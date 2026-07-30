import React from 'react';
import { LayoutConfig, ResumeData } from './types';

interface TemplateProps {
  data: ResumeData;
  config: LayoutConfig;
}

export const CompactElegant: React.FC<TemplateProps> = ({ data, config }) => {
  const { primaryColor, fontSize } = config;
  const sizeMultiplier = fontSize === 'small' ? 0.88 : fontSize === 'large' ? 1.05 : 0.95;

  return (
    <div
      id="resume-preview-document"
      className="resume-paper font-sans p-6"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontSize: `${0.88 * sizeMultiplier}rem`,
        lineHeight: '1.4',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header - Top Compact Grid */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          borderBottom: `2px solid ${primaryColor}`,
          paddingBottom: '10px',
          marginBottom: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: `${1.6 * sizeMultiplier}rem`,
              fontWeight: '800',
              color: primaryColor,
              margin: '0 0 2px 0',
              lineHeight: '1.1',
            }}
          >
            {data.fullName}
          </h1>
          <div style={{ fontWeight: '700', color: '#334155', fontSize: '0.95rem' }}>{data.targetTitle}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          {data.linkedin && <div>{data.linkedin}</div>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '12px' }}>
          <h2 style={compactTitleStyle(primaryColor)}>Summary</h2>
          <p style={{ margin: 0, color: '#1e293b' }}>{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: '12px' }}>
          <h2 style={compactTitleStyle(primaryColor)}>Technical Skills & Expertise</h2>
          <div style={{ display: 'grid', gap: '4px' }}>
            {data.skills.map((cat, idx) => (
              <div key={idx}>
                <strong>{cat.category}:</strong> {cat.skills.join(' • ')}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: '12px' }}>
          <h2 style={compactTitleStyle(primaryColor)}>Work History</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>
                  {exp.role} <span style={{ color: primaryColor, fontWeight: '600' }}>| {exp.company}</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <ul style={{ margin: '2px 0 0 0', paddingLeft: '16px', color: '#334155' }}>
                {exp.highlights.map((h, idx) => (
                  <li key={idx} style={{ marginBottom: '2px' }}>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: '12px' }}>
          <h2 style={compactTitleStyle(primaryColor)}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong>{edu.degree}</strong> — {edu.institution}
              </span>
              <span>{edu.graduationYear}</span>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {config.showCertifications && data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 style={compactTitleStyle(primaryColor)}>Certifications</h2>
          <p style={{ margin: 0 }}>{data.certifications.join('  •  ')}</p>
        </section>
      )}
    </div>
  );
};

const compactTitleStyle = (color: string) => ({
  fontSize: '0.85rem',
  fontWeight: '700' as const,
  color,
  textTransform: 'uppercase' as const,
  borderBottom: '1px solid #cbd5e1',
  paddingBottom: '2px',
  marginBottom: '6px',
});
