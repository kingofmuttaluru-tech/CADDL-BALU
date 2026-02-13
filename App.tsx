import React, { useState, useEffect } from 'react';
import { View, DiagnosticReport, ConsultationRequest } from './types';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import ConsultationManager from './components/ConsultationManager';
import Gallery from './components/Gallery';
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
          // COMPREHENSIVE DUMMY REPORT WITH FULL VALUES FOR ALL CATEGORIES
          const dummy: DiagnosticReport[] = [{
            id: 'LAB-AGD-2024-001',
            farmerName: 'K. RAMA SUBBA REDDY',
            fatherName: 'S/O K. VENKATA REDDY',
            village: 'RUDRAVARAM',
            mandal: 'Allagadda',
            district: 'Nandyal',
            mobileNumber: '9533550105',
            animalId: 'TAG-554109',
            species: 'Bovine',
            breed: 'Murrah Buffalo',
            age: '5 Years',
            sex: 'Female',
            bodyWeight: '480',
            pregnancyStatus: 'Non-Pregnant',
            lactationStage: 'Early Lactation',
            clinicalHistory: 'Sudden drop in milk yield, off-feed since 2 days, dull appearance. Suspected Mastitis and metabolic disorder.',
            sampleType: 'Blood, Milk & Urine',
            sampleId: 'S-10224',
            dateOfCollection: '2024-05-24',
            collectionTime: '07:30',
            collectedBy: 'Balu',
            sampleCondition: 'Fresh',
            dateOfReport: '2024-05-25',
            hospitalName: 'AVH Rudravaram',
            referringDoctor: 'Dr. M Pratap (A.D. Rudravaram)',
            assistantDirector: 'Dr. C. H. Chandra Mohan Reddy',
            labTechnician: 'S BALARAJU',
            status: 'Completed',
            conciseSummary: 'CLINICAL MASTITIS WITH HYPOCALCEMIA AND SECONDARY ANEMIA',
            otherRemarks: 'The blood picture reveals mild normocytic normochromic anemia. Milk examination confirms clinical mastitis (CMT ++). Biochemistry indicates low Serum Calcium. Urine analysis shows mild proteinuria. Immediate parenteral calcium therapy and intramammary antibiotic infusion required. Recommend mineral mix supplementation for 30 days.',
            categorizedResults: {
              clinicalPathology: [
                { testName: 'Hemoglobin (Hb)', resultValue: '8.4', unit: 'g/dL', normalRange: '8.0 - 15.0', method: 'Sahli\'s' },
                { testName: 'Total RBC Count', resultValue: '5.1', unit: 'million/µL', normalRange: '5 - 10' },
                { testName: 'Packed Cell Volume (PCV)', resultValue: '26', unit: '%', normalRange: '24 - 46' },
                { testName: 'Total WBC Count (TLC)', resultValue: '11,400', unit: '/µL', normalRange: '4,000 - 12,000' }
              ],
              biochemistry: [
                { testName: 'Serum Calcium', resultValue: '7.2', unit: 'mg/dL', normalRange: '8.5 - 11.5' },
                { testName: 'Phosphorus', resultValue: '4.8', unit: 'mg/dL', normalRange: '4.0 - 7.0' },
                { testName: 'Serum Creatinine', resultValue: '1.1', unit: 'mg/dL', normalRange: '0.6 - 1.5' },
                { testName: 'Total Protein', resultValue: '6.8', unit: 'g/dL', normalRange: '6.0 - 8.0' }
              ],
              milkExamination: [
                { testName: 'Milk Fat %', resultValue: '3.8', unit: '%', normalRange: '3.5 - 6.0' },
                { testName: 'Mastitis (CMT)', resultValue: 'POSITIVE (++)', unit: '-', normalRange: 'Negative' },
                { testName: 'Lactometer Reading', resultValue: '27', unit: 'CLR', normalRange: '26 - 32' },
                { testName: 'MBRT', resultValue: '1.5', unit: 'Hours', normalRange: '> 2 hrs' }
              ],
              parasitology: [
                { testName: 'Direct Smear', resultValue: 'NIL', unit: '-', normalRange: 'Absent' },
                { testName: 'Flotation Test', resultValue: 'NIL', unit: '-', normalRange: 'Absent' }
              ],
              urineAnalysis: [
                { testName: 'Urine pH', resultValue: '7.5', unit: 'pH', normalRange: '6.0 - 8.0' },
                { testName: 'Urine Protein', resultValue: 'POSITIVE (+)', unit: '-', normalRange: 'Nil' },
                { testName: 'Urine Sugar', resultValue: 'NIL', unit: '-', normalRange: 'Nil' }
              ],
              serology: [
                { testName: 'Brucellosis (RBPT)', resultValue: 'NEGATIVE', unit: '-', normalRange: 'Negative' }
              ],
              microbiology: [
                { testName: 'Gram Staining', resultValue: 'GRAM +VE COCCI', unit: '-', normalRange: 'Gram +ve / -ve' }
              ],
              pathology: []
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
    const data = { reports, consultations, gallery: JSON.parse(localStorage.getItem('caddl_gallery') || '[]') };
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
          if (data.gallery) {
             localStorage.setItem('caddl_gallery', JSON.stringify(data.gallery));
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
        {activeView === 'gallery' && <Gallery />}
      </main>

      <footer className="bg-black text-white border-t-4 border-green-700 py-6 text-center text-sm no-print">
        <p className="font-black uppercase tracking-widest">&copy; {new Date().getFullYear()} CADDL ALLAGADDA. OFFICIAL VETERINARY DIAGNOSTIC PORTAL.</p>
        <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-widest">Department of Animal Husbandry, Govt of Andhra Pradesh</p>
      </footer>
    </div>
  );
};

export default App;
