import { CheckCircle2, Key, Lock, ShieldCheck, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  clearApiKeyConfig,
  getApiKeyConfig,
  saveApiKeyConfig,
} from '../services/aiEngine';
import { ApiKeyConfig, ApiProvider } from '../templates/types';

const MODEL_OPTIONS: Record<ApiProvider, string[]> = {
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1', 'gpt-4o-realtime-preview'],
  gemini: [
    'gemini-1.5-flash',
    'gemini-2.0-pro',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
  ],
  anthropic: [
    'claude-3-5-sonnet-20240620',
    'claude-4.1',
    'claude-3.5-realtime',
  ],
};

const DEFAULT_MODEL: Record<ApiProvider, string> = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-3.6-flash',
  anthropic: 'claude-3-5-sonnet-20240620',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (config: ApiKeyConfig | null) => void;
}

export const KeyManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [provider, setProvider] = useState<ApiProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL.openai);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const existing = getApiKeyConfig();
    if (existing) {
      setProvider(existing.provider);
      setApiKey(existing.apiKey);
      setModel(existing.model);
      setIsSaved(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    const config: ApiKeyConfig = {
      provider,
      apiKey: apiKey.trim(),
      model,
    };

    saveApiKeyConfig(config);
    setIsSaved(true);
    onConfigSaved(config);
    onClose();
  };

  const handleClear = () => {
    clearApiKeyConfig();
    setApiKey('');
    setIsSaved(false);
    onConfigSaved(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}>
      <div
        className='glass-panel'
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          borderRadius: '20px',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
            <Key size={22} />
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: 0,
                fontFamily: 'var(--font-heading)',
              }}>
              Bring Your Own Key (BYOK)
            </h2>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                margin: 0,
              }}>
              Keys are stored strictly in session memory and lost when tab
              closes.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Provider Selection */}
          <div>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                marginBottom: '6px',
                display: 'block',
              }}>
              Select AI Provider
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}>
              {(['openai', 'gemini', 'anthropic'] as ApiProvider[]).map(p => (
                <button
                  type='button'
                  key={p}
                  onClick={() => {
                    setProvider(p);
                    setModel(DEFAULT_MODEL[p]);
                  }}
                  className={`btn ${provider === p ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize', fontSize: '0.82rem' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                marginBottom: '6px',
                display: 'block',
              }}>
              Model
            </label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className='input-field'
              style={{ width: '100%' }}>
              {MODEL_OPTIONS[provider].map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                marginBottom: '6px',
                display: 'block',
              }}>
              API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type='password'
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className='input-field'
                placeholder={`Paste your ${provider.toUpperCase()} API key...`}
                required
              />
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  color: 'var(--text-dim)',
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
            <ShieldCheck size={18} />
            <span>
              Zero server storage. Direct browser request to provider API.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type='submit'
              className='btn btn-primary'
              style={{ flex: 1 }}>
              <CheckCircle2 size={18} />
              Save to Session
            </button>
            {isSaved && (
              <button
                type='button'
                onClick={handleClear}
                className='btn btn-secondary'
                style={{ color: 'var(--accent-rose)' }}>
                <Trash2 size={18} />
                Clear
              </button>
            )}
            <button
              type='button'
              onClick={onClose}
              className='btn btn-secondary'>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
