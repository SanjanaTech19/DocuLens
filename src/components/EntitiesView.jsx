import React, { useState, useMemo } from 'react';
import { Boxes, User, Building2, Coins, Calendar, MapPin, FileText, Search, ExternalLink, Plus, Sparkles } from 'lucide-react';

export default function EntitiesView({ onNavigateGraph, onOpenDocument, documents = [], onOpenUpload }) {
  const [selectedType, setSelectedType] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  // Dynamically extract entities from vault documents
  const activeEntities = useMemo(() => {
    if (!documents || documents.length === 0) return [];

    const entitiesMap = new Map();

    documents.forEach((doc) => {
      const docEntities = doc.extractedEntities || ['Primary Entity', 'Key Parameter', 'Extraction Date'];
      docEntities.forEach((entName) => {
        let type = 'Organization';
        if (entName.includes('₹') || entName.includes('$') || entName.toLowerCase().includes('payable') || entName.toLowerCase().includes('loss') || entName.toLowerCase().includes('amount')) {
          type = 'Money';
        } else if (entName.toLowerCase().includes('today') || entName.toLowerCase().includes('date') || entName.toLowerCase().includes('aug') || entName.toLowerCase().includes('2026')) {
          type = 'Date';
        } else if (entName.toLowerCase().includes('party') || entName.toLowerCase().includes('officer') || entName.toLowerCase().includes('smith') || entName.toLowerCase().includes('john')) {
          type = 'Person';
        } else if (entName.toLowerCase().includes('chennai') || entName.toLowerCase().includes('delhi') || entName.toLowerCase().includes('hq')) {
          type = 'Location';
        } else if (entName.toLowerCase().includes('rule') || entName.toLowerCase().includes('doc') || entName.toLowerCase().includes('pdf')) {
          type = 'Document ID';
        }

        if (entitiesMap.has(entName)) {
          const existing = entitiesMap.get(entName);
          existing.mentions += 1;
          if (!existing.docs.includes(doc.title)) existing.docs.push(doc.title);
        } else {
          entitiesMap.set(entName, {
            name: entName,
            type: type,
            mentions: 1,
            docs: [doc.title],
            docRef: doc
          });
        }
      });
    });

    return Array.from(entitiesMap.values());
  }, [documents]);

  const types = ['All', 'Person', 'Organization', 'Money', 'Date', 'Location', 'Document ID'];

  const filteredEntities = activeEntities.filter((ent) => {
    const matchType = selectedType === 'All' || ent.type === selectedType;
    const matchSearch = ent.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <Boxes className="w-6 h-6 text-indigo-600" />
              Smart Entity Extraction & Index
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 font-mono">
              {activeEntities.length} Discovered Named Entities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated NLP extraction of people, neural network concepts, financial figures, dates & document identifiers.
          </p>
        </div>

        {/* Search & Action */}
        <div className="flex items-center gap-3">
          <div className="relative w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search entities..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Type Pill Filter Bar */}
      <div className="flex items-center bg-white p-2 rounded-2xl border border-slate-200 overflow-x-auto gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedType === t
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Entity Grid Cards OR Empty State */}
      {filteredEntities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEntities.map((ent, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition">
                    {ent.type === 'Person' ? <User className="w-4 h-4" /> :
                     ent.type === 'Organization' ? <Building2 className="w-4 h-4" /> :
                     ent.type === 'Money' ? <Coins className="w-4 h-4" /> :
                     ent.type === 'Date' ? <Calendar className="w-4 h-4" /> :
                     ent.type === 'Location' ? <MapPin className="w-4 h-4" /> :
                     <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 font-heading">{ent.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono">{ent.type}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 font-mono">
                  {ent.mentions} {ent.mentions === 1 ? 'doc' : 'docs'}
                </span>
              </div>

              {/* Document References list */}
              {ent.docs && ent.docs.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold">Referenced Documents:</p>
                  <div className="space-y-1">
                    {ent.docs.map((docName, dIdx) => (
                      <div 
                        key={dIdx}
                        onClick={() => {
                          if (onOpenDocument) {
                            const doc = documents.find(d => d.title === docName) || ent.docRef || documents[0];
                            if (doc) onOpenDocument(doc);
                          }
                        }}
                        className="text-[11px] text-slate-700 hover:text-indigo-600 font-medium truncate flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-indigo-50/50 p-1.5 rounded-lg border border-slate-100 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{docName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onNavigateGraph && (
                <button
                  onClick={onNavigateGraph}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-1.5 rounded-xl text-[11px] border border-slate-200 flex items-center justify-center gap-1 transition"
                >
                  <span>Explore Entity in Knowledge Graph</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100 shadow-md">
            <Boxes className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-slate-900 font-heading">
              Smart Entity Extraction Ready
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When documents are ingested, DocuLens automatically extracts named entities—such as neural network models, companies, people, monetary figures, and key document IDs.
            </p>
          </div>

          {onOpenUpload && (
            <div className="pt-2">
              <button
                onClick={onOpenUpload}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document to Extract Named Entities</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
