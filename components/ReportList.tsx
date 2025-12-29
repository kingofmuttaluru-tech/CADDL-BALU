
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
        <button 
          onClick={() => setSelectedReport(null)}
          className="flex items-center text-blue-700 font-medium hover:underline mb-4 no-print"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Reports
        </button>
        <ReportPrintPreview report={selectedReport} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
        <h2 className="font-bold text-blue-800">Laboratory Archive</h2>
        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-bold">{reports.length} Total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-6 py-3 font-bold tracking-wider">Farmer</th>
              <th className="px-6 py-3 font-bold tracking-wider">Animal Details</th>
              <th className="px-6 py-3 font-bold tracking-wider">Date</th>
              <th className="px-6 py-3 font-bold tracking-wider">Lab ID</th>
              <th className="px-6 py-3 font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{report.farmerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  <span className="block font-medium">{report.species}</span>
                  <span className="text-xs text-gray-400">{report.breed} ({report.age})</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{report.dateOfReport}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs text-gray-600 uppercase">
                    CADDL-{report.id.slice(0, 4)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-medium"
                  >
                    View / Print
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete this report?')) onDelete(report.id); }}
                    className="p-1.5 text-red-300 hover:text-red-600 transition-colors"
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
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No reports generated yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportList;
