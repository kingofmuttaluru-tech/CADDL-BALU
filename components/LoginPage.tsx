import React, { useState } from 'react';
import { GOVT_NAME, DEPT_NAME, LAB_NAME, LAB_LOCATION } from '../constants';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [techNumber, setTechNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!techNumber || !password) {
      setError('AUTHORIZATION KEYS REQUIRED');
      return;
    }

    setLoading(true);
    
    // Credentials verification
    // Tech ID: BALU2113
    // Password: 9533550105
    setTimeout(() => {
      setLoading(false);
      if (techNumber.toUpperCase() === 'BALU2113' && password === '9533550105') {
        onLogin();
      } else {
        setError('SYSTEM ACCESS DENIED: INVALID CREDENTIALS');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-900 via-emerald-600 to-blue-900"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform origin-top-right"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[480px] z-10 animate-fadeIn">
        
        {/* Official Header Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center space-y-1 mb-6">
            <span className="text-[10px] font-black text-blue-900/50 uppercase tracking-[0.4em]">{GOVT_NAME}</span>
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{DEPT_NAME}</span>
          </div>
          
          <div className="flex flex-col items-center">
            {/* CADDL Logo Placeholder */}
            <div className="relative mb-6 group">
              <div className="absolute -inset-2 bg-blue-600/5 rounded-full blur-lg group-hover:bg-blue-600/10 transition-all duration-500"></div>
              <div className="relative w-24 h-24 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(30,58,138,0.2)] border border-slate-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
                <svg className="w-12 h-12 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>

            <h1 className="text-xl font-black text-blue-900 tracking-tighter uppercase leading-none max-w-sm mb-3">
              {LAB_NAME}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="h-px w-6 bg-slate-300"></span>
              <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-[0.2em]">{LAB_LOCATION}</p>
              <span className="h-px w-6 bg-slate-300"></span>
            </div>
          </div>
        </div>

        {/* Secure Authorization Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(30,58,138,0.1)] border border-white p-10 sm:p-12 relative overflow-hidden">
          {/* Accent corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full"></div>
          
          <div className="mb-10 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.945V10c0 5.825-3.83 10.885-9 12.485-5.17-1.6-9-6.66-9-12.485V5.845a1 1 0 01.666-.945zM10 3.331L3 6.331V10c0 4.88 3.191 9.179 7 10.655 3.809-1.476 7-5.774 7-10.655V6.331l-7-3z" clipRule="evenodd" /></svg>
              <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Authorized Access Only</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Node Authorization</h2>
            <p className="text-sm font-medium text-slate-400 mt-1">Please enter your diagnostic credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black border border-red-100 text-center uppercase tracking-widest animate-headShake">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technician Identification</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input 
                  type="text" 
                  value={techNumber}
                  onChange={(e) => setTechNumber(e.target.value)}
                  placeholder="ID Number (e.g. BALU2113)" 
                  className="w-full pl-14 pr-6 py-7 text-xl bg-slate-50 border border-slate-200 rounded-3xl font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="w-full pl-14 pr-6 py-7 text-xl bg-slate-50 border border-slate-200 rounded-3xl font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-3 group relative overflow-hidden mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating Node...</span>
                </>
              ) : (
                <>
                  <span>Establish Secure Session</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between opacity-50">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Diagnostic Cluster Active</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Build v5.4.1</span>
          </div>
        </div>

        {/* Legal Footer */}
        <p className="mt-10 text-[9px] text-slate-400 font-bold text-center uppercase tracking-widest leading-relaxed px-12 opacity-40 select-none">
          Unauthorized access to this government terminal is prohibited and monitored under the laboratory information management system protocols.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes headShake {
          0%, 100% { transform: translateX(0); }
          6.5% { transform: translateX(-6px) rotateY(-9deg); }
          18.5% { transform: translateX(5px) rotateY(7deg); }
          31.5% { transform: translateX(-3px) rotateY(-5deg); }
          43.5% { transform: translateX(2px) rotateY(3deg); }
          50% { transform: translateX(0); }
        }
        .animate-headShake {
          animation: headShake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;