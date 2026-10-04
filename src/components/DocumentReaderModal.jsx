import React, { useState } from 'react';
import { X, FileText, SearchCheck, CheckCircle2, ChevronLeft, ChevronRight, Download, Sparkles, Shield, Bookmark } from 'lucide-react';

export default function DocumentReaderModal({ document, isOpen, onClose, onInvestigateDoc }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen || !document) return null;

  const totalPages = document.pages || 24;
  const sections = document.sections || [
    { page: 1, title: '1. Document Preamble', text: document.previewText },
    { page: 4, title: '4. Agreed Payment Terms', text: 'The agreed project fee is ₹50,000 for deliverables described in Schedule A.' }
  ];

  const currentSection = sections.find(s => s.page === currentPage) || sections[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <div>
              <h2 className="text-sm font-bold text-white truncate max-w-md">{document.title}</h2>
              <p className="text-[10px] text-slate-400 font-mono">
                {document.category} • Indexed Vector Document • {document.pages} Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onInvestigateDoc(document);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <SearchCheck className="w-3.5 h-3.5" />
              <span>Investigate Document</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body Grid: Left Section Tree & Right Document Reader View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Table of Contents */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-3 overflow-y-auto shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Document Structure & Sections
            </span>
            <div className="space-y-1.5">
              {sections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(sec.page)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition ${
                    currentPage === sec.page
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80 mb-0.5">
                    <span>Page {sec.page}</span>
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <p className="truncate">{sec.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Document Page Simulation Canvas */}
          <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex flex-col items-center">
            {/* Simulation A4 Page */}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-slate-200 p-8 min-h-[500px] space-y-6 text-xs text-slate-800 relative">
              {/* Page Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-[10px] text-slate-400 font-mono">
                <span>CONFIDENTIAL • CASE EVIDENCE ITEM</span>
                <span>PAGE {currentPage} OF {totalPages}</span>
              </div>

              {/* Page Section Title */}
              <h3 className="text-base font-black text-slate-900">
                {currentSection?.title || `Page ${currentPage} Content`}
              </h3>

              {/* Main Text Content */}
              <div className="space-y-4 leading-relaxed font-serif text-slate-900 text-sm">
                <p>
                  {currentSection?.text || document.previewText}
                </p>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  In witness whereof, the parties hereto have caused this agreement to be executed by their duly authorized representatives as of the date first above written. All modifications or amendments shall require explicit written consent.
                </p>
              </div>

              {/* Highlighted Evidence Callout */}
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Indexed Evidentiary Chunk
                </span>
                <p className="text-xs font-semibold text-slate-900 italic">
                  "{currentSection?.text}"
                </p>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 hover:bg-slate-100 rounded disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 hover:bg-slate-100 rounded disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
