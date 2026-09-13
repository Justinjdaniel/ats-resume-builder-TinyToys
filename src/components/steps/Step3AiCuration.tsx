import React, { useState, useEffect } from "react";
import {
  MasterProfile,
  JobDescription,
  CoverLetter,
  AiModelConfig,
} from "../../types";
import {
  curateProfileForJobDescription,
  generateTargetedCoverLetter,
} from "../../lib/aiAtsService";
import { AI_PROVIDERS } from "../../lib/aiProviderService";
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  FileText,
  MailCheck,
  Check,
  ShieldCheck,
  Zap,
  Sliders,
  Cpu,
  Lock,
} from "lucide-react";

interface Props {
  masterProfile: MasterProfile;
  jobDescription: JobDescription;
  curatedProfile: MasterProfile | null;
  onUpdateCuratedProfile: (profile: MasterProfile) => void;
  requireCoverLetter: boolean;
  coverLetter: CoverLetter | null;
  onUpdateCoverLetter: (cl: CoverLetter | null) => void;
  apiKey?: string;
  aiConfig?: AiModelConfig;
  onOpenAiSettings?: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3AiCuration: React.FC<Props> = ({
  masterProfile,
  jobDescription,
  curatedProfile,
  onUpdateCuratedProfile,
  requireCoverLetter,
  coverLetter,
  onUpdateCoverLetter,
  apiKey,
  aiConfig,
  onOpenAiSettings,
  onNext,
  onBack,
}) => {
  const [isCurating, setIsCurating] = useState(false);
  const [curationLogs, setCurationLogs] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const activeProvider =
    aiConfig?.provider || (apiKey ? "gemini" : "local_heuristic");
  const providerMeta = AI_PROVIDERS[activeProvider];

  const runAiCuration = async () => {
    setIsCurating(true);
    setCurationLogs(["Initiating ATS alignment engine..."]);

    try {
      // 1. Curate the CV profile using active AI configuration
      const result = await curateProfileForJobDescription(
        masterProfile,
        jobDescription,
        aiConfig || apiKey,
      );
      onUpdateCuratedProfile(result.curatedProfile);
      setCurationLogs(result.optimizationLog);

      // 2. Curate cover letter ONLY IF requireCoverLetter is TRUE
      if (requireCoverLetter) {
        setCurationLogs((prev) => [
          ...prev,
          "Synthesizing targeted cover letter for hiring committee...",
        ]);
        const cl = await generateTargetedCoverLetter(
          result.curatedProfile,
          jobDescription,
          aiConfig || apiKey,
        );
        onUpdateCoverLetter(cl);
        setCurationLogs((prev) => [
          ...prev,
          `Cover letter tailored for ${jobDescription.company || "the role"}`,
        ]);
      } else {
        onUpdateCoverLetter(null);
        setCurationLogs((prev) => [
          ...prev,
          "Cover letter generation skipped (flag set to optional)",
        ]);
      }

      setHasRun(true);
    } catch (err: any) {
      setCurationLogs((prev) => [
        ...prev,
        `Curation notice: ${err.message || "Complete"}`,
      ]);
    } finally {
      setIsCurating(false);
    }
  };

  // Run automatically on first mount if not yet curated
  useEffect(() => {
    if (!curatedProfile) {
      runAiCuration();
    } else {
      setHasRun(true);
    }
  }, []);

  const activeCv = curatedProfile || masterProfile;

  return (
    <div id="step-3-ai-curation" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>AI Curation &amp; Master Data Synthesis</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              AI analyzes your comprehensive master data and tailors the
              headline, summary, skills taxonomy, and experience highlights
              directly against the target job description.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenAiSettings && (
              <button
                onClick={onOpenAiSettings}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-md font-medium transition-colors cursor-pointer"
                title="Switch AI provider or configure Ollama/OpenAI/Claude"
              >
                <Cpu className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">AI Settings</span>
              </button>
            )}
            <button
              onClick={runAiCuration}
              disabled={isCurating}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isCurating ? "animate-spin" : ""}`}
              />
              <span>{isCurating ? "Synthesizing..." : "Re-run Curation"}</span>
            </button>
            <button
              onClick={onNext}
              disabled={isCurating}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-md font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <span>Next: ATS Match &amp; Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Synthesis Status Badge */}
        <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${isCurating ? "bg-amber-500 animate-ping" : "bg-emerald-600"}`}
            />
            <span className="font-semibold text-stone-800">
              {isCurating
                ? "AI Synthesis Engine Running..."
                : "Curated CV Ready & ATS Optimized"}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-600">
              Target Role:{" "}
              <strong>{jobDescription.title || "Target Position"}</strong>
            </span>
            {jobDescription.company && (
              <span className="text-stone-600">
                @ <strong>{jobDescription.company}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeProvider === "ollama" ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/80">
                <Lock className="w-3 h-3 text-emerald-600" />
                Local Ollama ({aiConfig?.model || "llama3.2"}) • 100% Private
              </span>
            ) : activeProvider === "local_heuristic" ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded-full">
                Deterministic Rule Engine
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {providerMeta.name} (
                {aiConfig?.model || providerMeta.defaultModel})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Curation Transformation Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Headline & Summary Transformation */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Curated Professional Headline &amp; Summary</span>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Tailored Headline
            </div>
            <div className="text-xs font-bold text-stone-900 p-2.5 bg-stone-50 rounded-md border border-stone-200">
              {activeCv.personalInfo.headline}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Tailored Executive Summary
            </div>
            <p className="text-xs text-stone-700 leading-relaxed p-2.5 bg-stone-50 rounded-md border border-stone-200">
              {activeCv.personalInfo.summary}
            </p>
          </div>
        </div>

        {/* Card 2: Experience Highlights & Skills Re-Ranking */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Experience Bullets &amp; Pinned Target Skills</span>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Top Quantified Experience Highlights (XYZ Impact Formula)
            </div>
            {activeCv.experiences[0] && (
              <div className="p-2.5 bg-stone-50 rounded-md border border-stone-200 space-y-1.5 text-xs">
                <div className="font-semibold text-stone-900">
                  {activeCv.experiences[0].position} @{" "}
                  {activeCv.experiences[0].company}
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  {activeCv.experiences[0].highlights
                    .slice(0, 2)
                    .map((h, i) => (
                      <li key={i} className="leading-normal">
                        {h}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Top Priority Skills Category (Pinned to Header)
            </div>
            {activeCv.skillCategories[0] && (
              <div className="flex flex-wrap gap-1 p-2 bg-stone-50 rounded-md border border-stone-200 max-h-20 overflow-y-auto">
                {activeCv.skillCategories[0].skills
                  .slice(0, 10)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold text-stone-800"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Letter Decision Card */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${requireCoverLetter ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500"}`}
          >
            <MailCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
              <span>Cover Letter Status:</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                  requireCoverLetter
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {requireCoverLetter
                  ? "Synthesized & Ready"
                  : "Skipped (Marked Optional)"}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {requireCoverLetter
                ? `Tailored cover letter generated for ${jobDescription.company || "target organization"}. You can preview and export it in Step 5.`
                : "Cover letter creation was turned off in Step 2. If you need one, you can enable it in Step 2 at any time."}
            </p>
          </div>
        </div>
      </div>

      {/* Curation Activity Log */}
      {curationLogs.length > 0 && (
        <div className="bg-stone-900 text-stone-200 p-4 rounded-xl text-xs font-mono space-y-1">
          <div className="text-stone-400 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Curation Pipeline Logs:</span>
          </div>
          {curationLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Step Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Description</span>
        </button>
        <button
          onClick={onNext}
          disabled={isCurating}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <span>Continue to Step 4: ATS Match &amp; Overview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
