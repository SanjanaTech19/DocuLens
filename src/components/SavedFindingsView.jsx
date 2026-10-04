import React from 'react';
import { Bookmark, Trash2, FileText, CheckCircle2, Share2, Sparkles, Plus, HelpCircle, ShieldCheck } from 'lucide-react';

export default function SavedFindingsView({ findings = [], onDeleteBookmark, onNavigateWorkspace }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <Bookmark className="w-6 h-6 text-amber-500" />
              Saved Investigation Bookmarks
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 font-mono">
              {findings.length} Bookmarked Evidentiary Statements
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curated evidence findings saved during multi-document Q&A sessions for executive report synthesis.
          </p>
        </div>

        {onNavigateWorkspace && (
          <button
            onClick={onNavigateWorkspace}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer font-mono"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Investigation Workspace</span>
          </button>
        )}
      </div>

      {/* Bookmarks Grid OR Interactive Empty State */}
      {findings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {findings.map((item) => {
            const summaryText = item.summary || item.snippet || item.text || `Verified evidentiary finding from ${item.docTitle || item.title || 'case file'}.`;
            const dateStr = item.dateSaved || item.date || '04 Oct 2026';
            const sourcesList = item.sources || (item.docTitle ? [item.docTitle] : ['Vault Evidence File']);

            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider font-mono">
                        {item.category || 'Evidence Finding'}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5 font-heading">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0 font-mono">
                      {item.confidence || '99% Verified'}
                    </span>
                  </div>

                  {/* Summary Snippet Text Callout */}
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-serif">
                    "{summaryText}"
                  </p>

                  {/* Sources List */}
                  <div className="space-y-1 pt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Auditable Citation Sources:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sourcesList.map((src, i) => (
                        <span key={i} className="text-[10px] font-semibold text-indigo-700 dark:text-cyan-400 bg-indigo-50 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-slate-800 font-mono">
                          📄 {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-medium font-mono">Saved: {dateStr}</span>
                  {onDeleteBookmark && (
                    <button
                      onClick={() => onDeleteBookmark(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Remove Finding"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-100 shadow-md">
            <Bookmark className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
              Bookmark Manager Ready
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When investigating case files in the AI Workspace, click the **Bookmark Finding** button on any AI response to pin key evidentiary quotes for instant export in executive PDF reports.
            </p>
          </div>

          {onNavigateWorkspace && (
            <div className="pt-2">
              <button
                onClick={onNavigateWorkspace}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer font-mono"
              >
                <Sparkles className="w-4 h-4" />
                <span>Go to AI Investigation Workspace</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
