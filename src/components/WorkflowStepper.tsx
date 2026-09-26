import React from "react";
import {
  UserCheck,
  Briefcase,
  Sparkles,
  BarChart3,
  DownloadCloud,
  Check,
} from "lucide-react";

export type WorkflowStep = 1 | 2 | 3 | 4 | 5;

interface Props {
  currentStep: WorkflowStep;
  onSelectStep: (step: WorkflowStep) => void;
  hasCuratedCv: boolean;
  hasJd: boolean;
  hasCandidateInfo: boolean;
  atsScore?: number;
}

const STEPS = [
  {
    step: 1 as WorkflowStep,
    title: "Candidate Info",
    subtitle: "Text or Multi-File Ingestion",
    icon: UserCheck,
  },
  {
    step: 2 as WorkflowStep,
    title: "Job Description",
    subtitle: "Text, File & Cover Letter",
    icon: Briefcase,
  },
  {
    step: 3 as WorkflowStep,
    title: "AI Curation",
    subtitle: "Tailored ATS Synthesis",
    icon: Sparkles,
  },
  {
    step: 4 as WorkflowStep,
    title: "ATS Match & Score",
    subtitle: "Overview & Keyword Audit",
    icon: BarChart3,
  },
  {
    step: 5 as WorkflowStep,
    title: "Style & Export",
    subtitle: "Image, PDF or DOC Export",
    icon: DownloadCloud,
  },
];

export const WorkflowStepper: React.FC<Props> = ({
  currentStep,
  onSelectStep,
  hasCuratedCv,
  hasJd,
  hasCandidateInfo,
  atsScore,
}) => {
  const isStepComplete = (step: WorkflowStep): boolean => {
    if (step === 1) return hasCandidateInfo;
    if (step === 2) return hasJd;
    if (step === 3) return hasCuratedCv;
    if (step === 4)
      return hasCuratedCv && atsScore !== undefined && atsScore > 0;
    return false;
  };

  return (
    <div className="w-full bg-white border-b border-stone-200 sticky top-14 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1 sm:gap-2">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const active = currentStep === s.step;
            const completed = isStepComplete(s.step);

            return (
              <React.Fragment key={s.step}>
                <button
                  id={`btn-workflow-step-${s.step}`}
                  onClick={() => onSelectStep(s.step)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all shrink-0 cursor-pointer ${
                    active
                      ? "bg-stone-900 text-white shadow-xs"
                      : completed
                        ? "bg-stone-100 hover:bg-stone-200/80 text-stone-800"
                        : "hover:bg-stone-100 text-stone-500"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      active
                        ? "bg-amber-400 text-stone-950"
                        : completed
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {completed && !active ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      s.step
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold whitespace-nowrap leading-tight flex items-center gap-1">
                      {s.title}
                      {s.step === 4 && atsScore !== undefined && (
                        <span
                          className={`text-[10px] px-1 rounded font-bold ${
                            active
                              ? "bg-stone-800 text-emerald-300"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {atsScore}%
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] truncate hidden md:block ${active ? "text-stone-300" : "text-stone-400"}`}
                    >
                      {s.subtitle}
                    </div>
                  </div>
                </button>

                {idx < STEPS.length - 1 && (
                  <div className="hidden sm:block w-3 sm:w-6 h-px bg-stone-200 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
