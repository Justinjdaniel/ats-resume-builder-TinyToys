import React, { useState, useEffect } from "react";
import {
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Cpu,
  Globe,
  Lock,
  ExternalLink,
  Sparkles,
  Server,
  Zap,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { AiModelConfig, AiProvider, AppSettings } from "../types";
import {
  AI_PROVIDERS,
  DEFAULT_AI_CONFIG,
  testAiConnection,
  fetchOllamaModels,
} from "../lib/aiProviderService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveConfig: (config: AiModelConfig) => void;
}

export const ApiKeyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSaveConfig,
}) => {
  // Initialize from settings.aiConfig or backwards-compatible settings.apiKey
  const initialProvider: AiProvider =
    settings.aiConfig?.provider || (settings.apiKey ? "gemini" : "gemini");
  const initialModel =
    settings.aiConfig?.model || AI_PROVIDERS[initialProvider].defaultModel;
  const initialKey = settings.aiConfig?.apiKey || settings.apiKey || "";
  const initialBaseUrl =
    settings.aiConfig?.baseUrl ||
    AI_PROVIDERS[initialProvider].defaultBaseUrl ||
    "";

  const [selectedProvider, setSelectedProvider] =
    useState<AiProvider>(initialProvider);
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [apiKeyInput, setApiKeyInput] = useState<string>(initialKey);
  const [baseUrlInput, setBaseUrlInput] = useState<string>(initialBaseUrl);
  const [showKey, setShowKey] = useState<boolean>(false);

  // Per-provider saved keys/urls state during session
  const [providerKeys, setProviderKeys] = useState<Record<string, string>>({
    gemini: settings.apiKey || settings.aiConfig?.apiKey || "",
    openai:
      settings.aiConfig?.provider === "openai"
        ? settings.aiConfig.apiKey || ""
        : "",
    anthropic:
      settings.aiConfig?.provider === "anthropic"
        ? settings.aiConfig.apiKey || ""
        : "",
    groq:
      settings.aiConfig?.provider === "groq"
        ? settings.aiConfig.apiKey || ""
        : "",
    openrouter:
      settings.aiConfig?.provider === "openrouter"
        ? settings.aiConfig.apiKey || ""
        : "",
  });

  // Ollama local state
  const [ollamaInstalledModels, setOllamaInstalledModels] = useState<string[]>(
    [],
  );
  const [isScanningOllama, setIsScanningOllama] = useState<boolean>(false);
  const [ollamaScanMsg, setOllamaScanMsg] = useState<string>("");

  // Test connection state
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "failed"
  >("idle");
  const [testResultMsg, setTestResultMsg] = useState<string>("");
  const [testLatency, setTestLatency] = useState<number | null>(null);

  // Sync state when modal opens or provider changes
  useEffect(() => {
    if (isOpen) {
      const prov =
        settings.aiConfig?.provider || (settings.apiKey ? "gemini" : "gemini");
      setSelectedProvider(prov);
      setSelectedModel(
        settings.aiConfig?.model || AI_PROVIDERS[prov].defaultModel,
      );
      setApiKeyInput(
        settings.aiConfig?.apiKey ||
          settings.apiKey ||
          providerKeys[prov] ||
          "",
      );
      setBaseUrlInput(
        settings.aiConfig?.baseUrl || AI_PROVIDERS[prov].defaultBaseUrl || "",
      );
      setTestStatus("idle");
      setTestResultMsg("");
      setTestLatency(null);
    }
  }, [isOpen]);

  const handleProviderSelect = (provider: AiProvider) => {
    setSelectedProvider(provider);
    setSelectedModel(AI_PROVIDERS[provider].defaultModel);
    setApiKeyInput(providerKeys[provider] || "");
    setBaseUrlInput(AI_PROVIDERS[provider].defaultBaseUrl || "");
    setTestStatus("idle");
    setTestResultMsg("");
    setTestLatency(null);

    // If switching to Ollama, trigger auto scan
    if (provider === "ollama" && ollamaInstalledModels.length === 0) {
      scanOllama(AI_PROVIDERS.ollama.defaultBaseUrl);
    }
  };

  const handleKeyChange = (val: string) => {
    setApiKeyInput(val);
    setProviderKeys((prev) => ({ ...prev, [selectedProvider]: val }));
    setTestStatus("idle");
  };

  const scanOllama = async (urlToScan?: string) => {
    setIsScanningOllama(true);
    setOllamaScanMsg("Querying local Ollama /api/tags...");
    try {
      const models = await fetchOllamaModels(
        urlToScan || baseUrlInput || "http://localhost:11434",
      );
      setOllamaInstalledModels(models);
      if (models.length > 0) {
        setOllamaScanMsg(`Found ${models.length} installed models!`);
        if (!models.includes(selectedModel)) {
          setSelectedModel(models[0]);
        }
      } else {
        setOllamaScanMsg(
          'Ollama responded but no models downloaded yet. Run "ollama pull llama3.2"',
        );
      }
    } catch (err: any) {
      setOllamaScanMsg(
        `Could not connect to Ollama. Make sure Ollama is running.`,
      );
    } finally {
      setIsScanningOllama(false);
    }
  };

  const handleRunTest = async () => {
    setTestStatus("testing");
    setTestResultMsg(
      `Testing connection to ${AI_PROVIDERS[selectedProvider].name}...`,
    );
    setTestLatency(null);

    const testConfig: AiModelConfig = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey: apiKeyInput.trim(),
      baseUrl: baseUrlInput.trim() || undefined,
    };

    const res = await testAiConnection(testConfig);
    if (res.success) {
      setTestStatus("success");
      setTestLatency(res.latencyMs);
      setTestResultMsg(res.message);
    } else {
      setTestStatus("failed");
      setTestLatency(res.latencyMs);
      setTestResultMsg(res.message);
    }
  };

  const handleSave = () => {
    const configToSave: AiModelConfig = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey:
        selectedProvider === "ollama" || selectedProvider === "local_heuristic"
          ? undefined
          : apiKeyInput.trim(),
      baseUrl: baseUrlInput.trim() || undefined,
    };

    onSaveConfig(configToSave);
    onClose();
  };

  const handleResetToDefault = () => {
    setSelectedProvider("local_heuristic");
    setSelectedModel("built-in-nlp");
    setApiKeyInput("");
    setBaseUrlInput("");
    onSaveConfig(DEFAULT_AI_CONFIG);
    setTestStatus("idle");
    setTestResultMsg("Switched to built-in deterministic rule engine.");
  };

  if (!isOpen) return null;

  const currentProviderMeta = AI_PROVIDERS[selectedProvider];

  return (
    <div
      id="ai-provider-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                AI Provider &amp; Model Configuration
              </h3>
              <p className="text-[11px] text-stone-500">
                Choose cloud BYOK frontier models or 100% private local Ollama
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Privacy Guarantee Pill */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-emerald-950">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block text-emerald-900 mb-0.5">
                Zero-Telemetry Client-Side Guarantee
              </span>
              All API keys are encrypted in your browser's private storage
              (IndexedDB). For absolute privacy, select{" "}
              <strong className="font-semibold text-emerald-800">Ollama</strong>{" "}
              to run curation completely on your local machine with{" "}
              <strong>zero external data egress</strong>.
            </div>
          </div>

          {/* Provider Selection Tabs */}
          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px] mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(AI_PROVIDERS) as AiProvider[]).map((provKey) => {
                const prov = AI_PROVIDERS[provKey];
                const isSelected = selectedProvider === provKey;
                const isLocal = prov.category === "local";
                const isHeuristic = prov.category === "heuristic";

                return (
                  <button
                    key={provKey}
                    type="button"
                    onClick={() => handleProviderSelect(provKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                        : "border-stone-200 bg-stone-50/50 hover:bg-stone-100/70 text-stone-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate">
                        {prov.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {isLocal && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            isSelected
                              ? "bg-emerald-500/30 text-emerald-200"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          100% Local AI
                        </span>
                      )}
                      {isHeuristic && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            isSelected
                              ? "bg-amber-500/30 text-amber-200"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          No Setup
                        </span>
                      )}
                      {!isLocal && !isHeuristic && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            isSelected
                              ? "bg-stone-800 text-stone-300"
                              : "bg-stone-200/80 text-stone-600"
                          }`}
                        >
                          Cloud BYOK
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Provider Configuration Panel */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
              <div>
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <span>{currentProviderMeta.name}</span>
                  {selectedProvider === "ollama" ? (
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-stone-500" />
                  )}
                </span>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {currentProviderMeta.description}
                </p>
              </div>

              {currentProviderMeta.docsUrl && (
                <a
                  href={currentProviderMeta.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 underline font-medium"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Model Selector */}
            {selectedProvider !== "local_heuristic" && (
              <div>
                <label className="block font-semibold text-stone-700 text-[11px] mb-1">
                  Model Selection
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setTestStatus("idle");
                    }}
                    className="flex-1 text-xs px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium text-stone-800"
                  >
                    {/* If Ollama has scanned installed models, present them first */}
                    {selectedProvider === "ollama" &&
                      ollamaInstalledModels.length > 0 && (
                        <optgroup label="Installed on your local machine">
                          {ollamaInstalledModels.map((m) => (
                            <option key={m} value={m}>
                              {m} (Installed)
                            </option>
                          ))}
                        </optgroup>
                      )}
                    <optgroup label="Recommended Models">
                      {currentProviderMeta.models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label} {m.tag ? `— [${m.tag}]` : ""}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  {/* For Ollama: Scan local models button */}
                  {selectedProvider === "ollama" && (
                    <button
                      type="button"
                      onClick={() => scanOllama()}
                      disabled={isScanningOllama}
                      className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      title="Fetch models currently downloaded on your local Ollama instance"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isScanningOllama ? "animate-spin" : ""}`}
                      />
                      <span className="hidden sm:inline">
                        Scan Local Models
                      </span>
                    </button>
                  )}
                </div>

                {/* Custom Model Input Option */}
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] text-stone-500 font-medium">
                    Or enter custom model ID:
                  </span>
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setTestStatus("idle");
                    }}
                    placeholder="e.g. llama3.2:1b, gpt-4o"
                    className="flex-1 text-[11px] font-mono px-2 py-1 bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
              </div>
            )}

            {/* Ollama Local Setup Guide & CORS Tips */}
            {selectedProvider === "ollama" && (
              <div className="space-y-2 p-3 bg-white rounded-lg border border-stone-200 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-stone-700" />
                    Ollama Server Endpoint
                  </span>
                  {ollamaScanMsg && (
                    <span className="text-[10px] text-stone-500 italic">
                      {ollamaScanMsg}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={baseUrlInput || "http://localhost:11434"}
                  onChange={(e) => {
                    setBaseUrlInput(e.target.value);
                    setTestStatus("idle");
                  }}
                  placeholder="http://localhost:11434"
                  className="w-full text-xs font-mono px-3 py-1.5 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
                />

                <div className="p-2 bg-stone-50 rounded border border-stone-200 text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-800">
                    Quick Local Setup Command:
                  </div>
                  <code className="block bg-stone-900 text-emerald-400 px-2 py-1 rounded font-mono text-[10px] select-all">
                    OLLAMA_ORIGINS="*" ollama serve
                  </code>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Setting <code>OLLAMA_ORIGINS="*"</code> allows your web
                    browser to communicate securely with your local Ollama port
                    (11434).
                  </p>
                </div>
              </div>
            )}

            {/* API Key Input for Cloud Providers */}
            {currentProviderMeta.requiresKey && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700 text-[11px]">
                    {currentProviderMeta.name} API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showKey ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                    <span>{showKey ? "Hide" : "Show"}</span>
                  </button>
                </div>

                <input
                  type={showKey ? "text" : "password"}
                  value={apiKeyInput}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder={
                    currentProviderMeta.keyPlaceholder || "Enter API Key..."
                  }
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-white"
                />
              </div>
            )}

            {/* Custom Base URL (For OpenAI / Groq / OpenRouter / Custom Proxies) */}
            {(selectedProvider === "openai" ||
              selectedProvider === "groq" ||
              selectedProvider === "openrouter") && (
              <div>
                <label className="block font-semibold text-stone-700 text-[11px] mb-1">
                  Custom Base URL (Optional, for proxies or LM Studio)
                </label>
                <input
                  type="text"
                  value={baseUrlInput}
                  onChange={(e) => {
                    setBaseUrlInput(e.target.value);
                    setTestStatus("idle");
                  }}
                  placeholder={currentProviderMeta.defaultBaseUrl}
                  className="w-full text-xs font-mono px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 bg-white"
                />
              </div>
            )}

            {/* Connection Test & Latency Ping */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleRunTest}
                disabled={testStatus === "testing"}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Zap
                  className={`w-3.5 h-3.5 ${testStatus === "testing" ? "animate-bounce text-amber-500" : "text-stone-700"}`}
                />
                <span>
                  {testStatus === "testing"
                    ? "Pinging Provider..."
                    : "Test Connection"}
                </span>
              </button>

              {testStatus === "success" && (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-[11px] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Verified {testLatency ? `(${testLatency}ms)` : ""}
                  </span>
                </div>
              )}

              {testStatus === "failed" && (
                <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 text-[11px] font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Connection Failed</span>
                </div>
              )}
            </div>

            {/* Test result text message */}
            {testResultMsg && (
              <div
                className={`p-2.5 rounded-lg text-[11px] leading-relaxed font-mono ${
                  testStatus === "success"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : testStatus === "failed"
                      ? "bg-rose-50 text-rose-900 border border-rose-200"
                      : "bg-stone-100 text-stone-700"
                }`}
              >
                {testResultMsg}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer underline"
          >
            Reset to Built-in Engine
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Apply AI Provider</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
