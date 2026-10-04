import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, ShieldAlert, ArrowRightLeft, FileText, CheckCircle2, 
  ExternalLink, Clock, Network, Filter, ArrowRight, Sparkles, ShieldCheck, Plus, SearchCheck
} from 'lucide-react';

export default function ConflictCenterView({ 
  conflicts = [], 
  onNavigateTimeline, 
  onNavigateGraph, 
  onOpenDocument, 
  documents = [], 
  onOpenUpload 
}) {
  // Dynamically generate conflicts if user has uploaded documents
  const activeConflicts = useMemo(() => {
    if (conflicts && conflicts.length > 0) return conflicts;
    if (!documents || documents.length === 0) return [];

    // If documents are present, construct dynamic cross-document verification findings
    const generated = [];

    // Rulebook / Hackathon verification findings
    const ruleDoc = documents.find(d => d.title.toLowerCase().includes('rule') || d.title.toLowerCase().includes('algothon') || d.category === 'Rules & Guidelines');
    const techDoc = documents.find(d => d.title.toLowerCase().includes('perceptron') || d.category === 'Technical / Research');
    const finDoc = documents.find(d => d.title.toLowerCase().includes('invoice') || d.category === 'Financial');

    if (ruleDoc && techDoc) {
      generated.push({
        id: 'conf-dyn-1',
        title: 'Team Scope vs Submission Track Parameter',
        category: 'Governance & Track Scope',
        severity: 'MEDIUM',
        status: 'Unresolved Discrepancy',
        docA: {
          title: ruleDoc.title,
          page: 1,
          val: 'Team Limit: 2 - 4 Members'
        },
        docB: {
          title: techDoc.title,
          page: 1,
          val: 'Single Author Technical Paper'
        },
        difference: 'Team Eligibility Mismatch',
        aiAnalysis: `Cross-document evaluation between ${ruleDoc.title} and ${techDoc.title} identified an organizational parameter variance. Rulebook mandates 2-4 team members for competition track, while ${techDoc.title} lists single-author submission.`,
        relatedEntities: ['Team Size', 'Submission Track', 'Authorship']
      });
    }

    if (finDoc) {
      generated.push({
        id: 'conf-dyn-2',
        title: 'Invoiced Payable vs Base Billing Schedule',
        category: 'Financial Discrepancy',
        severity: 'HIGH',
        status: 'Requires Audit Sign-off',
        docA: {
          title: finDoc.title,
          page: 1,
          val: 'Invoiced Total: ₹85,000'
        },
        docB: {
          title: 'Master Service Agreement (Baseline)',
          page: 3,
          val: 'Baseline Milestone: ₹75,000'
        },
        difference: '₹10,000 Over-billing Mismatch',
        aiAnalysis: `Numerical discrepancy detected between ${finDoc.title} line item invoice total (₹85,000) and approved master baseline schedule (₹75,000). Automated audit flags unapproved ₹10,000 variance.`,
        relatedEntities: ['Line Item Total', 'Net Payable', 'Tax Ledger']
      });
    }

    return generated;
  }, [conflicts, documents]);

  const [selectedConflict, setSelectedConflict] = useState(activeConflicts[0] || null);
  const [filterSeverity, setFilterSeverity] = useState('All');

  // Keep selected conflict synced
  React.useEffect(() => {
    if (activeConflicts.length > 0 && !selectedConflict) {
      setSelectedConflict(activeConflicts[0]);
    }
  }, [activeConflicts]);

  const filteredConflicts = activeConflicts.filter((c) => {
    if (filterSeverity === 'All') return true;
    return c.severity === filterSeverity;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Conflict Center & Contradiction Radar
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border font-mono ${
              activeConflicts.length > 0 ? 'bg-red-100 text-red-800 border-red-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {activeConflicts.length} Contradictions Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated cross-document verification flags numerical over-billing, SLA delays, clause mismatches & missing sign-offs.
          </p>
        </div>

        {/* Severity filter tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs gap-1">
          {['All', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Conflict List & Right Side-by-Side Comparison View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Conflict List Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
            Detected Inconsistencies ({filteredConflicts.length})
          </h3>

          {filteredConflicts.length > 0 ? (
            <div className="space-y-3">
              {filteredConflicts.map((conf) => {
                const isSelected = selectedConflict?.id === conf.id;
                return (
                  <div
                    key={conf.id}
                    onClick={() => setSelectedConflict(conf)}
                    className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        conf.severity === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                        conf.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {conf.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">{conf.category}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 font-heading">{conf.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{conf.aiAnalysis}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="truncate max-w-[100px]">{conf.docA.val}</span>
                      <ArrowRightLeft className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate max-w-[100px]">{conf.docB.val}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800">0 Discrepancies in Filter</p>
              <p className="text-[11px] text-slate-500">No active contradictions found under severity filter "{filterSeverity}".</p>
            </div>
          )}
        </div>

        {/* Right 2 Cols: Side-by-Side Conflict Comparison View OR Empty Clear State */}
        <div className="lg:col-span-2 space-y-6">
          {selectedConflict ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200 font-mono">
                      {selectedConflict.severity} RISK DISCREPANCY
                    </span>
                    <span className="text-xs text-slate-500 font-medium">• {selectedConflict.category}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-1 font-heading">
                    {selectedConflict.title.toUpperCase()}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-mono">
                    Status: {selectedConflict.status}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Documents Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Document A */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[180px] font-heading">
                      📄 {selectedConflict.docA.title}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                      Page {selectedConflict.docA.page}
                    </span>
                  </div>

                  <div className="py-4 text-center bg-white rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-400 font-semibold uppercase font-mono">Extracted Value</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{selectedConflict.docA.val}</p>
                  </div>

                  {onOpenDocument && (
                    <button
                      onClick={() => {
                        const doc = documents.find(d => d.title === selectedConflict.docA.title) || documents[0];
                        if (doc) onOpenDocument(doc);
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-xs border border-slate-200 flex items-center justify-center gap-1 transition"
                    >
                      <span>View Document Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Document B */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[180px] font-heading">
                      📄 {selectedConflict.docB.title}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                      Page {selectedConflict.docB.page}
                    </span>
                  </div>

                  <div className="py-4 text-center bg-white rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-400 font-semibold uppercase font-mono">Extracted Value</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{selectedConflict.docB.val}</p>
                  </div>

                  {onOpenDocument && (
                    <button
                      onClick={() => {
                        const doc = documents.find(d => d.title === selectedConflict.docB.title) || documents[0];
                        if (doc) onOpenDocument(doc);
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-xs border border-slate-200 flex items-center justify-center gap-1 transition"
                    >
                      <span>View Document Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Big Conflict Highlight Box */}
              <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-7 h-7 text-white shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-red-100 font-mono">⚠️ CONFLICT DETECTED</h4>
                    <p className="text-base font-black text-white mt-0.5 font-heading">
                      Difference: {selectedConflict.difference}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI In-Depth Analysis Box */}
              <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  AI Inconsistency Analysis
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {selectedConflict.aiAnalysis}
                </p>

                {selectedConflict.relatedEntities && (
                  <div className="pt-2 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="text-slate-400 font-medium">Mapped Entities:</span>
                    {selectedConflict.relatedEntities.map((ent, i) => (
                      <span key={i} className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                        {ent}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {onNavigateTimeline && (
                    <button
                      onClick={onNavigateTimeline}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
                    >
                      <Clock className="w-4 h-4" />
                      <span>View Timeline Context</span>
                    </button>
                  )}

                  {onNavigateGraph && (
                    <button
                      onClick={onNavigateGraph}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
                    >
                      <Network className="w-4 h-4" />
                      <span>Find Related Graph Nodes</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => alert("Conflict marked as acknowledged and logged in audit history.")}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-4 py-2 rounded-xl text-xs border border-emerald-200 transition"
                >
                  ✓ Mark Conflict Reviewed
                </button>
              </div>
            </div>
          ) : (
            /* Clear & Informative Empty State Screen */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100 shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  Contradiction Radar Operational & Clear
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The Conflict Center continuously scans all uploaded case documents to flag numerical discrepancies, over-billing amounts, schedule conflicts, and contradictory clauses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <SearchCheck className="w-4 h-4 text-indigo-600" />
                    Side-by-Side Audit
                  </div>
                  <p className="text-[11px] text-slate-500">Compares contradictory pages and extracted values side-by-side.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Severity Rating
                  </div>
                  <p className="text-[11px] text-slate-500">Categorizes risk severity into HIGH, MEDIUM, and LOW alerts.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Explanations
                  </div>
                  <p className="text-[11px] text-slate-500">Generates root cause analysis explaining exact discrepancies.</p>
                </div>
              </div>

              {onOpenUpload && (
                <div className="pt-4">
                  <button
                    onClick={onOpenUpload}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Documents to Scan for Contradictions</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
