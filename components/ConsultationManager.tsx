
import React, { useState } from 'react';
import { DiagnosticReport, ConsultationRequest } from '../types';

interface ConsultationManagerProps {
  reports: DiagnosticReport[];
  consultations: ConsultationRequest[];
  onAddConsultation: (req: ConsultationRequest) => void;
  onDeleteConsultation: (id: string) => void;
}

const ConsultationManager: React.FC<ConsultationManagerProps> = ({ 
  reports, 
  consultations, 
  onAddConsultation,
  onDeleteConsultation
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ConsultationRequest>>({
    reportId: '',
    urgency: 'Routine',
    requestNote: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedReport = reports.find(r => r.id === formData.reportId);
    if (!selectedReport) return alert("Please select a valid report.");

    const newRequest: ConsultationRequest = {
      id: Math.random().toString(36).substr(2, 9),
      reportId: selectedReport.id,
      farmerName: selectedReport.farmerName,
      species: selectedReport.species,
      urgency: formData.urgency as any,
      requestNote: formData.requestNote || '',
      status: 'Submitted',
      createdAt: new Date().toLocaleString()
    };

    onAddConsultation(newRequest);
    setShowForm(false);
    setFormData({ reportId: '', urgency: 'Routine', requestNote: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Veterinary Consultations</h2>
          <p className="text-sm text-gray-500">Request expert review from Senior Pathologists at CADDL Allagadda</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-all shadow-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Request New Consultation</span>
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-blue-800 uppercase text-xs tracking-widest">Consultation Details</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Attach Lab Report</label>
              <select 
                required
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.reportId}
                onChange={e => setFormData({...formData, reportId: e.target.value})}
              >
                <option value="">-- Select Existing Report --</option>
                {reports.map(r => (
                  <option key={r.id} value={r.id}>{r.farmerName} - {r.species} ({r.dateOfReport})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Urgency Level</label>
              <select 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.urgency}
                onChange={e => setFormData({...formData, urgency: e.target.value as any})}
              >
                <option value="Routine">Routine (24-48 hours)</option>
                <option value="Urgent">Urgent (4-8 hours)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Case Brief / Specific Queries for Pathologist</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide clinical context, symptoms, and specific questions based on the AI insights or lab findings..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.requestNote}
              onChange={e => setFormData({...formData, requestNote: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
             <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border rounded-lg font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-10 py-2.5 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900 transition-all shadow-lg"
            >
              Submit Consultation Request
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50/50 text-left text-[10px] text-blue-800 uppercase font-black tracking-widest">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Farmer / Case</th>
                  <th className="px-6 py-4">Urgency</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {consultations.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        req.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{req.farmerName}</div>
                      <div className="text-xs text-gray-400">{req.species} - Report ID: {req.reportId.slice(0, 4)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        req.urgency === 'Emergency' ? 'text-red-600' :
                        req.urgency === 'Urgent' ? 'text-amber-600' :
                        'text-gray-600'
                      }`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{req.createdAt}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => alert(`Note: ${req.requestNote}`)}
                        className="text-blue-700 font-bold hover:underline"
                      >
                        Details
                      </button>
                      <button 
                         onClick={() => onDeleteConsultation(req.id)}
                         className="text-red-300 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {consultations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No consultation requests found. Click "Request New Consultation" to begin.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationManager;
