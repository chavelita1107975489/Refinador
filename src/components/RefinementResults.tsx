import { 
  Check, 
  Copy, 
  Save, 
  Info, 
  AlertCircle, 
  Plus,
  Zap,
  Layout,
  User,
  Target,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { RefinedPromptResult } from '../types';
import { cn } from '../lib/utils';

interface RefinementResultsProps {
  result: RefinedPromptResult;
  onSave: () => void;
  isSaved: boolean;
}

export default function RefinementResults({ result, onSave, isSaved }: RefinementResultsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.refinedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[#0d0d0d] border-emerald-500/20 shadow-emerald-500/5';
    if (score >= 50) return 'bg-[#0d0d0d] border-amber-500/20 shadow-amber-500/5';
    return 'bg-[#0d0d0d] border-red-500/20 shadow-red-500/5';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Structure Analysis */}
        <div className="md:col-span-8 bg-[#0d0d0d] border border-[#262626] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Structure Analysis</span>
            <span className={cn(
              "text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-tighter",
              result.precision >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
            )}>
              {result.precision >= 80 ? 'Optimal' : 'Incomplete'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { label: 'Role', value: result.components.role, status: result.components.role ? 'Detected' : 'Missing' },
              { label: 'Task', value: result.components.task, status: result.components.task ? 'Detected' : 'Missing' },
              { label: 'Context', value: result.components.context, status: result.components.context ? 'Clear' : 'Vague' },
              { label: 'Format', value: result.components.format, status: result.components.format ? 'Specified' : 'Missing' },
            ].map((comp, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-[#1a1a1a] pb-1 cursor-default group">
                <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">{comp.label}:</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase",
                  comp.status === 'Detected' || comp.status === 'Clear' || comp.status === 'Specified' ? "text-emerald-500" : "text-red-400"
                )} title={comp.value}>
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Block */}
        <div className="md:col-span-4 bg-[#0d0d0d] border border-[#262626] rounded-xl p-5 flex flex-col justify-center items-center shadow-xl">
          <div className={cn("text-4xl font-light", getScoreColor(result.precision))}>
            {result.precision}<span className="text-sm text-gray-600">/100</span>
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-bold mt-2 tracking-widest">Precision Score</div>
          
          <button 
            onClick={onSave}
            disabled={isSaved}
            className={cn(
              "mt-4 w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
              isSaved ? "bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
            )}
          >
            <Save className="w-3.5 h-3.5" />
            {isSaved ? "Saved to Logs" : "Save and Archive"}
          </button>
        </div>
      </div>

      {/* Refined Output area */}
      <div className="border-t border-[#262626] bg-[#0f0f0f] p-6 rounded-2xl shadow-inner">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Layout className="w-3.5 h-3.5" />
            Refined Output (v{isSaved ? 'Archive' : 'Active'})
          </h3>
          <button 
            onClick={copyToClipboard}
            className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Prompt
          </button>
        </div>
        <div className="p-5 bg-black border border-emerald-900/20 rounded-xl leading-relaxed text-gray-400 shadow-2xl">
          <div className="markdown-body">
            <ReactMarkdown>{result.refinedPrompt}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="bg-emerald-950/10 border border-emerald-800/20 rounded-xl p-4">
          <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Prompt Engineering Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.suggestions.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-[11px] text-emerald-100/60 leading-relaxed italic">"{s}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
