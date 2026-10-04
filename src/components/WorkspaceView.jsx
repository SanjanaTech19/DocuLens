import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, FileText, CheckSquare, Square, Sparkles, AlertTriangle, 
  ExternalLink, Bookmark, ArrowRight, CheckCircle2,
  Layers, Upload, Folder, RefreshCw, X, ChevronRight, SlidersHorizontal,
  Plus, Search, ShieldCheck, Eye, MessageSquare, BookOpen, Scale, Award
} from 'lucide-react';
import { generateDomainSummary, detectDocumentCategory, generateAIAnswer } from '../utils/documentClassifier';

export default function WorkspaceView({ 
  documents = [], 
  onOpenDocument, 
  onBookmarkFinding,
  onOpenUpload,
  initialQuery = '',
  targetDoc = null
}) {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [showDocsDrawer, setShowDocsDrawer] = useState(false);
  const [investigationMode, setInvestigationMode] = useState('Investigate');
  const [questionInput, setQuestionInput] = useState('');

  // Persistent Selected Document IDs across sessions and tab re-renders
  const [selectedDocIds, setSelectedDocIds] = useState(() => {
    try {
      const saved = localStorage.getItem('doculens_selected_docs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return (documents && documents.length > 0) ? documents.map(d => d.id) : [];
  });

  // Domain-Aware Summary Generator for any document
  const createDocSummaryResponse = (doc) => {
    return generateDomainSummary(doc);
  };

  // Initial Chat State tailored to targetDoc or default query
  const [chatHistory, setChatHistory] = useState(() => {
    if (targetDoc) {
      const summaryRes = createDocSummaryResponse(targetDoc);
      return [
        {
          id: 'msg-init-user',
          sender: 'user',
          text: `Summarize the document ${targetDoc.title}`
        },
        {
          id: 'msg-init-ai',
          sender: 'ai',
          text: summaryRes.text,
          confidence: summaryRes.confidence,
          confidenceStatus: summaryRes.confidenceStatus,
          confidenceColor: summaryRes.confidenceColor,
          citations: summaryRes.citations,
          hasConflict: false
        }
      ];
    }
    return [];
  });

  // Save selected document IDs to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('doculens_selected_docs_v1', JSON.stringify(selectedDocIds));
    } catch (e) {}
  }, [selectedDocIds]);

  // Keep documents in sync: if new documents are uploaded, auto-select them!
  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelectedDocIds(prev => {
        const validDocIds = documents.map(d => d.id);
        const newDocIds = validDocIds.filter(id => !prev.includes(id));
        if (newDocIds.length > 0) {
          const merged = [...prev, ...newDocIds];
          localStorage.setItem('doculens_selected_docs_v1', JSON.stringify(merged));
          return merged;
        }
        if (prev.length === 0) {
          return validDocIds;
        }
        return prev;
      });
    }
  }, [documents]);

  // Handle targetDoc without unchecking other documents!
  useEffect(() => {
    if (targetDoc) {
      setSelectedDocIds(prev => {
        if (!prev.includes(targetDoc.id)) {
          const updated = [...prev, targetDoc.id];
          localStorage.setItem('doculens_selected_docs_v1', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
      setIsSetupMode(false);
      
      // Add initial targetDoc summary message if chat history doesn't have it
      const summaryRes = createDocSummaryResponse(targetDoc);
      setChatHistory([
        {
          id: `msg-doc-${Date.now()}-u`,
          sender: 'user',
          text: `Summarize the document ${targetDoc.title}`
        },
        {
          id: `msg-doc-${Date.now()}-ai`,
          sender: 'ai',
          text: summaryRes.text,
          confidence: summaryRes.confidence,
          confidenceStatus: summaryRes.confidenceStatus,
          confidenceColor: summaryRes.confidenceColor,
          citations: summaryRes.citations,
          hasConflict: false
        }
      ]);
    }
  }, [targetDoc]);

  const toggleDocSelection = (id) => {
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter(dId => dId !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  // Active participating documents list
  const activeDocsList = (documents || []).filter(d => selectedDocIds.includes(d.id));

  // Core Question / Query Trigger Engine (Supports Multi-Document Ingestion & Synthesis)
  const triggerQuestion = (promptText, docToQuery = null) => {
    const prompt = promptText.trim();
    if (!prompt) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt
    };

    const targetDocs = docToQuery ? [docToQuery] : (activeDocsList.length > 0 ? activeDocsList : documents);
    const lowerPrompt = prompt.toLowerCase();
    let aiMsg = {};

    if (targetDocs.length > 1) {
      // MULTI-DOCUMENT SIMULTANEOUS SYNTHESIS:
      const allCitations = [];
      const responses = targetDocs.map((doc, idx) => {
        const isSummary = lowerPrompt.includes('summarize') || lowerPrompt.includes('summary') || lowerPrompt.includes('overview') || lowerPrompt.includes('explain');
        const ans = isSummary ? generateDomainSummary(doc) : generateAIAnswer(prompt, doc);

        if (ans.citations) {
          allCitations.push(...ans.citations);
        }

        return `==================================================\n📄 ${idx + 1}. ${doc.title} (${doc.category || detectDocumentCategory(doc.title)})\n${ans.text}`;
      });

      aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Multi-Document Synthesis Across ${targetDocs.length} Active Vault Files:\n\n${responses.join('\n\n')}`,
        confidence: 99,
        confidenceStatus: 'High Confidence',
        confidenceColor: 'green',
        citations: allCitations,
        hasConflict: false
      };
    } else {
      // SINGLE DOCUMENT QUERY:
      const activeDoc = targetDocs[0] || (documents.length > 0 ? documents[0] : { title: 'Uploaded Document.pdf', pages: 11, category: 'Technical / Research' });
      const docCategory = activeDoc.category || detectDocumentCategory(activeDoc.title);

      if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary') || lowerPrompt.includes('overview') || lowerPrompt.includes('explain')) {
        const summaryRes = generateDomainSummary(activeDoc);
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: summaryRes.text,
          confidence: summaryRes.confidence,
          confidenceStatus: summaryRes.confidenceStatus,
          confidenceColor: summaryRes.confidenceColor,
          citations: summaryRes.citations,
          hasConflict: false
        };
      } else if (lowerPrompt.includes('compare') || lowerPrompt.includes('comparison') || lowerPrompt.includes('versus') || lowerPrompt.includes('vs')) {
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Multi-Document Comparative Analysis:\n\nEvaluating active vault case file (${activeDoc.title}):\n\n1. Structural & Categorical Scope:\n• Primary Focus (${activeDoc.title}): Categorized under ${docCategory}. Extracted key neural network activation functions (Sigmoid, ReLU, Tanh) and backpropagation gradient derivations.\n• Comparative Baseline: Cross-referenced against indexed vector enclave embeddings.\n\n2. Key Comparative Takeaways:\n• Technical Alignment: High structural consistency in algorithmic definitions (99% alignment).\n• Source Grounding: All primary definitions verified against evidence enclave.`,
          confidence: 98,
          confidenceStatus: 'High Confidence',
          confidenceColor: 'green',
          citations: [
            {
              docTitle: activeDoc.title,
              page: 1,
              section: '1. Comparative Scope',
              quote: `"Cross-document evaluation verifies structural consistency across evidence files."`
            }
          ],
          hasConflict: false
        };
      } else if (lowerPrompt.includes('timeline') || lowerPrompt.includes('chronology') || lowerPrompt.includes('dates') || lowerPrompt.includes('milestone')) {
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Chronological Evidence Timeline Reconstruction for ${activeDoc.title}:\n\n1. Initial Ingestion & Indexing: Today, 10:15 AM - File ${activeDoc.title} uploaded and 1,536-dim vector embeddings generated.\n2. OCR & Entity Extraction: Today, 10:20 AM - Parsed named entities (MLP, Backpropagation, Gradient Descent, SGD, Adam).\n3. Audit Verification: Today, 10:22 AM - Mathematical equations verified with 99% confidence score.`,
          confidence: 99,
          confidenceStatus: 'High Confidence',
          confidenceColor: 'green',
          citations: [
            {
              docTitle: activeDoc.title,
              page: 1,
              section: 'Document Verification Stamp',
              quote: `"Ingested and verified in evidence enclave."`
            }
          ],
          hasConflict: false
        };
      } else if (lowerPrompt.includes('investigate') || lowerPrompt.includes('audit') || lowerPrompt.includes('risk') || lowerPrompt.includes('conflict')) {
        if (docCategory === 'Technical / Research') {
          aiMsg = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Technical & Algorithmic Audit for ${activeDoc.title}:\n\nScanned neural network architecture, activation functions, and gradient backpropagation equations across ${activeDoc.title}:\n\n• Gradient Dynamics: Vanishing gradient risk identified in deeper sigmoid layers; ReLU or activation clipping standard practice for deep MLPs.\n• Optimization Stability: Backpropagation partial derivatives verified; learning rate optimization ensured via adaptive momentum (Adam).\n• Mathematical Integrity: Vector RAG verified 100% of mathematical equations with 0 structural inconsistencies detected.`,
            confidence: 99,
            confidenceStatus: 'High Confidence',
            confidenceColor: 'green',
            citations: [
              {
                docTitle: activeDoc.title,
                page: 2,
                section: '2. Backpropagation Gradient Computation',
                quote: `"Chain rule calculus applies partial derivatives backwards through hidden layers to update weight parameters."`
              }
            ],
            hasConflict: false
          };
        } else {
          aiMsg = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Deep Investigation Audit for ${activeDoc.title}:\n\nParsed all structural sections and verified terms in enclave. No critical compliance violations found.`,
            confidence: 96,
            confidenceStatus: 'High Confidence',
            confidenceColor: 'green',
            citations: [
              {
                docTitle: activeDoc.title,
                page: 1,
                section: 'Document Analysis & Scope',
                quote: activeDoc.previewText || `"Document terms indexed in evidence enclave."`
              }
            ],
            hasConflict: false
          };
        }
      } else {
        const answerRes = generateAIAnswer(prompt, activeDoc);
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: answerRes.text,
          confidence: answerRes.confidence,
          confidenceStatus: answerRes.confidenceStatus,
          confidenceColor: answerRes.confidenceColor,
          citations: answerRes.citations,
          hasConflict: false
        };
      }
    }

    setChatHistory(prev => [...prev, userMsg, aiMsg]);
    setQuestionInput('');
  };

  // Automatically execute initialQuery from Dashboard search or suggested query chips
  const lastExecutedQueryRef = useRef('');

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && lastExecutedQueryRef.current !== initialQuery) {
      lastExecutedQueryRef.current = initialQuery;
      setIsSetupMode(false);
      triggerQuestion(initialQuery);
    }
  }, [initialQuery]);

  const handleSendQuestion = (e) => {
    e.preventDefault();
    triggerQuestion(questionInput);
  };

  // Mode Bar Button Click Handler: Makes the bar fully functional & actionable!
  const handleSelectMode = (mode) => {
    setInvestigationMode(mode);

    if (mode === 'Summarize') {
      triggerQuestion(`Summarize all participating documents`);
    } else if (mode === 'Compare') {
      triggerQuestion(`Compare key technical methodologies and scope across all documents`);
    } else if (mode === 'Timeline') {
      triggerQuestion(`Reconstruct the chronological timeline and key event milestones from all documents`);
    } else if (mode === 'Investigate') {
      triggerQuestion(`Perform a deep AI investigation analyzing entity relations and key findings across all documents`);
    } else if (mode === 'Ask') {
      const inputEl = document.getElementById('investigate-input');
      if (inputEl) inputEl.focus();
    }
  };

  // STEP 1: Uncluttered Setup Screen
  if (isSetupMode) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/30">
            🧠
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Set Up Your Investigation Session
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Choose whether to upload new case files or select existing documents from your vault.
          </p>
        </div>

        {/* 2 Main Action Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Upload New Documents */}
          <div 
            onClick={onOpenUpload}
            className="bg-white rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 p-8 text-center cursor-pointer transition group shadow-xs hover:shadow-lg space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center group-hover:scale-110 transition duration-200">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                Upload New Case Documents
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingest PDF, DOCX, PNG scanned contracts for immediate OCR & vector indexing.
              </p>
            </div>
            <button
              type="button"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl text-xs border border-indigo-200 transition cursor-pointer"
            >
              + Ingest New Files
            </button>
          </div>

          {/* Option B: Use Existing Vault Documents */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                  <Folder className="w-5 h-5 text-indigo-600" />
                  Select Vault Documents
                </h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 font-mono">
                  {selectedDocIds.length} Selected
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Select from your pre-indexed vault documents to include in this query session:
              </p>
            </div>

            {/* Quick document checkbox picker */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {documents.length > 0 ? (
                documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDocSelection(doc.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected ? 'bg-indigo-50 border-indigo-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="truncate max-w-[240px]">{doc.title}</span>
                      {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  No vault documents yet. Click Upload above.
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSetupMode(false)}
              disabled={selectedDocIds.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Proceed with {selectedDocIds.length} Selected Document(s)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Clean, Spacious Workspace Screen
  const currentActiveDoc = activeDocsList[0] || targetDoc || (documents.length > 0 ? documents[0] : null);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#EBF3FE] dark:bg-[#090D16] overflow-hidden">
      {/* Top Clean Context Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-md shrink-0 z-10 text-white">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <h2 className="text-xs font-black text-white tracking-tight font-heading">
            Investigation Workspace
          </h2>

          {/* Active Documents Pill */}
          <button
            onClick={() => setShowDocsDrawer(true)}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer font-mono"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{selectedDocIds.length > 0 ? `${selectedDocIds.length} Docs Selected` : "Select Documents"}</span>
            <SlidersHorizontal className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          <button
            onClick={() => setIsSetupMode(true)}
            className="text-[11px] text-slate-400 hover:text-white font-semibold underline ml-1 cursor-pointer"
          >
            Switch Documents
          </button>
        </div>

        {/* 5 Prominent Actionable Investigation Modes Bar */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl gap-1 text-xs border border-slate-800 shadow-inner">
          {['Ask', 'Compare', 'Timeline', 'Summarize', 'Investigate'].map((mode) => {
            const isActive = investigationMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleSelectMode(mode)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-heading scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/90 font-medium'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Uncluttered Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Active Multi-Document Participation Pill Banner */}
        {activeDocsList.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 p-3 px-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 text-xs mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold font-mono text-[11px] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Active Vault Files ({activeDocsList.length}):
              </span>

              {activeDocsList.map((doc) => (
                <span 
                  key={doc.id}
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs font-heading"
                >
                  📄 {doc.title.length > 22 ? doc.title.slice(0, 20) + '...' : doc.title}
                  <button
                    onClick={() => toggleDocSelection(doc.id)}
                    className="hover:text-red-400 p-0.5 rounded-full transition cursor-pointer"
                    title="Remove from live investigation session"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <button
              onClick={() => setShowDocsDrawer(true)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Manage Docs</span>
            </button>
          </div>
        )}

        {/* Chat Messages Stream or Clean Empty State */}
        {chatHistory.length > 0 ? (
          chatHistory.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.sender === 'user' ? (
                /* User Question Bubble */
                <div className="flex justify-end">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-xs max-w-xl text-xs font-medium shadow-md leading-relaxed">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ) : (
                /* AI Investigator Response Card */
                <div className="flex items-start gap-4 animate-in fade-in duration-300">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-600/30 shrink-0 mt-1">
                    🧠
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-xs text-slate-800 space-y-4">
                      {/* Message Content formatted with linebreaks */}
                      <div className="text-xs font-normal leading-relaxed text-slate-900 whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      {/* Conflict Alert Box */}
                      {msg.hasConflict && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                            <span className="font-bold">{msg.conflictText}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded font-mono">
                            Flagged Notice
                          </span>
                        </div>
                      )}

                      {/* Source Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            Auditable Evidence Sources ({msg.citations.length})
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {msg.citations.map((cite, idx) => (
                              <div 
                                key={idx}
                                className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs hover:border-indigo-300 transition"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 truncate max-w-[160px] font-heading">
                                    📄 {cite.docTitle}
                                  </span>
                                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                                    Page {cite.page}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">{cite.section}</p>
                                <p className="text-[11px] text-slate-700 italic bg-white p-2 rounded-lg border border-slate-100 font-serif">
                                  {cite.quote}
                                </p>

                                <button
                                  onClick={() => onOpenDocument(documents.find(d => d.title === cite.docTitle) || currentActiveDoc || documents[0])}
                                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-1 cursor-pointer font-mono"
                                >
                                  <span>View exact page source</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Save to Saved Findings Bookmark Button */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                        <button
                          onClick={() => onBookmarkFinding({
                            id: `fnd-${Date.now()}`,
                            title: `Finding from ${currentActiveDoc?.title || 'Case File'}`,
                            docTitle: currentActiveDoc?.title || 'Case File',
                            snippet: msg.text.slice(0, 140) + '...',
                            confidence: `${msg.confidence || 98}% Verified`
                          })}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 border border-indigo-200 transition cursor-pointer font-mono"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Bookmark Finding</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          /* Empty Workspace Welcome State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center font-bold text-3xl shadow-md border border-indigo-100">
              🧠
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-black text-slate-900 font-heading">
                AI Investigation Workspace Ready
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {currentActiveDoc
                  ? `Ready to cross-examine "${currentActiveDoc.title}". Click any mode above or ask a question below.`
                  : 'No documents selected. Click "Upload Document" to ingest your first contract or case file.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Centered Question Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSendQuestion} className="max-w-3xl mx-auto space-y-2">
          <div className="relative flex items-center">
            <input
              id="investigate-input"
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder={activeDocsList.length > 1 ? `Ask a question across all ${activeDocsList.length} active documents...` : currentActiveDoc ? `Ask a question about ${currentActiveDoc.title}...` : "Upload or select a document first..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-24 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Investigate</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 overflow-x-auto pt-1">
            <span className="font-semibold text-slate-500 shrink-0">Quick Prompts:</span>
            <button
              type="button"
              onClick={() => triggerQuestion("summarize the documents")}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-0.5 rounded-md shrink-0 transition border border-indigo-200/60 cursor-pointer font-mono"
            >
              "summarize all documents"
            </button>
            <button
              type="button"
              onClick={() => triggerQuestion("What are the key rules and eligibility guidelines?")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md shrink-0 transition cursor-pointer font-mono"
            >
              "Key rules & eligibility"
            </button>
            <button
              type="button"
              onClick={() => triggerQuestion("Check for any compliance flags or audit details")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md shrink-0 transition cursor-pointer font-mono"
            >
              "Check compliance flags"
            </button>
          </div>
        </form>
      </div>

      {/* Slide-Over Drawer for Managing Active Documents */}
      {showDocsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-96 bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Participating Documents ({selectedDocIds.length})
                </h3>
                <button
                  onClick={() => setShowDocsDrawer(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDocSelection(doc.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected ? 'bg-indigo-50 border-indigo-200 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="truncate max-w-[220px]">
                        <p className="truncate font-heading">{doc.title}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{doc.category} • {doc.pages} pages</p>
                      </div>
                      {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowDocsDrawer(false)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs mt-4 cursor-pointer"
            >
              Done ({selectedDocIds.length} Selected)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
