import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Share2, RefreshCw, Star, Info, Layers, 
  MapPin, ShieldAlert, Cpu, Heart, Coins, Target, Terminal, 
  TrendingUp, Compass, Gift, CalendarCheck, Lightbulb, Check, AlertTriangle, AlertCircle
} from 'lucide-react';
import { SavedReport, AnalysisResult } from '../types';
import CircularProgress from './CircularProgress';
import { jsPDF } from 'jspdf';

interface ResultsDashboardProps {
  report: SavedReport;
  onBack: () => void;
  onRerun: (id: string) => void;
  loadingRerun: boolean;
}

export default function ResultsDashboard({
  report,
  onBack,
  onRerun,
  loadingRerun
}: ResultsDashboardProps) {
  const result: AnalysisResult = report.result;
  const [activeTab, setActiveTab] = useState<'market' | 'strategy' | 'mvp' | 'pitch' | 'finance'>('market');
  const [copied, setCopied] = useState(false);

  // Generate public clip URL for sharing
  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#share-${report.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let posY = 20;

    const drawPageHeader = () => {
      posY = 22;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 115, 125);
      doc.text(`NexIdea Venture Assessment  |  ${report.name.toUpperCase()}`, 15, 12);
      doc.setDrawColor(220, 225, 230);
      doc.line(15, 14, 195, 14);
    };

    const addHeading = (text: string, level: number = 2) => {
      if (posY > 240) {
        doc.addPage();
        drawPageHeader();
      }
      if (level === 1) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(text, 15, posY);
        posY += 5;
        doc.setDrawColor(234, 88, 12); // brand orange thin line
        doc.line(15, posY, 195, posY);
        posY += 7;
      } else if (level === 2) {
        posY += 3;
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(234, 88, 12); // brand-orange
        doc.text(text, 15, posY);
        posY += 5;
      } else {
        posY += 1;
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text(text, 15, posY);
        posY += 4;
      }
    };

    const addText = (text: string, size: number = 9.5, isBold: boolean = false, color: [number, number, number] = [71, 85, 105], lineGap: number = 3.5) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text || 'N/A', 180);
      lines.forEach((line: string) => {
        if (posY > 270) {
          doc.addPage();
          drawPageHeader();
        }
        doc.text(line, 15, posY);
        posY += (size * 0.35) + 1.2;
      });
      posY += lineGap;
    };

    // --- COVERS & INITIATION CARD ---
    doc.setFillColor(15, 23, 42); // slate-900 background banner card
    doc.rect(15, 15, 180, 42, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(234, 88, 12); // brand-orange accent
    doc.text("NEXIDEA VENTURE ASSESSMENT ENGINE", 22, 25);
    
    // Auto-expand or limit name size for display design on cover
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(report.name, 22, 35);
    
    // Overall Viability Score card on the right
    doc.setFillColor(234, 88, 12);
    doc.rect(142, 21, 43, 26, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text("VIABILITY SCORE", 146, 27);
    doc.setFontSize(22);
    doc.text(`${result.overallScore}/10`, 146, 39);

    posY = 68;

    // Speculative Science warning box on cover if true
    if (result.isSpeculativeScience) {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(239, 68, 68);
      doc.rect(15, posY, 180, 26, 'FD');
      posY += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28);
      doc.text("CRITICAL IMPEDIMENT: SPECULATIVE SCIENCE DETECTED", 20, posY);
      posY += 5;
      
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(153, 27, 27);
      const limitLines = doc.splitTextToSize(result.scientificLimitationDetails || 'Concept relies on currently speculative, sci-fi, or unproven physical tech.', 170);
      limitLines.forEach((l: string) => {
        if (posY < 270) {
          doc.text(l, 20, posY);
          posY += 4;
        }
      });
      posY += 6;
    }

    addHeading("Executive Summary", 1);
    addText(result.ideaSummary, 9.5, false, [51, 65, 85], 4);

    addHeading("Problem Statement & Pain Point", 2);
    addText(result.problemStatement, 9.5, false, [51, 65, 85], 4);

    addHeading("Target Audience", 2);
    addText(result.targetAudience, 9.5, false, [51, 65, 85], 4);

    addHeading("Market Opportunity", 2);
    addText(result.marketOpportunity, 9.5, false, [51, 65, 85], 6);

    // --- PAGE 2: METRIC SCORE PROFILE & BALANCED REASONINGS ---
    doc.addPage();
    drawPageHeader();
    
    addHeading("Strategic Venture Diagnostics", 1);
    addText("NexIdea executes a multi-factor risk simulation of the startup proposal. Parameters below model core operational bottlenecks.", 9, false, [100, 110, 120], 5);

    scoreKeys.forEach((key) => {
      const label = scoreLabels[key] || String(key);
      const { score, reasoning } = getScoreDataSafe(key);
      
      if (posY > 245) {
        doc.addPage();
        drawPageHeader();
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(label, 15, posY);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(234, 88, 12);
      doc.text(`${score}/10`, 183, posY);
      posY += 4;
      
      // Paint score progress line
      doc.setFillColor(241, 245, 249);
      doc.rect(15, posY, 180, 2, 'F');
      
      // Color matching algorithm
      if (key === 'executionComplexity') {
        doc.setFillColor(score >= 8 ? 239 : 16, score >= 8 ? 68 : 185, score >= 8 ? 68 : 129); // high complexity is red
      } else {
        doc.setFillColor(score >= 8 ? 16 : (score >= 5 ? 234 : 239), score >= 8 ? 185 : (score >= 5 ? 88 : 68), score >= 8 ? 129 : (score >= 5 ? 12 : 68));
      }
      doc.rect(15, posY, score * 18, 2, 'F');
      posY += 5;
      
      addText(reasoning, 8.5, false, [71, 85, 105], 4.5);
    });

    // --- PAGE 3: COMPETITOR ANALYSIS & STRATEGIC SWOT MATRIX ---
    doc.addPage();
    drawPageHeader();

    addHeading("Competitors & Market Overlaps", 1);
    addText("Analyzed products in matching segments, detailing weaknesses and opportunities for market wedge positioning.", 9.5, false, [100, 110, 120], 5);

    if (result.competitorAnalysis && result.competitorAnalysis.length > 0) {
      result.competitorAnalysis.forEach((comp) => {
        if (posY > 240) {
          doc.addPage();
          drawPageHeader();
        }
        
        doc.setFontSize(11.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Segment Actor: ${comp.name}`, 15, posY);
        posY += 4.5;
        
        addText(comp.description, 9, false, [71, 85, 105], 2.5);
        
        // Competitor Strengths list
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text("Engineered Strengths:", 22, posY);
        posY += 3.5;
        comp.strengths.forEach((s) => {
          addText(`* ${s}`, 8.5, false, [51, 65, 85], 1);
        });
        posY += 2;
        
        // Competitor Weaknesses list
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68);
        doc.text("Discovered Weaknesses & Gaps:", 22, posY);
        posY += 3.5;
        comp.weaknesses.forEach((w) => {
          addText(`* ${w}`, 8.5, false, [51, 65, 85], 1);
        });
        posY += 5;
      });
    } else {
      addText("No critical competitor overlapping identified during validation sweeps.", 9, false, [71, 85, 105], 5);
    }
    
    // SWOT Sections
    if (posY > 180) {
      doc.addPage();
      drawPageHeader();
    }
    
    addHeading("SWOT Strategic Diagnostic Matrix", 2);
    const swot = result.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
    
    const renderSwotBlock = (title: string, list: string[], fillBg: [number, number, number], fontColor: [number, number, number]) => {
      if (posY > 235) {
        doc.addPage();
        drawPageHeader();
      }
      doc.setFillColor(fillBg[0], fillBg[1], fillBg[2]);
      doc.rect(15, posY, 180, 5, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(fontColor[0], fontColor[1], fontColor[2]);
      doc.text(title, 18, posY + 3.8);
      posY += 7;
      
      if (list && list.length > 0) {
        list.forEach((val) => {
          addText(`+ ${val}`, 8.5, false, [60, 70, 85], 1);
        });
      } else {
        addText("None documented.", 8.5, false, [120, 120, 120], 1);
      }
      posY += 3;
    };
    
    renderSwotBlock("S - INTERNAL STRENGTHS", swot.strengths, [236, 253, 245], [5, 150, 105]);
    renderSwotBlock("W - INTERNAL WEAKNESSES", swot.weaknesses, [254, 242, 242], [220, 38, 38]);
    renderSwotBlock("O - EXTERNAL OPPORTUNITIES", swot.opportunities, [239, 246, 255], [37, 99, 235]);
    renderSwotBlock("T - EXTERNAL THREATS", swot.threats, [255, 251, 235], [217, 119, 6]);

    // --- PAGE 4: MVP FEATURES & TECHNICAL STRUCTURE ---
    doc.addPage();
    drawPageHeader();

    addHeading("Venture Roadmap & System Architecture", 1);
    addText("Concrete phased MVP boundaries and target technologies selected for optimal capital-efficiency.", 9.5, false, [100, 110, 120], 5);

    addHeading("Phased MVP Build Specifications", 2);
    const mfeList = result.mvpFeatures || [];
    mfeList.forEach((phItem) => {
      if (posY > 240) {
        doc.addPage();
        drawPageHeader();
      }
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(phItem.phase, 15, posY);
      posY += 4.5;
      
      if (phItem.features && phItem.features.length > 0) {
        phItem.features.forEach((feature) => {
          addText(`- ${feature}`, 8.5, false, [71, 85, 105], 1);
        });
      }
      posY += 3;
    });

    addHeading("Technical Architecture Stack", 2);
    const archData = result.technicalArchitecture || { frontend: '', backend: '', database: '', architecture: '' };
    
    const writeTechElement = (labelName: string, textValue: string) => {
      if (posY > 250) {
        doc.addPage();
        drawPageHeader();
      }
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(labelName, 17, posY);
      posY += 3.5;
      addText(textValue, 8.5, false, [71, 85, 105], 2);
    };

    writeTechElement("System Frontend Architecture:", archData.frontend);
    writeTechElement("Core Backend Service Framework:", archData.backend);
    writeTechElement("Data Persistence & DB Layer:", archData.database);
    writeTechElement("Global Infrastructure Model:", archData.architecture);

    addHeading("Monetization & Stream Setup", 2);
    const moneyStrats = result.monetizationStrategy || [];
    moneyStrats.forEach((ms) => {
      if (posY > 245) {
        doc.addPage();
        drawPageHeader();
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(ms.model, 15, posY);
      posY += 4;
      
      addText(`Pricing Formula: ${ms.pricing}`, 8.5, true, [234, 88, 12], 1);
      addText(ms.description, 8.5, false, [71, 85, 105], 3);
    });

    // --- PAGE 5: GTM CALENDAR & FINANCIAL ANALYSIS ---
    doc.addPage();
    drawPageHeader();

    addHeading("Go-To-Market Validation Timeline", 1);
    addText("Chronological actions targeting immediate market response, validation testing, and early interest acquisition.", 9.5, false, [100, 110, 120], 5);

    const checkDays = result.launchPlan || [];
    checkDays.forEach((cd) => {
      if (posY > 245) {
        doc.addPage();
        drawPageHeader();
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(cd.day, 15, posY);
      posY += 4;
      addText(cd.task, 8.5, false, [71, 85, 105], 2.5);
    });

    addHeading("3-Year Revenue & Cost Forecasting", 2);
    const forecastRows = result.revenueForecast || [];
    forecastRows.forEach((fr) => {
      if (posY > 250) {
        doc.addPage();
        drawPageHeader();
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(fr.year, 15, posY);
      posY += 4;
      
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(234, 88, 12);
      doc.text(`Pro-forma Earnings: ${fr.revenue}   |   Operational Expenses: ${fr.expenses}`, 18, posY);
      posY += 5;
    });

    posY += 12;
    if (posY > 270) {
      doc.addPage();
      drawPageHeader();
      posY += 15;
    }
    doc.setDrawColor(220, 225, 230);
    doc.line(15, posY, 195, posY);
    posY += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(140, 145, 155);
    doc.text("End of diagnostic assessment. Generated server-side using the real-time NexIdea Science Engine.", 15, posY);

    doc.save(`nexidea-assessment-${report.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const scoreKeys: Array<keyof typeof result.scores> = [
    'technicalFeasibility',
    'scientificFeasibility',
    'regulatoryFeasibility',
    'marketDemand',
    'revenuePotential',
    'competition',
    'executionComplexity'
  ];

  const scoreLabels: Record<string, string> = {
    technicalFeasibility: "Technical Feasibility",
    scientificFeasibility: "Scientific Feasibility",
    regulatoryFeasibility: "Regulatory Feasibility",
    marketDemand: "Market Demand",
    revenuePotential: "Revenue Potential",
    competition: "Competition",
    executionComplexity: "Execution Complexity"
  };

  const getScoreDataSafe = (key: string): { score: number; reasoning: string } => {
    const rawVal = (result.scores as any)?.[key];
    if (rawVal && typeof rawVal === 'object' && 'score' in rawVal) {
      return {
        score: typeof rawVal.score === 'number' ? rawVal.score : Number(rawVal.score) || 0,
        reasoning: String(rawVal.reasoning || '')
      };
    }
    // Handle legacy key mapping fallbacks if they happen
    let fallbackNum = 5;
    if (typeof rawVal === 'number') {
      fallbackNum = rawVal;
    } else if (key === 'technicalFeasibility') {
      fallbackNum = Number((result.scores as any)?.scalability) || 5;
    } else if (key === 'scientificFeasibility') {
      fallbackNum = 10; // Legacy assume fully proven
    } else if (key === 'regulatoryFeasibility') {
      fallbackNum = 8;
    } else if (key === 'marketDemand') {
      fallbackNum = Number((result.scores as any)?.marketDemand) || 5;
    } else if (key === 'revenuePotential') {
      fallbackNum = Number((result.scores as any)?.revenuePotential) || 5;
    } else if (key === 'competition') {
      fallbackNum = Number((result.scores as any)?.competition) || 5;
    } else if (key === 'executionComplexity') {
      fallbackNum = Number((result.scores as any)?.executionDifficulty) || 5;
    }

    return {
      score: fallbackNum,
      reasoning: "Legacy calculation without detailed reasoning. Recalculate using Re-run Validation to see rich parameters."
    };
  };

  const getScoreColor = (key: string, val: number) => {
    if (key === 'executionComplexity') {
      if (val >= 8) return "bg-red-500 shadow-sm shadow-red-500/20";
      if (val >= 5) return "bg-brand-orange shadow-sm shadow-brand-orange/20";
      return "bg-emerald-500 shadow-sm shadow-emerald-500/20";
    }
    if (val >= 8) return "bg-emerald-500 shadow-sm shadow-emerald-500/20";
    if (val >= 5) return "bg-brand-orange shadow-sm shadow-brand-orange/20";
    return "bg-red-500 shadow-sm shadow-red-500/20";
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16 select-none relative z-10 font-sans" id="results-view">
      
      {/* Decorative Warm Background Radial Glow (User Request) */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full max-w-6xl h-[280px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,107,0,0.08),transparent_100%)] pointer-events-none"></div>

      {/* Top dashboard control bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-900 pb-8 mb-8 no-print">
        <button
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-neutral-800 bg-[#0d0d0d] hover:bg-[#121212] px-4.5 py-2.5 text-xs font-semibold text-[#f5f5f5] transition-all cursor-pointer"
        >
          <ArrowLeft size={13} className="text-neutral-400" />
          <span>Venture Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onRerun(report.id)}
            disabled={loadingRerun}
            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-[#0d0d0d] hover:bg-[#121212] px-4 py-2.5 text-xs font-semibold text-[#f5f5f5] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={12} className={loadingRerun ? "animate-spin text-brand-orange" : ""} />
            <span>{loadingRerun ? "Refreshing..." : "Re-run Validation"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-[#0d0d0d] hover:bg-[#121212] px-4 py-2.5 text-xs font-semibold text-[#f5f5f5] transition-all cursor-pointer"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
            <span>{copied ? "Link Copied!" : "Share Blueprint"}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-lg bg-brand-orange hover:bg-brand-orange/95 px-4.5 py-2.5 text-xs font-semibold text-white transition-all shadow-lg shadow-brand-orange/10 cursor-pointer"
          >
            <Download size={12} />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Speculative Science Impediment Alert Box */}
      {result.isSpeculativeScience && (
        <div className="mb-8 rounded-xl border border-red-950 bg-red-950/10 p-6 shadow-xl relative overflow-hidden backdrop-blur-sm animate-pulse">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-red-400 font-bold block">
                Critical Scientific Impediment Detected
              </span>
              <h2 className="font-display text-base font-bold text-white tracking-tight">
                Unproven or Sci-Fi Speculative Technology Dependency
              </h2>
              <p className="text-xs text-red-200/70 leading-relaxed pt-1.5 max-w-2xl font-sans">
                {result.scientificLimitationDetails || "This idea relies on currently unproven physics or uninvented technology. Execution feasibility has been capped to reflect realistic physical/engineering boundaries."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Printable Title Header */}
      <div className="mb-8 pl-4.5 border-l-2 border-brand-orange">
        <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3.5xl">
          {report.name} — Blueprint Scan
        </h1>
        <p className="text-xs text-neutral-400 mt-1.5 max-w-3xl leading-relaxed">
          {report.ideaDescription}
        </p>
        <span className="text-[9px] font-mono text-neutral-500 block mt-2.5">
          Validated via NexIdea server intelligence on {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </span>
      </div>

      {/* Unified Score Section (Radial gauge + detailed parameters) */}
      <div className="grid gap-6 md:grid-cols-12 mb-8 select-none">
        {/* Gauge Block */}
        <div className="md:col-span-4 rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.01] p-6 flex flex-col items-center justify-center text-center glass-panel">
          <CircularProgress score={result.overallScore} size={170} />
          <div className="mt-4">
            <span className="text-xs font-mono uppercase text-brand-orange tracking-widest block font-bold mb-1">
              Validation Metric
            </span>
            <p className="text-xs text-white/50 px-2 line-clamp-2">
              Values aggregated from competitive volume, target market depth, and execution friction.
            </p>
          </div>
        </div>

        {/* Detailed Horizontal sliders */}
        <div className="md:col-span-8 rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Info size={13} />
              <span>Core Operational Parameters & Score Reasonings</span>
            </h3>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {scoreKeys.map((key) => {
                const label = scoreLabels[key] || key;
                const { score, reasoning } = getScoreDataSafe(key);
                return (
                  <div key={key} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-brand-secondary font-semibold">{label}</span>
                      <span className="font-bold text-white">{score}/10</span>
                    </div>
                    {/* Linear score meter */}
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(key, score)}`}
                        style={{ width: `${score * 10}%` }}
                      ></div>
                    </div>
                    {reasoning && (
                      <p className="text-[11px] text-white/60 leading-relaxed pl-2.5 border-l border-white/10 font-sans">
                        {reasoning}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list - SaaS Product Layout */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/5 mb-8 no-print select-none">
        <button
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'market' 
              ? 'bg-brand-orange/10 border-b-2 border-brand-orange text-white bg-white/5' 
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <Target size={14} />
          <span>Validation & Market</span>
        </button>

        <button
          onClick={() => setActiveTab('strategy')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'strategy' 
              ? 'bg-brand-orange/10 border-b-2 border-brand-orange text-white bg-white/5' 
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <Compass size={14} />
          <span>SWOT & Competition</span>
        </button>

        <button
          onClick={() => setActiveTab('mvp')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'mvp' 
              ? 'bg-brand-orange/10 border-b-2 border-brand-orange text-white bg-white/5' 
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <Cpu size={14} />
          <span>Product & Tech</span>
        </button>

        <button
          onClick={() => setActiveTab('pitch')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'pitch' 
              ? 'bg-brand-orange/10 border-b-2 border-brand-orange text-white bg-white/5' 
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <Heart size={14} />
          <span>Elevator Pitch</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'finance' 
              ? 'bg-brand-orange/10 border-b-2 border-brand-orange text-white bg-white/5' 
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <Coins size={14} />
          <span>Monetization & Forecast</span>
        </button>
      </div>

      {/* Tabs Content Cluster */}
      <div className="space-y-8 min-h-[300px]">
        
        {/* Tab 1: Validation & Market */}
        {(activeTab === 'market' || window.matchMedia('print').matches) && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                <Star size={13} />
                <span>Executive Idea Summary</span>
              </h3>
              <p className="text-sm text-brand-secondary leading-relaxed font-sans">
                {result.ideaSummary}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                <AlertCircle size={13} />
                <span>Problem Statement</span>
              </h3>
              <p className="text-sm text-brand-secondary leading-relaxed">
                {result.problemStatement}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                <MapPin size={13} />
                <span>Primary Target Audience</span>
              </h3>
              <p className="text-sm text-brand-secondary leading-relaxed">
                {result.targetAudience}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                <TrendingUp size={13} />
                <span>Market Opportunity & TAM metrics</span>
              </h3>
              <p className="text-sm text-brand-secondary leading-relaxed">
                {result.marketOpportunity}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: SWOT & Competition */}
        {(activeTab === 'strategy' && !window.matchMedia('print').matches) && (
          <div className="space-y-6">
            {/* Competitor lists */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-1.5">
                <ShieldAlert size={13} />
                <span>Direct Competitor Mapping</span>
              </h3>
              
              <div className="grid gap-6 sm:grid-cols-3">
                {result.competitorAnalysis.map((comp, idx) => (
                  <div key={idx} className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
                    <div>
                      <span className="block text-sm font-bold text-white mb-1.5">{comp.name}</span>
                      <p className="text-xs text-brand-secondary leading-relaxed mb-4">{comp.description}</p>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-white/5 text-[11px]">
                      <div>
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-emerald-400 mb-0.5">Key Strengths</span>
                        <ul className="list-disc list-inside text-white/60 space-y-0.5">
                          {comp.strengths.slice(0, 2).map((s, si) => <li key={si} className="truncate">{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-amber-400 mb-0.5">Critical Weaknesses</span>
                        <ul className="list-disc list-inside text-white/60 space-y-0.5">
                          {comp.weaknesses.slice(0, 2).map((w, wi) => <li key={wi} className="truncate">{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SWOT Matrix Grid */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-1.5">
                <Compass size={13} />
                <span>SWOT Matrix Parameters</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-4">
                {/* Strengths */}
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] p-4">
                  <span className="block text-xs font-bold text-emerald-400 font-mono uppercase mb-2">Strengths</span>
                  <ul className="space-y-1.5 text-xs text-brand-secondary">
                    {result.swotAnalysis.strengths.map((s, itemIdx) => <li key={itemIdx} className="flex gap-1.5"><span className="text-emerald-500 font-bold">•</span>{s}</li>)}
                  </ul>
                </div>
                {/* Weaknesses */}
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.01] p-4">
                  <span className="block text-xs font-bold text-amber-400 font-mono uppercase mb-2">Weaknesses</span>
                  <ul className="space-y-1.5 text-xs text-brand-secondary">
                    {result.swotAnalysis.weaknesses.map((w, itemIdx) => <li key={itemIdx} className="flex gap-1.5"><span className="text-amber-500 font-bold">•</span>{w}</li>)}
                  </ul>
                </div>
                {/* Opportunities */}
                <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.01] p-4">
                  <span className="block text-xs font-bold text-blue-400 font-mono uppercase mb-2">Opportunities</span>
                  <ul className="space-y-1.5 text-xs text-brand-secondary">
                    {result.swotAnalysis.opportunities.map((o, itemIdx) => <li key={itemIdx} className="flex gap-1.5"><span className="text-blue-400 font-bold">•</span>{o}</li>)}
                  </ul>
                </div>
                {/* Threats */}
                <div className="rounded-xl border border-red-500/10 bg-red-500/[0.01] p-4">
                  <span className="block text-xs font-bold text-red-400 font-mono uppercase mb-2">Threats</span>
                  <ul className="space-y-1.5 text-xs text-brand-secondary">
                    {result.swotAnalysis.threats.map((t, itemIdx) => <li key={itemIdx} className="flex gap-1.5"><span className="text-red-400 font-bold">•</span>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Go to market channels */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                <Gift size={13} />
                <span>Go-To-Market Strategic Channels</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.goToMarket.map((itm, idx) => (
                  <span key={idx} className="rounded-full bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 text-xs text-brand-accent font-medium">
                    {itm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Product & Launch */}
        {(activeTab === 'mvp' && !window.matchMedia('print').matches) && (
          <div className="grid gap-6 md:grid-cols-12">
            {/* MVP Phases */}
            <div className="md:col-span-6 rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange flex items-center gap-1.5">
                <Layers size={13} />
                <span>Product MVP Phased Roadmap</span>
              </h3>

              <div className="space-y-4">
                {result.mvpFeatures.map((mvp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <span className="block text-xs font-bold text-white font-display mb-2">{mvp.phase}</span>
                    <ul className="space-y-1 text-xs text-brand-secondary">
                      {mvp.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange"></span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Stacks */}
            <div className="md:col-span-6 space-y-6">
              <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
                <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                  <Terminal size={13} />
                  <span>Technical System Architecture Stacks</span>
                </h3>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-3 text-xs leading-relaxed border-b border-white/5 pb-2.5">
                    <span className="font-semibold text-white/50">Frontend</span>
                    <span className="col-span-2 text-white">{result.technicalArchitecture.frontend}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs leading-relaxed border-b border-white/5 pb-2.5">
                    <span className="font-semibold text-white/50">Backend</span>
                    <span className="col-span-2 text-white">{result.technicalArchitecture.backend}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs leading-relaxed border-b border-white/5 pb-2.5">
                    <span className="font-semibold text-white/50">Database</span>
                    <span className="col-span-2 text-white">{result.technicalArchitecture.database}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs leading-relaxed">
                    <span className="font-semibold text-white/50">Infrastructure</span>
                    <span className="col-span-2 text-white">{result.technicalArchitecture.architecture}</span>
                  </div>
                </div>
              </div>

              {/* launch checklist */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
                <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5">
                  <CalendarCheck size={13} />
                  <span>30-Day Launchpad checklists</span>
                </h3>
                <div className="space-y-3.5">
                  {result.launchPlan.map((plan, idx) => (
                    <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                      <span className="font-mono text-brand-orange font-bold min-w-[70px] uppercase">{plan.day}</span>
                      <span className="text-brand-secondary">{plan.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Elevator Pitch & Deck Context */}
        {(activeTab === 'pitch' && !window.matchMedia('print').matches) && (
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5 space-y-6">
              {/* Elevator Pitch speech block */}
              <div className="rounded-2xl border border-brand-orange/15 bg-brand-orange/[0.01] p-6 glass-panel relative">
                <div className="absolute top-4 right-4 text-brand-orange opacity-15">
                  <Terminal size={40} />
                </div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-1.5 font-bold">
                  <span>30-Second Elevator Pitch</span>
                </h3>
                <p className="text-sm italic text-white/90 leading-relaxed font-sans border-l-2 border-brand-orange/40 pl-3">
                  "{result.elevatorPitch}"
                </p>
              </div>

              {/* Alternative brand names suggestions */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel">
                <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-1.5">
                  <Lightbulb size={13} />
                  <span>Alternative Names Suggestions</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  {result.startupNames.map((nm, idx) => {
                    const domain = result.domainSuggestions[idx] || `${nm.toLowerCase()}.co`;
                    return (
                      <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-white">{nm}</span>
                        <span className="font-mono text-brand-orange px-2 py-0.5 rounded bg-brand-orange/5 border border-brand-orange/10 uppercase text-[10px]">
                          {domain}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Investor Deck structured slides details */}
            <div className="md:col-span-7 rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange flex items-center gap-1.5 mb-2.5">
                <Star size={13} />
                <span>Investor Deck context slide breakdown</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <span className="block font-bold text-white mb-1 uppercase tracking-tight">Venture Headline</span>
                  <p className="text-brand-secondary leading-normal">{result.investorPitch.headline}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <span className="block font-bold text-white mb-1 uppercase tracking-tight">The Hook Problem</span>
                  <p className="text-brand-secondary leading-normal">{result.investorPitch.problem}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <span className="block font-bold text-white mb-1 uppercase tracking-tight">The Hook Solution</span>
                  <p className="text-brand-secondary leading-normal">{result.investorPitch.solution}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <span className="block font-bold text-white mb-1 uppercase tracking-tight">Competitor & TAM sizes</span>
                  <p className="text-brand-secondary leading-normal">{result.investorPitch.marketSize}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <span className="block font-bold text-white mb-1 uppercase tracking-tight">Venture Team Structure Required</span>
                  <p className="text-brand-secondary leading-normal">{result.investorPitch.teamNeeded}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Monetization strategy & financial forecast */}
        {(activeTab === 'finance' && !window.matchMedia('print').matches) && (
          <div className="grid gap-6 md:grid-cols-12">
            
            {/* SaaS Monetization plans */}
            <div className="md:col-span-6 rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange flex items-center gap-1.5 mb-1">
                <Coins size={13} />
                <span>SaaS Revenue Strategy Models</span>
              </h3>

              <div className="space-y-4">
                {(result.monetizationStrategy || []).map((mon, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-white tracking-tight">{mon.model}</span>
                      <span className="text-xs font-semibold text-brand-orange font-mono">
                        {mon.pricing}
                      </span>
                    </div>
                    <p className="text-xs text-brand-secondary leading-normal">{mon.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Year forecasts flow */}
            <div className="md:col-span-6 rounded-2xl border border-white/5 bg-white/[0.01] p-6 glass-panel space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange flex items-center gap-1.5">
                <TrendingUp size={13} />
                <span>3-Year financial projection estimations</span>
              </h3>

              <div className="space-y-3.5">
                {result.revenueForecast.map((forecast, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-white/50 block">PERIOD</span>
                      <span className="font-bold text-sm text-white">{forecast.year}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-emerald-400 font-bold font-mono">
                        Proj Rev: {forecast.revenue}
                      </span>
                      <span className="block text-[10px] text-white/40 font-mono">
                        Est. Costs: {forecast.expenses}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Report Only Sections (All categories expanded together when user prints the file!) */}
      <div className="hidden print-only space-y-8 mt-12 border-t border-dashed border-black/20 pt-12 text-black">
        <h2 className="text-xl font-bold font-display uppercase border-b-2 border-black pb-2">Complete Startup Evaluation Dossier</h2>
        
        <div className="space-y-4">
          <h4 className="font-bold text-sm">Executive Idea Summary</h4>
          <p className="text-xs leading-relaxed">{result.ideaSummary}</p>
          
          <h4 className="font-bold text-sm">Problem Statement</h4>
          <p className="text-xs leading-relaxed">{result.problemStatement}</p>

          <h4 className="font-bold text-sm">Market Opportunity & Demographics</h4>
          <p className="text-xs leading-relaxed">{result.marketOpportunity}</p>

          <h4 className="font-bold text-sm">Competitor Saturation mapping</h4>
          <div className="grid grid-cols-3 gap-4">
            {(result.competitorAnalysis || []).map((c, i) => (
              <div key={i} className="border border-black/20 p-3 rounded">
                <span className="font-bold text-xs uppercase block">{c.name}</span>
                <p className="text-[10px] text-black/70 mb-2">{c.description}</p>
                <div className="text-[9px]">
                  <strong>Strengths:</strong> {c.strengths.join(", ")} <br/>
                  <strong>Weaknesses:</strong> {c.weaknesses.join(", ")}
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-bold text-sm">System Architecture</h4>
          <p className="text-xs leading-relaxed">
            Frontend: {result.technicalArchitecture?.frontend ?? "Not provided"} 
            {result.technicalArchitecture?.backend ?? "Not provided"}
            {result.technicalArchitecture?.database ?? "Not provided"}
            {result.technicalArchitecture?.architecture ?? "Not provided"}
          </p>

          <h4 className="font-bold text-sm">Revenue forecasting & pricing models</h4>
          <p className="text-xs leading-relaxed">
            {result.monetizationStrategy.map(m => `${m.model}: (${m.pricing}) - ${m.description}`).join(' | ')}
          </p>
        </div>
      </div>
    </div>
  );
}
