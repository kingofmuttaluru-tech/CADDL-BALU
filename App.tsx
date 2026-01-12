
import React, { useState, useEffect } from 'react';
import { View, DiagnosticReport, ConsultationRequest } from './types';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import ConsultationManager from './components/ConsultationManager';
import Navbar from './components/Navbar';
import { LAB_NAME, HOSPITAL_LIST, GOVT_NAME, DEPT_NAME } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [reports, setReports] = useState<DiagnosticReport[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  useEffect(() => {
    // Load Reports
    const savedReports = localStorage.getItem('caddl_reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      const dummy: DiagnosticReport[] = [
        {
          id: '1',
          farmerName: 'Venkata Reddy',
          fatherName: 'Late Nagabhushanam',
          farmerAddress: 'H.No: 4-12, Allagadda Village, Nandyal Dist.',
          hospitalName: HOSPITAL_LIST[0],
          dateOfCollection: '2024-05-20',
          dateOfReport: '2024-05-21',
          species: 'Bovine',
          age: '4 Years',
          sex: 'Female',
          breed: 'Murrah Buffalo',
          referringDoctor: 'Dr. Ramesh Kumar',
          labTechnicianName: 'S.BALARAJU',
          assistantDirector: 'DR.M.Y.VARAPRASAD',
          status: 'Completed',
          conciseSummary: 'Suspected gastrointestinal parasitism and mild hypoglycemia.',
          otherRemarks: 'Deworming recommended. Blood glucose is slightly lower than normal.',
          categorizedResults: {
            clinicalPathology: [
              { testName: 'Hemoglobin (Hb)', resultValue: '10.5', unit: 'g/dL', normalRange: '8.0 - 15.0' },
              { testName: 'Packed Cell Volume (PCV)', resultValue: '32', unit: '%', normalRange: '24 - 46' }
            ],
            biochemistry: [
              { testName: 'Blood Glucose', resultValue: '40', unit: 'mg/dL', normalRange: '45 - 75' }
            ],
            pathology: [],
            microbiology: [],
            parasitology: [
               { testName: 'Fecal Exam (Direct)', resultValue: 'Strongyle eggs (+)', unit: '-', normalRange: 'Nil' }
            ],
            milkExamination: []
          }
        }
      ];
      setReports(dummy);
      localStorage.setItem('caddl_reports', JSON.stringify(dummy));
    }

    // Load Consultations
    const savedConsultations = localStorage.getItem('caddl_consultations');
    if (savedConsultations) {
      setConsultations(JSON.parse(savedConsultations));
    }
  }, []);

  const saveReport = (newReport: DiagnosticReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('caddl_reports', JSON.stringify(updated));
    setActiveView('reports-list');
  };

  const deleteReport = (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('caddl_reports', JSON.stringify(updated));
  };

  const addConsultation = (req: ConsultationRequest) => {
    const updated = [req, ...consultations];
    setConsultations(updated);
    localStorage.setItem('caddl_consultations', JSON.stringify(updated));
  };

  const deleteConsultation = (id: string) => {
    const updated = consultations.filter(c => c.id !== id);
    setConsultations(updated);
    localStorage.setItem('caddl_consultations', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8 border-b-2 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-sm font-black text-blue-800 tracking-widest uppercase mb-1">{GOVT_NAME}</h1>
            <h2 className="text-xs font-black text-blue-800 tracking-tight uppercase mb-4">{DEPT_NAME}</h2>
            <div className="inline-block bg-green-700 text-white px-4 py-2 rounded shadow-lg border border-black">
              <h3 className="text-xl font-black uppercase tracking-tighter">{LAB_NAME}</h3>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-black text-black uppercase tracking-widest">Diagnostic Admin Portal</p>
            <p className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">Authorized Laboratory Use Only</p>
          </div>
        </header>

        {activeView === 'dashboard' && <Dashboard reports={reports} />}
        {activeView === 'new-report' && <ReportForm onSave={saveReport} />}
        {activeView === 'reports-list' && (
          <ReportList 
            reports={reports} 
            onDelete={deleteReport} 
          />
        )}
        {activeView === 'consultations' && (
          <ConsultationManager 
            reports={reports}
            consultations={consultations}
            onAddConsultation={addConsultation}
            onDeleteConsultation={deleteConsultation}
          />
        )}
      </main>

      <footer className="bg-black text-white border-t-4 border-green-700 py-6 text-center text-sm no-print">
        <p className="font-black uppercase tracking-widest">&copy; {new Date().getFullYear()} CADDL ALLAGADDA. OFFICIAL VETERINARY DIAGNOSTIC PORTAL.</p>
        <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">Department of Animal Husbandry, Government of Andhra Pradesh</p>
      </footer>
    </div>
  );
};

export default App;
