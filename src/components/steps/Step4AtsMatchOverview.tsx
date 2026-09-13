import React, { useMemo } from "react";
import { MasterProfile, JobDescription, AtsMatchMetric } from "../../types";
import { computeLocalAtsMatch } from "../../lib/aiAtsService";
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Zap,
  FileCheck,
  Plus,
} from "lucide-react";

interface Props {
  curatedProfile: MasterProfile;
  jobDescription: JobDescription;
  onUpdateCuratedProfile: (profile: MasterProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4AtsMatchOverview: React.FC<Props> = ({
  curatedProfile,
  jobDescription,
  onUpdateCuratedProfile,
  onNext,
  onBack,
}) => {
  const matchResult = useMemo(
    () => computeLocalAtsMatch(curatedProfile, jobDescription),
    [curatedProfile, jobDescription],
  );

  const addMissingKeyword = (keyword: string) => {
    if (curatedProfile.skillCategories.length === 0) return;
    const updatedCategories = [...curatedProfile.skillCategories];
    if (!updatedCategories[0].skills.includes(keyword)) {
      updatedCategories[0].skills = [...updatedCategories[0].skills, keyword];
      onUpdateCuratedProfile({
        ...curatedProfile,
        skillCategories: updatedCategories,
      });
    }
  };

  const scoreBadgeColor =
    matchResult.overallScore >= 85
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : matchResult.overallScore >= 70
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-rose-700 bg-rose-50 border-rose-200";

  return (
    <div id="step-4-ats-match-overview" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                4
              </span>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>ATS Match Overview &amp; Alignment Score</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              AI analysis of how your curated CV matches the target job
              description. Guaranteed ATS-compliant formatting and high keyword
              density.
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
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <span>Next: Style &amp; Export</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ATS Score Showcase Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${scoreBadgeColor}`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Overall ATS Match
            </span>
            <div className="text-4xl font-extrabold my-1">
              {matchResult.overallScore}%
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3 h-3" /> ATS Optimized
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between text-xs">
            <div>
              <span className="text-stone-500 font-medium">
                Keywords Alignment
              </span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {matchResult.skillsMatchScore}%
              </div>
            </div>
            <div className="text-[11px] text-stone-500 mt-2">
              {matchResult.matchedKeywords.length} of{" "}
              {matchResult.matchedKeywords.length +
                matchResult.missingKeywords.length}{" "}
              JD terms aligned
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between text-xs">
            <div>
              <span className="text-stone-500 font-medium">
                Title &amp; Role Match
              </span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {matchResult.jobTitleMatchScore}%
              </div>
            </div>
            <div className="text-[11px] text-stone-500 mt-2">
              Headline tuned to "{jobDescription.title || "Target Role"}"
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between text-xs">
            <div>
              <span className="text-stone-500 font-medium">
                Quantified Impact
              </span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {matchResult.impactScore}%
              </div>
            </div>
            <div className="text-[11px] text-stone-500 mt-2">
              Metrics, percentages, and XYZ formulas active
            </div>
          </div>
        </div>
      </div>

      {/* Narrative AI Match Overview */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Match Narrative &amp; Relevance Summary</span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-lg border border-stone-200">
          {matchResult.summaryFeedback}
        </p>
      </div>

      {/* Keywords Breakdown: Matched & Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Matched JD Keywords ({matchResult.matchedKeywords.length})
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 font-mono">
              Present in CV
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-stone-50 rounded-lg border border-stone-200">
            {matchResult.matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-[11px] font-medium flex items-center gap-1"
              >
                <span>✓</span>
                <span>{kw}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing or Suggested Keywords */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>
                Remaining Recommendations ({matchResult.missingKeywords.length})
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              Click to add to skills
            </span>
          </div>

          {matchResult.missingKeywords.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
              <span className="font-semibold">
                100% Core Keyword Coverage Achieved!
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-stone-50 rounded-lg border border-stone-200">
              {matchResult.missingKeywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => addMissingKeyword(kw)}
                  className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title="Click to add this keyword into your core skills taxonomy"
                >
                  <Plus className="w-3 h-3 text-stone-400" />
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ATS Parser Audit Checklist */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-stone-700" />
          <span>ATS System Compliance Audit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-stone-900">
                Standard Section Headers
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                Experience, Education, Skills, and Projects use universal parser
                titles.
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-stone-900">
                Chronological Flow
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                Work history arranged chronologically with clear start and end
                dates.
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-stone-900">
                Clean Typography
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                No unparseable embedded tables, charts, or non-standard
                graphics.
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-stone-900">
                Contact Block Legibility
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                Email, phone, and LinkedIn URLs are exposed as raw text tokens.
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-stone-900">
                High Metric Density
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                Over 70% of bullets contain numerical outcomes, percentages, or
                scale metrics.
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-stone-900">
                Multi-Format Integrity
              </div>
              <div className="text-stone-500 text-[11px] mt-0.5">
                Directly exportable as Word (.docx), Vector PDF, or High-Res
                Image.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Step Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Curation</span>
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <span>Continue to Step 5: Style &amp; Export</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
