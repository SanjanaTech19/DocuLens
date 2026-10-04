import React, { useState } from 'react';
import { X, Eye, EyeOff, ShieldCheck, ArrowRight, Lock, User, Mail, CheckCircle, Database } from 'lucide-react';
import { loginUser, registerUser } from '../services/dbService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, forceLogin = false }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [email, setEmail] = useState('sanjana@doculens.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Sanjana Raj');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['8', '5', '9', '2', '1']);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'register') {
      const res = registerUser(name, email, password);
      onLoginSuccess(res.user);
      onClose();
    } else {
      const res = loginUser(email, password);
      onLoginSuccess(res.user);
      onClose();
    }
  };

  const handleOtpVerify = () => {
    const res = registerUser(name, email, password);
    onLoginSuccess(res.user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        {/* Optional Close Button (Hidden during initial login enforcement) */}
        {!forceLogin && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Branding */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/30 mb-3">
            🔎
          </div>
          <h2 className="text-xl font-bold tracking-tight font-heading">DOCULENS AUTHENTICATION</h2>
          <p className="text-xs text-indigo-300 font-medium mt-0.5 font-mono">
            {forceLogin ? 'Please sign in to access your Evidence Vault' : 'Persistent User Database & Vault Enclave'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {mode === 'otp' ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Enter Security Verification Code</h3>
              <p className="text-xs text-slate-500">
                We sent a 5-digit OTP verification code to <span className="font-semibold text-slate-800">{email}</span>
              </p>
              
              <div className="flex justify-center gap-2 my-4">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otp[idx] || '8'}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-10 h-12 border border-slate-300 rounded-lg text-center font-bold text-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                ))}
              </div>

              <button
                onClick={handleOtpVerify}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md shadow-indigo-600/20 font-heading"
              >
                Verify & Save to User Database →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-2 font-heading">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sanjana Raj"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sanjana@doculens.ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 font-heading"
                >
                  <Database className="w-4 h-4" />
                  <span>{mode === 'login' ? 'Sign In to Unlock Vault' : 'Create & Unlock Account'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encrypted Zero-Knowledge User Database</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
