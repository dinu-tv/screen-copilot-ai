import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Camera, Sparkles, Copy, Check, Terminal, 
  Code, FileText, Bug, Table, RefreshCw, Cpu
} from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState("Explain what is on my screen and summarize key points.");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");

  // Check backend server health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      await axios.get('http://127.0.0.1:8000/');
      setServerStatus("online");
    } catch {
      setServerStatus("offline");
    }
  };

  const handleCaptureAndAnalyze = async (customPrompt = null) => {
    const activePrompt = customPrompt || prompt;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/analyze', {
        prompt: activePrompt
      });
      setResponse(res.data.analysis);
      setServerStatus("online");
    } catch (err) {
      setResponse("❌ Error analyzing screen. Make sure FastAPI backend is running on http://127.0.0.1:8000");
      setServerStatus("offline");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrompts = [
    { label: "Summarize Screen", icon: FileText, query: "Explain what is on my screen and summarize key points." },
    { label: "Extract Code", icon: Code, query: "Extract any source code visible on screen and clean it up into formatted code blocks." },
    { label: "Find Bugs / Errors", icon: Bug, query: "Look for any error messages, syntax issues, or bugs on screen and suggest solutions." },
    { label: "Extract Table Data", icon: Table, query: "Extract any tabular or structured data on screen into clean Markdown tables." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                Vision Copilot AI
              </h1>
              <p className="text-xs text-slate-400">Agentic Real-Time Screen Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs">
              <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span className={serverStatus === 'online' ? 'text-emerald-400 font-medium' : 'text-rose-400'}>
                {serverStatus === 'online' ? 'Backend Ready' : 'Backend Offline'}
              </span>
              <button onClick={checkHealth} className="ml-1 text-slate-400 hover:text-white transition">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            <span className="text-xs px-3 py-1.5 bg-indigo-950/80 text-indigo-300 rounded-full border border-indigo-800/60 font-mono hidden sm:inline-block">
              Gemini 3.5 Flash
            </span>
          </div>
        </header>

        {/* Input & Control Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Agent Instruction
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-medium"
              placeholder="e.g. Extract code, analyze spreadsheet, fix error message..."
            />
          </div>

          {/* Preset Quick Chips */}
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-medium">Quick Preset Actions:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickPrompts.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(item.query);
                      handleCaptureAndAnalyze(item.query);
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-xs text-slate-300 hover:text-indigo-300 transition cursor-pointer text-left disabled:opacity-50"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={() => handleCaptureAndAnalyze()}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>Capturing Screen & Executing Agent...</span>
              </div>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Capture Screen & Execute AI Agent</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        {response && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Agent Analysis Output</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied to Clipboard!" : "Copy Output"}
              </button>
            </div>
            
            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto bg-slate-950 p-4 rounded-xl border border-slate-800/80 max-h-[500px] overflow-y-auto">
              {response}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}