import React, { useState } from 'react';
import { 
  CheckCircle, ArrowRight, Zap, BarChart3, 
  Sparkles, Layers, RefreshCw, HelpCircle, ChevronDown, Rocket, Flame, Mail, Loader2, ShieldCheck, Globe, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onStartValidating: () => void;
  onViewDemo: () => void;
}

export default function LandingPage({ onStartValidating, onViewDemo }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      setWaitlistError("Please enter a valid email address.");
      return;
    }
    setSubmittingWaitlist(true);
    setWaitlistError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: waitlistEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register.');
      }
      setJoinedWaitlist(true);
      setWaitlistPosition(data.position);
      setWaitlistEmail('');
    } catch (err: any) {
      setWaitlistError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  const features = [
    {
      icon: <Zap className="text-brand-orange" size={20} />,
      title: "Instant Verification Engine",
      desc: "Our strategic model parses startup viability, core friction, and market demand in less than 15 seconds."
    },
    {
      icon: <BarChart3 className="text-brand-orange" size={20} />,
      title: "Competitor Market Mapping",
      desc: "Detect overlapping products, dissect their critical weaknesses, and isolate your supreme product differentiator."
    },
    {
      icon: <Layers className="text-brand-orange" size={20} />,
      title: "Phased MVP Blueprints",
      desc: "Skip software bloating. Receive structured MVP specifications dividing engineering objectives across clear timeline phases."
    },
    {
      icon: <Flame className="text-brand-orange" size={20} />,
      title: "GTM & Execution Launchpad",
      desc: "A bespoke 30-day go-to-market launching checklist covering social validation, user acquisition, and pipeline growth."
    },
    {
      icon: <RefreshCw className="text-brand-orange" size={20} />,
      title: "3-Year Revenue Modelling",
      desc: "Get initial financial forecasts outlining projected operational costs and high-level revenue flow structures."
    },
    {
      icon: <Sparkles className="text-brand-orange" size={20} />,
      title: "Investor-Ready Pitch Deck",
      desc: "Get an architectural-ready venture headline, TAM/SAM/SOM breakdown, and team-requirement outlines."
    }
  ];

  const methodologies = [
    {
      title: "Scientific & Physics Bounds Checking",
      desc: "Automatically evaluates whether raw technological requirements depend on speculative science, unproven physics, or represent proven physical mechanics.",
      pillar: "Pillar 01"
    },
    {
      title: "Objective Risk Analysis Modeling",
      desc: "Computes structural validation scores across regulatory load, distribution bottlenecks, and development friction using VC-partner skepticism.",
      pillar: "Pillar 02"
    },
    {
      title: "Deep Competitive Gaps Mapping",
      desc: "Isolates existing market options, measures crowded saturation layers, and defines realistic architectural changes to secure strong positioning.",
      pillar: "Pillar 03"
    },
    {
      title: "GTM Trajectory Formulation",
      desc: "Outlines a hard-hitting 30-day execution calendar centering on organic validation, pre-selling feedback, and continuous product iteration.",
      pillar: "Pillar 04"
    }
  ];

  const faqs = [
    {
      q: "How does the Startup Scoring system evaluate my idea?",
      a: "Our validation algorithm uses premium server-side Gemini 3.5 Flash models to run cross-checks. It grades your idea from 1 to 10 across five fundamental axes: market demand, competitive saturation, technical scalability, monetization potential, and overall initial execution difficulty. It then integrates these vectors to calculate a unified Startup Viability Score."
    },
    {
      q: "Is my proprietary startup concept kept safe and private?",
      a: "Absolutely. All generation pipelines run isolated server-side queries. Standard security rules ensure your concepts belong entirely to you, and reports saved to your founder workspace are private and secure unless you choose to actively share them using your custom shared link."
    },
    {
      q: "What is the difference between a pitch and an MVP blueprint?",
      a: "The pitch is optimized for venture capital and angel presentation, detailing your TAM/SAM/SOM market sizes and product value. The MVP blueprint is built exclusively for senior engineers and product managers, defining exact frontend/backend schemas, system architecture, database recommendations, and phase timelines."
    },
    {
      q: "Can I rerun analyses or update details later?",
      a: "Yes! In your Dashboard, you can access your report history, delete obsolete reports, share them with colleagues, and re-run active validation sequences which feeds our engine updated market vectors to refresh the business output."
    }
  ];

  return (
    <div id="landing-page-container" className="relative min-h-screen bg-[#050505] overflow-hidden select-none">
      
      {/* Vercel-like Premium Background: Glowing Grid Mask + Ambient Radial Domes */}
      <div className="absolute inset-0 bg-[#050505] bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      {/* Immersive orange gradients in body background (per User Request) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,107,0,0.18),transparent_100%)] pointer-events-none"></div>
      <div className="absolute top-[35%] left-[10%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(255,107,0,0.06)_0%,transparent_70%)] blur-[85px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(255,107,0,0.04)_0%,transparent_75%)] blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative px-6 pt-28 pb-16 text-center sm:px-12 md:pt-36 lg:px-20 z-10">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Tagline Pill (Linear/Stripe style) */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/20 bg-brand-orange/5 px-3.5 py-1 text-xs font-mono tracking-wider font-semibold text-brand-orange mb-8"
          >
            <Rocket size={12} className="text-brand-orange" />
            <span>NEXIDEA VENTURE SYSTEM v1.2</span>
          </motion.div>

          {/* Epic Main Heading with custom gradients */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7.5xl leading-[1.08] text-balance"
          >
            Validate Before <br />
            <span className="bg-gradient-to-r from-brand-orange via-brand-accent to-white bg-clip-text text-transparent">
              You Build.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-2xl text-md leading-relaxed text-[#a3a3a3] md:text-lg font-sans"
          >
            Get instant VC-grade validation, strategic customer alignment, high-fidelity MVP architectural specs, and deep competitive gaps parsing with server-side AI model consensus.
          </motion.p>

          {/* Premium CTA Buttons Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row max-w-md mx-auto sm:max-w-none"
          >
            <button
              onClick={onStartValidating}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange/95 hover:shadow-lg hover:shadow-brand-orange/20 active:scale-[0.98] sm:w-auto overflow-hidden duration-200"
            >
              {/* Internal subtle glow */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              <span>Start Validating</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} />
            </button>
            
            <button
              onClick={onViewDemo}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-[#0d0d0d] hover:bg-[#121212] hover:border-neutral-700 px-8 py-3.5 text-sm font-semibold text-[#f5f5f5] transition-all active:scale-[0.98] sm:w-auto duration-200"
            >
              <span>View Live Demo</span>
            </button>
          </motion.div>

          {/* Trust badges / value proposition highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3.5 text-xs text-neutral-500 font-mono tracking-wide"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-brand-orange" />
              <span>Full GTM Launch Sequence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-brand-orange" />
              <span>Technical architecture stack</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-brand-orange" />
              <span>Export and Share PDF Reports</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section className="px-6 py-20 bg-black/40 border-y border-neutral-900 sm:px-12 lg:px-20 relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-[10px] text-brand-orange font-bold uppercase tracking-widest block mb-2">SYSTEM UTILITIES</span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-3 sm:text-3xl">
              Engineered for Speed. Tailored for Founders.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              NexIdea acts as a continuous VC partner, analyzing conceptual blind spots and formulating reliable, phase-bound tech specifications instantaneously.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -4, borderColor: "rgba(255, 107, 0, 0.25)" }}
                transition={{ duration: 0.2 }}
                className="relative rounded-xl border border-neutral-900 bg-[#0b0b0b]/90 p-7 shadow-2xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/[0.02] to-transparent pointer-events-none"></div>
                <div className="mb-4 inline-flex rounded-lg bg-brand-orange/5 border border-brand-orange/10 p-2.5">
                  {feat.icon}
                </div>
                <h3 className="text-md font-bold text-white mb-2 tracking-tight">{feat.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific/Strategic Pillars Section (Linear Style layout) */}
      <section className="px-6 py-24 sm:px-12 lg:px-20 relative z-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-[10px] text-brand-orange font-bold uppercase tracking-widest block mb-2">METHODOLOGY</span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-3 sm:text-3xl">
              The 4-Pillar Validation Model
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We replace speculative hope with ruthless mechanical logic, evaluating technological parameters against regulatory realities, competitive thresholds, and actual user loops.
            </p>
          </div>

          <div className="grid gap-4.5 sm:grid-cols-2">
            {methodologies.map((method, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-xl border border-neutral-900 bg-[#090909]/75 p-6 hover:border-brand-orange/20 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-4.5">
                  <span className="font-mono text-[10px] text-brand-orange/90 font-bold uppercase tracking-widest">
                    {method.pillar}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange transition-colors duration-300"></div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 tracking-tight group-hover:text-brand-orange transition-colors duration-200">
                  {method.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {method.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Access Strategy & Waitlist section (Stripe Style) */}
      <section className="px-6 py-24 sm:px-12 lg:px-20 border-t border-neutral-900/60 relative z-10 overflow-hidden">
        
        {/* Decorative ambient background shape */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(255,107,0,0.06),transparent_70%)] blur-[95px] pointer-events-none"></div>

        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-[#0b0b0b] px-3 py-1 text-[10px] font-mono text-neutral-400 uppercase mb-4 tracking-wider">
              <ShieldCheck size={12} className="text-brand-orange" />
              <span>Free Public Testing Blueprint</span>
            </div>
            
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white mb-2 sm:text-4xl text-balance">
              100% Free Public Testing Mode
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed">
              Uncapping direct pipeline inputs. Enjoy complete, unrestricted access to deep GTM formulation models, multi-year revenue predictions, competitor breakdowns, and PDF files.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-12 max-w-4xl mx-auto items-stretch">
            
            {/* Free Beta Access Information Card */}
            <div className="md:col-span-7 rounded-xl border border-neutral-900 bg-[#080808]/90 p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.05),transparent_70%)] pointer-events-none"></div>
              
              <div>
                <span className="font-mono text-[9px] text-[#888] uppercase tracking-widest block mb-1">CURRENT PLAN</span>
                <h3 className="font-display text-lg font-bold text-white mb-2 tracking-tight">NexIdea Creator Workspace</h3>
                <p className="text-xs text-neutral-400 mb-6 font-sans">Full feature access. Verify unlimited plans during our high-performance trial.</p>
                
                <ul className="grid gap-x-4 gap-y-3 sm:grid-cols-2 text-xs text-neutral-300 mb-8 font-sans">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-brand-orange shrink-0" />
                    <span>Uncapped concept scans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-brand-orange shrink-0" />
                    <span>Physics bounds validation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-brand-orange shrink-0" />
                    <span>Structured MVC schemas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-brand-orange shrink-0" />
                    <span>30-Day execution plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-brand-orange shrink-0" />
                    <span>3-Year financial modelling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-brand-orange shrink-0" />
                    <span>Public share archives</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={onStartValidating}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-orange hover:bg-brand-orange/95 py-3.5 text-center text-xs font-semibold text-white transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Launch Creator Studio</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Premium Waitlist Signup Card with exquisite glow */}
            <div className="md:col-span-5 rounded-xl border border-brand-orange/15 bg-[#0b0b0b] p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-brand-orange/10 blur-xl pointer-events-none"></div>
              
              <div>
                <span className="font-mono text-[9px] text-[#888] uppercase tracking-widest block mb-1">FUTURE RELEASE</span>
                <h3 className="font-display text-md font-bold text-white mb-1.5 tracking-tight">Venture Pro Tier</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-sans">
                  Secure early access to automated investor mapping datasets, editable PPT deck formats, and instant regulatory scanning triggers.
                </p>

                {joinedWaitlist ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center mt-2">
                    <Sparkles className="text-brand-orange mx-auto mb-2 animate-bounce" size={18} />
                    <h4 className="text-xs font-bold text-white mb-1">Spot Allocated!</h4>
                    <p className="text-[10.5px] text-neutral-300 leading-relaxed">
                      You are positioned as founder <strong className="text-white font-mono">#{waitlistPosition}</strong> for future enterprise rollouts.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleJoinWaitlist} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        FOUNDER EMAIL
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 py-2.5 pl-9 pr-4 text-xs text-white placeholder-neutral-600 transition-all focus:border-brand-orange/50 focus:outline-none"
                        />
                        <Mail className="absolute left-3 top-3 text-neutral-600" size={13} />
                      </div>
                      {waitlistError && (
                        <p className="mt-1.5 text-[10px] font-mono text-red-500">
                          {waitlistError}
                        </p>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={submittingWaitlist}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black hover:bg-neutral-200 py-2.5 text-center text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                      {submittingWaitlist ? (
                        <>
                          <Loader2 className="animate-spin text-brand-orange" size={13} />
                          <span>Securing spot...</span>
                        </>
                      ) : (
                        <>
                          <span>Reserve Pro Token</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-6 text-center border-t border-neutral-950 pt-4">
                <span className="text-[10px] text-neutral-500 font-mono block">
                  Beta pricing is guaranteed 100% free forever
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="px-6 py-20 bg-black/40 border-t border-neutral-900/80 sm:px-12 lg:px-20 relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <span className="font-mono text-[10px] text-brand-orange font-bold uppercase tracking-widest block mb-2">INFORMATION MATRIX</span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-3 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-sm">
              Operational details regarding database indexing and consensus generation models.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-lg border border-neutral-900 bg-[#080808]/90 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#0c0c0c]/80"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">{faq.q}</span>
                    <ChevronDown 
                      size={15} 
                      className={`text-brand-orange transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <div className="px-5 pb-5 pt-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-950/60 bg-black/30 font-sans">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-neutral-900 text-center text-[11px] text-neutral-500 font-mono relative z-10 select-none">
        <div className="max-w-xl mx-auto">
          <p className="font-display text-md font-extrabold text-white mb-2 tracking-tight">NexIdea</p>
          <p className="mb-4 leading-normal text-neutral-400">Validate startup ideas, plan software MVPs, and align GTM strategy effortlessly.</p>
          <p className="mb-6 bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-600 bg-clip-text text-transparent italic text-xs">
            By Shreena.
          </p>
          <p className="text-neutral-600">&copy; {new Date().getFullYear()} NexIdea Corp. All startup intelligence compiled server-side.</p>
        </div>
      </footer>
    </div>
  );
}
