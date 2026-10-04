import React, { useState } from 'react';
import { Settings, ShieldCheck, User, Cpu, Bell, Sliders, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsView({ user, onSaveSettings }) {
  const [detailLevel, setDetailLevel] = useState('Balanced');
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [autoConflictDetection, setAutoConflictDetection] = useState(true);
  const [zeroRetention, setZeroRetention] = useState(true);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              Platform Settings & Preferences
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
              System Parameters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure AI reasoning detail, confidence audit thresholds & zero-retention enclave privacy.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Profile Card (Section 22) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            Investigator Profile
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-xl shadow-md">
              SR
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">{user?.name || 'Sanjana Raj'}</h4>
              <p className="text-xs text-slate-500">{user?.email || 'sanjana@doculens.ai'}</p>
              <span className="inline-block bg-indigo-50 text-indigo-700 font-semibold text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-100 mt-1">
                Lead Investigator • Enterprise Security Clearance
              </span>
            </div>
          </div>
        </div>

        {/* AI Engine Settings (Section 23) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            AI Investigation Parameters
          </h3>

          {/* Answer Detail Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Answer Detail Depth</label>
            <div className="grid grid-cols-3 gap-3">
              {['Short', 'Balanced', 'Detailed'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDetailLevel(lvl)}
                  className={`p-3 rounded-xl border text-xs font-bold transition ${
                    detailLevel === lvl
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">Minimum Audit Confidence Threshold</label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {confidenceThreshold}% Confidence
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Automatic Conflict Detection Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">Automatic Conflict Detection Radar</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically scan uploaded contracts & invoices for payment or SLA date inconsistencies.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoConflictDetection}
              onChange={(e) => setAutoConflictDetection(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Security & Privacy Settings (Section 21) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Security Enclave & Privacy
          </h3>

          <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <div>
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero-Retention AI Privacy Enclave
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Uploaded document embeddings are never used for AI model training.
              </p>
            </div>
            <input
              type="checkbox"
              checked={zeroRetention}
              onChange={(e) => setZeroRetention(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
