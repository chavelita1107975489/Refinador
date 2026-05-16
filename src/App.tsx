/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  History, 
  Settings2, 
  Trash2, 
  Save, 
  ChevronRight,
  Zap,
  BookOpen,
  Brain,
  MessageSquare
} from 'lucide-react';
import { cn } from './lib/utils';
import { Technique, SavedPrompt, RefinedPromptResult, PromptExample } from './types';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import RefinementResults from './components/RefinementResults';
import HistoryList from './components/HistoryList';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [technique, setTechnique] = useState<Technique>('zero-shot');
  const [examples, setExamples] = useState<PromptExample[]>([]);
  const [taskType, setTaskType] = useState('Escritura creativa');
  const [isRefining, setIsRefining] = useState(false);
  const [result, setResult] = useState<RefinedPromptResult | null>(null);
  const [history, setHistory] = useState<SavedPrompt[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  const handleRefine = async () => {
    if (!prompt.trim()) return;
    
    setIsRefining(true);
    setResult(null);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          technique,
          examples,
          taskType
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error refining prompt:', error);
      alert('Hubo un error al refinar el prompt. Por favor intenta de nuevo.');
    } finally {
      setIsRefining(false);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    
    const newSaved: SavedPrompt = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      original: prompt,
      refined: result.refinedPrompt,
      technique,
      result,
      name: `Refinamiento ${history.length + 1}`
    };

    setHistory([newSaved, ...history]);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(history.filter(p => p.id !== id));
  };

  const loadFromHistory = (saved: SavedPrompt) => {
    setPrompt(saved.original);
    setTechnique(saved.technique);
    setResult(saved.result);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleHistory={() => setShowHistory(!showHistory)} historyCount={history.length} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input and Configuration */}
          <div className={cn(
            "lg:col-span-12 transition-all duration-300",
            result ? "lg:col-span-5" : "lg:col-span-12 max-w-3xl mx-auto w-full"
          )}>
            <div className="space-y-6">
              <PromptInput 
                value={prompt}
                onChange={setPrompt}
                technique={technique}
                onTechniqueChange={setTechnique}
                examples={examples}
                onExamplesChange={setExamples}
                taskType={taskType}
                onTaskTypeChange={setTaskType}
                onRefine={handleRefine}
                isRefining={isRefining}
              />
            </div>
          </div>

          {/* Right Column: Results */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7"
            >
              <RefinementResults 
                result={result} 
                onSave={saveToHistory}
                isSaved={history.some(h => h.refined === result.refinedPrompt)}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 shadow-2xl overflow-y-auto"
            >
              <HistoryList 
                history={history} 
                onClose={() => setShowHistory(false)}
                onDelete={deleteFromHistory}
                onLoad={loadFromHistory}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="h-10 bg-[#111] border-t border-[#262626] flex items-center px-6 text-[10px] text-gray-600 justify-between shrink-0">
        <div className="flex gap-6">
          <span className="uppercase font-bold tracking-tighter">System: <span className="text-gray-400">f392-aa01</span></span>
          <span className="uppercase font-bold tracking-tighter">Cloud Sync: <span className="text-emerald-500">Active</span></span>
        </div>
        <div className="flex gap-6">
          <span className="hidden sm:block">Refinador de Prompts Pro &bull; v4.2 stable</span>
          <span className="uppercase font-bold tracking-tighter">Model: <span className="text-gray-400">Gemini 3 Flash</span></span>
        </div>
      </footer>
    </div>
  );
}

