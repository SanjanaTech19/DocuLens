import React from 'react';
import { History, Search, ArrowRight, FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { INITIAL_HISTORY } from '../data/mockData';

export default function HistoryView({ onResumeInvestigation }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-600" />
              Investigation History
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
              {INITIAL_HISTORY.length} Investigation Sessions Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Archived logs of past query sessions, multi-document reasoning threads & audit findings.
          </p>
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-4">
        {INITIAL_HISTORY.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'Active Investigation' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {item.status}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
              </div>

              <h3 className="text-base font-black text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                "{item.query}"
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-1">
                <span>📄 {item.docCount} Documents</span>
                <span>⭐ {item.findingsCount} Findings</span>
                <span className="text-red-600">⚠️ {item.conflictsCount} Conflicts</span>
              </div>
            </div>

            <button
              onClick={() => onResumeInvestigation(item.query)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20 shrink-0"
            >
              <span>Resume Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
