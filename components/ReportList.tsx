
import React, { useState, useMemo } from 'react';
import { DiagnosticReport } from '../types';
import ReportPrintPreview from './ReportPrintPreview';

interface ReportListProps {
  reports: DiagnosticReport[];
  onDelete: (id: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onDelete }) => {
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('All');

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = 
        r.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecies = filterSpecies === 'All' || r.species === filterSpecies;
      return matchesSearch && matchesSpecies;
    });
  }, [reports, searchTerm, filterSpecies]);

  if (selectedReport) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center no-print px-4">
          <button 
            onClick={() => setSelectedReport(null)}
            className="flex items-center text-blue-700 font-black uppercase text-[10px] tracking-widest hover:underline group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Database Archive
          </button>
          <button 
            onClick={() => { if(confirm('Permanently delete this diagnostic record? This cannot be undone.')) { onDelete(selectedReport.id); setSelectedReport(null); } }}
            className="flex items-center text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 px-6 py-2.5 rounded-2xl transition-all border-2 border-red-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Purge Record
          </button>
        </div>
        <ReportPrintPreview report={selectedReport} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filtering Header */}
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Archive</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="FARMER NAME OR LAB ID..."
              className="w-full p-4 pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-900 outline-none font-bold uppercase placeholder:text-slate-300"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="w-full md:w-64 space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Species Filter</label>
           <select 
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-900 outline-none font-bold uppercase"
            value={filterSpecies}
            onChange={e => setFilterSpecies(e.target.value)}
           >
              <option value="All">All Species</option>
              <option value="Bovine">Bovine</option>
              <option value="Caprine">Caprine</option>
              <option value="Ovine">Ovine</option>
              <option value="Equine">Equine</option>
              <option value="Avian">Avian</option>
              <option value="Canine">Canine</option>
           </select>
        </div>
        <div className="hidden lg:block pb-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-full">
             {filteredReports.length} Matches
           </span>
        </div>
      </div>

      {/* Database Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-black overflow-hidden">
        <div className="bg-black p-6 flex justify-between items-center border-b-2 border-green-700">
           <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center">
              <svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              CADDL Diagnostic Archive
           </h2>
           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">Encryption: CID-AGD Active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-5">Lab Ref / ID</th>
                <th className="px-10 py-5">Farmer Identification</th>
                <th className="px-10 py-5">Species / Breed</th>
                <th className="px-10 py-5">Report Date</th>
                <th className="px-10 py-5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <span className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-mono text-xs uppercase border-b-2 border-green-700 group-hover:bg-blue-900 transition-colors">
                      ID-{report.id.slice(0, 6)}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                     <div className="font-black text-slate-900 text-sm uppercase group-hover:text-blue-900 transition-colors">{report.farmerName}</div>
                     {/* Fix: farmerAddress does not exist on DiagnosticReport. Combining valid address components. */}
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-xs">{`${report.village}, ${report.mandal}, ${report.district}`}</div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="font-black text-blue-800 text-xs uppercase tracking-tighter">{report.species}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{report.breed || 'UNDISCLOSED'}</div>
                  </td>
                  <td className="px-10 py-6 text-slate-500 font-black text-xs uppercase tabular-nums">
                    {report.dateOfReport}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center px-8 py-3 bg-white text-black border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all font-black uppercase text-[10px] tracking-widest shadow-lg hover:translate-y-[-2px] active:translate-y-[0px]"
                    >
                      Review
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center space-y-3 opacity-20">
                       <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                       <p className="text-xs font-black uppercase tracking-[0.3em]">No Records Matching Search Parameters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
