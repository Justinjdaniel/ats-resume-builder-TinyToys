import React, { useState } from "react";
import { MasterProfile, JobDescription, CoverLetter } from "../types";
import { generateTargetedCoverLetter } from "../lib/aiAtsService";
import { exportCoverLetterToDocx } from "../lib/docxExport";
import {
  Sparkles,
  Copy,
  Download,
  Check,
  RefreshCw,
  FileText,
} from "lucide-react";

interface Props {
  profile: MasterProfile;
  jobDescription: JobDescription;
  coverLetter: CoverLetter;
  onUpdateCoverLetter: (cl: CoverLetter) => void;
  apiKey?: string;
}

export const CoverLetterEditor: React.FC<Props> = ({
  profile,
  jobDescription,
  coverLetter,
  onUpdateCoverLetter,
  apiKey,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<"modern" | "executive" | "technical">(
    "modern",
  );
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateTargetedCoverLetter(
        profile,
        jobDescription,
        apiKey,
        tone,
      );
      onUpdateCoverLetter(generated);
    } catch (e) {
      console.error("Error generating cover letter:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleParagraphChange = (index: number, text: string) => {
    const newParagraphs = [...coverLetter.bodyParagraphs];
    newParagraphs[index] = text;
    onUpdateCoverLetter({
      ...coverLetter,
      bodyParagraphs: newParagraphs,
      updatedAt: new Date().toISOString(),
    });
  };

  const addParagraph = () => {
    onUpdateCoverLetter({
      ...coverLetter,
      bodyParagraphs: [
        ...coverLetter.bodyParagraphs,
        "I would appreciate the opportunity to discuss my qualifications in detail.",
      ],
    });
  };

  const removeParagraph = (index: number) => {
    onUpdateCoverLetter({
      ...coverLetter,
      bodyParagraphs: coverLetter.bodyParagraphs.filter((_, i) => i !== index),
    });
  };

  const copyToClipboard = () => {
    const fullText = `${coverLetter.salutation}\n\n${coverLetter.bodyParagraphs.join("\n\n")}\n\n${coverLetter.signOff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDocx = () => {
    exportCoverLetterToDocx(profile, coverLetter);
  };

  return (
    <div id="cover-letter-editor-pane" className="space-y-4">
      {/* Controls & AI Generator Card */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-700" />
              <h3 className="text-sm font-semibold text-stone-900">
                Cover Letter Synthesis
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Targeted to{" "}
              <span className="font-semibold text-stone-800">
                {jobDescription.title || "Target Role"}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-stone-800">
                {jobDescription.company || "Target Company"}
              </span>
              .
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-cover-letter"
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-700 font-medium transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy Text"}</span>
            </button>
            <button
              id="btn-download-cl-docx"
              onClick={downloadDocx}
              className="flex items-center gap-1 text-xs px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-700 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.docx)</span>
            </button>
          </div>
        </div>

        {/* Tone Selection and Generate Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200/70">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-medium">Tone:</span>
            <div className="flex gap-1">
              {(["modern", "executive", "technical"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`text-xs capitalize px-2.5 py-1 rounded-md border font-medium transition-colors ${
                    tone === t
                      ? "bg-white text-stone-900 border-stone-300 shadow-xs"
                      : "border-transparent text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-generate-ai-cl"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded-lg font-medium transition-colors shadow-xs disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-stone-300" />
            )}
            <span>
              {isGenerating
                ? "Synthesizing..."
                : apiKey
                  ? "Generate with Gemini AI"
                  : "Generate Targeted Letter"}
            </span>
          </button>
        </div>

        {/* Edit fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={coverLetter.recipientName || ""}
              onChange={(e) =>
                onUpdateCoverLetter({
                  ...coverLetter,
                  recipientName: e.target.value,
                })
              }
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50"
              placeholder="e.g. Hiring Committee"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Recipient Title / Organization
            </label>
            <input
              type="text"
              value={coverLetter.recipientTitle || ""}
              onChange={(e) =>
                onUpdateCoverLetter({
                  ...coverLetter,
                  recipientTitle: e.target.value,
                })
              }
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50"
              placeholder="e.g. Engineering Leadership"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Salutation
          </label>
          <input
            type="text"
            value={coverLetter.salutation}
            onChange={(e) =>
              onUpdateCoverLetter({
                ...coverLetter,
                salutation: e.target.value,
              })
            }
            className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50"
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800">
              Body Paragraphs ({coverLetter.bodyParagraphs.length})
            </span>
            <button
              onClick={addParagraph}
              className="text-xs text-stone-700 hover:text-stone-900 font-medium"
            >
              + Add Paragraph
            </button>
          </div>

          {coverLetter.bodyParagraphs.map((para, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>Paragraph {idx + 1}</span>
                {coverLetter.bodyParagraphs.length > 1 && (
                  <button
                    onClick={() => removeParagraph(idx)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={para}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                className="w-full text-xs p-3 border border-stone-200 rounded-lg bg-stone-50/40 focus:outline-none focus:ring-1 focus:ring-stone-400 leading-relaxed"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Sign-off
          </label>
          <input
            type="text"
            value={coverLetter.signOff}
            onChange={(e) =>
              onUpdateCoverLetter({ ...coverLetter, signOff: e.target.value })
            }
            className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50"
          />
        </div>
      </div>
    </div>
  );
};
