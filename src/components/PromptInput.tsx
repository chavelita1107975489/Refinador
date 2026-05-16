import { useState } from 'react';
import { 
  Zap, 
  Settings2, 
  MessageSquare, 
  Plus, 
  X,
  Brain,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Technique, PromptExample } from '../types';

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  technique: Technique;
  onTechniqueChange: (t: Technique) => void;
  examples: PromptExample[];
  onExamplesChange: (ex: PromptExample[]) => void;
  taskType: string;
  onTaskTypeChange: (type: string) => void;
  onRefine: () => void;
  isRefining: boolean;
}

const taskTypes = [
  'Escritura creativa',
  'Análisis de datos',
  'Traducción',
  'Resumen',
  'Generación de código',
  'Asistente personal',
  'Marketing / Ventas'
];

export default function PromptInput({
  value,
  onChange,
  technique,
  onTechniqueChange,
  examples,
  onExamplesChange,
  taskType,
  onTaskTypeChange,
  onRefine,
  isRefining
}: PromptInputProps) {
  const [newExampleInput, setNewExampleInput] = useState('');
  const [newExampleOutput, setNewExampleOutput] = useState('');

  const addExample = () => {
    if (newExampleInput && newExampleOutput) {
      onExamplesChange([
        ...examples,
        { id: crypto.randomUUID(), input: newExampleInput, output: newExampleOutput }
      ]);
      setNewExampleInput('');
      setNewExampleOutput('');
    }
  };

  const removeExample = (id: string) => {
    onExamplesChange(examples.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Technique Selector */}
      <div className="flex items-center gap-1 bg-[#111] p-1 rounded-lg border border-[#222] w-fit">
        <button
          onClick={() => onTechniqueChange('zero-shot')}
          className={cn(
            "px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
            technique === 'zero-shot' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/10" : "text-gray-500 hover:text-gray-300"
          )}
        >
          Zero-Shot
        </button>
        <button
          onClick={() => onTechniqueChange('few-shot')}
          className={cn(
            "px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
            technique === 'few-shot' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/10" : "text-gray-500 hover:text-gray-300"
          )}
        >
          Few-Shot
        </button>
        <button
          onClick={() => onTechniqueChange('chain-of-thought')}
          className={cn(
            "px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
            technique === 'chain-of-thought' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/10" : "text-gray-500 hover:text-gray-300"
          )}
        >
          CoT
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5" />
          Raw Input
        </label>
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Introduce tu prompt aquí..."
            className="w-full h-40 bg-[#111] border border-[#262626] rounded-xl p-5 text-sm focus:outline-none focus:border-emerald-500/50 transition-all resize-none text-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <Settings2 className="w-3.5 h-3.5" />
            Task Pattern
          </label>
          <select 
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value)}
            className="w-full bg-[#111] border border-[#262626] rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 transition-all text-xs appearance-none text-gray-300 cursor-pointer"
          >
            {taskTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onRefine}
            disabled={isRefining || !value.trim()}
            className={cn(
              "w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-white text-sm font-bold transition-all",
              isRefining ? "bg-[#161616] border border-[#262626] cursor-not-allowed text-gray-500" : "bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] shadow-lg shadow-emerald-900/20"
            )}
          >
            {isRefining ? (
              <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {isRefining ? "Refining..." : "Refine Prompt"}
          </button>
        </div>
      </div>

      {technique === 'few-shot' && (
        <div className="space-y-4 p-4 rounded-xl bg-[#0d0d0d] border border-[#262626]">
          <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ejemplos (Training Data)</label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {examples.map((ex) => (
              <div key={ex.id} className="group relative flex flex-col gap-1 p-3 bg-[#111] border border-[#262626] rounded-lg">
                <button 
                  onClick={() => removeExample(ex.id)}
                  className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="text-[10px] flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">IN:</span>
                  <span className="text-gray-400 truncate">{ex.input}</span>
                </div>
                <div className="text-[10px] flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">OUT:</span>
                  <span className="text-gray-400 truncate">{ex.output}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 pt-1">
            <div className="flex flex-col gap-2">
              <input 
                value={newExampleInput}
                onChange={(e) => setNewExampleInput(e.target.value)}
                placeholder="Training input..."
                className="bg-[#111] border border-[#262626] rounded-lg px-3 py-2 text-[10px] focus:border-emerald-500/50 outline-none text-gray-300"
              />
              <input 
                value={newExampleOutput}
                onChange={(e) => setNewExampleOutput(e.target.value)}
                placeholder="Expected output..."
                className="bg-[#111] border border-[#262626] rounded-lg px-3 py-2 text-[10px] focus:border-emerald-500/50 outline-none text-gray-300"
              />
            </div>
            <button 
              onClick={addExample}
              disabled={!newExampleInput || !newExampleOutput}
              className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#1a1a1a] border border-[#333] hover:bg-[#222] text-gray-300 transition-colors text-[10px] font-bold disabled:opacity-50"
            >
              <Plus className="w-3 h-3" />
              Save Example
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
