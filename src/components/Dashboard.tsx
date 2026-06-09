import React, { useState } from 'react';
import { 
  Plus, Search, ArrowRight, Trash2, Calendar, FileText, 
  Sparkles, AlertCircle, RefreshCw, LogIn, ChevronRight, Play, BookOpen, Clock, Settings, Brain, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SavedReport, User } from '../types';

interface DashboardProps {
  user: User | null;
  history: SavedReport[];
  loading: boolean;
  onAnalyze: (name: string, idea: string) => void;
  onSelectReport: (report: SavedReport) => void;
  onDeleteReport: (id: string, e: React.MouseEvent) => void;
  onOpenAuth: () => void;
}

const EXAMPLE_IDEAS = [
  {
    name: "AeroMeal",
    idea: "Pre-ordered gourmet meal lockers at airport gates for passengers who hate plane food."
  },
  {
    name: "EquiRecycle",
    idea: "A vertical marketplace for certified high-end carbon-fiber bicycle parts with integrated stress testing."
  },
  {
    name: "DocScribe",
    idea: "Ambient voice recorder for vet clinics that auto-generates pet clinical charting and logs medicine prescriptions."
  }
];

const LOADING_PHASES = [
  "Mapping competitive duplicates across world registries...",
  "Running SWOT strategic matrix permutations...",
  "Generating multi-tenant serverless technical architecture diagrams...",
  "Structuring financial cash flows & SaaS monetization models...",
  "Calculating circular core startup metric viability scores..."
];

export default function Dashboard({
  user,
  history,
  loading,
  onAnalyze,
  onSelectReport,
  onDeleteReport,
  onOpenAuth
}: DashboardProps) {
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);

  // Rotate loading steps every 3.5 seconds when analyzing
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setActivePhraseIdx(0);
      interval = setInterval(() => {
        setActivePhraseIdx((prev) => (prev + 1) % LOADING_PHASES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) return;
    onAnalyze(name.trim(), idea.trim());
  };

  const handleApplyExample = (exName: string, exIdea: string) => {
    setName(exName);
    setIdea(exIdea);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((rep) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (rep.name || '').toLowerCase().includes(q) ||
      (rep.ideaDescription || '').toLowerCase().includes(q)
    );
  });

  // Loading animation state render (comparable to Vercel/Linear deployment pipelines)
  if (loading) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center select-none relative">
        <div className="absolute inset-0 bg-[#050505] bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        {/* Underlay orange gradient bubble */}
        <div className="absolute w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(255,107,0,0.1)_0%,transparent_70%)] blur-[75px] pointer-events-none"></div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center max-w-lg"
        >
          <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-orange/5"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-orange border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-brand-orange/20 animate-pulse"></div>
            <Brain className="text-brand-orange animate-pulse" size={26} />
          </div>
          
          <span className="font-mono text-[10px] text-brand-orange font-bold uppercase tracking-widest block mb-2.5">
            ALIGNING SYNTHESIS PARAMETERS
          </span>
          <h2 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3.5xl">
            Synthesizing Corporate Matrix
          </h2>
          
          <div className="mt-6 min-h-[36px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={activePhraseIdx}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.35 }}
                className="text-sm font-mono text-[#e5e5e5] px-4 py-2 rounded-lg border border-neutral-800 bg-[#0c0c0c] flex items-center gap-2 shadow-2xl"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange animate-ping"></span>
                <span>{LOADING_PHASES[activePhraseIdx]}</span>
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mt-8 text-xs text-neutral-500 leading-relaxed font-sans max-w-sm">
            Evaluating historical patterns, system constraints, and competitor matrices. Process completes in approximately 10-15 seconds.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16 select-none relative z-10">
      
      {/* Decorative localized radiant glows */}
      <div className="absolute top-[20%] right-[-100px] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(255,107,0,0.06)_0%,transparent_70%)] blur-[75px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-100px] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(255,107,0,0.04)_0%,transparent_70%)] blur-[75px] pointer-events-none"></div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        
        {/* Main analytical container */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-xl border border-neutral-900 bg-[#090909]/95 p-6 md:p-8 shadow-2xl relative overflow-hidden group">
            {/* Top border ambient glow */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent"></div>
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-widest text-brand-orange font-bold">
              <Sparkles size={11} className="text-brand-orange" />
              <span>DYNAMIC VENTURE ANALYZER</span>
            </div>
            
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Validate New Venture
            </h2>
            <p className="text-xs text-neutral-400 mt-1 mb-8 leading-relaxed font-sans">
              Provide your conceptual corporate name and description. Our server-side neural models will simulate risk feasibility, build MVP stack systems, and plot distribution tracks.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-2 font-semibold">
                  Proposed Venture Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., AeroMeal or FitAI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-[#0d0d0d] py-3 px-4 text-xs sm:text-sm text-white placeholder-neutral-700 transition-all focus:border-brand-orange/50 focus:outline-none focus:ring-1 focus:ring-brand-orange/30 font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] font-semibold">
                    Core Concept & Market Strategy
                  </label>
                  <span className="text-[9px] font-mono text-neutral-600">INPUT DENSITY RECOMMENDED</span>
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder="e.g., An AI-powered fitness coach that builds custom home workouts based on target duration and dynamically reads Apple Watch biometrics to calibrate progress."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-[#0d0d0d] py-3 px-4 text-xs sm:text-sm text-white placeholder-neutral-700 transition-all focus:border-brand-orange/50 focus:outline-none focus:ring-1 focus:ring-brand-orange/30 resize-none font-sans leading-relaxed"
                />
                <span className="mt-2 block text-[10px] text-neutral-500 font-mono leading-normal">
                  Providing customer-specific vectors, pricing details, or launch loops will produce deeply customized SWAT blueprints.
                </span>
              </div>

              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange hover:bg-brand-orange/95 py-3.5 text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.98] shadow-lg shadow-brand-orange/10 cursor-pointer duration-200"
              >
                <span>Initialize Assessment Scan</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>

          {/* Quickstart presets */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] mb-3.5 flex items-center gap-1.5 font-bold">
              <BookOpen size={12} className="text-[#888]" />
              <span>Interactive Preset Blueprints</span>
            </h3>
            <div className="grid gap-3.5 sm:grid-cols-3">
              {EXAMPLE_IDEAS.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyExample(ex.name, ex.idea)}
                  className="rounded-lg border border-neutral-900 bg-[#090909]/70 p-4.5 text-left transition-all hover:bg-neutral-900 hover:border-brand-orange/20 hover:shadow-lg group focus:outline-none cursor-pointer duration-200"
                >
                  <span className="block text-xs font-bold text-white mb-1.5 tracking-tight group-hover:text-brand-orange transition-colors duration-200">
                    {ex.name}
                  </span>
                  <span className="block text-[11px] text-neutral-400 line-clamp-3 leading-relaxed font-sans">
                    {ex.idea}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History / Workspace sidebar panel */}
        <div className="lg:col-span-5 h-full">
          <div className="rounded-xl border border-neutral-900 bg-[#090909]/95 p-6 shadow-2xl relative h-full flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
            
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between border-b border-neutral-950 pb-4 mb-4.5">
                <h2 className="font-display text-md font-bold text-white tracking-tight flex items-center gap-2">
                  <Clock size={14} className="text-brand-orange" />
                  <span>Founder Workspace</span>
                </h2>
                
                {!user && (
                  <button 
                    onClick={onOpenAuth}
                    className="text-[10px] font-mono uppercase tracking-wider font-bold text-brand-orange border border-brand-orange/15 rounded bg-brand-orange/5 px-2.5 py-1 hover:bg-brand-orange/10 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <LogIn size={10} />
                      <span>SIGN IN</span>
                    </span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                /* Beautiful orange gradient empty states background (per User Request) */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-5 border border-dashed border-neutral-900 rounded-lg bg-black/40 relative overflow-hidden min-h-[220px]">
                  {/* Subtle orange background cloud layer */}
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-brand-orange/[0.03] to-transparent pointer-events-none"></div>
                  
                  <FileText className="text-brand-orange/30 mb-3 animate-pulse" size={26} />
                  <p className="text-xs font-bold text-white mb-1">No reports saved yet</p>
                  <p className="text-[10.5px] text-neutral-400 max-w-xs leading-relaxed font-sans">
                    {user 
                      ? "Analyze startup ideas to automatically compile persistent assessments in this panel."
                      : "Create secure concept models as a guest. Authenticate to sync reports across devices."
                    }
                  </p>
                </div>
              ) : (
                <div className="flex flex-col min-h-0 flex-1">
                  <div className="relative mb-3.5">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600">
                      <Search size={13} />
                    </span>
                    <input
                      type="text"
                      placeholder="Filter ledger archives..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-[#0d0d0d] py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-700 transition-all focus:border-brand-orange/50 focus:outline-none focus:ring-1 focus:ring-brand-orange/30 font-sans"
                    />
                  </div>

                  {filteredHistory.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed border-neutral-900 rounded-lg bg-black/20">
                      <Search className="text-neutral-700 mb-2" size={18} />
                      <p className="text-xs font-semibold text-neutral-400">No matching ledger records</p>
                      <p className="text-[10px] text-neutral-600 mt-0.5">Try general terms</p>
                    </div>
                  ) : (
                    <div className="max-h-[350px] lg:max-h-[380px] overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-transparent">
                      {filteredHistory.map((rep) => (
                        <div 
                          key={rep.id}
                          onClick={() => onSelectReport(rep)}
                          className="group flex items-center justify-between rounded-lg border border-neutral-900/40 bg-neutral-950/40 p-3.5 text-left transition-all hover:bg-neutral-900/60 hover:border-brand-orange/20 cursor-pointer duration-150"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-xs text-white truncate max-w-[155px] group-hover:text-brand-orange transition-colors duration-150">
                                {rep.name}
                              </span>
                              <span className="shrink-0 rounded bg-brand-orange/5 border border-brand-orange/10 px-1.5 py-0.5 text-[8.5px] font-mono text-brand-orange font-bold">
                              {rep.result?.overallScore?.toFixed?.(1) || "N/A"} VIAB
                              </span>
                            </div>
                            <span className="block text-[11px] text-neutral-500 line-clamp-1 font-sans">
                              {rep.ideaDescription}
                            </span>
                          </div>
                          
                          <button
                            onClick={(e) => onDeleteReport(rep.id, e)}
                            className="text-neutral-600 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded transition-colors focus:outline-none cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Authentication feedback message */}
            {user && (
              <div className="mt-6 border-t border-neutral-950 pt-4 flex items-center justify-between text-[11px] text-neutral-400 font-mono select-none">
                <span className="truncate flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Ledger Synced</span>
                </span>
                <span className="font-bold text-neutral-500 max-w-[160px] truncate">{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
