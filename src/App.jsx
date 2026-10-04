import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import DashboardView from './components/DashboardView';
import VaultView from './components/VaultView';
import SmartUploadModal from './components/SmartUploadModal';
import WorkspaceView from './components/WorkspaceView';
import EvidenceGraphView from './components/EvidenceGraphView';
import TimelineView from './components/TimelineView';
import EntitiesView from './components/EntitiesView';
import InsightsView from './components/InsightsView';
import SavedFindingsView from './components/SavedFindingsView';
import ReportsView from './components/ReportsView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import DocumentReaderModal from './components/DocumentReaderModal';

import { 
  getActiveUser, 
  getStoredDocuments, 
  saveDocumentToDb, 
  deleteDocumentFromDb, 
  getStoredFindings, 
  saveFindingToDb, 
  deleteFindingFromDb 
} from './services/dbService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Authentication State: Require login on page refresh
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(true); // Open modal automatically on refresh

  // Database User State
  const [user, setUser] = useState(() => getActiveUser());
  
  // Theme State: Default permanently to 'theme-cyber-dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('doculens_theme') || 'theme-cyber-dark';
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocForReader, setSelectedDocForReader] = useState(null);
  
  // Persistent Evidence Vault & Findings Database State
  const [documents, setDocuments] = useState(() => getStoredDocuments());
  const [savedFindings, setSavedFindings] = useState(() => getStoredFindings());
  
  // Active Investigation Context State
  const [activeQuery, setActiveQuery] = useState('');
  const [activeDocForInvestigation, setActiveDocForInvestigation] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartInvestigation = (query, targetDoc = null) => {
    setActiveQuery(query);
    setActiveDocForInvestigation(targetDoc);
    setActiveTab('investigate');
    showToast(`Launched AI investigation session for "${query.slice(0, 30)}..."`);
  };

  const handleUploadComplete = (newDoc) => {
    const updatedDocs = saveDocumentToDb(newDoc);
    setDocuments(updatedDocs);
    setActiveDocForInvestigation(newDoc);
    setActiveQuery(`Investigate terms and summary of ${newDoc.title}`);
    setActiveTab('investigate');
    showToast(`Successfully uploaded & saved ${newDoc.title} to Evidence Vault!`);
  };

  const handleBookmarkFinding = (newFinding) => {
    const updated = saveFindingToDb(newFinding);
    setSavedFindings(updated);
    showToast(`Saved finding: "${newFinding.title}"`);
  };

  const handleDeleteDocument = (docId) => {
    const updated = deleteDocumentFromDb(docId);
    setDocuments(updated);
    showToast("Document removed from Evidence Vault.");
  };

  const handleDeleteBookmark = (findingId) => {
    const updated = deleteFindingFromDb(findingId);
    setSavedFindings(updated);
    showToast("Saved finding removed.");
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('doculens_theme', newTheme);
    showToast(`Applied UI theme: ${newTheme === 'theme-cyber-dark' ? 'Cyber Obsidian Dark' : newTheme === 'default' ? 'Digital Indigo' : 'Selected Palette'}`);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setIsAuthOpen(false);
    showToast(`Welcome back, ${loggedInUser.name}! Evidence Vault unlocked.`);
  };

  return (
    <div className={`flex h-screen bg-[#090D16] overflow-hidden text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white ${theme}`}>
      {/* Permanent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentsCount={documents.length}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Sticky Header */}
        <Header
          activeTab={activeTab}
          onGlobalSearch={(q) => handleStartInvestigation(q)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          theme={theme}
          onThemeChange={handleThemeChange}
          documents={documents}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-500/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{toastMessage}</span>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              onStartInvestigation={handleStartInvestigation}
              onNavigate={setActiveTab}
              documents={documents}
              findings={savedFindings}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'vault' && (
            <VaultView
              documents={documents}
              onOpenDocument={(doc) => setSelectedDocForReader(doc)}
              onInvestigateDoc={(doc) => handleStartInvestigation(`Investigate terms in ${doc.title}`, doc)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'investigate' && (
            <WorkspaceView
              documents={documents}
              onOpenDocument={(doc) => setSelectedDocForReader(doc)}
              onBookmarkFinding={handleBookmarkFinding}
              onOpenUpload={() => setIsUploadOpen(true)}
              initialQuery={activeQuery}
              targetDoc={activeDocForInvestigation}
            />
          )}

          {activeTab === 'graph' && (
            <EvidenceGraphView
              documents={documents}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              onOpenDocument={(doc) => setSelectedDocForReader(doc)}
              documents={documents}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'entities' && (
            <EntitiesView
              onNavigateGraph={() => setActiveTab('graph')}
              onOpenDocument={(doc) => setSelectedDocForReader(doc)}
              documents={documents}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView
              documents={documents}
              conflicts={[]}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'saved' && (
            <SavedFindingsView
              findings={savedFindings}
              onDeleteBookmark={handleDeleteBookmark}
              onNavigateWorkspace={() => setActiveTab('investigate')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              documents={documents}
              conflicts={[]}
              findings={savedFindings}
              user={user}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'help' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <SmartUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Auth Modal Enforces Login on Refresh */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          if (isAuthenticated) setIsAuthOpen(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        forceLogin={!isAuthenticated}
      />

      {selectedDocForReader && (
        <DocumentReaderModal
          document={selectedDocForReader}
          onClose={() => setSelectedDocForReader(null)}
        />
      )}
    </div>
  );
}
