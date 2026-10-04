import React, { useState } from 'react';
import { 
  Folder, FileText, Search, Filter, ArrowUpDown, Plus, 
  CheckCircle, AlertTriangle, Clock, Eye, SearchCheck, MoreVertical,
  Trash2, ExternalLink, Upload, Sparkles
} from 'lucide-react';

export default function VaultView({ 
  documents = [], 
  onOpenDocument, 
  onInvestigateDoc, 
  onOpenUpload,
  onDeleteDocument 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const categories = [
    { name: 'All', count: documents.length },
    { name: 'Technical / Research', count: documents.filter(d => d.category === 'Technical / Research').length },
    { name: 'Rules & Guidelines', count: documents.filter(d => d.category === 'Rules & Guidelines').length },
    { name: 'Financial', count: documents.filter(d => d.category === 'Financial').length },
    { name: 'Contracts', count: documents.filter(d => d.category === 'Contracts').length },
    { name: 'Reports', count: documents.filter(d => d.category === 'Reports').length },
    { name: 'Other', count: documents.filter(d => d.category === 'Other' || (d.category && !['Technical / Research', 'Rules & Guidelines', 'Financial', 'Contracts', 'Reports'].includes(d.category))).length }
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.previewText?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">Evidence Vault</h1>
            <span className="bg-slate-800 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-700 font-mono shadow-xs">
              {documents.length} Documents Archived
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure archived repository with automatic OCR, section identification & embedding index.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Folder Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Folder className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-slate-800 text-indigo-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </div>
              <p className="text-xs font-bold mt-2 truncate font-heading">{cat.name}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault documents..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Category: {selectedCategory}</span>
        </div>
      </div>

      {/* Documents Grid / Empty State */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                      📄
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px] font-heading" title={doc.title}>
                        {doc.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-mono">
                        {doc.pages} pages • {doc.size || '1.4 MB'} • Added {doc.addedDate}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shrink-0 font-mono ${
                    doc.statusColor === 'red' ? 'bg-red-100 text-red-700 border border-red-200' :
                    doc.statusColor === 'amber' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {doc.statusColor === 'red' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {doc.status || 'FULLY PROCESSED'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 font-serif">
                  "{doc.previewText}"
                </p>

                {doc.extractedEntities && doc.extractedEntities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {doc.extractedEntities.slice(0, 3).map((ent, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-indigo-100 font-mono">
                        {ent}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer font-mono"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open</span>
                  </button>

                  <button
                    onClick={() => onInvestigateDoc(doc)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer font-mono"
                  >
                    <SearchCheck className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                  </button>
                </div>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Remove Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900 font-heading">Your Evidence Vault is Empty</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No documents currently in your enclave vault. Upload your first PDF, DOCX, or scanned contract to begin investigating.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upload Your First Document</span>
          </button>
        </div>
      )}
    </div>
  );
}
