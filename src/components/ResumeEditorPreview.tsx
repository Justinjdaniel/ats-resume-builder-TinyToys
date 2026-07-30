import React, { useState } from 'react';
import { Download, Edit3, Eye, FileSpreadsheet, FileCode } from 'lucide-react';
import { LayoutConfig, ResumeData } from '../templates/types';
import { ModernMinimalist } from '../templates/ModernMinimalist';
import { ExecutiveClassic } from '../templates/ExecutiveClassic';
import { TechClean } from '../templates/TechClean';
import { CompactElegant } from '../templates/CompactElegant';
import { exportToDocx } from '../services/exportDocx';
import { exportToPdf } from '../services/exportPdf';

interface Props {
  data: ResumeData;
  config: LayoutConfig;
  onDataChange: (data: ResumeData) => void;
}

export const ResumeEditorPreview: React.FC<Props> = ({ data, config, onDataChange }) => {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [isExporting, setIsExporting] = useState(false);

  const renderTemplate = () => {
    switch (config.templateId) {
      case 'executive':
        return <ExecutiveClassic data={data} config={config} />;
      case 'tech':
        return <TechClean data={data} config={config} />;
      case 'compact':
        return <CompactElegant data={data} config={config} />;
      case 'modern':
      default:
        return <ModernMinimalist data={data} config={config} />;
    }
  };

  const handleDocxDownload = async () => {
    setIsExporting(true);
    try {
      await exportToDocx(data, config);
    } catch (e) {
      console.error('Docx export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePdfDownload = async () => {
    setIsExporting(true);
    try {
      await exportToPdf('resume-preview-document', data);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Toolbar */}
      <div
        className="glass-panel toolbar-actions"
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`btn ${mode === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            <Eye size={16} /> Live Preview
          </button>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`btn ${mode === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            <Edit3 size={16} /> Quick Edit Data
          </button>
        </div>

        {/* Download Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDocxDownload}
            disabled={isExporting}
            className="btn btn-success"
            style={{ fontSize: '0.85rem' }}
          >
            <FileSpreadsheet size={16} />
            Download DOCX
          </button>
          <button
            type="button"
            onClick={handlePdfDownload}
            disabled={isExporting}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      {mode === 'preview' ? (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '32px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
          }}
        >
          {renderTemplate()}
        </div>
      ) : (
        /* Form Edit Mode */
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Candidate Information Editor</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => onDataChange({ ...data, fullName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Job Title</label>
              <input
                type="text"
                value={data.targetTitle}
                onChange={(e) => onDataChange({ ...data, targetTitle: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => onDataChange({ ...data, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => onDataChange({ ...data, phone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Professional Summary</label>
            <textarea
              rows={4}
              value={data.summary}
              onChange={(e) => onDataChange({ ...data, summary: e.target.value })}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
