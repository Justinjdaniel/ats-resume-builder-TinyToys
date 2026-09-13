import React, { useState, useEffect } from "react";
import { webMcpService } from "../lib/webMcp";
import { AgentActivityLog } from "../types";
import {
  Bot,
  Terminal,
  Play,
  CheckCircle2,
  Cpu,
  ShieldCheck,
} from "lucide-react";

export const WebMcpPanel: React.FC = () => {
  const [logs, setLogs] = useState<AgentActivityLog[]>(
    () => webMcpService.activityLogs,
  );
  const [simulatingTool, setSimulatingTool] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = webMcpService.subscribe((action) => {
      if (action === "log_added") {
        setLogs([...webMcpService.activityLogs]);
      }
    });
    return unsubscribe;
  }, []);

  const runSimulation = async (toolName: string) => {
    setSimulatingTool(toolName);
    setSimulationResult(null);
    try {
      const doc = document as any;
      if (doc.modelContext?.invokeTool) {
        let result: any;
        if (toolName === "populateJobDescription") {
          result = await doc.modelContext.invokeTool("populateJobDescription", {
            jobTitle: "Principal Cloud Platform Architect",
            company: "NextGen Autonomous Systems",
            rawText:
              "Seeking Principal Cloud Architect with deep mastery in Kubernetes, Go, Zero-Trust Architecture, and Kafka event pipelines.",
          });
        } else if (toolName === "triggerAtsOptimization") {
          result = await doc.modelContext.invokeTool("triggerAtsOptimization", {
            focusArea: "all",
          });
        } else if (toolName === "generateCoverLetter") {
          result = await doc.modelContext.invokeTool("generateCoverLetter", {
            tone: "technical",
          });
        } else if (toolName === "exportResume") {
          result = await doc.modelContext.invokeTool("exportResume", {
            format: "markdown",
            template: "modern",
          });
        } else if (toolName === "getResumeSummary") {
          result = await doc.modelContext.invokeTool("getResumeSummary", {});
        }
        setSimulationResult(JSON.stringify(result, null, 2));
      }
    } catch (e: any) {
      setSimulationResult(`Error: ${e.message}`);
    } finally {
      setSimulatingTool(null);
    }
  };

  const toolsList = [
    {
      name: "populateJobDescription",
      desc: "Ingests target role and JD text, triggering instant ATS scoring.",
      args: "{ jobTitle, company, rawText }",
    },
    {
      name: "triggerAtsOptimization",
      desc: "Calculates keyword match score and bullet-point suggestions.",
      args: '{ focusArea?: "all" | "skills" | "experience" }',
    },
    {
      name: "generateCoverLetter",
      desc: "Generates a tailored cover letter customized to the target JD.",
      args: '{ tone?: "executive" | "modern" | "technical" }',
    },
    {
      name: "exportResume",
      desc: "Exports resume as DOCX, Markdown, or Plain Text.",
      args: '{ format: "docx" | "markdown" | "text" }',
    },
    {
      name: "getResumeSummary",
      desc: "Returns candidate profile summary and top technical skills.",
      args: "{}",
    },
  ];

  return (
    <div id="webmcp-inspector-pane" className="space-y-4">
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-stone-800" />
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                WebMCP Agent Protocol Interface
              </h3>
              <p className="text-xs text-stone-500">
                Autonomous browser AI tools exposed via{" "}
                <code className="text-stone-800 bg-stone-100 px-1 py-0.5 rounded font-mono">
                  document.modelContext.registerTool
                </code>
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            WebMCP Active
          </span>
        </div>

        {/* Declarative Status Banner */}
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
          <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
          <span>
            Declarative JSON-LD{" "}
            <code className="text-stone-800 font-mono">schema.org/Person</code>{" "}
            injected into page head for zero-shot agent discovery.
          </span>
        </div>

        {/* Registered Tools List */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Exposed Imperative Tools
          </h4>
          <div className="space-y-2">
            {toolsList.map((t) => (
              <div
                key={t.name}
                className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2"
              >
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span className="font-mono font-bold text-stone-900">
                      {t.name}
                    </span>
                  </div>
                  <p className="text-stone-600">{t.desc}</p>
                  <div className="text-[11px] font-mono text-stone-400">
                    Schema: {t.args}
                  </div>
                </div>

                <button
                  id={`btn-simulate-${t.name}`}
                  onClick={() => runSimulation(t.name)}
                  disabled={simulatingTool === t.name}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-800 transition-colors shadow-xs text-xs"
                >
                  <Play className="w-3 h-3 text-stone-600" />
                  <span>
                    {simulatingTool === t.name ? "Executing..." : "Test Tool"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Output Output Box */}
        {simulationResult && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">
                Simulator Output:
              </span>
              <button
                onClick={() => setSimulationResult(null)}
                className="text-[11px] text-stone-500 hover:text-stone-800"
              >
                Clear
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 text-[11px] font-mono rounded-lg overflow-x-auto max-h-48 border border-stone-800">
              {simulationResult}
            </pre>
          </div>
        )}
      </div>

      {/* Real-Time Agent Activity Log */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
            <Terminal className="w-4 h-4 text-stone-700" />
            <span>Agent Interaction Stream ({logs.length})</span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            Live event log
          </span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-2 bg-stone-50 border border-stone-200/80 rounded-md text-[11px] font-mono flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-stone-900">
                      [{log.toolName}]
                    </span>
                    <span className="text-stone-400 text-[10px]">
                      {log.timestamp}
                    </span>
                  </div>
                  <div className="text-stone-600 mt-0.5">{log.details}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-stone-400 italic text-center py-4">
              No agent events recorded yet. Click "Test Tool" above to simulate
              an autonomous AI call.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
