import React, { useState } from 'react';
import { 
  FileText, Search, Trash2, Calendar, ChevronRight, 
  Sparkles, ShieldCheck, TrendingUp, BarChart3, AlertCircle, RefreshCw, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SavedReport, User } from '../types';

interface HistoryPageProps {
  user: User | null;
  history: SavedReport[];
  onSelectReport: (report: SavedReport) => void;
  onDeleteReport: (id: string, e: React.MouseEvent) => void;
  onNavigateToDashboard: () => void;
}

export default function HistoryPage({
  user,
  history,
  onSelectReport,
  onDeleteReport,
  onNavigateToDashboard
}: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((rep) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (rep.name || '').toLowerCase().includes(q) ||
      (rep.ideaDescription || '').toLowerCase().includes(q)
    );
  });

  // Calculate high level stats
  const totalBlueprints = history.length;
  const averageScore = totalBlueprints > 0 
    ? (history.reduce((acc, curr) => acc + (curr.result?.overallScore || 0), 0) / totalBlueprints).toFixed(1)
    : '0.0';

  const speculativeCount = history.filter(rep => rep.result?.isSpeculativeScience).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:py-16 select-none relative z-10 font-sans">
      
      {/* Decorative Warm Backgound Glowing Orb  */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,107,0,0.08),transparent_100%)] pointer-events-none"></div>

      {/* Header section (Stripe/Linear styled) */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10 border-b border-neutral-900 pb-8">
        <div>
          <div className="flex items-center gap-1.5 mb-2.5 font-mono text-[9px] uppercase tracking-widest text-brand-orange font-bold">
            <ShieldCheck size={11} className="text-brand-orange animate-pulse" />
            <span>Encrypted Founder Storage Ledger</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3.5xl">
            Venture Dossier Ledger
          </h1>
          <p className="mt-1.5 text-xs text-neutral-400 max-w-xl font-sans leading-relaxed">
            Review your collection of strategic viability scoring sessions, Swot analysis checklists, and developer MVP models compiled under this session.
          </p>
        </div>

        <button
          onClick={onNavigateToDashboard}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange/95 px-4.5 py-2.5 text-xs font-semibold text-white transition-all active:scale-[0.98] self-start cursor-pointer shadow-lg shadow-brand-orange/10"
        >
          <Sparkles size={12} />
          <span>Validate New Idea</span>
        </button>
      </div>

      {/* Analytics Bento Row (Linear Style) */}
      <div className="grid gap-4.5 sm:grid-cols-3 mb-10 relative z-10">
        <div className="rounded-xl border border-neutral-900 bg-[#090909]/80 p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-[#777] mb-1 font-bold">
            ARCHIVED BLUEPRINTS
          </span>
          <span className="font-display text-3xl font-extrabold text-white">
            {totalBlueprints}
          </span>
          <p className="text-[10px] text-neutral-500 font-mono mt-1">Stored securely in cloud</p>
        </div>

        <div className="rounded-xl border border-neutral-900 bg-[#090909]/80 p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-[#777] mb-1 font-bold">
            MEAN VIABILITY RATIO
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold text-brand-orange">
              {averageScore}
            </span>
            <span className="font-mono text-[9px] text-brand-orange/80 font-bold">/ 10</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono mt-1">Weighted validation score</p>
        </div>

        <div className="rounded-xl border border-neutral-900 bg-[#090909]/80 p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-[#777] mb-1 font-bold">
            SPECULATIVE MECHANICS
          </span>
          <span className={`font-display text-3xl font-extrabold ${speculativeCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {speculativeCount}
          </span>
          <p className="text-[10px] text-neutral-500 font-mono mt-1">Physics violations flagged</p>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="rounded-xl border border-neutral-900 bg-[#080808]/90 p-5 sm:p-6 relative z-10 shadow-2xl">
        
        {/* Search bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Filter archives by venture title or core description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-[#0b0b0b] py-3 pl-10 pr-5 text-xs sm:text-sm text-white placeholder-neutral-700 transition-all focus:border-brand-orange/50 focus:outline-none focus:ring-1 focus:ring-brand-orange/30 font-sans"
          />
        </div>

        {filteredHistory.length === 0 ? (
          /* Orange Glow empty state (per User Request) */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-neutral-900 rounded-lg bg-black/40 relative overflow-hidden min-h-[300px]">
            {/* Subtle beautiful orange gradient overlay for the empty state background */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/[0.03] to-transparent pointer-events-none"></div>
            
            <FileText className="text-brand-orange/30 mb-4 animate-pulse" size={32} />
            <p className="text-sm font-bold text-white mb-1">No reports archived in ledger</p>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-6 font-sans">
              {searchQuery 
                ? "Your search term didn't yield any results under this profile. Try checking for spelling differences."
                : "You don't have any generated models saved yet. Head to the Venture Hub to run dynamic analyses."
              }
            </p>
            {!searchQuery && (
              <button
                onClick={onNavigateToDashboard}
                className="rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:text-brand-orange text-xs text-[#f5f5f5] px-5 py-2.5 font-semibold transition-colors cursor-pointer"
              >
                Assemble Fresh Spec
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((rep) => {
              const score = rep.result?.overallScore || 0;
              const isSpeculative = rep.result?.isSpeculativeScience;
              
              return (
                <div 
                  key={rep.id}
                  onClick={() => onSelectReport(rep)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-neutral-900 bg-neutral-950/30 p-4.5 text-left transition-all hover:bg-neutral-900/50 hover:border-brand-orange/20 cursor-pointer gap-4 duration-150"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="font-bold text-sm text-white group-hover:text-brand-orange transition-colors truncate max-w-[280px]">
                        {rep.name}
                      </span>
                      <span className="rounded bg-brand-orange/5 border border-brand-orange/10 px-2 py-0.5 text-[8.5px] font-mono text-brand-orange font-bold shrink-0">
                        {score.toFixed(1)} VIAB
                      </span>
                      {isSpeculative && (
                        <span className="flex items-center gap-1 rounded bg-red-950/10 border border-red-900/15 px-2 py-0.5 text-[8px] font-mono text-red-400 font-bold shrink-0 animate-pulse">
                          <AlertCircle size={9} />
                          <span>SPECULATIVE</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-sans max-w-2xl">
                      {rep.ideaDescription}
                    </p>
                    <div className="flex items-center gap-3 mt-3.5 text-[9.5px] font-mono text-[#555] tracking-tight">
                      <span className="flex items-center gap-1 font-bold">
                        <Calendar size={11} />
                        <span>{new Date(rep.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </span>
                      <span>&bull;</span>
                      <span>ID: {rep.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReport(rep);
                      }}
                      className="text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900/60 group-hover:bg-brand-orange/10 group-hover:text-brand-orange px-3.5 py-1.5 rounded-lg border border-neutral-900 transition-all flex items-center gap-1 duration-200 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                    
                    <button
                      onClick={(e) => onDeleteReport(rep.id, e)}
                      className="text-neutral-600 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors focus:outline-none cursor-pointer"
                      title="Permanently remove blueprint"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-[10px] font-mono text-[#555] select-none">
        <span>Session Reference: {user?.id} &bull; Generated data certified by dynamic LLM consensus</span>
      </footer>
    </div>
  );
}
