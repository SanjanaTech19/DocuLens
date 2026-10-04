import React from 'react';
import { 
  LayoutDashboard, Search, FolderKanban, Network, 
  Clock, Boxes, BarChart3, Bookmark, FileText, History, 
  Settings, HelpCircle, ShieldCheck, UserCheck, Bell
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  documentsCount = 0,
  onOpenAuth 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'investigate', label: 'Investigate', icon: Search, badge: 'LIVE' },
    { id: 'vault', label: 'Evidence Vault', icon: FolderKanban, count: String(documentsCount) },
    { id: 'graph', label: 'Evidence Graph', icon: Network, highlight: true },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'entities', label: 'Entities', icon: Boxes },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'saved', label: 'Saved Findings', icon: Bookmark },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none z-30 shrink-0 no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            🔍
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight flex items-center gap-1 font-heading">
              DOCULENS
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Evidence Engine
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-semibold text-slate-500 px-3 uppercase tracking-wider mb-2">
          Workspace Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase animate-pulse">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Utilities */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 ${
            activeTab === 'settings' ? 'bg-slate-800 text-white' : ''
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Guide</span>
        </button>

        {/* Security Enclave Status */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400">Enclave Active</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">AES-256</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
            Document evidence zero-retention mode
          </p>
        </div>

        {/* Auth / User Pill */}
        <div 
          onClick={onOpenAuth}
          className="mt-2 flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer border border-slate-800 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
              S
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-none">Sanjana Raj</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Lead Investigator</p>
            </div>
          </div>
          <UserCheck className="w-4 h-4 text-indigo-400" />
        </div>
      </div>
    </aside>
  );
}
