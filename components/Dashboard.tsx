import React, { useMemo, useState } from 'react';
import { DiagnosticReport, View } from '../types';
import { ISO_CERT, NABL_CERT, CATEGORY_LABELS } from '../constants';
import { getAIDashboardAnalytics, AIAnalyticsDashboardResponse } from '../services/geminiService';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

interface DashboardProps {
  reports: DiagnosticReport[];
  onNavigate: (view: View) => void;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const COLORS = ['#1e3a8a', '#15803d', '#000000', '#1d4ed8', '#166534', '#334155'];

const Dashboard: React.FC<DashboardProps> = ({ reports, onNavigate, onBackup, onRestore }) => {
  const [aiAnalytics, setAiAnalytics] = useState<AIAnalyticsDashboardResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const stats = [
    { label: 'TOTAL REPORTS', value: reports.length, color: 'bg-blue-900' },
    { label: 'RECENT (7 DAYS)', value: reports.filter(r => new Date(r.dateOfReport) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'bg-green-800' },
    { label: 'BOVINE CASES', value: reports.filter(r => r.species === 'Bovine').length, color: 'bg-black' },
    { label: 'CAPRINE/OVINE', value: reports.filter(r => r.species === 'Caprine' || r.species === 'Ovine').length, color: 'bg-blue-700' },
  ];

  const handleGenerateAIAnalytics = async () => {
    if (reports.length === 0) return;
    setLoadingAI(true);
    try {
      const data = await getAIDashboardAnalytics(reports);
      setAiAnalytics(data);
    } catch (err) {
      console.error(err);
      alert("AI Analytics engine busy or connection lost. Try again later.");
    } finally {
      setLoadingAI(false);
    }
  };

  const trendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
      reports: reports.filter(r => r.dateOfReport === date).length
    }));
  }, [reports]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Accreditation Banner */}
      <div className="bg-black p-6 rounded-2xl shadow-2xl text-white flex flex-col md:flex-row justify-between items-center border-2 border-green-700 gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-green-700 p-3 rounded-full border-2 border-white/20 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-widest uppercase">{ISO_CERT}</h2>
            <p className="text-green-500 text-xs font-black tracking-[0.2em] uppercase">{NABL_CERT}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onBackup}
            className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center space-x-3 shadow-xl hover:scale-105 active:scale-95 border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export All Reports</span>
          </button>
          
          <button 
            onClick={() => onNavigate('new-report')}
            className="bg-green-700 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center space-x-3 shadow-xl hover:scale-105 active:scale-95 border border-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border-2 border-black flex items-center space-x-4 group hover:bg-black transition-all">
            <div className={`w-14 h-14 rounded-lg ${stat.color} flex items-center justify-center text-white border-2 border-black shadow-md`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/50">{stat.label}</p>
              <p className="text-3xl font-black text-black group-hover:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Security Card */}
      <div className="bg-blue-900 p-8 rounded-3xl shadow-2xl border-4 border-black text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            System Integrity & Backup
          </h2>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]">Protect your diagnostic database from browser cache loss.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onBackup}
            className="px-6 py-3 bg-white text-blue-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-green-400 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Backup
          </button>
          <label className="px-6 py-3 bg-blue-800 text-white border border-blue-700 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            Restore Data
            <input type="file" accept=".json" onChange={onRestore} className="hidden" />
          </label>
        </div>
      </div>

      {/* AI Visual Intelligence & Data Hotspots */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-black space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-slate-100 pb-6">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-blue-900">Epidemiological AI Insights</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Disease Patterns & Geographical Hotspots</p>
             </div>
          </div>
          <button 
            onClick={handleGenerateAIAnalytics}
            disabled={loadingAI || reports.length === 0}
            className="px-6 py-3 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center space-x-2 disabled:opacity-50 hover:bg-blue-900 transition-all border border-slate-700"
          >
            {loadingAI ? (
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
            <span>Regenerate Regional Analytics</span>
          </button>
        </div>

        {aiAnalytics ? (
          <div className="space-y-10 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-blue-50 border-l-8 border-blue-900 p-6 rounded-r-xl shadow-inner">
                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
                  Epidemiological Trend Narrative
                </h4>
                <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{aiAnalytics.narrativeInsight}"</p>
              </div>
              
              <div className="bg-white border-2 border-black rounded-xl p-6 flex flex-col justify-center text-center shadow-lg">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">REGIONAL RISK LEVEL</h4>
                <div className={`text-2xl font-black uppercase tracking-widest ${
                  aiAnalytics.riskLevel === 'High' ? 'text-red-600' :
                  aiAnalytics.riskLevel === 'Moderate' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {aiAnalytics.riskLevel}
                </div>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${
                    aiAnalytics.riskLevel === 'High' ? 'bg-red-600 w-full' :
                    aiAnalytics.riskLevel === 'Moderate' ? 'bg-amber-600 w-2/3' : 'bg-green-600 w-1/3'
                  }`}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiAnalytics.charts.map((chart, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h5 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-500 border-b border-slate-200 pb-2 flex justify-between">
                    <span>{chart.title}</span>
                    <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 rounded">{chart.type}</span>
                  </h5>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chart.type === 'bar' ? (
                        <BarChart data={chart.data} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#cbd5e1" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="label" type="category" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#000', fontWeight: 'bold' }} />
                          <Tooltip 
                            contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}
                          />
                          <Bar dataKey="value" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      ) : chart.type === 'pie' ? (
                        <PieChart>
                          <Pie
                            data={chart.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="label"
                          >
                            {chart.data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '8px', fontWeight: '900', paddingTop: '10px' }} />
                        </PieChart>
                      ) : (
                        <AreaChart data={chart.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis hide />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#1e3a8a" fill="#3b82f6" fillOpacity={0.1} />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black text-green-800 uppercase tracking-widest mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    District Veterinary Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {aiAnalytics.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start text-xs font-bold text-slate-700">
                        <span className="w-5 h-5 bg-green-200 text-green-800 rounded flex-shrink-0 flex items-center justify-center text-[9px] mr-3 mt-0.5">{i+1}</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
               </div>
               
               <div className="bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-center border-b-4 border-green-500 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-2">EPIDEMIOLOGICAL ALERT</h4>
                  <p className="text-xl font-black leading-tight mb-4 uppercase">Targeted deworming and vaccination recommended for high-risk zones.</p>
                  <button onClick={() => onNavigate('new-report')} className="w-fit px-4 py-2 bg-green-700 text-white text-[9px] font-black rounded hover:bg-green-600 transition-colors uppercase tracking-widest">Update Local Records</button>
               </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-2xl">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Regional Diagnostics Insight Inactive</p>
             <p className="text-[10px] text-slate-400 max-w-sm mx-auto">Gemini AI is ready to cross-analyze your entire database to detect disease patterns and geographical hotspots in the Nandyal district.</p>
          </div>
        )}
      </div>

      {/* Basic Trend Visualization (Legacy Static Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-black">
          <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-8 flex items-center">
            <span className="w-2 h-2 bg-blue-900 rounded-full mr-2"></span>
            Case Volume Trend (7 Days)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#000', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#000', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontSize: '11px', fontWeight: '900' }}
                />
                <Bar dataKey="reports" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-4 border-black overflow-hidden h-full flex flex-col">
           <div className="bg-black p-4 border-b-2 border-green-700">
              <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Recent Case Stream</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[250px]">
              {reports.slice(0, 4).map((report) => (
                <div key={report.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs font-black text-black uppercase">{report.farmerName}</p>
                    <p className="text-[9px] font-bold text-blue-800 uppercase">{report.species} - {report.id.slice(0,4)}</p>
                  </div>
                  <span className="text-[8px] font-black bg-white border border-slate-200 px-2 py-1 rounded">{report.dateOfReport}</span>
                </div>
              ))}
              {reports.length === 0 && <p className="text-center py-10 text-xs text-slate-300 font-black uppercase">No Data Available</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;