import React, { useState, useRef } from "react";
import {
  MasterProfile,
  CoverLetter,
  AppSettings,
  TemplateTheme,
  PaperSize,
} from "../../types";
import { ModernTemplate } from "../templates/ModernTemplate";
import { ProfessionalTemplate } from "../templates/ProfessionalTemplate";
import { CreativeTemplate } from "../templates/CreativeTemplate";
import { CoverLetterDocument } from "../templates/CoverLetterDocument";
import { PageBreakIndicator } from "../PageBreakIndicator";
import { DocumentPageNumbers } from "../DocumentPageNumbers";
import { exportElementToImage } from "../../lib/imageExport";
import { exportDocumentToPdf } from "../../lib/pdfExport";
import { useSafePageBreakMargins } from "../../lib/useSafePageBreakMargins";
import {
  exportResumeToDocx,
  exportCoverLetterToDocx,
  formatResumeAsMarkdown,
  formatResumeAsPlainText,
  triggerFileDownload,
} from "../../lib/docxExport";
import {
  DownloadCloud,
  FileText,
  Printer,
  Image,
  FileCode,
  Layers,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Check,
  Hash,
  Type,
  Scissors,
  Sparkles,
  CheckCircle2,
  Maximize2,
  ShieldCheck,
  FileDown,
} from "lucide-react";

interface Props {
  profile: MasterProfile;
  coverLetter: CoverLetter | null;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const Step5StyleAndExport: React.FC<Props> = ({
  profile,
  coverLetter,
  settings,
  onUpdateSettings,
  onBack,
}) => {
  const [docView, setDocView] = useState<"resume" | "coverLetter">("resume");
  const [zoomLevel, setZoomLevel] = useState(0.9);
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  // Paper Dimension styling
  const isA4 = settings.paperSize === "a4";
  const targetPaperWidth = isA4 ? 794 : 816; // Standard 96 DPI CSS pixels for physical sheets (A4: 210mm, Letter: 8.5in)
  const paperDimensionsMm = isA4
    ? "210mm × 297mm (A4)"
    : "8.5in × 11in (US Letter)";
  const pageHeightRatio = isA4 ? 297 / 210 : 11 / 8.5;
  const singlePageHeight = targetPaperWidth * pageHeightRatio;

  // Enforce safe top/bottom margins on every page when page breaks are on
  const { marginMm } = useSafePageBreakMargins({
    paperRef,
    enabled: showPageBreaks,
    singlePageHeight,
    pageMargin: settings.pageMargin,
    dependencies: [
      profile,
      coverLetter,
      settings.selectedTemplate,
      settings.fontSize,
      settings.paperSize,
      settings.pageMargin,
      docView,
      showPageBreaks,
    ],
  });

  // Export handlers
  const handleExportImage = async () => {
    if (!paperRef.current) return;
    setIsExporting(true);
    setExportStatus("Rendering high-resolution image...");
    try {
      const filename =
        docView === "resume"
          ? `${profile.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.png`
          : `${profile.personalInfo.fullName.replace(/\s+/g, "_")}_CoverLetter.png`;
      await exportElementToImage(paperRef.current, filename);
      setExportStatus("Image downloaded successfully!");
      setTimeout(() => setExportStatus(null), 4000);
    } catch (err: any) {
      setExportStatus(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!paperRef.current) return;
    setIsExporting(true);
    setExportStatus("Rendering and generating downloadable PDF...");
    try {
      const baseName =
        profile.personalInfo.fullName.trim().replace(/\s+/g, "_") || "Resume";
      const filename =
        docView === "resume"
          ? `${baseName}_Resume.pdf`
          : `${baseName}_CoverLetter.pdf`;

      await exportDocumentToPdf({
        element: paperRef.current,
        filename,
        paperSize: settings.paperSize,
        pageMargin: settings.pageMargin,
      });

      setExportStatus("PDF file downloaded successfully!");
      setTimeout(() => setExportStatus(null), 4000);
    } catch (err: any) {
      console.error("PDF export failed:", err);
      setExportStatus(
        `PDF generation failed: ${err.message || "Error creating PDF"}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    setExportStatus("Generating Word (.docx) document...");
    try {
      if (docView === "coverLetter" && coverLetter) {
        await exportCoverLetterToDocx(
          profile,
          coverLetter,
          settings.paperSize,
          settings.pageMargin,
        );
      } else {
        await exportResumeToDocx(
          profile,
          settings.selectedTemplate,
          settings.paperSize,
          settings.pageMargin,
        );
      }
      setExportStatus("Word document downloaded successfully!");
      setTimeout(() => setExportStatus(null), 4000);
    } catch (err: any) {
      setExportStatus(`Word export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = () => {
    const md = formatResumeAsMarkdown(profile);
    const blob = new Blob([md], { type: "text/markdown" });
    triggerFileDownload(
      blob,
      `${profile.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.md`,
    );
    setExportStatus("Markdown file downloaded!");
    setTimeout(() => setExportStatus(null), 3000);
  };

  return (
    <div id="step-5-style-and-export" className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                5
              </span>
              <h2 className="text-base font-bold text-stone-900">
                Select Style &amp; Export Document
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Choose your design archetype, calibrate document density, and
              export in your preferred format: High-Res Image (PNG), Vector PDF,
              or Microsoft Word (.docx).
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to ATS Match</span>
          </button>
        </div>

        {/* Style Selector & Format Toolbar */}
        <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Section 1: Style Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-700" />
              <span>1. Choose Document Style:</span>
            </div>

            {/* Template Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: "modern" as TemplateTheme,
                  name: "Modern ATS",
                  desc: "Single-col clean",
                },
                {
                  id: "professional" as TemplateTheme,
                  name: "Executive",
                  desc: "Classic serif",
                },
                {
                  id: "creative" as TemplateTheme,
                  name: "Sidebar",
                  desc: "Split layout",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  id={`btn-style-${t.id}`}
                  onClick={() => onUpdateSettings({ selectedTemplate: t.id })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.selectedTemplate === t.id
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                  }`}
                >
                  <div className="text-xs font-bold">{t.name}</div>
                  <div
                    className={`text-[10px] ${settings.selectedTemplate === t.id ? "text-stone-300" : "text-stone-500"}`}
                  >
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Styling Modifiers */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Font Size */}
              <div className="flex items-center bg-stone-100 rounded-md p-0.5 border border-stone-200 text-xs">
                <span className="text-[11px] font-medium text-stone-500 px-1.5 flex items-center gap-1">
                  <Type className="w-3 h-3 text-stone-400" />
                  <span>Font:</span>
                </span>
                {(["sm", "base", "lg"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ fontSize: size })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      settings.fontSize === size
                        ? "bg-white text-stone-900 font-bold shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {size === "sm" ? "Sm" : size === "base" ? "Base" : "Lg"}
                  </button>
                ))}
              </div>

              {/* Paper Size */}
              <div className="flex items-center bg-stone-100 rounded-md p-0.5 border border-stone-200 text-xs">
                {(["a4", "letter"] as const).map((ps) => (
                  <button
                    key={ps}
                    onClick={() => onUpdateSettings({ paperSize: ps })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase transition-colors cursor-pointer ${
                      settings.paperSize === ps
                        ? "bg-white text-stone-900 font-bold shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {ps}
                  </button>
                ))}
              </div>

              {/* Page Number Toggle */}
              <button
                onClick={() =>
                  onUpdateSettings({
                    showPageNumbers: !settings.showPageNumbers,
                  })
                }
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
                  settings.showPageNumbers
                    ? "bg-stone-900 text-white border-stone-800"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                }`}
              >
                <Hash className="w-3 h-3" />
                <span>Page # ({settings.showPageNumbers ? "ON" : "OFF"})</span>
              </button>

              {/* Page Margin Selector */}
              <div className="flex items-center bg-stone-100 rounded-md p-0.5 border border-stone-200 text-xs">
                <span
                  className="text-[11px] font-medium text-stone-500 px-1.5 flex items-center gap-1"
                  title="Top & bottom margins between printed pages"
                >
                  <Maximize2 className="w-3 h-3 text-stone-400" />
                  <span>Margins:</span>
                </span>
                {(
                  [
                    { id: "compact", label: '0.4"', tip: "10mm Compact" },
                    { id: "normal", label: '0.6"', tip: "15mm Standard ATS" },
                    { id: "spacious", label: '0.8"', tip: "20mm Executive" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onUpdateSettings({ pageMargin: m.id })}
                    title={m.tip}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      (settings.pageMargin || "normal") === m.id
                        ? "bg-white text-stone-900 font-bold shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Format Selection & Export Actions */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <DownloadCloud className="w-3.5 h-3.5 text-stone-700" />
              <span>2. Select Export Format:</span>
            </div>

            {/* Export Format Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {/* IMAGE Export */}
              <button
                id="btn-export-image"
                onClick={handleExportImage}
                disabled={isExporting}
                className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl text-left transition-all hover:shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Image className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                    PNG
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-900">
                  Image File
                </div>
                <div className="text-[10px] text-stone-500">
                  2x Retina Image
                </div>
              </button>

              {/* PDF Export */}
              <button
                id="btn-export-pdf"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="p-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-left transition-all shadow-xs cursor-pointer group disabled:opacity-60"
              >
                <div className="flex items-center justify-between mb-1">
                  <FileDown className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300 px-1.5 py-0.2 rounded">
                    PDF
                  </span>
                </div>
                <div className="text-xs font-bold text-white">Download PDF</div>
                <div className="text-[10px] text-stone-300">
                  Clean Vector .pdf file
                </div>
              </button>

              {/* DOCX Export */}
              <button
                id="btn-export-doc"
                onClick={handleExportDocx}
                disabled={isExporting}
                className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl text-left transition-all hover:shadow-xs cursor-pointer group disabled:opacity-60"
              >
                <div className="flex items-center justify-between mb-1">
                  <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    DOCX
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-900">Word DOC</div>
                <div className="text-[10px] text-stone-500">
                  Editable Microsoft Word
                </div>
              </button>
            </div>

            {/* Direct print link */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={handlePrint}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline decoration-dotted flex items-center gap-1 transition-colors cursor-pointer"
                title="Open browser system print dialog"
              >
                <Printer className="w-3 h-3 text-stone-400" />
                <span>Or open browser print dialog (Ctrl/Cmd + P)</span>
              </button>
            </div>

            {/* Document Switcher if Cover Letter exists */}
            {coverLetter && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-stone-500 font-medium">Previewing:</span>
                <button
                  onClick={() => setDocView("resume")}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    docView === "resume"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  Curated Resume / CV
                </button>
                <button
                  onClick={() => setDocView("coverLetter")}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    docView === "coverLetter"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  Cover Letter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status notification banner */}
        {exportStatus && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{exportStatus}</span>
          </div>
        )}
      </div>

      {/* Live Physical Canvas Area */}
      <div className="bg-stone-200/80 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-start border border-stone-300 min-h-[600px] overflow-x-auto">
        {/* Canvas Toolbar */}
        <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 mb-4 text-xs text-stone-700 no-print">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-stone-900">
              {docView === "resume"
                ? "Live Physical Resume Preview"
                : "Live Cover Letter Preview"}
            </span>
            <span>•</span>
            <span className="font-mono text-stone-500">
              {paperDimensionsMm}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Page Break toggle */}
            <button
              onClick={() => setShowPageBreaks(!showPageBreaks)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
                showPageBreaks
                  ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
              }`}
              title="Toggle multi-page breaks with automatic safe margin protection"
            >
              <Scissors className="w-3 h-3" />
              <span>Page Breaks ({showPageBreaks ? "ON" : "OFF"})</span>
            </button>

            {showPageBreaks && (
              <span
                className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium"
                title="Automatic safe margin alignment active to prevent clipping"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Auto-Aligned ({marginMm}mm Safe Margins)</span>
              </span>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white rounded-md border border-stone-300 p-0.5">
              <button
                onClick={() =>
                  setZoomLevel((prev) =>
                    Math.max(0.6, Math.round((prev - 0.1) * 10) / 10),
                  )
                }
                className="p-1 hover:bg-stone-100 rounded text-stone-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() =>
                  setZoomLevel((prev) =>
                    Math.min(1.2, Math.round((prev + 0.1) * 10) / 10),
                  )
                }
                className="p-1 hover:bg-stone-100 rounded text-stone-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1.0)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  Math.abs(zoomLevel - 1.0) < 0.01
                    ? "bg-stone-900 text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
                title="Reset to 100% 1:1 Physical Scale"
              >
                100% (1:1)
              </button>
            </div>
          </div>
        </div>

        {/* The True-to-Size Document Paper */}
        <div
          id="document-paper-sheet"
          ref={paperRef}
          style={{
            width: `${targetPaperWidth}px`,
            minWidth: `${targetPaperWidth}px`,
            maxWidth: `${targetPaperWidth}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            minHeight: `${Math.round(singlePageHeight)}px`,
            marginBottom: `${Math.max(48, Math.round(singlePageHeight * (zoomLevel - 1)) + 48)}px`,
          }}
          className="bg-white rounded-md shadow-2xl border border-stone-300/80 transition-transform duration-150 relative"
        >
          {/* Page Breaks Overlay */}
          <PageBreakIndicator
            paperRef={paperRef}
            paperSize={settings.paperSize}
            singlePageHeight={singlePageHeight}
            enabled={showPageBreaks}
            fontSize={settings.fontSize}
            pageMargin={settings.pageMargin}
            onFitToOnePage={() => onUpdateSettings({ fontSize: "sm" })}
          />

          {/* Optional Page Numbering */}
          <DocumentPageNumbers
            paperRef={paperRef}
            paperSize={settings.paperSize}
            singlePageHeight={singlePageHeight}
            enabled={!!settings.showPageNumbers}
            fontSize={settings.fontSize}
            pageMargin={settings.pageMargin}
          />

          {/* Template Content */}
          <div id="document-content-root" className="w-full">
            {docView === "resume" ? (
              settings.selectedTemplate === "modern" ? (
                <ModernTemplate
                  profile={profile}
                  fontSize={settings.fontSize}
                  pageMargin={settings.pageMargin}
                />
              ) : settings.selectedTemplate === "professional" ? (
                <ProfessionalTemplate
                  profile={profile}
                  fontSize={settings.fontSize}
                  pageMargin={settings.pageMargin}
                />
              ) : (
                <CreativeTemplate
                  profile={profile}
                  fontSize={settings.fontSize}
                  pageMargin={settings.pageMargin}
                />
              )
            ) : coverLetter ? (
              <CoverLetterDocument
                profile={profile}
                coverLetter={coverLetter}
                fontSize={settings.fontSize}
                pageMargin={settings.pageMargin}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
