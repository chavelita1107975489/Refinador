import { X, Trash2, Clock, Terminal, ChevronRight } from 'lucide-react';
import { SavedPrompt } from '../types';
import { cn } from '../lib/utils';

interface HistoryListProps {
  history: SavedPrompt[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onLoad: (prompt: SavedPrompt) => void;
}

export default function HistoryList({ history, onClose, onDelete, onLoad }: HistoryListProps) {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      <div className="p-6 border-b border-[#262626] flex items-center justify-between bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold tracking-tight uppercase text-gray-400">Prompt History</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#1a1a1a] rounded-full text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
            <div className="w-16 h-16 rounded-full border border-dashed border-gray-700 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">No Records</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onLoad(item)}
              className="group relative bg-[#161616] border border-[#262626] hover:border-emerald-500/30 rounded-xl p-4 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-gray-200 group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                    <span>{formatDate(item.timestamp)}</span>
                    <span className="text-emerald-500/50">•</span>
                    <span className="text-emerald-500/80">{item.technique}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-gray-500 line-clamp-2 italic leading-relaxed">
                  "{item.original}"
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-[#262626]/50">
                  <div className="w-20 h-1 bg-[#222] rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        item.result.precision >= 80 ? "bg-emerald-500" : "bg-amber-500"
                      )}
                      style={{ width: `${item.result.precision}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold">{item.result.precision}% High Clr</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-[#262626] bg-[#0d0d0d]">
        <button 
          onClick={onClose}
          className="w-full py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-all"
        >
          Close Manager
        </button>
      </div>
    </div>
  );
}
