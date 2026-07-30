import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearApiKeyConfig,
  getApiKeyConfig,
  runHeuristicOptimization,
  saveApiKeyConfig,
} from '../services/aiEngine';
import { ApiKeyConfig } from '../templates/types';

describe('aiEngine service', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should save, retrieve, and clear BYOK config in sessionStorage', () => {
    const config: ApiKeyConfig = {
      provider: 'openai',
      apiKey: 'sk-test-123456789',
      model: 'gpt-4o-mini',
    };

    saveApiKeyConfig(config);
    const retrieved = getApiKeyConfig();
    expect(retrieved).toEqual(config);

    clearApiKeyConfig();
    expect(getApiKeyConfig()).toBeNull();
  });

  it('should calculate match percentage and generate structured ATS report in heuristic mode', () => {
    const candidateData = 'John Doe, Senior Frontend Engineer with React, TypeScript, and Node.js experience.';
    const jdData = 'Looking for a Senior Frontend Engineer proficient in React, TypeScript, Docker, and Kubernetes.';

    const result = runHeuristicOptimization(candidateData, jdData);

    expect(result).toHaveProperty('resumeData');
    expect(result).toHaveProperty('atsReport');

    expect(result.resumeData.fullName).toBeTruthy();
    expect(result.resumeData.skills.length).toBeGreaterThan(0);
    expect(result.atsReport.overallScore).toBeGreaterThan(50);
    expect(result.atsReport.matchedKeywords).toContain('React');
    expect(result.atsReport.matchedKeywords).toContain('TypeScript');
  });
});
