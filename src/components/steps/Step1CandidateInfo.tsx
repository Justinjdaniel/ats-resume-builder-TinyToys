import React, { useState, useRef } from "react";
import { MasterProfile } from "../../types";
import {
  parseMultipleFilesToMasterData,
  parseResumeTextToProfile,
} from "../../lib/fileParser";
import { DEFAULT_PROFILE } from "../../lib/storage";
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  User,
  Briefcase,
  Code,
  GraduationCap,
  Layers,
  RotateCcw,
} from "lucide-react";

interface Props {
  masterProfile: MasterProfile;
  onUpdateMasterProfile: (profile: MasterProfile) => void;
  onNext: () => void;
}

export const Step1CandidateInfo: React.FC<Props> = ({
  masterProfile,
  onUpdateMasterProfile,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "text" | "review">(
    "upload",
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rawPastedText, setRawPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Multi-file selection
  const handleFilesAdded = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newFileList = [...uploadedFiles, ...fileArray];
    setUploadedFiles(newFileList);
    setIsProcessing(true);
    setStatusMessage(
      `Analyzing ${fileArray.length} file(s) and merging into Master Profile...`,
    );

    try {
      const { profile, fileDetails } = await parseMultipleFilesToMasterData(
        fileArray,
        masterProfile,
      );
      onUpdateMasterProfile(profile);
      setStatusMessage(
        `Successfully analyzed ${fileDetails.length} file(s). Master profile updated with ${profile.experiences.length} experiences and ${profile.skillCategories.flatMap((c) => c.skills).length} skills!`,
      );
    } catch (err: any) {
      setStatusMessage(
        `Error parsing files: ${err.message || "Unknown error"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
  };

  // Handle text parsing
  const handleParseRawText = () => {
    if (!rawPastedText.trim()) return;
    setIsProcessing(true);
    setStatusMessage("Parsing raw text into Master Profile...");
    try {
      const parsed = parseResumeTextToProfile(rawPastedText, masterProfile);
      onUpdateMasterProfile(parsed);
      setStatusMessage("Text successfully parsed into Master Profile!");
      setActiveTab("review");
    } catch (err: any) {
      setStatusMessage(`Error parsing text: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleProfile = () => {
    onUpdateMasterProfile(DEFAULT_PROFILE);
    setStatusMessage(
      "Loaded pre-configured Senior Distributed Systems Architect profile.",
    );
  };

  const totalSkills = masterProfile.skillCategories.flatMap(
    (c) => c.skills,
  ).length;

  return (
    <div id="step-1-candidate-info" className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-base font-bold text-stone-900">
                Candidate Information Ingestion
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Add your experience and background by uploading multiple files
              (PDF, MD, DOCX, TXT) or pasting raw text. AI will analyze and
              synthesize your comprehensive Master Data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSampleProfile}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium transition-colors"
              title="Load full pre-configured sample profile"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Profile</span>
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md font-semibold transition-colors shadow-2xs"
            >
              <span>Next: Job Description</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input Method Selector Tabs */}
        <div className="flex border-b border-stone-200 mt-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "upload"
                ? "border-stone-900 text-stone-900 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Multiple Files ({uploadedFiles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "text"
                ? "border-stone-900 text-stone-900 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste / Type Raw Text</span>
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-4 py-2 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "review"
                ? "border-stone-900 text-stone-900 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>
              Review Master Data ({masterProfile.experiences.length} exp,{" "}
              {totalSkills} skills)
            </span>
          </button>
        </div>

        {/* Tab 1: Multi-file Ingestion Dropzone */}
        {activeTab === "upload" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">
                  Multi-File Client-Side Ingestion:{" "}
                </span>
                You can select or drag multiple files at once (e.g. your older
                resume PDF + LinkedIn export + project docs). All parsing runs
                100% locally in your browser sandbox.
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files)
                  handleFilesAdded(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-xl p-8 text-center bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.md,.txt,.json"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFilesAdded(e.target.files)
                }
              />
              <UploadCloud className="w-8 h-8 mx-auto text-stone-500 mb-2" />
              <div className="text-sm font-semibold text-stone-800">
                Click or Drag & Drop Multiple Files Here
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Supports multiple PDF, MD, DOCX, TXT, or JSON files.
              </div>
            </div>

            {/* List of uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-700">
                  Uploaded Files ({uploadedFiles.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-stone-500 shrink-0" />
                        <span className="font-medium text-stone-800 truncate">
                          {file.name}
                        </span>
                        <span className="text-stone-400 text-[10px]">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploadedFile(idx);
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Raw Text Ingestion */}
        {activeTab === "text" && (
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-semibold text-stone-700">
              Paste Resume, Bio, or Notes (Plain text or Markdown):
            </label>
            <textarea
              rows={8}
              value={rawPastedText}
              onChange={(e) => setRawPastedText(e.target.value)}
              placeholder="Paste your past resume text, LinkedIn profile text, work history highlights, or technical skills list here..."
              className="w-full text-xs font-mono p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 leading-relaxed resize-y"
            />
            <div className="flex justify-end">
              <button
                onClick={handleParseRawText}
                disabled={!rawPastedText.trim() || isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Parse and Merge into Master Data</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Review Master Data */}
        {activeTab === "review" && (
          <div className="mt-4 space-y-4">
            {/* Quick Personal Info Edit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={masterProfile.personalInfo.fullName}
                  onChange={(e) =>
                    onUpdateMasterProfile({
                      ...masterProfile,
                      personalInfo: {
                        ...masterProfile.personalInfo,
                        fullName: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={masterProfile.personalInfo.headline}
                  onChange={(e) =>
                    onUpdateMasterProfile({
                      ...masterProfile,
                      personalInfo: {
                        ...masterProfile.personalInfo,
                        headline: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={masterProfile.personalInfo.email}
                  onChange={(e) =>
                    onUpdateMasterProfile({
                      ...masterProfile,
                      personalInfo: {
                        ...masterProfile.personalInfo,
                        email: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Phone / Location
                </label>
                <input
                  type="text"
                  value={`${masterProfile.personalInfo.phone} | ${masterProfile.personalInfo.location}`}
                  onChange={(e) => {
                    const parts = e.target.value
                      .split("|")
                      .map((s) => s.trim());
                    onUpdateMasterProfile({
                      ...masterProfile,
                      personalInfo: {
                        ...masterProfile.personalInfo,
                        phone: parts[0] || "",
                        location: parts[1] || "",
                      },
                    });
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-medium"
                />
              </div>
            </div>

            {/* Experience list summary */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-800 flex items-center justify-between">
                <span>
                  Work Experiences ({masterProfile.experiences.length}):
                </span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {masterProfile.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs"
                  >
                    <div className="font-semibold text-stone-900 flex justify-between">
                      <span>
                        {exp.position} @ {exp.company}
                      </span>
                      <span className="text-stone-500 font-mono text-[11px]">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <ul className="list-disc list-inside mt-1.5 text-stone-600 space-y-0.5">
                      {exp.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="truncate">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Badges */}
            <div>
              <div className="text-xs font-semibold text-stone-800 mb-1.5">
                Master Skill Inventory ({totalSkills} skills):
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-stone-50 rounded-lg border border-stone-200">
                {masterProfile.skillCategories
                  .flatMap((c) => c.skills)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-stone-300 rounded text-[11px] font-medium text-stone-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Status notification banner */}
        {statusMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Master Data Snapshot Overview Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-center shadow-2xs">
          <User className="w-4 h-4 mx-auto text-stone-500 mb-1" />
          <div className="text-base font-bold text-stone-900 truncate">
            {masterProfile.personalInfo.fullName || "Candidate"}
          </div>
          <div className="text-[11px] text-stone-500">Identity Configured</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-center shadow-2xs">
          <Briefcase className="w-4 h-4 mx-auto text-stone-500 mb-1" />
          <div className="text-base font-bold text-stone-900">
            {masterProfile.experiences.length} Roles
          </div>
          <div className="text-[11px] text-stone-500">Work Experiences</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-center shadow-2xs">
          <Code className="w-4 h-4 mx-auto text-stone-500 mb-1" />
          <div className="text-base font-bold text-stone-900">
            {totalSkills} Skills
          </div>
          <div className="text-[11px] text-stone-500">Technical Taxonomy</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-center shadow-2xs">
          <GraduationCap className="w-4 h-4 mx-auto text-stone-500 mb-1" />
          <div className="text-base font-bold text-stone-900">
            {masterProfile.education.length} Degrees
          </div>
          <div className="text-[11px] text-stone-500">Academic Background</div>
        </div>
      </div>

      {/* Bottom Step Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="text-xs text-stone-500">
          Step 1 of 5 complete. Proceed to configure target Job Description.
        </div>
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <span>Continue to Step 2: Job Description</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
