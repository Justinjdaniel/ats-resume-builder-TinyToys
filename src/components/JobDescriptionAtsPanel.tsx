import React, { useState } from "react";
import {
  MasterProfile,
  JobDescription,
  AtsMatchMetric,
  BulletSuggestion,
} from "../types";
import {
  computeLocalAtsMatch,
  optimizeBulletWithAi,
} from "../lib/aiAtsService";
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface Props {
  profile: MasterProfile;
  jobDescription: JobDescription;
  onUpdateJd: (jd: JobDescription) => void;
  onUpdateProfile: (profile: MasterProfile) => void;
  apiKey?: string;
}

export const JobDescriptionAtsPanel: React.FC<Props> = ({
  profile,
  jobDescription,
  onUpdateJd,
  onUpdateProfile,
  apiKey,
}) => {
  const [matchResult, setMatchResult] = useState<AtsMatchMetric>(() =>
    computeLocalAtsMatch(profile, jobDescription),
  );
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleTextChange = (field: keyof JobDescription, value: string) => {
    const updated = {
      ...jobDescription,
      [field]: value,
    };
    onUpdateJd(updated);
    setMatchResult(computeLocalAtsMatch(profile, updated));
  };

  const recomputeMatch = () => {
    setMatchResult(computeLocalAtsMatch(profile, jobDescription));
  };

  const addMissingKeywordToSkills = (keyword: string) => {
    if (profile.skillCategories.length === 0) return;
    const updatedCategories = [...profile.skillCategories];
    const targetCat = updatedCategories[0];
    if (!targetCat.skills.includes(keyword)) {
      targetCat.skills = [...targetCat.skills, keyword];
      const updatedProfile = {
        ...profile,
        skillCategories: updatedCategories,
      };
      onUpdateProfile(updatedProfile);
      setMatchResult(computeLocalAtsMatch(updatedProfile, jobDescription));
    }
  };

  const applyBulletSuggestion = (suggestion: BulletSuggestion) => {
    const updatedExperiences = profile.experiences.map((exp) => {
      if (exp.id === suggestion.experienceId) {
        return {
          ...exp,
          highlights: exp.highlights.map((h) =>
            h === suggestion.originalBullet ? suggestion.recommendedBullet : h,
          ),
        };
      }
      return exp;
    });

    const updatedProfile = {
      ...profile,
      experiences: updatedExperiences,
    };
    onUpdateProfile(updatedProfile);
    setMatchResult(computeLocalAtsMatch(updatedProfile, jobDescription));
  };

  const scoreColor =
    matchResult.overallScore >= 80
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : matchResult.overallScore >= 60
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-rose-700 bg-rose-50 border-rose-200";

  return (
    <div id="job-description-ats-panel" className="space-y-4">
      {/* Target Role & ATS Match Gauge Header */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-stone-700" />
              <h3 className="text-sm font-semibold text-stone-900">
                Target Role &amp; Real-Time ATS Match
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Paste any job description to compute instant keyword alignment and
              match score.
            </p>
          </div>
          <button
            id="btn-recompute-ats"
            onClick={recomputeMatch}
            className="flex items-center gap-1 text-xs px-2.5 py-1 text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 rounded-md transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Recalculate</span>
          </button>
        </div>

        {/* ATS Score Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${scoreColor}`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Overall ATS Score
            </span>
            <div className="text-3xl font-extrabold my-1">
              {matchResult.overallScore}%
            </div>
            <span className="text-[11px] opacity-85">
              {matchResult.overallScore >= 80
                ? "High Match"
                : matchResult.overallScore >= 60
                  ? "Moderate Match"
                  : "Needs Optimization"}
            </span>
          </div>

          <div className="md:col-span-3 grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-stone-500 font-medium">
                Title Alignment
              </span>
              <span className="text-lg font-bold text-stone-900">
                {matchResult.jobTitleMatchScore}%
              </span>
              <div className="w-full bg-stone-200 h-1 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-stone-800 h-full rounded-full"
                  style={{ width: `${matchResult.jobTitleMatchScore}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-stone-500 font-medium">
                Skills Coverage
              </span>
              <span className="text-lg font-bold text-stone-900">
                {matchResult.skillsMatchScore}%
              </span>
              <div className="w-full bg-stone-200 h-1 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-stone-800 h-full rounded-full"
                  style={{ width: `${matchResult.skillsMatchScore}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-stone-500 font-medium">
                Impact Density
              </span>
              <span className="text-lg font-bold text-stone-900">
                {matchResult.impactScore}%
              </span>
              <div className="w-full bg-stone-200 h-1 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-stone-800 h-full rounded-full"
                  style={{ width: `${matchResult.impactScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback banner */}
        <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 leading-normal">
          <span className="font-semibold text-stone-900">Analysis: </span>
          {matchResult.summaryFeedback}
        </p>

        {/* Job Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Target Job Title
            </label>
            <input
              id="input-jd-title"
              type="text"
              value={jobDescription.title}
              onChange={(e) => handleTextChange("title", e.target.value)}
              placeholder="e.g. Principal Distributed Systems Engineer"
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Company / Organization
            </label>
            <input
              id="input-jd-company"
              type="text"
              value={jobDescription.company}
              onChange={(e) => handleTextChange("company", e.target.value)}
              placeholder="e.g. CloudScale Infrastructure"
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Raw Job Description Content
          </label>
          <textarea
            id="input-jd-rawtext"
            rows={5}
            value={jobDescription.rawText}
            onChange={(e) => handleTextChange("rawText", e.target.value)}
            placeholder="Paste full job description requirements, responsibilities, and qualifications..."
            className="w-full text-xs p-3 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Keyword Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Matched Keywords ({matchResult.matchedKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchResult.matchedKeywords.length > 0 ? (
              matchResult.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium"
                >
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-stone-400 italic">
                No keyword overlap detected yet.
              </span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>
              Missing Target Keywords ({matchResult.missingKeywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchResult.missingKeywords.length > 0 ? (
              matchResult.missingKeywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => addMissingKeywordToSkills(kw)}
                  title="Click to add to your skills"
                  className="group flex items-center gap-1 text-xs bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-400 hover:bg-amber-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  <span>{kw}</span>
                  <Plus className="w-2.5 h-2.5 text-amber-700 opacity-60 group-hover:opacity-100" />
                </button>
              ))
            ) : (
              <span className="text-xs text-stone-400 italic">
                All extracted JD keywords exist in your resume!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bullet Point Improvement Suggestions */}
      {matchResult.bulletPointSuggestions.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
            <Sparkles className="w-4 h-4 text-stone-700" />
            <span>
              ATS Tailoring &amp; Bullet Point Optimization Recommendations
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Incorporate missing keywords and impact metrics to maximize machine
            screening score:
          </p>

          <div className="space-y-3">
            {matchResult.bulletPointSuggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-2"
              >
                <div className="text-stone-500 line-through pl-2 border-l-2 border-stone-300">
                  {sug.originalBullet}
                </div>
                <div className="text-stone-900 font-medium pl-2 border-l-2 border-emerald-500 flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{sug.recommendedBullet}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                  <span>{sug.reasoning}</span>
                  <button
                    onClick={() => applyBulletSuggestion(sug)}
                    className="px-2.5 py-1 bg-stone-900 text-white rounded-md hover:bg-stone-800 text-xs font-medium transition-colors"
                  >
                    Apply to Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
