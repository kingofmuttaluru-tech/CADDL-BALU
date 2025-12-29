
import React from 'react';
import { DiagnosticReport } from '../types';
import { ISO_CERT, NABL_CERT } from '../constants';

interface DashboardProps {
  reports: DiagnosticReport[];
}

const Dashboard: React.FC<DashboardProps> = ({ reports }) => {
  const stats = [
    { label: 'Total Reports', value: reports.length, color: 'bg-blue-500' },
    { label: 'Recent (7 Days)', value: reports.filter(r => new Date(r.dateOfReport) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'bg-emerald-500' },
    { label: 'Bovine Cases', value: reports.filter(r => r.species === 'Bovine').length, color: 'bg-amber-500' },
    { label: 'Caprine/Ovine', value: reports.filter(r => r.species === 'Caprine' || r.species === 'Ovine').length, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Accreditation Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 rounded-2xl shadow-xl text-white flex flex-col md:flex-row justify-between items-center border border-emerald-600/30">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-white/10 p-3 rounded-full border border-white/20 backdrop-blur-sm">
            <svg className="w-8 h-8 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">{ISO_CERT}</h2>
            <p className="text-emerald-100/80 text-sm font-medium tracking-wide uppercase">{NABL_CERT}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="bg-emerald-900/40 px-4 py-2 rounded-lg text-xs font-black border border-emerald-400/20 backdrop-blur-md uppercase tracking-widest">Official Certification 9001:2015</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b text-gray-400 text-sm uppercase">
                <th className="pb-3 font-semibold">Farmer Name</th>
                <th className="pb-3 font-semibold">Species</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium">{report.farmerName}</td>
                  <td className="py-4 text-gray-600">{report.species}</td>
                  <td className="py-4 text-gray-600 text-sm">{report.dateOfReport}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400 italic">No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
