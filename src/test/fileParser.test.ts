import { describe, it, expect } from 'vitest';
import { parseFileContent } from '../services/fileParser';

describe('fileParser service', () => {
  it('should parse plain text files correctly', async () => {
    const file = new File(['Hello world, this is a plain text file.'], 'sample.txt', {
      type: 'text/plain',
    });
    const content = await parseFileContent(file);
    expect(content).toBe('Hello world, this is a plain text file.');
  });

  it('should parse Markdown files correctly', async () => {
    const file = new File(['# Professional Summary\n\nExperienced Software Engineer.'], 'resume.md', {
      type: 'text/markdown',
    });
    const content = await parseFileContent(file);
    expect(content).toContain('# Professional Summary');
    expect(content).toContain('Experienced Software Engineer.');
  });

  it('should parse JSON files correctly and format them', async () => {
    const jsonObj = { name: 'Alex', title: 'Senior Developer' };
    const file = new File([JSON.stringify(jsonObj)], 'data.json', {
      type: 'application/json',
    });
    const content = await parseFileContent(file);
    expect(content).toContain('"name": "Alex"');
    expect(content).toContain('"title": "Senior Developer"');
  });
});
