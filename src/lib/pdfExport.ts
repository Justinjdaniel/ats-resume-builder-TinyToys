import { jsPDF } from "jspdf";
import { toCanvas } from "html-to-image";
import { PaperSize, PageMargin } from "../types";
import { triggerFileDownload } from "./docxExport";

interface ExportPdfOptions {
  element: HTMLElement;
  filename?: string;
  paperSize?: PaperSize;
  pageMargin?: PageMargin;
}

/**
 * Directly renders the document into a high-fidelity, multi-page PDF file
 * and triggers a native file download.
 *
 * Slices each physical page cleanly at the exact aspect ratio (A4 or Letter)
 * respecting safe margins and automatic content alignment.
 */
export async function exportDocumentToPdf({
  element,
  filename = "resume.pdf",
  paperSize = "letter",
}: ExportPdfOptions): Promise<void> {
  const isA4 = paperSize === "a4";

  // Physical dimensions in millimeters
  // A4: 210 x 297 mm
  // US Letter: 215.9 x 279.4 mm (8.5 x 11 inches)
  const pageWidthMm = isA4 ? 210 : 215.9;
  const pageHeightMm = isA4 ? 297 : 279.4;
  const pageRatio = pageHeightMm / pageWidthMm;

  // 1. Render the container to a high-resolution canvas using html-to-image
  // Pixel ratio 2x provides sharp, retina-crisp typography
  const canvas = await toCanvas(element, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    style: {
      transform: "none",
      transformOrigin: "top left",
    },
    filter: (node: Node) => {
      if (node instanceof HTMLElement) {
        // Exclude UI overlay elements like dashed cutting guides and badges
        if (
          node.id === "page-break-guides-overlay" ||
          node.classList.contains("no-print")
        ) {
          return false;
        }
      }
      return true;
    },
  });

  const fullWidth = canvas.width;
  const fullHeight = canvas.height;
  const singlePageCanvasHeight = fullWidth * pageRatio;

  // Determine number of physical pages needed
  const totalPages = Math.max(
    1,
    Math.ceil((fullHeight - 1) / singlePageCanvasHeight),
  );

  // Initialize jsPDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isA4 ? "a4" : "letter",
    compress: true,
  });

  // 2. Slice each page from the full canvas and insert into PDF
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage(isA4 ? "a4" : "letter", "portrait");
    }

    const sourceY = page * singlePageCanvasHeight;
    const currentSliceHeight = Math.min(
      singlePageCanvasHeight,
      fullHeight - sourceY,
    );

    // Create a temporary page canvas to draw this page slice
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = fullWidth;
    pageCanvas.height = Math.round(singlePageCanvasHeight);

    const ctx = pageCanvas.getContext("2d");
    if (ctx) {
      // Fill with clean white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      // Draw the slice from the source canvas
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        fullWidth,
        currentSliceHeight,
        0,
        0,
        fullWidth,
        currentSliceHeight,
      );

      const pageDataUrl = pageCanvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(
        pageDataUrl,
        "JPEG",
        0,
        0,
        pageWidthMm,
        pageHeightMm,
        undefined,
        "FAST",
      );
    }
  }

  // 3. Output as Blob and trigger file download
  const pdfBlob = pdf.output("blob");
  triggerFileDownload(pdfBlob, filename);
}
