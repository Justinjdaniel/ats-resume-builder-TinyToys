import React, { useState, useRef } from "react";
import { JobDescription } from "../../types";
import { extractKeywordsFromText } from "../../lib/aiAtsService";
import { extractTextFromFile } from "../../lib/fileParser";
import {
  Briefcase,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  MailCheck,
  FileQuestion,
} from "lucide-react";

interface Props {
  jobDescription: JobDescription;
  onUpdateJd: (jd: JobDescription) => void;
  requireCoverLetter: boolean;
  onToggleRequireCoverLetter: (enabled: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_JDS = [
  {
    title: "Staff Distributed Systems Engineer",
    company: "Fintech Scaleup",
    text: `About the Role:
We are looking for a Staff Distributed Systems Engineer to architect and scale our real-time core processing platform. You will lead cross-functional architecture across Kubernetes, Go, TypeScript, Kafka, and Redis, sustaining 99.999% availability with microsecond latency.

Requirements:
- 7+ years building high-throughput distributed architectures, microservices, and event-driven data pipelines.
- Production mastery with Go, TypeScript, Node.js, Kubernetes, Docker, and AWS / GCP cloud platforms.
- Deep expertise in PostgreSQL, Redis caching, Kafka streaming, and OpenTelemetry observability.
- Proven leadership driving Zero-Trust security, CI/CD pipeline automation, and mentoring engineering leads.`,
  },
  {
    title: "Senior Full-Stack Engineer",
    company: "Cloud Platform Corp",
    text: `About the Role:
Seeking an experienced Senior Full-Stack Engineer to lead frontend and backend web experiences. You will design scalable React and Next.js applications, TypeScript microservices, and GraphQL APIs.

Requirements:
- 5+ years experience with React, TypeScript, Tailwind CSS, Node.js, and modern SPA performance optimization.
- Strong knowledge of REST and GraphQL APIs, PostgreSQL, Docker, and CI/CD pipelines.
- Commitment to web accessibility, responsive engineering, and rigorous automated testing.`,
  },
  {
    title: "AI / ML Platform Engineer",
    company: "Nexus Intelligence",
    text: `About the Role:
Join our AI platform team deploying large language models, retrieval-augmented generation (RAG) pipelines, and low-latency inference services.

Requirements:
- Strong engineering experience with Python, TypeScript, PyTorch, Vector Databases, Docker, and Kubernetes.
- Experience building production LLM integrations, function calling agents, and scalable microservices.
- Experience with cloud infrastructure (GCP/AWS), observability, and system reliability.`,
  },
];

export const Step2JobDescription: React.FC<Props> = ({
  jobDescription,
  onUpdateJd,
  requireCoverLetter,
  onToggleRequireCoverLetter,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "file" | "presets">(
    "text",
  );
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileMessage, setFileMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (field: keyof JobDescription, val: string) => {
    const updated = {
      ...jobDescription,
      [field]: val,
    };
    if (field === "rawText") {
      updated.parsedKeywords = extractKeywordsFromText(val);
    }
    onUpdateJd(updated);
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessingFile(true);
    setFileMessage(null);
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length === 0) {
        throw new Error("Could not extract readable text from this file.");
      }
      const keywords = extractKeywordsFromText(text);

      // Attempt title extraction from first line
      const firstLine = text
        .split("\n")[0]
        ?.replace(/^#+\s*/, "")
        .trim();
      const detectedTitle =
        firstLine && firstLine.length < 60 ? firstLine : jobDescription.title;

      onUpdateJd({
        ...jobDescription,
        title: detectedTitle,
        rawText: text,
        parsedKeywords: keywords,
      });
      setFileMessage(
        `Extracted job description from ${file.name} with ${keywords.length} relevant keywords!`,
      );
    } catch (err: any) {
      setFileMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const applyPreset = (preset: (typeof PRESET_JDS)[0]) => {
    const keywords = extractKeywordsFromText(preset.text);
    onUpdateJd({
      ...jobDescription,
      title: preset.title,
      company: preset.company,
      rawText: preset.text,
      parsedKeywords: keywords,
    });
    setActiveTab("text");
  };

  const keywords =
    jobDescription.parsedKeywords.length > 0
      ? jobDescription.parsedKeywords
      : extractKeywordsFromText(jobDescription.rawText);

  return (
    <div id="step-2-job-description" className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-base font-bold text-stone-900">
                Target Job Description &amp; Options
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Provide the job description for the role you want to apply for. In
              Step 3, AI will analyze this JD alongside your master data to
              generate a tailored, ATS-optimized CV.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={onNext}
              disabled={!jobDescription.rawText.trim()}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-md font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <span>Next: AI Curation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input Method Selector Tabs */}
        <div className="flex border-b border-stone-200 mt-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "text"
                ? "border-stone-900 text-stone-900 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste / Type Job Description</span>
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`px-4 py-2 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "file"
                ? "border-stone-900 text-stone-900 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload JD File (PDF/DOCX/MD/TXT)</span>
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-4 py-2 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "presets"
                ? "border-stone-900 text-stone-900 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sample Role Presets</span>
          </button>
        </div>

        {/* Tab 1: Text Input */}
        {activeTab === "text" && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={jobDescription.title}
                  onChange={(e) => handleTextChange("title", e.target.value)}
                  placeholder="e.g. Staff Distributed Systems Engineer"
                  className="w-full text-xs font-medium p-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Target Company
                </label>
                <input
                  type="text"
                  value={jobDescription.company}
                  onChange={(e) => handleTextChange("company", e.target.value)}
                  placeholder="e.g. Stripe, Google, Acme Tech"
                  className="w-full text-xs font-medium p-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Job Description Text (Responsibilities, Requirements &amp;
                Stack)
              </label>
              <textarea
                rows={9}
                value={jobDescription.rawText}
                onChange={(e) => handleTextChange("rawText", e.target.value)}
                placeholder="Paste the full job posting, required qualifications, technical stack, and responsibilities here..."
                className="w-full text-xs font-mono p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 leading-relaxed resize-y"
              />
            </div>
          </div>
        )}

        {/* Tab 2: File Upload */}
        {activeTab === "file" && (
          <div className="mt-4 space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-xl p-8 text-center bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.md,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-8 h-8 mx-auto text-stone-500 mb-2" />
              <div className="text-sm font-semibold text-stone-800">
                Click to Upload Job Description Document
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Upload a job specification PDF, Word (.docx), Markdown, or text
                file.
              </div>
            </div>

            {fileMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{fileMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Presets */}
        {activeTab === "presets" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_JDS.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl cursor-pointer transition-colors flex flex-col justify-between"
                onClick={() => applyPreset(p)}
              >
                <div>
                  <div className="font-semibold text-xs text-stone-900">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-stone-500 mb-2">
                    {p.company}
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-3 leading-relaxed">
                    {p.text}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full py-1.5 bg-white border border-stone-300 hover:bg-stone-900 hover:text-white rounded text-xs font-medium text-stone-700 transition-colors"
                >
                  Select this Role
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Extracted Keywords Preview */}
        {keywords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Detected Core Keywords ({keywords.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-stone-50 rounded-lg border border-stone-200">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white border border-stone-300 rounded text-[11px] font-medium text-stone-800"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* REQUIRED COVER LETTER TOGGLE SECTION (User's explicit requirement) */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${requireCoverLetter ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500"}`}
            >
              <MailCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  Require Cover Letter
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    requireCoverLetter
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {requireCoverLetter ? "Enabled" : "Optional (Skipped)"}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                {requireCoverLetter
                  ? "Cover letter generation is active. In Step 3, AI will craft a high-converting, tailored cover letter customized specifically for this role and company."
                  : "Cover letter is currently turned OFF. Cover letters are optional for many modern applications. AI will focus strictly on generating an ATS-optimized CV unless enabled."}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            id="toggle-require-cover-letter"
            type="button"
            role="switch"
            aria-checked={requireCoverLetter}
            onClick={() => onToggleRequireCoverLetter(!requireCoverLetter)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              requireCoverLetter ? "bg-stone-900" : "bg-stone-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                requireCoverLetter ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bottom Step Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Info</span>
        </button>
        <button
          onClick={onNext}
          disabled={!jobDescription.rawText.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <span>Continue to Step 3: AI Curation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
