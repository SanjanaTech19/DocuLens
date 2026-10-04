import React, { useState, useMemo } from 'react';
import { Search, Bell, Shield, User, Sparkles, CheckCircle2, AlertTriangle, FileText, Palette, Sun, Moon, Trees, Flame, Gem, Check } from 'lucide-react';

export default function Header({ 
  activeTab, 
  onGlobalSearch, 
  onOpenUpload, 
  onOpenAuth, 
  theme = 'default',
  onThemeChange,
  documents = []
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const titles = {
    dashboard: { main: 'Investigation Dashboard', sub: 'Evidence Command Center' },
    investigate: { main: 'AI Investigation Workspace', sub: 'Interactive Document Querying & Reasoning' },
    vault: { main: 'Evidence Vault', sub: 'Secure Archival & Document Processing' },
    graph: { main: 'Evidence Graph', sub: 'Visual Relationship & Entity Network' },
    timeline: { main: 'Investigation Timeline', sub: 'Chronological Evidence Flow' },
    entities: { main: 'Entity Extraction', sub: 'Extracted People, Monies, Orgs & Dates' },
    insights: { main: 'Investigation Insights', sub: 'Live Analytics & Vault Metrics' },
    saved: { main: 'Saved Findings', icon: '⭐', sub: 'Bookmarked Evidentiary Statements' },
    reports: { main: 'Investigation Reports', sub: 'Executive Summaries & PDF Export' },
    history: { main: 'Investigation History', sub: 'Past Queries & Saved Sessions' },
    settings: { main: 'System Settings', sub: 'AI Confidence & Document Parameters' }
  };

  const current = titles[activeTab] || { main: 'DocuLens Platform', sub: 'Intelligence for Documents' };

  // Dynamically compute real notifications based on active documents
  const notificationsList = useMemo(() => {
    if (!documents || documents.length === 0) return [];

    return documents.slice(0, 3).map((doc, idx) => ({
      id: doc.id || idx,
      type: 'index',
      title: 'Document Indexing Complete',
      desc: `${doc.title} fully processed (${doc.pages || 10} pages) & stored in vector enclave.`,
      time: `${(idx + 1) * 15}m ago`
    }));
  }, [documents]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onGlobalSearch(searchInput);
    }
  };

  const themesList = [
    { id: 'default', name: 'Digital Indigo', icon: Sun, color: 'text-indigo-600' },
    { id: 'theme-sapphire-blue', name: 'Sapphire Royal Blue', icon: Sparkles, color: 'text-blue-600' },
    { id: 'theme-cyber-dark', name: 'Cyber Obsidian Dark', icon: Moon, color: 'text-cyan-400' },
    { id: 'theme-nordic-emerald', name: 'Nordic Emerald', icon: Trees, color: 'text-emerald-600' },
    { id: 'theme-crimson-radar', name: 'Crimson Radar', icon: Flame, color: 'text-red-600' },
    { id: 'theme-amethyst-violet', name: 'Amethyst Violet', icon: Gem, color: 'text-purple-600' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs no-print">
      {/* View Title */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-heading">
          {current.main}
        </h2>
        <p className="text-[11px] text-slate-500 font-medium">
          {current.sub}
        </p>
      </div>

      {/* Center Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-8 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search across indexed case documents & extracted entities..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-24 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium px-2.5 py-1 rounded-md transition font-heading"
          >
            Investigate
          </button>
        </div>
      </form>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3">
        {/* Upload quick button */}
        <button
          onClick={onOpenUpload}
          className="hidden sm:flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition font-heading"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Upload Document</span>
        </button>

        {/* Theme Palette Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition flex items-center gap-1.5 text-xs font-semibold font-heading"
            title="Select UI Theme & Colors"
          >
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="hidden lg:inline text-[11px]">Theme</span>
          </button>

          {showThemePicker && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 border-b border-slate-100 mb-1 font-mono">
                Choose Color Palette
              </div>

              {themesList.map((tItem) => {
                const Icon = tItem.icon;
                const isSelected = theme === tItem.id;
                return (
                  <button
                    key={tItem.id}
                    onClick={() => {
                      onThemeChange(tItem.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left font-medium transition ${
                      isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${tItem.color}`} />
                      <span>{tItem.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
            title="Notifications Bell"
          >
            <Bell className="w-4 h-4" />
            {notificationsList.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 font-heading">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-indigo-600 font-medium cursor-pointer hover:underline font-mono"
                >
                  Mark all read
                </span>
              </div>
              <div className="space-y-2">
                {notificationsList.length > 0 ? (
                  notificationsList.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-left transition border border-slate-100 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1 font-heading">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{n.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 font-medium">
                    No unread notifications. All processing pipelines clear.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div 
          onClick={onOpenAuth}
          className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs font-heading">
            SR
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition font-heading">Sanjana Raj</p>
            <p className="text-[10px] text-slate-500 font-mono">Lead Investigator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
