import { GoogleGenAI } from "@google/genai";
import { AiModelConfig, AiProvider } from "../types";

export interface ProviderMeta {
  id: AiProvider;
  name: string;
  category: "cloud" | "local" | "heuristic";
  description: string;
  defaultModel: string;
  models: { id: string; label: string; tag?: string }[];
  defaultBaseUrl?: string;
  requiresKey: boolean;
  keyPlaceholder?: string;
  docsUrl?: string;
}

export const AI_PROVIDERS: Record<AiProvider, ProviderMeta> = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    category: "cloud",
    description:
      "Direct browser BYOK connection to Google's multimodal frontier models.",
    defaultModel: "gemini-3.8-flash",
    models: [
      {
        id: "gemini-3.8-flash",
        label: "Gemini 3.8 Flash",
        tag: "Fast & Recommended (2026 Flagship)",
      },
      {
        id: "gemini-3.1-pro-preview",
        label: "Gemini 3.1 Pro",
        tag: "High Reasoning & Synthesis",
      },
      {
        id: "gemini-3.1-flash-lite",
        label: "Gemini 3.1 Flash Lite",
        tag: "Ultra-Low Latency",
      },
      {
        id: "gemini-flash-latest",
        label: "Gemini Flash (Latest)",
        tag: "Dynamic Alias",
      },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", tag: "Stable LTS" },
      {
        id: "gemini-2.5-pro",
        label: "Gemini 2.5 Pro",
        tag: "Deep Analysis LTS",
      },
    ],
    requiresKey: true,
    keyPlaceholder: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    category: "cloud",
    description:
      "Direct browser BYOK to OpenAI GPT-4o and frontier reasoning models.",
    defaultModel: "gpt-4o",
    models: [
      { id: "gpt-4o", label: "GPT-4o (Omni)", tag: "Flagship Multimodal" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini", tag: "Fast & Efficient" },
      { id: "o3-mini", label: "o3-mini", tag: "High-Speed STEM & Logic" },
      { id: "o3", label: "o3", tag: "Deep Frontier Reasoning" },
      { id: "o1", label: "o1", tag: "Complex Multi-step Thinking" },
      {
        id: "chatgpt-4o-latest",
        label: "ChatGPT-4o Latest",
        tag: "Dynamic Pointer",
      },
    ],
    defaultBaseUrl: "https://api.openai.com/v1",
    requiresKey: true,
    keyPlaceholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    category: "cloud",
    description:
      "Direct BYOK client to Claude 3.7 & 3.5 models with articulate tone synthesis.",
    defaultModel: "claude-3-7-sonnet-latest",
    models: [
      {
        id: "claude-3-7-sonnet-latest",
        label: "Claude 3.7 Sonnet",
        tag: "Latest Hybrid Reasoning",
      },
      {
        id: "claude-3-5-sonnet-latest",
        label: "Claude 3.5 Sonnet",
        tag: "Precision & Coding",
      },
      {
        id: "claude-3-5-haiku-latest",
        label: "Claude 3.5 Haiku",
        tag: "Ultra-Fast",
      },
      {
        id: "claude-3-opus-latest",
        label: "Claude 3 Opus",
        tag: "Maximum Depth",
      },
    ],
    requiresKey: true,
    keyPlaceholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  groq: {
    id: "groq",
    name: "Groq Cloud",
    category: "cloud",
    description:
      "Ultra-fast LPU inference hosting DeepSeek-R1 and Llama 3.3 at 500+ tokens/sec.",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      {
        id: "llama-3.3-70b-versatile",
        label: "Llama 3.3 70B Versatile",
        tag: "Top Speed (500+ tok/s)",
      },
      {
        id: "deepseek-r1-distill-llama-70b",
        label: "DeepSeek-R1 Distill Llama 70B",
        tag: "Fast Reasoning",
      },
      {
        id: "llama-3.1-8b-instant",
        label: "Llama 3.1 8B Instant",
        tag: "Sub-second",
      },
      {
        id: "qwen-2.5-coder-32b",
        label: "Qwen 2.5 Coder 32B",
        tag: "Technical Precision",
      },
      {
        id: "qwen-2.5-72b-versatile",
        label: "Qwen 2.5 72B Versatile",
        tag: "High Capacity",
      },
    ],
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    requiresKey: true,
    keyPlaceholder: "gsk_...",
    docsUrl: "https://console.groq.com/keys",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    category: "cloud",
    description:
      "Unified gateway providing access to DeepSeek, Llama, Claude, and 200+ models.",
    defaultModel: "deepseek/deepseek-r1",
    models: [
      {
        id: "deepseek/deepseek-r1",
        label: "DeepSeek R1",
        tag: "Open Reasoning",
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct",
        label: "Meta Llama 3.3 70B",
        tag: "Open Weights",
      },
      {
        id: "anthropic/claude-3.7-sonnet",
        label: "Anthropic Claude 3.7 Sonnet",
        tag: "Curated",
      },
      {
        id: "google/gemini-3.8-flash",
        label: "Google Gemini 3.8 Flash",
        tag: "High Speed 2026",
      },
      {
        id: "google/gemini-3.1-pro-preview",
        label: "Google Gemini 3.1 Pro",
        tag: "Deep Reasoning",
      },
      { id: "openai/gpt-4o", label: "OpenAI GPT-4o", tag: "Omni" },
      {
        id: "qwen/qwen-2.5-72b-instruct",
        label: "Qwen 2.5 72B Instruct",
        tag: "Multilingual",
      },
    ],
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    requiresKey: true,
    keyPlaceholder: "sk-or-v1-...",
    docsUrl: "https://openrouter.ai/keys",
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Local AI)",
    category: "local",
    description:
      "100% private, zero-egress local AI running directly on your machine. Data never leaves your device.",
    defaultModel: "llama3.3",
    models: [
      { id: "llama3.3", label: "Llama 3.3 (70B)", tag: "Recommended Flagship" },
      {
        id: "llama3.2",
        label: "Llama 3.2 (3B / 1B)",
        tag: "Ultra-Lightweight",
      },
      {
        id: "deepseek-r1:8b",
        label: "DeepSeek-R1 (8B)",
        tag: "Local Reasoning",
      },
      {
        id: "deepseek-r1:14b",
        label: "DeepSeek-R1 (14B)",
        tag: "Deep Local Reasoning",
      },
      {
        id: "qwen2.5-coder:7b",
        label: "Qwen 2.5 Coder (7B)",
        tag: "Code & Tech",
      },
      { id: "qwen2.5:7b", label: "Qwen 2.5 (7B)", tag: "Multilingual" },
      { id: "phi4", label: "Phi-4 (14B)", tag: "Dense Logic & Math" },
      { id: "mistral-small", label: "Mistral Small (24B)", tag: "Balanced" },
      { id: "gemma2:9b", label: "Gemma 2 (9B)", tag: "Google Open Weights" },
    ],
    defaultBaseUrl: "http://localhost:11434",
    requiresKey: false,
    docsUrl: "https://ollama.com",
  },
  local_heuristic: {
    id: "local_heuristic",
    name: "Deterministic Rule Engine",
    category: "heuristic",
    description:
      "Instant zero-dependency client-side algorithm. Quantifies metrics, rewrites bullets, and aligns keywords with no AI models required.",
    defaultModel: "built-in-nlp",
    models: [
      {
        id: "built-in-nlp",
        label: "Built-in Rule & Keyword Engine",
        tag: "Zero Setup",
      },
    ],
    requiresKey: false,
  },
};

export const DEFAULT_AI_CONFIG: AiModelConfig = {
  provider: "local_heuristic",
  model: "built-in-nlp",
  baseUrl: "http://localhost:11434",
};

/**
 * Fetch installed models list from local Ollama instance
 */
export async function fetchOllamaModels(
  baseUrl = "http://localhost:11434",
): Promise<string[]> {
  const cleanUrl = baseUrl.trim().replace(/\/$/, "");
  const res = await fetch(`${cleanUrl}/api/tags`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Ollama response status ${res.status}`);
  }
  const data = await res.json();
  if (Array.isArray(data.models)) {
    return data.models.map((m: any) => m.name || m.model);
  }
  return [];
}

/**
 * Clean and parse JSON from model responses (handling markdown backticks ```json ... ``` and <think>...</think> tags)
 */
export function extractJsonFromResponse(raw: string): any {
  if (!raw) return null;
  // Strip out thought / reasoning tokens emitted by DeepSeek-R1, QwQ, etc.
  const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to regex extractor
  }

  // Extract from markdown code blocks
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Find first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Continue
    }
  }

  // Find first [ and last ]
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const candidate = cleaned.substring(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Continue
    }
  }

  return null;
}

export interface AiPromptRequest {
  prompt: string;
  systemPrompt?: string;
  jsonMode?: boolean;
  temperature?: number;
}

/**
 * Execute AI text/json generation through the active configured provider
 */
export async function executeAiCompletion(
  config: AiModelConfig,
  request: AiPromptRequest,
): Promise<string> {
  const { provider, model, apiKey, baseUrl, temperature } = config;
  const effectiveTemp = temperature ?? request.temperature ?? 0.4;

  if (provider === "local_heuristic") {
    throw new Error(
      "Local heuristic provider does not run LLM prompts directly.",
    );
  }

  // 1. Google Gemini (Official @google/genai SDK)
  if (provider === "gemini") {
    if (!apiKey || apiKey.trim().length < 10) {
      throw new Error("Please configure a valid Gemini API key.");
    }
    const ai = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const targetModel = model || "gemini-3.8-flash";
    const genConfig: Record<string, any> = {
      temperature: effectiveTemp,
    };

    if (request.systemPrompt) {
      genConfig.systemInstruction = request.systemPrompt;
    }
    if (request.jsonMode) {
      genConfig.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: request.prompt,
      config: genConfig,
    });

    const outputText = response.text || "";
    return outputText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }

  // 2. OpenAI, Groq, OpenRouter (OpenAI-compatible chat completion endpoints)
  if (
    provider === "openai" ||
    provider === "groq" ||
    provider === "openrouter"
  ) {
    if (!apiKey || apiKey.trim().length < 5) {
      throw new Error(
        `Please configure an API key for ${AI_PROVIDERS[provider].name}.`,
      );
    }

    const hostUrl =
      baseUrl ||
      AI_PROVIDERS[provider].defaultBaseUrl ||
      "https://api.openai.com/v1";
    const endpoint = `${hostUrl.replace(/\/$/, "")}/chat/completions`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    };

    if (provider === "openrouter") {
      headers["HTTP-Referer"] =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://curatecv.local";
      headers["X-Title"] = "CurateCV ATS Studio";
    }

    const targetModel = model || AI_PROVIDERS[provider].defaultModel;
    // Reasoning models (e.g. OpenAI o1, o3, o3-mini) forbid the temperature parameter
    const isReasoningModel = /^(o1|o3|o4)/i.test(targetModel);

    const messages: {
      role: "system" | "user" | "developer";
      content: string;
    }[] = [];
    if (request.systemPrompt) {
      // For reasoning models, developer/system role guidance
      messages.push({
        role: isReasoningModel ? "developer" : "system",
        content:
          request.systemPrompt +
          (request.jsonMode ? "\nYou must return valid JSON only." : ""),
      });
    }
    messages.push({ role: "user", content: request.prompt });

    const payload: Record<string, any> = {
      model: targetModel,
      messages,
    };

    if (!isReasoningModel) {
      payload.temperature = effectiveTemp;
    }

    if (request.jsonMode) {
      // Pass json_object format for structured output
      payload.response_format = { type: "json_object" };
    }

    let res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    // Graceful fallback if a specific model or endpoint rejects response_format
    if (!res.ok && request.jsonMode) {
      const errTextPeek = await res.clone().text();
      if (errTextPeek.includes("response_format")) {
        delete payload.response_format;
        res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }
    }

    if (!res.ok) {
      const errText = await res.text();
      let errJsonMsg = errText;
      try {
        const parsedErr = JSON.parse(errText);
        errJsonMsg = parsedErr.error?.message || errText;
      } catch {
        // use raw
      }
      throw new Error(
        `${AI_PROVIDERS[provider].name} error (${res.status}): ${errJsonMsg}`,
      );
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    return rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }

  // 3. Anthropic Claude
  if (provider === "anthropic") {
    if (!apiKey || apiKey.trim().length < 10) {
      throw new Error("Please configure a valid Anthropic Claude API key.");
    }

    const endpoint = "https://api.anthropic.com/v1/messages";
    const systemText = request.systemPrompt
      ? `${request.systemPrompt}${request.jsonMode ? " Return ONLY a valid JSON object." : ""}`
      : request.jsonMode
        ? "Return ONLY a valid JSON object."
        : undefined;

    const targetModel = model || "claude-3-7-sonnet-latest";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
        "dangerously-allow-browser": "true",
      },
      body: JSON.stringify({
        model: targetModel,
        max_tokens: 8192,
        system: systemText,
        messages: [{ role: "user", content: request.prompt }],
        temperature: effectiveTemp,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errJsonMsg = errText;
      try {
        const parsed = JSON.parse(errText);
        errJsonMsg = parsed.error?.message || errText;
      } catch {
        // raw
      }
      throw new Error(`Anthropic error (${res.status}): ${errJsonMsg}`);
    }

    const data = await res.json();
    const rawContent = data.content?.[0]?.text || "";
    return rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }

  // 4. Ollama (100% Local AI)
  if (provider === "ollama") {
    const host = (baseUrl || "http://localhost:11434")
      .trim()
      .replace(/\/$/, "");
    const endpoint = `${host}/api/chat`;

    const messages: { role: string; content: string }[] = [];
    if (request.systemPrompt) {
      messages.push({
        role: "system",
        content: `${request.systemPrompt}${request.jsonMode ? " You must respond with valid JSON only." : ""}`,
      });
    }
    messages.push({ role: "user", content: request.prompt });

    const targetModel = model || "llama3.3";
    const payload: any = {
      model: targetModel,
      messages,
      stream: false,
      options: {
        temperature: effectiveTemp,
      },
    };

    if (request.jsonMode) {
      payload.format = "json";
    }

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (networkErr: any) {
      throw new Error(
        `Failed to reach Ollama at ${host}. If Ollama is running locally, ensure CORS is allowed by starting it with:\nOLLAMA_ORIGINS="*" ollama serve`,
      );
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Ollama error (${res.status}): ${errText || "Model execution error"}`,
      );
    }

    const data = await res.json();
    const rawContent = data.message?.content || "";
    return rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }

  throw new Error(`Unsupported AI Provider: ${provider}`);
}

/**
 * Test connectivity for any provider and return latency and verification message
 */
export async function testAiConnection(config: AiModelConfig): Promise<{
  success: boolean;
  latencyMs: number;
  message: string;
  responsePreview?: string;
}> {
  const start = performance.now();

  if (config.provider === "local_heuristic") {
    return {
      success: true,
      latencyMs: 1,
      message:
        "Built-in deterministic NLP & rule engine is active. Ready instantly with zero configuration.",
    };
  }

  try {
    const response = await executeAiCompletion(config, {
      prompt: 'Respond with exactly the single word "READY". No punctuation.',
    });

    const elapsed = Math.round(performance.now() - start);
    const clean = response.trim();

    return {
      success: true,
      latencyMs: elapsed,
      message: `Connected successfully to ${AI_PROVIDERS[config.provider].name} (${config.model}) in ${elapsed}ms.`,
      responsePreview: clean.slice(0, 100),
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - start);
    return {
      success: false,
      latencyMs: elapsed,
      message: err.message || "Connection failed.",
    };
  }
}
