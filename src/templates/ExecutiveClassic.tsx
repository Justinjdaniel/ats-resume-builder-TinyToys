import React from 'react';
import { LayoutConfig, ResumeData } from './types';

interface TemplateProps {
  data: ResumeData;
  config: LayoutConfig;
}

export const ExecutiveClassic: React.FC<TemplateProps> = ({ data, config }) => {
  const { primaryColor, fontSize } = config;
  const sizeMultiplier =
    fontSize === 'small' ? 0.88
    : fontSize === 'large' ? 1.08
    : 1.0;

  return (
    <div
      id='resume-preview-document'
      className='resume-paper font-serif p-10'
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontSize: `${0.95 * sizeMultiplier}rem`,
        lineHeight: '1.55',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
      <header
        style={{
          marginBottom: '24px',
          borderBottom: `2px solid ${primaryColor}`,
          paddingBottom: '18px',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: `${2.1 * sizeMultiplier}rem`,
                fontWeight: 800,
                color: '#111827',
              }}>
              {data.fullName}
            </h1>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: `${1.05 * sizeMultiplier}rem`,
                color: primaryColor,
                fontWeight: 600,
              }}>
              {data.targetTitle}
            </p>
          </div>
          <div
            style={{
              textAlign: 'right',
              minWidth: '210px',
              color: '#4b5563',
              fontSize: `${0.9 * sizeMultiplier}rem`,
            }}>
            {data.email && <div>{data.email}</div>}
            {data.phone && <div>{data.phone}</div>}
            {data.location && <div>{data.location}</div>}
            {data.linkedin && <div>{data.linkedin}</div>}
          </div>
        </div>
      </header>

      {data.summary && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={headingStyle(primaryColor, sizeMultiplier)}>
            EXECUTIVE SUMMARY
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={headingStyle(primaryColor, sizeMultiplier)}>
            CORE COMPETENCIES
          </h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {data.skills.map((category, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <strong style={{ minWidth: '150px', color: '#111827' }}>
                  {category.category}:
                </strong>
                <span style={{ color: '#4b5563' }}>
                  {category.skills.join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={headingStyle(primaryColor, sizeMultiplier)}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: `${1.0 * sizeMultiplier}rem`,
                      color: '#111827',
                    }}>
                    {exp.role}
                  </div>
                  <div style={{ color: primaryColor, marginTop: '2px' }}>
                    {exp.company}
                  </div>
                </div>
                <div
                  style={{
                    color: '#6b7280',
                    fontSize: `${0.85 * sizeMultiplier}rem`,
                  }}>
                  {exp.startDate} – {exp.endDate}
                  {exp.location ? ` | ${exp.location}` : ''}
                </div>
              </div>
              <ul
                style={{
                  margin: '10px 0 0 18px',
                  padding: 0,
                  color: '#374151',
                }}>
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={headingStyle(primaryColor, sizeMultiplier)}>EDUCATION</h2>
          {data.education.map(edu => (
            <div
              key={edu.id}
              style={{ marginBottom: '10px', color: '#374151' }}>
              <div style={{ fontWeight: 700 }}>{edu.degree}</div>
              <div>{edu.institution}</div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: `${0.85 * sizeMultiplier}rem`,
                }}>
                {edu.graduationYear}
              </div>
            </div>
          ))}
        </section>
      )}

      {config.showProjects && data.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={headingStyle(primaryColor, sizeMultiplier)}>
            SELECT PROJECTS
          </h2>
          {data.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, color: '#111827' }}>
                {proj.name}
              </div>
              <div style={{ margin: '4px 0', color: '#4b5563' }}>
                {proj.description}
              </div>
              {proj.technologies && (
                <div
                  style={{
                    fontSize: `${0.85 * sizeMultiplier}rem`,
                    color: '#6b7280',
                  }}>
                  {proj.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {config.showCertifications &&
        data.certifications &&
        data.certifications.length > 0 && (
          <section>
            <h2 style={headingStyle(primaryColor, sizeMultiplier)}>
              CERTIFICATIONS
            </h2>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151' }}>
              {data.certifications.map((cert, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        )}
    </div>
  );
};

const headingStyle = (color: string, sizeMultiplier: number) => ({
  color,
  fontSize: `${1.0 * sizeMultiplier}rem`,
  fontWeight: 700,
  letterSpacing: '0.05em',
  borderBottom: `1px solid #e2e8f0`,
  paddingBottom: '6px',
  marginBottom: '10px',
});
