import React, { useState, useEffect } from 'react';
import { Key, Sparkles, FileCheck, Layers, FileUp } from 'lucide-react';
import { ApiKeyConfig, AtsReport, LayoutConfig, ResumeData, UploadedFile } from './templates/types';
import { getApiKeyConfig, generateOptimizedResume, runHeuristicOptimization } from './services/aiEngine';
import { KeyManagerModal } from './components/KeyManagerModal';
import { FileUploader } from './components/FileUploader';
import { AtsReportCard } from './components/AtsReportCard';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeEditorPreview } from './components/ResumeEditorPreview';

export const App: React.FC = () => {
  const [apiKeyConfig, setApiKeyConfig] = useState<ApiKeyConfig | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [atsReport, setAtsReport] = useState<AtsReport | null>(null);

  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    templateId: 'modern',
    primaryColor: '#6366f1',
    fontFamily: 'sans',
    fontSize: 'medium',
    spacing: 'normal',
    showProjects: true,
    showCertifications: true,
  });

  useEffect(() => {
    const existing = getApiKeyConfig();
    if (existing) {
      setApiKeyConfig(existing);
    } else {
      // Default to initial sample heuristic data so user sees live preview instantly!
      const initial = runHeuristicOptimization('', '');
      setResumeData(initial.resumeData);
      setAtsReport(initial.atsReport);
    }
  }, []);

  const handleOptimize = async () => {
    setIsProcessing(true);
    try {
      const result = await generateOptimizedResume(files, apiKeyConfig);
      setResumeData(result.resumeData);
      setAtsReport(result.atsReport);
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header className="app-header">
        <div className="brand-logo">
          <Sparkles size={24} style={{ color: 'var(--accent-primary)' }} />
          <span>ATS Resumaster</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setIsKeyModalOpen(true)}
            className={`btn ${apiKeyConfig ? 'btn-success' : 'btn-outline'}`}
            style={{ fontSize: '0.82rem' }}
          >
            <Key size={16} />
            {apiKeyConfig
              ? `BYOK Active (${apiKeyConfig.provider.toUpperCase()})`
              : 'Add API Key (BYOK)'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-container" style={{ flex: 1 }}>
        <div className="grid-workspace">
          {/* Sidebar Controls */}
          <div className="sidebar-controls" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1: Upload Documents */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h2
                style={{
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FileUp size={18} style={{ color: 'var(--accent-primary)' }} />
                1. Master Data & Job Ingestion
              </h2>

              <FileUploader
                files={files}
                onFilesChange={setFiles}
                onOptimize={handleOptimize}
                isProcessing={isProcessing}
              />
            </div>

            {/* Step 2: ATS Report */}
            {atsReport && <AtsReportCard report={atsReport} />}

            {/* Step 3: Template Gallery Picker */}
            <TemplateSelector config={layoutConfig} onChange={setLayoutConfig} />
          </div>

          {/* Right Pane: Live Document Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {resumeData ? (
              <ResumeEditorPreview
                data={resumeData}
                config={layoutConfig}
                onDataChange={setResumeData}
              />
            ) : (
              <div
                className="glass-panel"
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <Layers size={48} style={{ color: 'var(--accent-primary)', opacity: 0.5, marginBottom: '12px' }} />
                <h3>Upload your documents and click "Generate ATS Optimised Resume"</h3>
                <p style={{ fontSize: '0.88rem' }}>
                  Supports PDF, DOCX, Markdown, JSON, and Text files.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* BYOK Modal */}
      <KeyManagerModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onConfigSaved={setApiKeyConfig}
      />
    </div>
  );
};

export default App;
