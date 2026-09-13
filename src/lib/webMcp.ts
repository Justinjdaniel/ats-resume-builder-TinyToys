import {
  MasterProfile,
  JobDescription,
  CoverLetter,
  TemplateTheme,
  AgentActivityLog,
} from "../types";
import {
  computeLocalAtsMatch,
  generateTargetedCoverLetter,
} from "./aiAtsService";
import {
  exportResumeToDocx,
  formatResumeAsMarkdown,
  formatResumeAsPlainText,
} from "./docxExport";

export type WebMcpEventHandler = (action: string, data: any) => void;

class WebMcpBridge {
  private listeners: WebMcpEventHandler[] = [];
  public activityLogs: AgentActivityLog[] = [];

  constructor() {
    this.initContext();
  }

  public subscribe(handler: WebMcpEventHandler): () => void {
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== handler);
    };
  }

  private notify(action: string, data: any) {
    this.listeners.forEach((fn) => fn(action, data));
  }

  public logActivity(
    toolName: string,
    status: "invoked" | "success" | "error",
    details: string,
  ) {
    const log: AgentActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      toolName,
      status,
      details,
    };
    this.activityLogs = [log, ...this.activityLogs.slice(0, 49)];
    this.notify("log_added", log);
  }

  private initContext() {
    if (typeof window === "undefined") return;

    // Polyfill or hook into document.modelContext if not natively present in browser
    const doc = document as any;
    if (!doc.modelContext) {
      doc.modelContext = {
        tools: new Map(),
        registerTool: (definition: any) => {
          doc.modelContext.tools.set(definition.name, definition);
          console.info(
            `[WebMCP] Registered imperative tool: ${definition.name}`,
          );
        },
        invokeTool: async (name: string, args: any) => {
          const tool = doc.modelContext.tools.get(name);
          if (!tool) throw new Error(`Tool ${name} is not registered.`);
          return await tool.handler(args);
        },
      };
    }

    // Expose on window for easy browser extension/agent inspection
    (window as any).__webMcp = doc.modelContext;
  }

  public registerAllTools(
    getProfile: () => MasterProfile,
    updateProfile: (p: MasterProfile) => void,
    getJd: () => JobDescription,
    updateJd: (jd: JobDescription) => void,
    getApiKey: () => string | undefined,
    updateCoverLetter: (cl: CoverLetter) => void,
  ) {
    const doc = document as any;
    if (!doc.modelContext?.registerTool) return;

    // 1. populateJobDescription
    doc.modelContext.registerTool({
      name: "populateJobDescription",
      description:
        "Ingests target job title, company, and JD text, triggering real-time ATS keyword matching.",
      inputSchema: {
        type: "object",
        properties: {
          jobTitle: { type: "string" },
          company: { type: "string" },
          rawText: { type: "string" },
        },
        required: ["jobTitle", "company", "rawText"],
      },
      handler: async (args: {
        jobTitle: string;
        company: string;
        rawText: string;
      }) => {
        this.logActivity(
          "populateJobDescription",
          "invoked",
          `Received JD for ${args.jobTitle} at ${args.company}`,
        );
        const newJd: JobDescription = {
          id: `jd-${Date.now()}`,
          title: args.jobTitle,
          company: args.company,
          rawText: args.rawText,
          parsedKeywords: [],
          createdAt: new Date().toISOString(),
        };
        updateJd(newJd);
        const match = computeLocalAtsMatch(getProfile(), newJd);
        this.logActivity(
          "populateJobDescription",
          "success",
          `ATS Score calculated: ${match.overallScore}% with ${match.matchedKeywords.length} matched keywords.`,
        );
        return {
          success: true,
          matchScore: match.overallScore,
          matchedKeywords: match.matchedKeywords,
          missingKeywords: match.missingKeywords,
        };
      },
    });

    // 2. triggerAtsOptimization
    doc.modelContext.registerTool({
      name: "triggerAtsOptimization",
      description:
        "Performs lexical and semantic ATS matching against the current target job description.",
      inputSchema: {
        type: "object",
        properties: {
          focusArea: { type: "string", enum: ["all", "skills", "experience"] },
        },
      },
      handler: async (args: { focusArea?: string }) => {
        this.logActivity(
          "triggerAtsOptimization",
          "invoked",
          `Running ATS analysis (Focus: ${args?.focusArea || "all"})`,
        );
        const match = computeLocalAtsMatch(getProfile(), getJd());
        this.logActivity(
          "triggerAtsOptimization",
          "success",
          `Score: ${match.overallScore}%. Generated ${match.bulletPointSuggestions.length} suggestions.`,
        );
        return {
          overallScore: match.overallScore,
          matchedKeywords: match.matchedKeywords,
          missingKeywords: match.missingKeywords,
          suggestions: match.bulletPointSuggestions,
          summaryFeedback: match.summaryFeedback,
        };
      },
    });

    // 3. generateCoverLetter
    doc.modelContext.registerTool({
      name: "generateCoverLetter",
      description:
        "Generates a tailored cover letter customized to the target JD using BYOK Gemini AI or local synthesis.",
      inputSchema: {
        type: "object",
        properties: {
          tone: { type: "string", enum: ["executive", "technical", "modern"] },
        },
      },
      handler: async (args: {
        tone?: "executive" | "technical" | "modern";
      }) => {
        const tone = args?.tone || "modern";
        this.logActivity(
          "generateCoverLetter",
          "invoked",
          `Synthesizing cover letter with tone '${tone}'`,
        );
        const cl = await generateTargetedCoverLetter(
          getProfile(),
          getJd(),
          getApiKey(),
          tone,
        );
        updateCoverLetter(cl);
        this.logActivity(
          "generateCoverLetter",
          "success",
          `Generated ${cl.bodyParagraphs.length} paragraphs for ${cl.company}`,
        );
        return {
          success: true,
          coverLetter: cl,
        };
      },
    });

    // 4. exportResume
    doc.modelContext.registerTool({
      name: "exportResume",
      description:
        "Triggers client-side export in DOCX, Markdown, or Plain Text format.",
      inputSchema: {
        type: "object",
        properties: {
          format: { type: "string", enum: ["docx", "markdown", "text"] },
          template: {
            type: "string",
            enum: ["modern", "professional", "creative"],
          },
        },
        required: ["format"],
      },
      handler: async (args: {
        format: "docx" | "markdown" | "text";
        template?: TemplateTheme;
      }) => {
        const profile = getProfile();
        this.logActivity(
          "exportResume",
          "invoked",
          `Exporting resume as ${args.format}`,
        );
        if (args.format === "docx") {
          await exportResumeToDocx(profile, args.template || "modern");
          this.logActivity(
            "exportResume",
            "success",
            "Downloaded Word .docx file",
          );
          return {
            success: true,
            message: "DOCX file generated and triggered download.",
          };
        } else if (args.format === "markdown") {
          const md = formatResumeAsMarkdown(profile);
          this.logActivity(
            "exportResume",
            "success",
            "Generated Markdown output",
          );
          return { success: true, markdown: md };
        } else {
          const txt = formatResumeAsPlainText(profile);
          this.logActivity(
            "exportResume",
            "success",
            "Generated Plain Text output",
          );
          return { success: true, text: txt };
        }
      },
    });

    // 5. getResumeSummary
    doc.modelContext.registerTool({
      name: "getResumeSummary",
      description:
        "Retrieves high-level summary of candidate profile, top skills, and career history.",
      inputSchema: { type: "object", properties: {} },
      handler: async () => {
        const profile = getProfile();
        this.logActivity(
          "getResumeSummary",
          "invoked",
          "Querying profile summary",
        );
        const summary = {
          fullName: profile.personalInfo.fullName,
          headline: profile.personalInfo.headline,
          email: profile.personalInfo.email,
          totalExperienceYears: 10,
          topSkills: profile.skillCategories
            .flatMap((c) => c.skills)
            .slice(0, 12),
          experienceCount: profile.experiences.length,
          projectCount: profile.projects.length,
        };
        this.logActivity(
          "getResumeSummary",
          "success",
          `Summary returned for ${summary.fullName}`,
        );
        return summary;
      },
    });

    // Declarative JSON-LD injection
    this.injectDeclarativeMetadata(getProfile());
  }

  private injectDeclarativeMetadata(profile: MasterProfile) {
    if (typeof document === "undefined") return;
    const existing = document.getElementById("resume-webmcp-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "resume-webmcp-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.personalInfo.fullName,
      jobTitle: profile.personalInfo.headline,
      email: profile.personalInfo.email,
      telephone: profile.personalInfo.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.personalInfo.location,
      },
      knowsAbout: profile.skillCategories.flatMap((c) => c.skills),
      webMcpReady: true,
      availableTools: [
        "populateJobDescription",
        "triggerAtsOptimization",
        "generateCoverLetter",
        "exportResume",
        "getResumeSummary",
      ],
    });
    document.head.appendChild(script);
  }
}

export const webMcpService = new WebMcpBridge();
