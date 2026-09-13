import React, { useState, useEffect, useMemo } from "react";
import {
  MasterProfile,
  JobDescription,
  CoverLetter,
  AppSettings,
} from "./types";
import {
  LocalStorageService,
  DEFAULT_PROFILE,
  DEFAULT_JOB_DESCRIPTION,
  DEFAULT_COVER_LETTER,
  DEFAULT_SETTINGS,
} from "./lib/storage";
import { webMcpService } from "./lib/webMcp";
import { computeLocalAtsMatch } from "./lib/aiAtsService";

import { WorkflowStepper, WorkflowStep } from "./components/WorkflowStepper";
import { Step1CandidateInfo } from "./components/steps/Step1CandidateInfo";
import { Step2JobDescription } from "./components/steps/Step2JobDescription";
import { Step3AiCuration } from "./components/steps/Step3AiCuration";
import { Step4AtsMatchOverview } from "./components/steps/Step4AtsMatchOverview";
import { Step5StyleAndExport } from "./components/steps/Step5StyleAndExport";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { WebMcpPanel } from "./components/WebMcpPanel";
import { AppLogo } from "./components/AppLogo";
import { PWAInstallButton } from "./components/PWAInstallButton";

import {
  ShieldCheck,
  Key,
  Bot,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  Cpu,
  Github,
  Bug,
  MessageSquarePlus,
  Heart,
} from "lucide-react";
import { AI_PROVIDERS } from "./lib/aiProviderService";

export default function App() {
  // 5-Step Workflow State
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);

  // Master candidate profile (unfiltered raw data from files/text)
  const [masterProfile, setMasterProfile] =
    useState<MasterProfile>(DEFAULT_PROFILE);

  // Curated profile (tailored for target JD in Step 3)
  const [curatedProfile, setCuratedProfile] = useState<MasterProfile | null>(
    null,
  );

  // Target Job Description
  const [jobDescription, setJobDescription] = useState<JobDescription>(
    DEFAULT_JOB_DESCRIPTION,
  );

  // Cover letter requirement toggle (User prompt: optional in many cases)
  const [requireCoverLetter, setRequireCoverLetter] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);

  // App settings (theme, paper size, font size, etc.)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // UI Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isWebMcpModalOpen, setIsWebMcpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    async function loadSavedData() {
      try {
        const [savedProfile, savedJd, savedCl, savedSettings] =
          await Promise.all([
            LocalStorageService.getProfile(),
            LocalStorageService.getJobDescription(),
            LocalStorageService.getCoverLetter(),
            LocalStorageService.getSettings(),
          ]);
        if (savedProfile) setMasterProfile(savedProfile);
        if (savedJd) setJobDescription(savedJd);
        if (savedSettings) {
          setSettings(savedSettings);
          if (savedSettings.requireCoverLetter !== undefined) {
            setRequireCoverLetter(savedSettings.requireCoverLetter);
          }
        }
        if (savedCl && savedSettings?.requireCoverLetter) {
          setCoverLetter(savedCl);
        }
      } catch (err) {
        console.error("Failed to load local storage state", err);
      }
    }
    loadSavedData();
  }, []);

  // Sync to WebMCP tools whenever master profile, curated profile, JD, or API key changes
  useEffect(() => {
    const activeProfile = curatedProfile || masterProfile;
    webMcpService.registerAllTools(
      () => activeProfile,
      (newP) => {
        setCuratedProfile(newP);
        LocalStorageService.saveProfile(newP);
      },
      () => jobDescription,
      (newJd) => {
        setJobDescription(newJd);
        LocalStorageService.saveJobDescription(newJd);
      },
      () => settings.apiKey,
      (newCl) => {
        setCoverLetter(newCl);
        LocalStorageService.saveCoverLetter(newCl);
      },
    );
  }, [
    masterProfile,
    curatedProfile,
    jobDescription,
    coverLetter,
    settings.apiKey,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateMasterProfile = (p: MasterProfile) => {
    setMasterProfile(p);
    LocalStorageService.saveProfile(p);
  };

  const handleUpdateCuratedProfile = (p: MasterProfile) => {
    setCuratedProfile(p);
    LocalStorageService.saveProfile(p);
  };

  const handleUpdateJd = (jd: JobDescription) => {
    setJobDescription(jd);
    LocalStorageService.saveJobDescription(jd);
  };

  const handleToggleRequireCoverLetter = (enabled: boolean) => {
    setRequireCoverLetter(enabled);
    const updated = { ...settings, requireCoverLetter: enabled };
    setSettings(updated);
    LocalStorageService.saveSettings(updated);
    if (!enabled) {
      setCoverLetter(null);
    }
  };

  const handleUpdateSettings = (updated: Partial<AppSettings>) => {
    const next = { ...settings, ...updated };
    setSettings(next);
    LocalStorageService.saveSettings(next);
  };

  // Compute live ATS score for step 4 & top stepper
  const atsMatchResult = useMemo(() => {
    const profileToScore = curatedProfile || masterProfile;
    if (!jobDescription.rawText.trim()) return undefined;
    return computeLocalAtsMatch(profileToScore, jobDescription);
  }, [curatedProfile, masterProfile, jobDescription]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans select-none text-stone-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <header
        id="curatecv-header"
        className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setCurrentStep(1)}
            >
              <AppLogo className="w-8 h-8 group-hover:scale-105 transition-transform drop-shadow-xs shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-stone-900 leading-tight">
                  CurateCV
                </span>
                <span className="text-[10px] text-stone-500 font-medium hidden sm:inline leading-none">
                  ATS Curriculum Vitae Studio
                </span>
              </div>
            </div>

            <span className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% Client-Side &amp; Private
            </span>
          </div>

          {/* Quick Step Indicators / Jump Pill */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-stone-600">
            <span className="text-stone-400">Workflow:</span>
            <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-800 font-semibold">
              Step {currentStep} of 5
            </span>
            {curatedProfile && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Curated CV Active
              </span>
            )}
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Quick Preview Jump to Step 5 */}
            {currentStep !== 5 && (
              <button
                id="btn-quick-preview-step5"
                onClick={() => setCurrentStep(5)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors cursor-pointer"
                title="Jump to Step 5: Document Preview & Export"
              >
                <Eye className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">Preview &amp; Export</span>
              </button>
            )}

            {/* AI Provider & Models Modal Trigger */}
            <button
              id="btn-open-byok-modal"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-700 font-medium transition-colors cursor-pointer"
              title="Configure AI Provider (Gemini, OpenAI, Claude, Groq, Ollama)"
            >
              <Cpu className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">
                {settings.aiConfig?.provider === "ollama"
                  ? `Ollama (${settings.aiConfig.model || "llama3.2"})`
                  : settings.aiConfig?.provider === "local_heuristic"
                    ? "Local NLP"
                    : settings.aiConfig
                      ? AI_PROVIDERS[settings.aiConfig.provider]?.name ||
                        "AI Engine"
                      : settings.apiKey
                        ? "Gemini BYOK"
                        : "AI Engine"}
              </span>
              {settings.aiConfig?.provider === "ollama" ? (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  title="100% Local AI Active"
                />
              ) : settings.aiConfig?.apiKey || settings.apiKey ? (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  title="API Key Connected"
                />
              ) : null}
            </button>

            {/* WebMCP Activity Modal Trigger */}
            <button
              id="btn-open-webmcp-modal"
              onClick={() => setIsWebMcpModalOpen(true)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-700 font-medium transition-colors cursor-pointer"
              title="Agent WebMCP Protocol Tools"
            >
              <Bot className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">WebMCP</span>
            </button>
          </div>
        </div>
      </header>

      {/* 5-Step Progress Stepper Bar */}
      <WorkflowStepper
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        hasCandidateInfo={masterProfile.experiences.length > 0}
        hasJd={jobDescription.rawText.trim().length > 0}
        hasCuratedCv={!!curatedProfile}
        atsScore={atsMatchResult?.overallScore}
      />

      {/* Main Workflow Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Step 1: Candidate Information */}
        {currentStep === 1 && (
          <Step1CandidateInfo
            masterProfile={masterProfile}
            onUpdateMasterProfile={handleUpdateMasterProfile}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2: Target Job Description & Cover Letter Option */}
        {currentStep === 2 && (
          <Step2JobDescription
            jobDescription={jobDescription}
            onUpdateJd={handleUpdateJd}
            requireCoverLetter={requireCoverLetter}
            onToggleRequireCoverLetter={handleToggleRequireCoverLetter}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3: AI Curation & Synthesis */}
        {currentStep === 3 && (
          <Step3AiCuration
            masterProfile={masterProfile}
            jobDescription={jobDescription}
            curatedProfile={curatedProfile}
            onUpdateCuratedProfile={handleUpdateCuratedProfile}
            requireCoverLetter={requireCoverLetter}
            coverLetter={coverLetter}
            onUpdateCoverLetter={setCoverLetter}
            apiKey={settings.apiKey}
            aiConfig={settings.aiConfig}
            onOpenAiSettings={() => setIsApiKeyModalOpen(true)}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: ATS Match Overview & Alignment Score */}
        {currentStep === 4 && (
          <Step4AtsMatchOverview
            curatedProfile={curatedProfile || masterProfile}
            jobDescription={jobDescription}
            onUpdateCuratedProfile={handleUpdateCuratedProfile}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {/* Step 5: Style Selection, Live Preview & Multi-Format Export */}
        {currentStep === 5 && (
          <Step5StyleAndExport
            profile={curatedProfile || masterProfile}
            coverLetter={coverLetter}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => setCurrentStep(4)}
          />
        )}
      </main>

      {/* Modern Footer with Creator Credit, GitHub, and Issue / Suggestion Links */}
      <footer
        id="curatecv-footer"
        className="bg-white border-t border-stone-200 py-4 text-xs text-stone-500 no-print"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Creator Credit */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-stone-600">
            <span className="font-semibold text-stone-900">CurateCV</span>
            <span className="text-stone-300">•</span>
            <span>
              Built by{" "}
              <strong className="font-semibold text-stone-900">
                Justin John D
              </strong>
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-500">
              Local-First ATS Resume &amp; Cover Letter Studio
            </span>
          </div>

          {/* Action Links: GitHub Repo, Bug Report, Feature Suggestion */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-600">
            {/* GitHub Repository */}
            <a
              id="link-github-repo"
              href="https://github.com/justinjdaniel/curate-cv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-900 transition-colors font-medium cursor-pointer"
              title="View CurateCV on GitHub"
            >
              <Github className="w-3.5 h-3.5 text-stone-700" />
              <span>GitHub</span>
            </a>

            {/* Issue Reporting */}
            <a
              id="link-report-issue"
              href="https://github.com/justinjdaniel/curate-cv/issues/new?template=bug_report.md&title=%5BBUG%5D%3A+"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-rose-700 transition-colors cursor-pointer"
              title="Report an issue or bug on GitHub"
            >
              <Bug className="w-3.5 h-3.5 text-rose-500" />
              <span>Report Issue</span>
            </a>

            {/* Feature Suggestion */}
            <a
              id="link-suggest-feature"
              href="https://github.com/justinjdaniel/curate-cv/issues/new?template=feature_request.md&title=%5BFEATURE%5D%3A+"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-700 transition-colors cursor-pointer"
              title="Suggest a new feature on GitHub"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggest Feature</span>
            </a>

            {/* Privacy Badge */}
            <span className="hidden sm:inline-block text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              Zero Data Egress
            </span>
          </div>
        </div>
      </footer>

      {/* Modal: AI Provider & Model Configuration (Gemini, OpenAI, Claude, Groq, Ollama) */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        settings={settings}
        onSaveConfig={(cfg) => {
          handleUpdateSettings({
            aiConfig: cfg,
            apiKey: cfg.provider === "gemini" ? cfg.apiKey : settings.apiKey,
          });
          showToast(`AI engine set to ${AI_PROVIDERS[cfg.provider].name}.`);
        }}
      />

      {/* Modal: WebMCP Agent Diagnostics */}
      {isWebMcpModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-stone-800" />
                <h3 className="font-bold text-sm text-stone-900">
                  WebMCP Agent Activity &amp; Live Tools
                </h3>
              </div>
              <button
                onClick={() => setIsWebMcpModalOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <WebMcpPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
