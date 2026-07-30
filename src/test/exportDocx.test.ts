import { describe, it, expect, vi } from 'vitest';
import { exportToDocx } from '../services/exportDocx';
import { LayoutConfig, ResumeData } from '../templates/types';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

describe('exportDocx service', () => {
  it('should generate docx blob without errors', async () => {
    const sampleData: ResumeData = {
      fullName: 'Jane Developer',
      targetTitle: 'Full Stack Engineer',
      email: 'jane@example.com',
      phone: '555-0199',
      location: 'New York, NY',
      summary: 'Experienced Full Stack Engineer.',
      skills: [{ category: 'Languages', skills: ['TypeScript', 'Python'] }],
      experience: [
        {
          id: '1',
          company: 'Acme Corp',
          role: 'Senior Developer',
          startDate: '2020',
          endDate: 'Present',
          highlights: ['Built web app.'],
        },
      ],
      education: [
        {
          id: 'e1',
          institution: 'MIT',
          degree: 'B.S. CS',
          graduationYear: '2020',
        },
      ],
      projects: [],
      certifications: [],
    };

    const config: LayoutConfig = {
      templateId: 'modern',
      primaryColor: '#6366f1',
      fontFamily: 'sans',
      fontSize: 'medium',
      spacing: 'normal',
      showProjects: true,
      showCertifications: true,
    };

    await expect(exportToDocx(sampleData, config)).resolves.not.toThrow();
  });
});
