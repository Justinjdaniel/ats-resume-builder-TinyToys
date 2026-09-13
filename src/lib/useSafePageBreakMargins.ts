import React, { useEffect, useCallback, useRef } from "react";
import { PageMargin } from "../types";

interface SafeMarginOptions {
  paperRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  singlePageHeight: number;
  pageMargin?: PageMargin;
  dependencies?: any[];
}

export const getMarginPx = (pageMargin: PageMargin = "normal"): number => {
  switch (pageMargin) {
    case "compact":
      return 38; // ~10mm
    case "spacious":
      return 76; // ~20mm
    case "normal":
    default:
      return 56; // ~15mm (Standard ATS)
  }
};

export const getMarginMm = (pageMargin: PageMargin = "normal"): number => {
  switch (pageMargin) {
    case "compact":
      return 10;
    case "spacious":
      return 20;
    case "normal":
    default:
      return 15;
  }
};

/**
 * Hook to automatically align content across pages to avoid page break clipping.
 *
 * Instead of showing manual warning notices, this hook automatically calculates
 * the physical page boundaries and safe margin limits. When any content block
 * (job experience, bullet list, project, education, or section header) would cross
 * the page cut line or encroach into the bottom safe margin zone, it automatically
 * aligns it to start cleanly at the top safe margin of the next page.
 *
 * It also prevents orphan headings (headings left alone at the bottom of a page
 * with no content following them) by automatically moving them to the next page.
 */
export function useSafePageBreakMargins({
  paperRef,
  enabled,
  singlePageHeight,
  pageMargin = "normal",
  dependencies = [],
}: SafeMarginOptions) {
  const marginPx = getMarginPx(pageMargin);
  const isAligningRef = useRef(false);

  const applySafeMargins = useCallback(() => {
    const container = paperRef.current;
    if (!container) return;

    // Avoid recursive observer triggers while applying shifts
    if (isAligningRef.current) return;
    isAligningRef.current = true;

    try {
      // 1. Reset all previously applied alignment shifts to restore natural DOM flow
      const previouslyShifted = Array.from(
        container.querySelectorAll(".page-break-shifted, [data-applied-shift]"),
      ) as HTMLElement[];

      for (const el of previouslyShifted) {
        el.style.marginTop = el.dataset.originalMarginTop || "";
        delete el.dataset.appliedShift;
        delete el.dataset.originalMarginTop;
        el.classList.remove("page-break-shifted");
      }

      // If page breaks are disabled, exit after resetting
      if (!enabled || singlePageHeight <= 0) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      // Account for CSS transform zoom (e.g. scale(0.8))
      const scale =
        container.offsetWidth > 0
          ? containerRect.width / container.offsetWidth
          : 1;

      // 2. Identify layout columns (e.g. aside and main in CreativeTemplate, or content root)
      const contentRoot =
        container.querySelector<HTMLElement>("#document-content-root") ||
        container;
      const multiColumns = Array.from(
        contentRoot.querySelectorAll(
          "#resume-creative-template > aside, #resume-creative-template > main",
        ),
      ) as HTMLElement[];
      const targetColumns: HTMLElement[] =
        multiColumns.length >= 2 ? multiColumns : [contentRoot];

      // 3. Align each column independently
      for (const column of targetColumns) {
        // Collect all potential candidate blocks
        const allCandidates = Array.from(
          column.querySelectorAll(
            '[data-page-break-block="true"], .break-inside-avoid, section > h2, section > h3, header',
          ),
        ) as HTMLElement[];

        // Filter to keep only the topmost independent units (avoid nested double-shifting)
        const topBlocks = allCandidates.filter(
          (block) =>
            !allCandidates.some(
              (other) => other !== block && other.contains(block),
            ),
        );

        let currentPage = 1;

        for (let i = 0; i < topBlocks.length; i++) {
          const block = topBlocks[i];
          const rect = block.getBoundingClientRect();
          const relTop = (rect.top - containerTop) / scale;
          const relBottom = (rect.bottom - containerTop) / scale;

          // Advance currentPage if block naturally starts further down
          while (relTop >= currentPage * singlePageHeight) {
            currentPage++;
          }

          const safeBottomLimit = currentPage * singlePageHeight - marginPx;
          const nextPageSafeTop = currentPage * singlePageHeight + marginPx;

          // Check if this block is a section heading
          const isHeading =
            block.tagName === "H2" ||
            block.tagName === "H3" ||
            Boolean(block.querySelector("h2, h3"));

          // Condition 1: Element extends into or across the bottom margin zone of currentPage
          const encroachesBottomMargin =
            relBottom > safeBottomLimit || relTop >= safeBottomLimit;

          // Condition 2: Prevent orphan headings (heading must have at least ~80px of breathing space
          // below it on the current page for following content)
          const isOrphanHeading = isHeading && relTop + 85 > safeBottomLimit;

          if (encroachesBottomMargin || isOrphanHeading) {
            const shift = Math.max(0, Math.round(nextPageSafeTop - relTop));

            if (shift > 0) {
              block.dataset.originalMarginTop = block.style.marginTop || "";
              block.dataset.appliedShift = `${shift}`;
              block.style.marginTop = `${shift}px`;
              block.classList.add("page-break-shifted");
              currentPage++;
            }
          }
        }
      }
    } finally {
      // Release mutex in next animation frame
      requestAnimationFrame(() => {
        isAligningRef.current = false;
      });
    }
  }, [paperRef, enabled, singlePageHeight, marginPx]);

  useEffect(() => {
    // Initial alignment pass after DOM render
    const timeoutId = setTimeout(() => {
      applySafeMargins();
    }, 60);

    const container = paperRef.current;
    if (!container) return () => clearTimeout(timeoutId);

    const targetToObserve =
      container.querySelector<HTMLElement>("#document-content-root") ||
      container;

    const observer = new ResizeObserver(() => {
      if (!isAligningRef.current) {
        applySafeMargins();
      }
    });

    observer.observe(targetToObserve);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [applySafeMargins, ...dependencies]);

  return { marginPx, marginMm: getMarginMm(pageMargin), applySafeMargins };
}
