import React, { useState } from 'react';
import { 
  Search, ArrowRight, FileText, SearchCheck, 
  Network, Sparkles, Clock, Boxes, BarChart3, Bookmark,
  Upload, CheckCircle2, ChevronRight, ShieldCheck, Scale, Layers
} from 'lucide-react';

export default function DashboardView({ 
  user,
  onStartInvestigation, 
  onNavigate, 
  documents = [], 
  findings = [],
  onOpenUpload 
}) {
  const [queryInput, setQueryInput] = useState('');
  const userName = user?.name || 'Investigator';

  const sampleQueries = [
    "Summarize the main sections of the document",
    "What key parameters or models are specified?",
    "Reconstruct the timeline of events",
    "Extract all named entities and financial figures"
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onStartInvestigation(queryInput);
    }
  };

  const actionCards = [
    {
      id: 'investigate',
      title: 'Start AI Investigation',
      tag: 'PRIMARY WORKSPACE',
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: SearchCheck,
      iconBg: 'bg-indigo-600 text-white',
      desc: 'Ask questions, cross-examine evidence, and query across indexed documents with auditable citations & confidence meters.',
      actionText: 'Launch Investigation Workspace',
      target: 'investigate'
    },
    {
      id: 'vault',
      title: 'Evidence Vault',
      tag: `${documents.length} DOCUMENTS`,
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FileText,
      iconBg: 'bg-blue-600 text-white',
      desc: 'Secure archived repository. Browse technical papers, rulebooks, financial records, and legal filings by category.',
      actionText: 'Browse Evidence Vault',
      target: 'vault'
    },
    {
      id: 'graph',
      title: 'Evidence Graph Network',
      tag: 'INTERACTIVE KNOWLEDGE MAP',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Network,
      iconBg: 'bg-purple-600 text-white',
      desc: 'Visualize entity relationships, technical models, money flows, and document connections on an interactive SVG canvas.',
      actionText: 'Explore Knowledge Graph',
      target: 'graph'
    },
    {
      id: 'timeline',
      title: 'Case Chronology Timeline',
      tag: 'MILESTONE STREAM',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Clock,
      iconBg: 'bg-amber-600 text-white',
      desc: 'Reconstruct event chronology from initial document uploads to OCR parsing, execution logs, and audit records.',
      actionText: 'View Case Timeline',
      target: 'timeline'
    },
    {
      id: 'entities',
      title: 'Smart Entity Index',
      tag: 'NAMED ENTITIES',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Boxes,
      iconBg: 'bg-teal-600 text-white',
      desc: 'NLP extraction of people, organizations, neural network models, financial amounts, and document IDs across case files.',
      actionText: 'Explore Extracted Entities',
      target: 'entities'
    },
    {
      id: 'insights',
      title: 'Analytics Insights',
      tag: 'LIVE AUDIT METRICS',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: BarChart3,
      iconBg: 'bg-emerald-600 text-white',
      desc: 'Review quantitative charts for document distribution by category, entity node density, and RAG vector performance.',
      actionText: 'View Analytics Dashboard',
      target: 'insights'
    },
    {
      id: 'saved',
      title: 'Saved Findings',
      tag: `${findings.length} BOOKMARKS`,
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Bookmark,
      iconBg: 'bg-amber-500 text-white',
      desc: 'Curated evidence findings bookmarked during Q&A sessions, ready for executive PDF report generation.',
      actionText: 'View Bookmarked Findings',
      target: 'saved'
    },
    {
      id: 'reports',
      title: 'Report Generator',
      tag: 'PDF EXPORT READY',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: FileText,
      iconBg: 'bg-slate-900 text-white',
      desc: 'Generate formal, audit-ready PDF executive summaries with verified citations for leadership presentation.',
      actionText: 'Generate Executive Report',
      target: 'reports'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DocuLens AI Command Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight font-heading">
            Welcome back, <span className="text-indigo-400">{userName}</span>! What would you like to do today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Select a dedicated workspace card below or type your inquiry directly to launch an AI investigation session.
          </p>

          {/* Direct Inquiry Input Box */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-1.5 focus-within:ring-2 focus-within:ring-indigo-400 transition">
              <Search className="w-5 h-5 text-indigo-300 ml-3" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask any question about your case files (e.g., 'Summarize Multilayer Perceptron paper')..."
                className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none px-3 py-2 font-medium"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/30 shrink-0 font-heading"
              >
                <span>Investigate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Sample Query Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-semibold font-mono">Suggested Queries:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onStartInvestigation(q)}
                className="text-[11px] bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-full border border-white/10 transition"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Navigation Portal Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 tracking-tight font-heading">
            Dedicated Workspace Task Cards
          </h2>
          <span className="text-xs text-slate-500 font-medium font-mono">
            Click any option to proceed to its separate page
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.target)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border font-mono ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition font-heading">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700 font-heading">
                  <span>{card.actionText}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
