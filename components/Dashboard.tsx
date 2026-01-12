
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

const COLORS = ['#1e40af', '#3b82f6', '#0ea5e9', '#6366f1', '#4f46e5', '#818cf8'];

const Dashboard: React.FC<DashboardProps> = ({ reports }) => {
  const stats = [
    { label: 'Total Reports', value: reports.length, color: 'bg-blue-500' },
    { label: 'Recent (7 Days)', value: reports.filter(r => new Date(r.dateOfReport) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'bg-blue-600' },
    { label: 'Bovine Cases', value: reports.filter(r => r.species === 'Bovine').length, color: 'bg-indigo-500' },
    { label: 'Caprine/Ovine', value: reports.filter(r => r.species === 'Caprine' || r.species === 'Ovine').length, color: 'bg-sky-500' },
  ];

  // Prepare Species Data for Pie Chart
  const speciesData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.species] = (counts[r.species] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  // Prepare Submission Trend Data (Last 7 Days)
  const trendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 p-6 rounded-2xl shadow-xl text-white flex flex-col md:flex-row justify-between items-center border border-blue-600/30">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-white/10 p-3 rounded-full border border-white/20 backdrop-blur-sm">
            <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">{ISO_CERT}</h2>
            <p className="text-blue-100/80 text-sm font-medium tracking-wide uppercase">{NABL_CERT}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="bg-blue-900/40 px-4 py-2 rounded-lg text-xs font-black border border-blue-400/20 backdrop-blur-md uppercase tracking-widest">Official Certification 9001:2015</span>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Laboratory Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Visualization */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-6">Daily Report Output (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-6">Case Mix by Species</h3>
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
                   contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Volume Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-6">Investigation Volume by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={testVolumeData} margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Diagnostic Entries</h2>
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
                      report.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
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