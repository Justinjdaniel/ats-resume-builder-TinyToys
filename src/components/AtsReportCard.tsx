import React from 'react';
import { CheckCircle, AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react';
import { AtsReport } from '../templates/types';

interface Props {
  report: AtsReport | null;
}

export const AtsReportCard: React.FC<Props> = ({ report }) => {
  if (!report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--accent-emerald)';
    if (score >= 70) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  const scoreColor = getScoreColor(report.overallScore);

  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-heading)', margin: 0 }}>
            ATS Compatibility Score
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Keyword and formatting analysis against Target JD
          </p>
        </div>

        {/* Circular / Large Score Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: `4px solid ${scoreColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <span style={{ fontSize: '1.35rem', fontWeight: '800', color: scoreColor, lineHeight: 1 }}>
            {report.overallScore}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ 100</span>
        </div>
      </div>

      {/* Match Percentage Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>JD Keyword Match Density</span>
          <span style={{ fontWeight: '700', color: scoreColor }}>{report.matchPercentage}%</span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${report.matchPercentage}%`,
              backgroundColor: scoreColor,
              borderRadius: '4px',
              transition: 'width 0.8s ease-out',
            }}
          />
        </div>
      </div>

      {/* Keyword Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '10px 12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-emerald)', marginBottom: '6px' }}>
            MATCHED KEYWORDS ({report.matchedKeywords.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {report.matchedKeywords.map((kw, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', padding: '10px 12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '6px' }}>
            MISSING KEYWORDS ({report.missingKeywords.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {report.missingKeywords.map((kw, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Strengths & Recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <CheckCircle size={15} style={{ color: 'var(--accent-emerald)' }} />
            Strengths
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
            {report.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Lightbulb size={15} style={{ color: 'var(--accent-amber)' }} />
            Optimization Advice
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
            {report.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
