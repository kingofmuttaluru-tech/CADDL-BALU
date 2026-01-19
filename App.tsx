import React, { useState, useEffect } from 'react';
import { View, DiagnosticReport, ConsultationRequest } from './types';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import ConsultationManager from './components/ConsultationManager';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import { LAB_NAME, HOSPITAL_LIST, GOVT_NAME, DEPT_NAME } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [reports, setReports] = useState<DiagnosticReport[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('caddl_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }

    const loadData = () => {
      try {
        const savedReports = localStorage.getItem('caddl_reports');
        if (savedReports) {
          const parsed = JSON.parse(savedReports);
          if (Array.isArray(parsed)) setReports(parsed);
        } else {
          // Initialize with dummy data matching the NEW veterinary schema
          const dummy: DiagnosticReport[] = [{
            id: 'LAB-AGD-2113',
            farmerName: 'K. Venkata Reddy',
            village: 'Gundupapala',
            mandal: 'Allagadda',
            district: 'Nandyal',
            mobileNumber: '9533550105',
            animalId: 'TAG-55410',
            species: 'Bovine',
            breed: 'Murrah Buffalo',
            age: '4 Years',
            sex: 'Female',
            bodyWeight: '450',
            pregnancyStatus: 'Pregnant (5M)',
            lactationStage: '2nd Lactation',
            clinicalHistory: 'Gradual loss of appetite and low milk yield for 4 days.',
            sampleType: 'Blood',
            sampleId: 'S-101',
            dateOfCollection: '2024-05-20',
            collectionTime: '08:30',
            collectedBy: 'Lab Asst. Balu',
            sampleCondition: 'Fresh',
            dateOfReport: '2024-05-21',
            hospitalName: HOSPITAL_LIST[0],
            referringDoctor: 'Dr. Ramesh Kumar',
            assistantDirector: 'DR.M.Y.VARAPRASAD',
            labTechnician: 'C.A.D.D.L ,ALLAGADDA',
            status: 'Completed',
            conciseSummary: 'Suspected Gastrointestinal Parasitism & Mild Deficiency.',
            otherRemarks: 'Hemoglobin and PCV levels are borderline. Fecal examination suggested for further confirmation of parasitic load. Recommend immediate mineral supplementation.',
            categorizedResults: {
              clinicalPathology: [
                { testName: 'Hemoglobin (Hb)', resultValue: '9.2', unit: 'g/dL', normalRange: '8.0 - 15.0', method: 'Sahli\'s' },
                { testName: 'Packed Cell Volume (PCV)', resultValue: '28', unit: '%', normalRange: '24 - 46' }
              ],
              biochemistry: [], pathology: [], microbiology: [], parasitology: [], milkExamination: [], urineAnalysis: [], serology: []
            }
          }];
          setReports(dummy);
          localStorage.setItem('caddl_reports', JSON.stringify(dummy));
        }

        const savedConsultations = localStorage.getItem('caddl_consultations');
        if (savedConsultations) {
          const parsed = JSON.parse(savedConsultations);
          if (Array.isArray(parsed)) setConsultations(parsed);
        }
      } catch (e) {
        console.error("Critical error loading local database.", e);
      }
    };

    loadData();
  }, []);

  const handleLogin = () => {
    localStorage.setItem('caddl_auth', 'true');
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('caddl_auth');
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

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

  const handleBackup = () => {
    const data = { reports, consultations };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CADDL_PORTAL_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.reports && Array.isArray(data.reports)) {
          setReports(data.reports);
          localStorage.setItem('caddl_reports', JSON.stringify(data.reports));
          if (data.consultations) {
            setConsultations(data.consultations);
            localStorage.setItem('caddl_consultations', JSON.stringify(data.consultations));
          }
          alert("Database successfully restored.");
        }
      } catch (err) {
        alert("Invalid archive format.");
      }
    };
    reader.readAsText(file);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8 border-b-2 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-sm font-black text-blue-800 tracking-widest uppercase mb-1">{GOVT_NAME}</h1>
            <h2 className="text-xs font-black text-blue-800 tracking-tight uppercase mb-4">{DEPT_NAME}</h2>
            <div className="inline-block bg-green-700 text-white px-4 py-2 rounded shadow-lg border border-black">
              <h3 className="text-xl font-black uppercase tracking-tighter">{LAB_NAME}</h3>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] font-black text-black uppercase tracking-widest bg-white border border-black px-2 py-0.5 rounded shadow-sm mb-1">
              Diagnostic Admin Hub
            </p>
            <p className="text-[9px] font-bold text-green-700 uppercase tracking-tighter">
              Allagadda Node
            </p>
          </div>
        </header>

        {activeView === 'dashboard' && (
          <Dashboard 
            reports={reports} 
            onNavigate={setActiveView} 
            onBackup={handleBackup} 
            onRestore={handleRestore} 
          />
        )}
        {activeView === 'new-report' && <ReportForm onSave={saveReport} />}
        {activeView === 'reports-list' && <ReportList reports={reports} onDelete={deleteReport} />}
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
        <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-widest">Department of Animal Husbandry, Govt of Andhra Pradesh</p>
      </footer>
    </div>
  );
};

export default App;