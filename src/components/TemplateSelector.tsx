import React from 'react';
import { Palette, Layout, Type, Maximize2 } from 'lucide-react';
import { LayoutConfig, TemplateId } from '../templates/types';

interface Props {
  config: LayoutConfig;
  onChange: (config: LayoutConfig) => void;
}

const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern Minimalist', desc: 'Clean, hybrid ATS single/two-column accents' },
  { id: 'executive', name: 'Executive Classic', desc: 'High-authority corporate serif with centered titles' },
  { id: 'tech', name: 'Tech Clean', desc: 'Developer specialist layout with skill matrix boxes' },
  { id: 'compact', name: 'Compact Elegant', desc: 'High-density single page for senior experience' },
];

const ACCENT_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Navy Corporate', hex: '#1e3a8a' },
  { name: 'Teal Modern', hex: '#0f766e' },
  { name: 'Burgundy', hex: '#9f1239' },
  { name: 'Charcoal Minimal', hex: '#334155' },
];

export const TemplateSelector: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: '700',
          fontFamily: 'var(--font-heading)',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Layout size={18} style={{ color: 'var(--accent-primary)' }} />
        Design & Layout Gallery
      </h3>

      {/* Template Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange({ ...config, templateId: t.id })}
            className="glass-card"
            style={{
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              borderColor: config.templateId === t.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.08)',
              backgroundColor: config.templateId === t.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '2px' }}>
              {t.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Controls: Color, Font, Density */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {/* Color Palette */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Palette size={14} /> Accent Color
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => onChange({ ...config, primaryColor: c.hex })}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: config.primaryColor === c.hex ? '2px solid #ffffff' : 'none',
                  cursor: 'pointer',
                  boxShadow: config.primaryColor === c.hex ? '0 0 8px ' + c.hex : 'none',
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Font Style */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Type size={14} /> Typography
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => onChange({ ...config, fontFamily: 'sans' })}
              className={`btn ${config.fontFamily === 'sans' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Sans
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, fontFamily: 'serif' })}
              className={`btn ${config.fontFamily === 'serif' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Serif
            </button>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize2 size={14} /> Spacing
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['compact', 'normal', 'spacious'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...config, spacing: s })}
                className={`btn ${config.spacing === s ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '0.72rem', textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
