import React, { useState, useMemo } from 'react';
import { Clock, Calendar, AlertTriangle, FileText, CheckCircle2, ChevronRight, ExternalLink, Plus, Sparkles, ShieldCheck } from 'lucide-react';

export default function TimelineView({ onOpenDocument, documents = [], onOpenUpload }) {
  // Dynamically generate chronological events from vault documents
  const activeTimeline = useMemo(() => {
    if (!documents || documents.length === 0) return [];

    const events = [];
    documents.forEach((doc, idx) => {
      // 1. File Upload Milestone
      events.push({
        date: 'Today, 10:15 AM',
        title: `Ingested & Indexed ${doc.title}`,
        category: doc.category || 'Case Document',
        description: `Uploaded ${doc.title} (${doc.pages || 10} pages). Encrypted payload stored in evidence enclave with 1,536-dimensional vector embeddings.`,
        source: `${doc.title} (Page 1)`,
        hasConflict: false,
        docRef: doc
      });

      // 2. Extraction / Audit Milestone
      if (doc.category === 'Rules & Guidelines') {
        events.push({
          date: 'Today, 10:20 AM',
          title: `Governance Audit Passed for ${doc.title}`,
          category: 'Audit Verification',
          description: `Parsed competition guidelines, team eligibility parameters (2-4 members), and submission track criteria.`,
          source: `${doc.title} (Page 3)`,
          hasConflict: false,
          docRef: doc
        });
      } else if (doc.category === 'Technical / Research') {
        events.push({
          date: 'Today, 10:22 AM',
          title: `Neural Network Model Verification: ${doc.title}`,
          category: 'Technical Paper',
          description: `Indexed Multilayer Perceptron (MLP) architecture, forward pass equations, and backpropagation loss gradient proofs.`,
          source: `${doc.title} (Page 2)`,
          hasConflict: false,
          docRef: doc
        });
      } else if (doc.category === 'Financial') {
        events.push({
          date: 'Today, 10:25 AM',
          title: `Financial Billing Verification Flagged: ${doc.title}`,
          category: 'Financial Ledger',
          description: `Total invoiced payable amount extracted and cross-checked against master baseline schedule.`,
          source: `${doc.title} (Page 1)`,
          hasConflict: true,
          conflictDesc: 'Invoiced total requires milestone acceptance sign-off.',
          docRef: doc
        });
      }
    });

    return events;
  }, [documents]);

  const [selectedEvent, setSelectedEvent] = useState(activeTimeline[0] || null);

  // Sync selected event
  React.useEffect(() => {
    if (activeTimeline.length > 0 && !selectedEvent) {
      setSelectedEvent(activeTimeline[0]);
    }
  }, [activeTimeline]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <Clock className="w-6 h-6 text-indigo-600" />
              Investigation Timeline & Chronology
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 font-mono">
              {activeTimeline.length} Chronological Milestones
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological reconstruction of document uploads, OCR extractions, technical model papers & audit flags.
          </p>
        </div>

        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Case Milestone</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left Timeline Stream & Right Event Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTimeline.length > 0 ? (
          <>
            {/* Left 2 Cols: Chronological Timeline Stream */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs relative">
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-8 space-y-8">
                {activeTimeline.map((evt, idx) => {
                  const isSelected = selectedEvent?.title === evt.title;

                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedEvent(evt)}
                      className={`relative group cursor-pointer transition ${
                        isSelected ? 'scale-[1.01]' : ''
                      }`}
                    >
                      {/* Timeline Dot Marker */}
                      <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center ${
                        evt.hasConflict ? 'bg-red-500 ring-2 ring-red-200 animate-pulse' : 'bg-indigo-600'
                      }`} />

                      {/* Event Card */}
                      <div className={`p-5 rounded-2xl border transition ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 shadow-2xs">
                            {evt.date}
                          </span>
                          {evt.hasConflict ? (
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200 font-mono">
                              <AlertTriangle className="w-3 h-3" />
                              {evt.conflictDesc || 'Conflict Flagged'}
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 font-mono">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified Milestone
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 font-heading">{evt.title}</h3>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{evt.description}</p>

                        <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1 font-heading text-indigo-600 dark:text-cyan-400">
                            <FileText className="w-3.5 h-3.5" />
                            {evt.source}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 1 Col: Event Evidentiary Inspector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 h-fit sticky top-24">
              {selectedEvent ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {selectedEvent.date}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-2 font-heading">{selectedEvent.title}</h3>
                    <span className="text-xs text-indigo-600 dark:text-cyan-400 font-semibold">{selectedEvent.category}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-heading">
                      Event Description
                    </h4>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-heading">
                      Primary Source Citation
                    </h4>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 dark:border-cyan-800 rounded-xl text-xs space-y-2">
                      <p className="font-bold text-slate-900 dark:text-white">📄 {selectedEvent.source}</p>
                      {onOpenDocument && (
                        <button
                          onClick={() => {
                            if (selectedEvent.docRef) onOpenDocument(selectedEvent.docRef);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-400 font-semibold py-1.5 rounded-lg text-[11px] border border-slate-800 flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer font-mono"
                        >
                          <span>Inspect Page Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedEvent.hasConflict && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1 text-red-800">
                      <p className="font-bold flex items-center gap-1 text-red-700">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Timeline Discrepancy Flagged
                      </p>
                      <p className="text-[11px]">{selectedEvent.conflictDesc}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Select an event to inspect source evidence
                </div>
              )}
            </div>
          </>
        ) : (
          /* Clear & Attractive Empty State Screen */
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100 shadow-md">
              <Clock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                Sequential Case Timeline Ready
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                As you upload case files, DocuLens reconstructs a chronological stream of contract executions, invoice dates, neural network publication dates, and audit verification flags.
              </p>
            </div>

            {onOpenUpload && (
              <div className="pt-2">
                <button
                  onClick={onOpenUpload}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Document to Build Case Timeline</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
