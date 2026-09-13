import React, { useState, useEffect, useMemo } from "react";
import { PaperSize, PageMargin } from "../types";

interface DocumentPageNumbersProps {
  paperRef: React.RefObject<HTMLDivElement | null>;
  paperSize: PaperSize;
  singlePageHeight?: number;
  enabled: boolean;
  fontSize?: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
}

export const DocumentPageNumbers: React.FC<DocumentPageNumbersProps> = ({
  paperRef,
  paperSize,
  singlePageHeight: propSinglePageHeight,
  enabled,
  fontSize = "base",
  pageMargin = "normal",
}) => {
  const [contentHeight, setContentHeight] = useState<number>(0);

  const isA4 = paperSize === "a4";
  const targetWidth = isA4 ? 794 : 816;
  const heightRatio = isA4 ? 297 / 210 : 11 / 8.5;
  const singlePageHeight =
    propSinglePageHeight && propSinglePageHeight > 0
      ? propSinglePageHeight
      : Math.round(targetWidth * heightRatio);

  const marginOffset = useMemo(() => {
    switch (pageMargin) {
      case "compact":
        return 22;
      case "spacious":
        return 42;
      case "normal":
      default:
        return 30;
    }
  }, [pageMargin]);

  useEffect(() => {
    if (!enabled) return;
    const el = paperRef.current;
    if (!el) return;

    const measure = () => {
      // Measure only the content root or template container, ignoring all overlays
      const contentEl = el.querySelector(
        "#document-content-root, #resume-modern-template, #resume-professional-template, #resume-creative-template, #cover-letter-document",
      ) as HTMLElement | null;

      if (contentEl) {
        const height = contentEl.scrollHeight || contentEl.offsetHeight;
        setContentHeight(height);
      } else {
        setContentHeight(el.clientHeight);
      }
    };

    measure();

    const targetEl =
      (el.querySelector("#document-content-root") as HTMLElement | null) || el;
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(targetEl);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [paperRef, paperSize, enabled, fontSize, pageMargin, singlePageHeight]);

  const totalPages = useMemo(() => {
    if (singlePageHeight <= 0 || contentHeight <= 0) return 1;
    // Use 4px buffer to avoid sub-pixel layout rounding adding an empty page
    return Math.max(1, Math.ceil((contentHeight - 4) / singlePageHeight));
  }, [singlePageHeight, contentHeight]);

  if (!enabled || singlePageHeight <= 0) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      id="document-page-numbers-overlay"
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      style={{ height: `${totalPages * singlePageHeight}px` }}
    >
      {pages.map((pageNum) => {
        // Position inside the bottom margin zone of page `pageNum`
        const topY = Math.round(pageNum * singlePageHeight - marginOffset);

        return (
          <div
            key={`page-number-${pageNum}`}
            id={`page-number-indicator-${pageNum}`}
            style={{ top: `${topY}px` }}
            className="absolute right-10 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-mono text-stone-600 bg-white/95 px-2.5 py-1 rounded-md border border-stone-300 shadow-2xs backdrop-blur-xs select-none print:bg-transparent print:border-none print:shadow-none print:text-stone-700"
          >
            <span className="font-semibold text-stone-800 print:text-black">
              Page {pageNum}
            </span>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-stone-600">{totalPages}</span>
          </div>
        );
      })}
    </div>
  );
};
