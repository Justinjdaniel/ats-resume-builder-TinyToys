import React, { useState, useRef } from "react";
import { MasterProfile } from "../types";
import {
  extractTextFromFile,
  parseResumeTextToProfile,
} from "../lib/fileParser";
import { DEFAULT_PROFILE } from "../lib/storage";
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface Props {
  currentProfile: MasterProfile;
  onImportProfile: (profile: MasterProfile) => void;
}

export const FileIngestionDropzone: React.FC<Props> = ({
  currentProfile,
  onImportProfile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<MasterProfile | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length === 0) {
        throw new Error("No readable text could be extracted from this file.");
      }
      const parsed = parseResumeTextToProfile(text, currentProfile);
      setParsedPreview(parsed);
      setSuccessMsg(
        `Successfully parsed ${file.name} (${file.size} bytes). Review the extracted preview below.`,
      );
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          "Failed to read file. Please try another text, markdown, or Word file.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const confirmImport = () => {
    if (parsedPreview) {
      onImportProfile(parsedPreview);
      setSuccessMsg("Master profile successfully updated with imported data!");
      setParsedPreview(null);
    }
  };

  const restoreSampleProfile = () => {
    onImportProfile(DEFAULT_PROFILE);
    setSuccessMsg("Default Senior Architect sample profile restored.");
    setParsedPreview(null);
  };

  return (
    <div id="file-ingestion-pane" className="space-y-4">
      {/* Privacy Notice Header */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-600 leading-normal">
            <span className="font-semibold text-stone-900 block mb-0.5">
              100% Client-Side Ingestion Sandbox
            </span>
            All file reading and tokenization runs in your browser's private
            memory sandbox. Files and profile data are never uploaded to any
            remote server or cloud database.
          </div>
        </div>

        {/* Dropzone Area */}
        <div
          id="file-dropzone-box"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-stone-900 bg-stone-100/70 scale-[0.99]"
              : "border-stone-300 hover:border-stone-400 bg-stone-50/40 hover:bg-stone-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.md,.txt,.json"
            onChange={handleFileInput}
            className="hidden"
          />

          <UploadCloud className="w-8 h-8 text-stone-500 mx-auto mb-2.5" />
          <div className="text-xs font-semibold text-stone-900 mb-1">
            Drag &amp; Drop your resume file here, or click to browse
          </div>
          <p className="text-[11px] text-stone-500">
            Accepts Markdown (
            <span className="font-mono text-stone-700">.md</span>), Plain Text (
            <span className="font-mono text-stone-700">.txt</span>), Word (
            <span className="font-mono text-stone-700">.docx</span>), PDF, and
            JSON
          </p>

          {isProcessing && (
            <div className="mt-3 text-xs text-stone-600 font-medium animate-pulse">
              Reading and structuring career sections...
            </div>
          )}
        </div>

        {/* Action button: Restore Sample */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-stone-500">
            Want to test with a pre-filled profile?
          </span>
          <button
            id="btn-restore-sample"
            onClick={restoreSampleProfile}
            className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Profile</span>
          </button>
        </div>

        {/* Success or Error feedback */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Parsed Preview Card */}
      {parsedPreview && (
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-stone-700" />
              <h4 className="text-xs font-semibold text-stone-900">
                Extracted Profile Preview
              </h4>
            </div>
            <button
              id="btn-confirm-import"
              onClick={confirmImport}
              className="text-xs px-3.5 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded-lg font-medium transition-colors"
            >
              Apply to Active Profile
            </button>
          </div>

          <div className="text-xs space-y-2 text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200/60 font-mono">
            <div>
              <span className="font-bold text-stone-900">Name:</span>{" "}
              {parsedPreview.personalInfo.fullName}
            </div>
            <div>
              <span className="font-bold text-stone-900">Headline:</span>{" "}
              {parsedPreview.personalInfo.headline}
            </div>
            <div>
              <span className="font-bold text-stone-900">Email:</span>{" "}
              {parsedPreview.personalInfo.email}
            </div>
            <div>
              <span className="font-bold text-stone-900">Phone:</span>{" "}
              {parsedPreview.personalInfo.phone}
            </div>
            <div>
              <span className="font-bold text-stone-900">Work Experience:</span>{" "}
              {parsedPreview.experiences.length} roles found
            </div>
            <div>
              <span className="font-bold text-stone-900">Education:</span>{" "}
              {parsedPreview.education.length} entries found
            </div>
            <div>
              <span className="font-bold text-stone-900">
                Skill Categories:
              </span>{" "}
              {parsedPreview.skillCategories.length} categories
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
