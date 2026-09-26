import { toPng, toBlob } from "html-to-image";
import { triggerFileDownload } from "./docxExport";

/**
 * Export a DOM node as a crisp, high-resolution PNG image
 */
export async function exportElementToImage(
  element: HTMLElement,
  filename = "resume.png",
): Promise<void> {
  try {
    // Hide print/overlay indicators temporarily if needed
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // 2x for retina-sharp crisp text
      backgroundColor: "#ffffff",
      style: {
        transform: "none",
        transformOrigin: "top left",
      },
      filter: (node: Node) => {
        if (node instanceof HTMLElement) {
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

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to export element as image:", error);
    throw new Error(
      "Image generation failed. Please ensure all fonts and styles are loaded.",
    );
  }
}
