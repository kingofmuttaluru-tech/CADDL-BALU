
import React, { useMemo } from 'react';
import { DiagnosticReport } from '../types';
import { ISO_CERT, NABL_CERT, CATEGORY_LABELS } from '../constants';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface DashboardProps {
  reports: DiagnosticReport[];
}

// Strictly Blue, Green, Black variants
const COLORS = ['#1e3a8a', '#15803d', '#000000', '#1d4ed8', '#166534', '#334155'];

const Dashboard: React.FC<DashboardProps> = ({ reports }) => {
  const stats = [
    { label: 'TOTAL REPORTS', value: reports.length, color: 'bg-blue-900' },
    { label: 'RECENT (7 DAYS)', value: reports.filter(r => new Date(r.dateOfReport) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'bg-green-800' },
    { label: 'BOVINE CASES', value: reports.filter(r => r.species === 'Bovine').length, color: 'bg-black' },
    { label: 'CAPRINE/OVINE', value: reports.filter(r => r.species === 'Caprine' || r.species === 'Ovine').length, color: 'bg-blue-700' },
  ];

  // Prepare Species Data for Pie Chart
  const speciesData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.species] = (counts[r.species] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, [reports]);

  // Prepare Submission Trend Data (Last 7 Days)
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

  // Prepare Test Volume Data
  const testVolumeData = useMemo(() => {
    return Object.keys(CATEGORY_LABELS).map(key => {
      const totalTests = reports.reduce((acc, report) => {
        const tests = (report.categorizedResults as any)[key];
        return acc + (tests?.length || 0);
      }, 0);
      
      return {
        name: CATEGORY_LABELS[key].split(' ')[0], // Use first word as shorthand
        count: totalTests
      };
    }).filter(d => d.count > 0);
  }, [reports]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Accreditation Banner */}
      <div className="bg-black p-6 rounded-2xl shadow-2xl text-white flex flex-col md:flex-row justify-between items-center border-2 border-green-700">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-green-700 p-3 rounded-full border-2 border-white/20 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-widest uppercase">{ISO_CERT}</h2>
            <p className="text-green-500 text-xs font-black tracking-[0.2em] uppercase">{NABL_CERT}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black border border-white/20 uppercase tracking-widest">Authorized Portal Access</span>
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

      {/* Laboratory Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Visualization */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-black">
          <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-8 flex items-center">
            <span className="w-2 h-2 bg-blue-900 rounded-full mr-2"></span>
            Daily Report Output (Last 7 Days)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#000', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#000', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ border: '2px solid #000', borderRadius: '12px', boxShadow: 'none', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Bar dataKey="reports" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Distribution */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-black">
          <h3 className="text-xs font-black text-green-800 uppercase tracking-widest mb-8 flex items-center">
             <span className="w-2 h-2 bg-green-800 rounded-full mr-2"></span>
             Case Mix by Species
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontSize: '11px', fontWeight: '900' }}
                />
                <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: '900', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-2xl border-4 border-black overflow-hidden">
        <div className="bg-black p-5 flex justify-between items-center border-b-2 border-green-700">
           <h2 className="text-xs font-black text-white uppercase tracking-widest">Recent Diagnostic Records</h2>
           <span className="text-[10px] bg-green-700 text-white px-3 py-1 rounded font-black uppercase">Live Database</span>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-2 border-black text-black text-[10px] font-black uppercase tracking-widest">
                <th className="pb-4 px-4">Farmer Name</th>
                <th className="pb-4 px-4">Species</th>
                <th className="pb-4 px-4 text-center">Date</th>
                <th className="pb-4 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-5 px-4 font-black text-black text-sm uppercase">{report.farmerName}</td>
                  <td className="py-5 px-4 text-blue-900 font-bold uppercase text-xs">{report.species}</td>
                  <td className="py-5 px-4 text-black font-black text-xs text-center">{report.dateOfReport}</td>
                  <td className="py-5 px-4 text-right">
                    <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-amber-100 text-amber-800 border-amber-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 font-black uppercase tracking-widest">Archive Empty</td>
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
