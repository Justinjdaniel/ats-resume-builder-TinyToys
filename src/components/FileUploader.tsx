import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { FileRole, UploadedFile } from '../templates/types';
import { parseFileContent } from '../services/fileParser';

interface Props {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onOptimize: () => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<Props> = ({ files, onFilesChange, onOptimize, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const newUploadedFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      if (!['pdf', 'docx', 'md', 'txt', 'json'].includes(extension)) {
        setErrorMessage(`Unsupported file format: .${extension}. Please upload PDF, DOCX, MD, TXT, or JSON.`);
        continue;
      }

      try {
        const content = await parseFileContent(file);

        // Auto-assign role based on file name heuristics
        let role: FileRole = 'master';
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('jd') || lowerName.includes('job') || lowerName.includes('description')) {
          role = 'jd';
        } else if (lowerName.includes('linkedin')) {
          role = 'linkedin';
        } else if (files.some((f) => f.role === 'master')) {
          role = 'extra';
        }

        newUploadedFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          extension,
          role,
          content,
          size: file.size,
        });
      } catch (err) {
        console.error('Error parsing file:', file.name, err);
        setErrorMessage(`Failed to read content from ${file.name}.`);
      }
    }

    onFilesChange([...files, ...newUploadedFiles]);
  };

  const handleRoleChange = (id: string, role: FileRole) => {
    onFilesChange(files.map((f) => (f.id === id ? { ...f, role } : f)));
  };

  const handleRemove = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
    if (previewFileId === id) setPreviewFileId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '28px 20px',
          textAlign: 'center',
          backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.md,.txt,.json"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            marginBottom: '12px',
          }}
        >
          <UploadCloud size={26} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
          Drop candidate files or Job Description here
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Supports <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>PDF, DOCX, MD, JSON, TXT</span>
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* List of Uploaded Files */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              UPLOADED DOCUMENTS ({files.length})
            </span>
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="glass-card"
              style={{
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <FileText size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px',
                    }}
                  >
                    {file.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewFileId(previewFileId === file.id ? null : file.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Toggle Text Preview"
                  >
                    {previewFileId === file.id ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(file.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-rose)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Remove File"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Tag / Role Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Categorize as:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['master', 'linkedin', 'jd', 'extra'] as FileRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(file.id, r)}
                      className={`badge ${
                        file.role === r
                          ? r === 'master'
                            ? 'badge-master'
                            : r === 'linkedin'
                            ? 'badge-linkedin'
                            : r === 'jd'
                            ? 'badge-jd'
                            : 'badge-extra'
                          : 'badge-extra'
                      }`}
                      style={{
                        cursor: 'pointer',
                        opacity: file.role === r ? 1 : 0.4,
                      }}
                    >
                      {r === 'master' ? 'Master Resume' : r === 'linkedin' ? 'LinkedIn' : r === 'jd' ? 'Target JD' : 'Extra'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Preview Box */}
              {previewFileId === file.id && (
                <pre
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    maxHeight: '140px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {file.content || '[Empty Content]'}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Trigger Optimization Button */}
      <button
        type="button"
        onClick={onOptimize}
        disabled={isProcessing || files.length === 0}
        className="btn btn-primary"
        style={{
          padding: '14px',
          fontSize: '0.95rem',
          fontWeight: '700',
          width: '100%',
          marginTop: '8px',
        }}
      >
        <Sparkles size={20} />
        {isProcessing ? 'Optimizing Resume with AI...' : 'Generate ATS Optimised Resume'}
      </button>
    </div>
  );
};
