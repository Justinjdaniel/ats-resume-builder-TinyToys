import React, { useState, useEffect, useMemo } from "react";
import { Scissors, SeparatorHorizontal, ShieldCheck } from "lucide-react";
import { PaperSize, PageMargin } from "../types";

interface PageBreakIndicatorProps {
  paperRef: React.RefObject<HTMLDivElement | null>;
  paperSize: PaperSize;
  singlePageHeight?: number;
  enabled: boolean;
  fontSize?: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
  onFitToOnePage?: () => void;
}

export const PageBreakIndicator: React.FC<PageBreakIndicatorProps> = ({
  paperRef,
  paperSize,
  singlePageHeight: propSinglePageHeight,
  enabled,
  fontSize = "base",
  pageMargin = "normal",
  onFitToOnePage,
}) => {
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Standard aspect ratios
  const isA4 = paperSize === "a4";
  const targetWidth = isA4 ? 794 : 816;
  const heightRatio = isA4 ? 297 / 210 : 11 / 8.5;
  const singlePageHeight =
    propSinglePageHeight && propSinglePageHeight > 0
      ? propSinglePageHeight
      : Math.round(targetWidth * heightRatio);

  // Margin in pixels (approx 96 DPI scale)
  const marginPx = useMemo(() => {
    switch (pageMargin) {
      case "compact":
        return 38;
      case "spacious":
        return 76;
      case "normal":
      default:
        return 56;
    }
  }, [pageMargin]);

  const marginMm = useMemo(() => {
    switch (pageMargin) {
      case "compact":
        return 10;
      case "spacious":
        return 20;
      case "normal":
      default:
        return 15;
    }
  }, [pageMargin]);

  // Measure paper container dimensions focusing purely on content elements
  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;

    const measure = () => {
      // Find the actual document template container, ignoring overlays
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
  }, [paperRef, paperSize, fontSize, pageMargin, singlePageHeight]);

  // Total pages calculation with 4px sub-pixel tolerance
  const totalPages = useMemo(() => {
    if (singlePageHeight <= 0 || contentHeight <= 0) return 1;
    return Math.max(1, Math.ceil((contentHeight - 4) / singlePageHeight));
  }, [singlePageHeight, contentHeight]);

  const pageFillRatio = useMemo(() => {
    if (singlePageHeight <= 0) return 0;
    if (contentHeight <= singlePageHeight) {
      return Math.min(100, (contentHeight / singlePageHeight) * 100);
    }
    const currentOver = contentHeight % singlePageHeight;
    return Math.min(
      100,
      ((currentOver === 0 ? singlePageHeight : currentOver) /
        singlePageHeight) *
        100,
    );
  }, [contentHeight, singlePageHeight]);

  if (!enabled || singlePageHeight <= 0) {
    return null;
  }

  // Generate page break positions
  // For totalPages = 2:
  // i = 1: Inter-page break at 1 * singlePageHeight (boundary between Page 1 and Page 2)
  // i = 2: End-of-document boundary at 2 * singlePageHeight
  const breaks = [];
  for (let i = 1; i <= totalPages; i++) {
    breaks.push({
      pageNumber: i,
      positionY: i * singlePageHeight,
      isEndOfDocument: i === totalPages,
    });
  }

  return (
    <div
      id="page-break-guides-overlay"
      className="no-print pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{ height: `${totalPages * singlePageHeight}px` }}
    >
      {/* Render each page boundary and margin zone */}
      {breaks.map((b) => {
        const isInterPageBreak = !b.isEndOfDocument;

        return (
          <div key={`page-boundary-group-${b.pageNumber}`}>
            {/* Visual Page Margin Zones (Top & Bottom buffer areas) - ONLY between actual pages */}
            {isInterPageBreak && (
              <>
                {/* Page N Bottom Margin Zone */}
                <div
                  style={{
                    top: `${b.positionY - marginPx}px`,
                    height: `${marginPx}px`,
                  }}
                  className="absolute left-0 right-0 bg-emerald-500/[0.02] border-t border-dashed border-emerald-500/35 pointer-events-none flex items-start justify-between px-4"
                >
                  <span className="text-[10px] font-mono text-emerald-800 bg-white/90 border border-emerald-300/80 rounded px-1.5 py-0.5 mt-1 shadow-2xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>
                      Page {b.pageNumber} Bottom Margin ({marginMm}mm safe zone)
                    </span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700/80 mt-1 hidden sm:inline font-medium">
                    Protected printable boundary
                  </span>
                </div>

                {/* Page N+1 Top Margin Zone */}
                <div
                  style={{
                    top: `${b.positionY}px`,
                    height: `${marginPx}px`,
                  }}
                  className="absolute left-0 right-0 bg-emerald-500/[0.02] border-b border-dashed border-emerald-500/35 pointer-events-none flex items-end justify-between px-4"
                >
                  <span className="text-[10px] font-mono text-emerald-800 bg-white/90 border border-emerald-300/80 rounded px-1.5 py-0.5 mb-1 shadow-2xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>
                      Page {b.pageNumber + 1} Top Margin ({marginMm}mm safe
                      zone)
                    </span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700/80 mb-1 hidden sm:inline font-medium">
                    Printable content resumes safely
                  </span>
                </div>
              </>
            )}

            {/* Central Page Cut Divider Line */}
            <div
              id={`visual-page-break-${b.pageNumber}`}
              style={{ top: `${b.positionY}px` }}
              className="absolute left-0 right-0 -translate-y-1/2 flex flex-col items-center select-none"
            >
              <div className="w-full flex items-center">
                {/* Left Line */}
                <div
                  className={`h-0 flex-1 border-b-2 ${
                    isInterPageBreak
                      ? "border-dashed border-indigo-500/90 shadow-2xs"
                      : "border-dashed border-stone-300/80"
                  }`}
                />

                {/* Central Badge */}
                <div
                  className={`mx-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-xs tracking-tight transition-all ${
                    isInterPageBreak
                      ? "bg-stone-900 text-stone-100 border border-stone-700 ring-2 ring-indigo-500/20"
                      : "bg-stone-100 text-stone-600 border border-stone-300/90"
                  }`}
                >
                  {isInterPageBreak ? (
                    <>
                      <Scissors className="w-3.5 h-3.5 text-indigo-400 -rotate-90 shrink-0" />
                      <span>PAGE {b.pageNumber} CUT LINE</span>
                      <span className="text-stone-400 font-normal">|</span>
                      <span className="text-indigo-300">
                        STARTS PAGE {b.pageNumber + 1}
                      </span>
                    </>
                  ) : (
                    <>
                      <SeparatorHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>
                        END OF DOCUMENT ({totalPages}{" "}
                        {totalPages === 1 ? "PAGE" : "PAGES"})
                      </span>
                    </>
                  )}
                </div>

                {/* Right Line */}
                <div
                  className={`h-0 flex-1 border-b-2 ${
                    isInterPageBreak
                      ? "border-dashed border-indigo-500/90 shadow-2xs"
                      : "border-dashed border-stone-300/80"
                  }`}
                />
              </div>

              {/* Status Pill for 2-page documents close to 1-page fit */}
              {isInterPageBreak &&
                b.pageNumber === 1 &&
                totalPages === 2 &&
                pageFillRatio < 35 &&
                onFitToOnePage && (
                  <div className="pointer-events-auto mt-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-2 shadow-sm animate-pulse">
                    <span>
                      Only ~{Math.round(pageFillRatio)}% of Page 2 used.
                    </span>
                    <button
                      onClick={onFitToOnePage}
                      className="underline font-bold text-amber-900 hover:text-amber-950 cursor-pointer"
                    >
                      Fit to 1 page?
                    </button>
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
