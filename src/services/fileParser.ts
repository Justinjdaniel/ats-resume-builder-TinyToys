import mammoth from 'mammoth';

export async function parseFileContent(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (extension === 'pdf') {
    return parsePdfFile(file);
  } else if (extension === 'docx') {
    return parseDocxFile(file);
  } else if (extension === 'json') {
    return parseJsonFile(file);
  } else {
    // Plain text, Markdown, etc.
    return parseTextFile(file);
  }
}

async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = (e) => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

async function parseJsonFile(file: File): Promise<string> {
  const rawText = await parseTextFile(file);
  try {
    const parsed = JSON.parse(rawText);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return rawText;
  }
}

async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  } catch (err) {
    console.error('Error parsing DOCX file:', err);
    throw new Error('Failed to extract text from DOCX file.');
  }
}

async function parsePdfFile(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs-dist for browser compatibility
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source to CDN if window is available
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tokenProps = await page.getTextContent();
      const pageText = tokenProps.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim() || (await parseTextFile(file));
  } catch (err) {
    console.warn('PDF.js parsing failed or unsupported in environment, falling back to text reader:', err);
    try {
      return await parseTextFile(file);
    } catch {
      return `[PDF Content - ${file.name}]`;
    }
  }
}
