import { Sparkles, History } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export default function Header({ onToggleHistory, historyCount }: HeaderProps) {
  return (
    <header className="h-16 sticky top-0 z-30 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-[#262626] px-6 shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
          <Sparkles className="text-black w-5 h-5" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-gray-200">
          Aura <span className="text-emerald-500 font-light">Refiner</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-[#1a1a1a] rounded-full px-3 py-1 border border-[#333]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Engine v4.2 Active</span>
        </div>
        
        <button 
          onClick={onToggleHistory}
          className="relative group flex items-center gap-2 px-4 py-1.5 rounded bg-[#1a1a1a] border border-[#333] hover:border-emerald-500/50 hover:bg-[#222] transition-all"
        >
          <History className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
          <span className="text-xs font-medium text-gray-300">Historial</span>
          {historyCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-lg">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
