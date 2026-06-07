import React, { useState, useEffect } from 'react';
import { 
  Sparkles, LogOut, LogIn, FileText, Globe, RefreshCw, 
  ChevronRight, AlertCircle, Rocket, Flame, ArrowLeft, Loader2, ShieldCheck, History
} from 'lucide-react';
import { User, SavedReport } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryPage from './components/HistoryPage';
import AuthModal from './components/AuthModal';
import { 
  supabase, 
  isSupabaseConfigured,
  saveReport,
  getReports,
  getReportById,
  deleteReport
} from './lib/supabase';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'history' | 'results'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedReport[]>([]);
  
  const [activeReport, setActiveReport] = useState<SavedReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [rerunning, setRerunning] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // 1. Initialize Supabase Auth session & hash routing
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Fetch initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          const loadedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            createdAt: session.user.created_at || new Date().toISOString()
          };
          setUser(loadedUser);
          setToken(session.access_token || session.user.id);
          
          // Initial reports fetch
          getReports(session.user.id).then(setHistory).catch((err) => {
            console.error("Failed to load user reports:", err);
          });
        }
      });

      // Subscribe to auth state updates
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          const activeUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            createdAt: session.user.created_at || new Date().toISOString()
          };
          setUser(activeUser);
          setToken(session.access_token || session.user.id);
          
          try {
            const list = await getReports(session.user.id);
            setHistory(list);
          } catch (err) {
            console.error("Failed to fetch reports:", err);
          }
        } else {
          // Reset states upon log out
          setUser(null);
          setToken(null);
          setHistory([]);
          setView('landing');
          setActiveReport(null);
          window.location.hash = '';
        }
      });

      // Watch hash updates
      handleHashRoute();
      window.addEventListener('hashchange', handleHashRoute);
      
      return () => {
        subscription.unsubscribe();
        window.removeEventListener('hashchange', handleHashRoute);
      };
    } else {
      // If Supabase credentials are not found in secrets, watch hash route only
      handleHashRoute();
      window.addEventListener('hashchange', handleHashRoute);
      return () => {
        window.removeEventListener('hashchange', handleHashRoute);
      };
    }
  }, []);

  // Support public sharing links loaded directly from storage
  const handleHashRoute = async () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#share-')) {
      const reportId = hash.substring(7);
      if (!reportId) return;

      setAnalyzing(true);
      setErrorMsg('');
      try {
        const data = await getReportById(reportId, user?.id);
        if (!data) {
          throw new Error('This shared startup report does not exist, is restricted, or was removed.');
        }
        setActiveReport(data);
        setView('results');
      } catch (err: any) {
        setErrorMsg(err.message || 'The shared report does not exist or was deleted.');
        setView('landing');
      } finally {
        setAnalyzing(false);
      }
    }
  };

  // Route control wrapper with clean, high-fidelity auth gate interceptor
  const navigateWithProtection = (targetView: 'landing' | 'dashboard' | 'history' | 'results') => {
    if ((targetView === 'dashboard' || targetView === 'history') && !user) {
      setAuthOpen(true);
      setStatusMsg("Founder authentication is required to access the Venture Hub workspace.");
      setTimeout(() => setStatusMsg(''), 5000);
      return;
    }
    setView(targetView);
  };

  const handleAuthSuccess = (authUser: User, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    setStatusMsg(`Successfully authenticated as ${authUser.email}`);
    setTimeout(() => setStatusMsg(''), 3000);
    // Auto-enter the builder dashboard upon standard auth success
    setView('dashboard');
  };

  const handleLogOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase log out error:", err);
      }
    }
    setUser(null);
    setToken(null);
    setHistory([]);
    setView('landing');
    setActiveReport(null);
    window.location.hash = '';
    setStatusMsg("Successfully signed out.");
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Core generation logic calling our secure backend Gemini API proxied route
  const handleAnalyzeIdea = async (name: string, idea: string) => {
    if (!user) {
      setAuthOpen(true);
      setStatusMsg("Please log in or sign up to validate ideas.");
      setTimeout(() => setStatusMsg(''), 4000);
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Call our secure Express backend which proxies Gemini API calls
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, idea })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete critical analysis. Please check your system configuration.');
      }

      // Save report in user storage ledger
      const freshReport = await saveReport(
        user.id,
        name,
        idea,
        data.result
      );

      setActiveReport(freshReport);
      setView('results');
      setHistory(prev => [freshReport, ...prev]);
      setStatusMsg("Corporate spec generated successfully.");
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during synthesis. Please confirm your AI tokens are active.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRerunReport = async (reportId: string) => {
    if (!user) return;
    setRerunning(true);
    setErrorMsg('');
    try {
      // Find old report details
      const oldReport = history.find(r => r.id === reportId) || await getReportById(reportId, user.id);
      if (!oldReport) {
        throw new Error("Target report core records not found.");
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Re-run the analysis by calling the secure Gemini endpoint with existing parameters
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: oldReport.name, idea: oldReport.ideaDescription })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Re-run analysis failed.');
      }

      // Save fresh report
      const freshReport = await saveReport(
        user.id,
        oldReport.name,
        oldReport.ideaDescription,
        data.result
      );

      // Clean up the stale report
      await deleteReport(reportId, user.id);

      setActiveReport(freshReport);
      setHistory(prev => [freshReport, ...prev.filter(r => r.id !== reportId)]);
      setView('results');
      
      setStatusMsg("Validation blueprint refreshed successfully.");
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to rerun proposal scan.');
    } finally {
      setRerunning(false);
    }
  };

  const handleDeleteReport = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (!confirm("Are you sure you want to delete this startup report?")) return;

    try {
      await deleteReport(reportId, user.id);
      setHistory(prev => prev.filter(r => r.id !== reportId));
      if (activeReport?.id === reportId) {
        setActiveReport(null);
        setView('dashboard');
      }
      setStatusMsg("Report successfully removed.");
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Failed to delete report from card ledger.");
    }
  };

  const handleStartValidating = () => {
    navigateWithProtection('dashboard');
  };

  const handleViewDemo = () => {
    if (!user) {
      setAuthOpen(true);
      setStatusMsg("Please sign in or sign up to validate ideas, including demo presets.");
      setTimeout(() => setStatusMsg(''), 5000);
      return;
    }
    handleAnalyzeIdea(
      "EcoSip",
      "Biodegradable plant-based coffee lids that indicate perfect drinking temperature by shifting color from orange to white."
    );
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white relative">
      
      {/* Top Navigation Bar - Sticky & Transparent (Stripe / Vercel style) */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4.5 no-print select-none">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigateWithProtection('landing')}>
            <div className="h-8.5 w-8.5 rounded-lg bg-brand-orange flex items-center justify-center font-bold font-display shadow-lg shadow-brand-orange/20 text-white">
              N
            </div>
            <div>
              <span className="font-display text-base font-extrabold tracking-tight text-white block leading-none mb-0.5">
                NexIdea
              </span>
              <span className="text-[8.5px] uppercase tracking-widest text-[#a3a3a3] font-mono block">
                VALIDATE CORE VENTURES
              </span>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigateWithProtection('dashboard')}
              className={`text-xs font-semibold hover:text-brand-orange transition-colors cursor-pointer ${view === 'dashboard' ? 'text-brand-orange' : 'text-neutral-400'}`}
            >
              Venture Hub
            </button>

            <button 
              onClick={() => navigateWithProtection('history')}
              className={`text-xs font-semibold hover:text-brand-orange transition-colors cursor-pointer ${view === 'history' ? 'text-brand-orange' : 'text-neutral-400'}`}
            >
              <span className="flex items-center gap-1">
                <History size={12} />
                <span>Dossiers</span>
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-block rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-neutral-400 max-w-[180px] truncate font-mono">
                  {user.email}
                </span>
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Sign out of founder workspace"
                >
                  <LogOut size={12} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-orange/95 active:scale-[0.98] cursor-pointer"
              >
                <LogIn size={12} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Real-time Toast Status Notifications */}
      {statusMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-500 border border-emerald-400 p-4 text-xs font-bold text-white shadow-2xl flex items-center gap-2 animate-bounce">
          <Rocket size={15} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Interactive Global Errors Bar */}
      {errorMsg && (
        <div className="mx-auto max-w-4xl px-6 pt-6">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs text-red-300 flex items-start gap-3 w-full">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">Synthesis Configuration Failure</span>
              <p className="opacity-90">{errorMsg}</p>
              <button 
                onClick={() => setErrorMsg('')} 
                className="mt-2 font-semibold text-white hover:underline block"
              >
                Dismiss notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pages Router Orchestration */}
      <main className="relative">
        {analyzing ? (
          /* Large Full Loading Block */
          <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-brand-orange/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-brand-orange border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <Flame className="text-brand-orange animate-pulse" size={32} />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Synthesizing Startup Core
            </h2>
            <p className="mt-2 text-brand-orange font-mono text-xs uppercase tracking-widest animate-pulse">
              Generating validation score, market sizing, and SWOT metrics...
            </p>
          </div>
        ) : (
          /* Render components */
          <>
            {view === 'landing' && (
              <LandingPage 
                onStartValidating={handleStartValidating}
                onViewDemo={handleViewDemo}
              />
            )}

            {view === 'dashboard' && (
              <Dashboard 
                user={user}
                history={history}
                loading={analyzing}
                onAnalyze={handleAnalyzeIdea}
                onSelectReport={(rep) => {
                  setActiveReport(rep);
                  setView('results');
                }}
                onDeleteReport={handleDeleteReport}
                onOpenAuth={() => setAuthOpen(true)}
              />
            )}

            {view === 'history' && (
              <HistoryPage
                user={user}
                history={history}
                onSelectReport={(rep) => {
                  setActiveReport(rep);
                  setView('results');
                }}
                onDeleteReport={handleDeleteReport}
                onNavigateToDashboard={() => setView('dashboard')}
              />
            )}

            {view === 'results' && activeReport && (
              <ResultsDashboard 
                report={activeReport}
                onBack={() => setView(user ? 'history' : 'landing')}
                onRerun={handleRerunReport}
                loadingRerun={rerunning}
              />
            )}
          </>
        )}
      </main>

      {/* Registration/Login Card Frame Trigger */}
      <AuthModal 
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
