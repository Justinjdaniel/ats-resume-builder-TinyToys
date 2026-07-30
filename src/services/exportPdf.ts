import { ResumeData } from '../templates/types';

export async function exportToPdf(elementId: string, data: ResumeData): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Target element for PDF export not found:', elementId);
    window.print();
    return;
  }

  try {
    // Dynamically import html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default || (window as any).html2pdf;

    const opt = {
      margin: [10, 10, 10, 10], // mm
      filename: `${data.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    if (html2pdf) {
      await html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  } catch (error) {
    console.warn('html2pdf failed or unavailable, falling back to browser print:', error);
    window.print();
  }
}
