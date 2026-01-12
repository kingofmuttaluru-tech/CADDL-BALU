
import React, { useState } from 'react';
import { DiagnosticReport } from '../types';
import ReportPrintPreview from './ReportPrintPreview';

interface ReportListProps {
  reports: DiagnosticReport[];
  onDelete: (id: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onDelete }) => {
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport | null>(null);

  if (selectedReport) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center no-print px-4">
          <button 
            onClick={() => setSelectedReport(null)}
            className="flex items-center text-blue-700 font-black uppercase text-[10px] tracking-widest hover:underline"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Reports
          </button>
          <button 
            onClick={() => { if(confirm('Permanently delete this report? This cannot be undone.')) { onDelete(selectedReport.id); setSelectedReport(null); } }}
            className="flex items-center text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-red-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete Permanently
          </button>
        </div>
        <ReportPrintPreview report={selectedReport} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
        <h2 className="font-bold text-blue-800 uppercase text-xs tracking-widest">Laboratory Archive</h2>
        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-bold">{reports.length} Total Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-6 py-3 font-bold tracking-wider">Farmer / Owner</th>
              <th className="px-6 py-3 font-bold tracking-wider">Patient Details</th>
              <th className="px-6 py-3 font-bold tracking-wider">Date</th>
              <th className="px-6 py-3 font-bold tracking-wider">Lab ID</th>
              <th className="px-6 py-3 font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="font-bold text-gray-900 uppercase">{report.farmerName}</div>
                   <div className="text-[10px] text-gray-400 italic">S/o {report.fatherName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  <span className="block font-bold text-blue-700 uppercase">{report.species}</span>
                  <span className="text-xs text-gray-400 font-medium">
                    {report.breed} {report.animalName ? `("${report.animalName}")` : ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">{report.dateOfReport}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-mono text-xs text-slate-700 uppercase border border-slate-200">
                    ID-{report.id.slice(0, 6)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all font-black uppercase text-[10px] tracking-widest shadow-sm shadow-blue-200"
                  >
                    Review
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete this report?')) onDelete(report.id); }}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Report"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No reports found in the diagnostic database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportList;
