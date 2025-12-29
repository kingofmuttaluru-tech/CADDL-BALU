
import React, { useState } from 'react';
import { DiagnosticReport, Species, LabTestEntry, CategorizedTests } from '../types';
import { SPECIES_LIST, MASTER_TEST_LIST, CATEGORY_LABELS } from '../constants';
import { getAIInsights } from '../services/geminiService';

interface ReportFormProps {
  onSave: (report: DiagnosticReport) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSave }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [formData, setFormData] = useState<Partial<DiagnosticReport>>({
    id: Math.random().toString(36).substr(2, 9),
    farmerName: '',
    farmerAddress: '',
    dateOfCollection: new Date().toISOString().split('T')[0],
    dateOfReport: new Date().toISOString().split('T')[0],
    species: 'Bovine',
    age: '',
    sex: 'Female',
    breed: '',
    referringDoctor: '',
    labTechnicianName: 'S.BALARAJU',
    assistantDirector: 'DR.M.Y.VARAPRASAD',
    status: 'Completed',
    conciseSummary: '',
    otherRemarks: '',
    categorizedResults: {
      clinicalPathology: [],
      pathology: [],
      biochemistry: [],
      microbiology: [],
      parasitology: []
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTest = (categoryKey: string, masterTestIndex: number) => {
    const master = MASTER_TEST_LIST[masterTestIndex];
    if (!master) return;

    const newEntry: LabTestEntry = {
      testName: master.name,
      resultValue: '',
      unit: master.unit,
      normalRange: master.normalRange
    };

    setFormData(prev => {
      const results = { ...prev.categorizedResults } as CategorizedTests;
      results[categoryKey as keyof CategorizedTests] = [
        ...results[categoryKey as keyof CategorizedTests],
        newEntry
      ];
      return { ...prev, categorizedResults: results };
    });
  };

  const bulkAddByCategory = (category: string, subCategory?: string) => {
    const tests = MASTER_TEST_LIST.filter(t => 
      t.category === category && (!subCategory || t.subCategory === subCategory)
    );
    const newEntries: LabTestEntry[] = tests.map(t => ({
      testName: t.name,
      resultValue: '',
      unit: t.unit,
      normalRange: t.normalRange
    }));

    setFormData(prev => {
      const results = { ...prev.categorizedResults } as CategorizedTests;
      results[category as keyof CategorizedTests] = [
        ...results[category as keyof CategorizedTests],
        ...newEntries
      ];
      return { ...prev, categorizedResults: results };
    });
  };

  const updateTestResult = (categoryKey: string, testIndex: number, value: string) => {
    setFormData(prev => {
      const results = { ...prev.categorizedResults } as CategorizedTests;
      const category = [...results[categoryKey as keyof CategorizedTests]];
      category[testIndex] = { ...category[testIndex], resultValue: value };
      results[categoryKey as keyof CategorizedTests] = category;
      return { ...prev, categorizedResults: results };
    });
  };

  const removeTest = (categoryKey: string, testIndex: number) => {
    setFormData(prev => {
      const results = { ...prev.categorizedResults } as CategorizedTests;
      const category = [...results[categoryKey as keyof CategorizedTests]];
      category.splice(testIndex, 1);
      results[categoryKey as keyof CategorizedTests] = category;
      return { ...prev, categorizedResults: results };
    });
  };

  const generateAIInsight = async () => {
    setLoadingAI(true);
    const { detailedAnalysis, conciseSummary } = await getAIInsights(formData);
    
    setFormData(prev => ({
      ...prev,
      conciseSummary: conciseSummary,
      otherRemarks: detailedAnalysis
    }));
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as DiagnosticReport);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 animate-fadeIn space-y-10">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-full border-b pb-2">
          <h3 className="font-bold text-blue-800 uppercase text-sm tracking-wider">Farmer & Animal Information</h3>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Farmer Name</label>
          <input required type="text" name="farmerName" value={formData.farmerName} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Farmer Address</label>
          <input type="text" name="farmerAddress" value={formData.farmerAddress} onChange={handleChange} placeholder="Village, Mandal, District" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Species</label>
          <select name="species" value={formData.species} onChange={handleChange} className="w-full p-2.5 border rounded-lg">
            {SPECIES_LIST.map(s => <option key={s} value={s.split(' ')[0]}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Breed</label>
          <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="w-full p-2.5 border rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Age</label>
          <input type="text" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 5 Years" className="w-full p-2.5 border rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Sex</label>
          <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-2.5 border rounded-lg">
            <option>Male</option>
            <option>Female</option>
            <option>Unknown</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Referring Doctor</label>
          <input type="text" name="referringDoctor" value={formData.referringDoctor} onChange={handleChange} placeholder="Name of VAS" className="w-full p-2.5 border rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Collection Date</label>
          <input type="date" name="dateOfCollection" value={formData.dateOfCollection} onChange={handleChange} className="w-full p-2.5 border rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Report Date</label>
          <input type="date" name="dateOfReport" value={formData.dateOfReport} onChange={handleChange} className="w-full p-2.5 border rounded-lg" />
        </div>
      </div>

      {/* Investigations */}
      <div className="space-y-8">
        <div className="col-span-full border-b pb-2 flex justify-between items-center">
          <h3 className="font-bold text-blue-800 uppercase text-sm tracking-wider">Laboratory Investigations</h3>
        </div>

        {Object.keys(CATEGORY_LABELS).map((catKey) => (
          <div key={catKey} className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <h4 className="font-black text-slate-700 text-xs tracking-tighter uppercase">{CATEGORY_LABELS[catKey]}</h4>
              
              <div className="flex flex-wrap items-center gap-2">
                {catKey === 'clinicalPathology' && (
                  <button 
                    type="button"
                    onClick={() => bulkAddByCategory('clinicalPathology')}
                    className="text-[10px] font-black bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-all shadow-sm uppercase tracking-widest"
                  >
                    Select All CBP
                  </button>
                )}

                {catKey === 'biochemistry' && (
                  <>
                    <button 
                      type="button"
                      onClick={() => bulkAddByCategory('biochemistry', 'LFT')}
                      className="text-[10px] font-black bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-all shadow-sm uppercase tracking-widest"
                    >
                      + LFT
                    </button>
                    <button 
                      type="button"
                      onClick={() => bulkAddByCategory('biochemistry', 'RFT')}
                      className="text-[10px] font-black bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-all shadow-sm uppercase tracking-widest"
                    >
                      + RFT
                    </button>
                    <button 
                      type="button"
                      onClick={() => bulkAddByCategory('biochemistry', 'ELECTROLYTES')}
                      className="text-[10px] font-black bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-all shadow-sm uppercase tracking-widest"
                    >
                      + ELECTROLYTES
                    </button>
                    <button 
                      type="button"
                      onClick={() => bulkAddByCategory('biochemistry', 'MINERALS')}
                      className="text-[10px] font-black bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-all shadow-sm uppercase tracking-widest"
                    >
                      + MINERALS
                    </button>
                  </>
                )}

                <select 
                  className="text-[10px] p-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.value !== "") addTest(catKey, parseInt(e.target.value));
                    e.target.value = "";
                  }}
                >
                  <option value="">+ Individual Test</option>
                  {MASTER_TEST_LIST
                    .map((t, idx) => ({ ...t, originalIndex: idx }))
                    .filter(t => t.category === catKey)
                    .map(t => (
                      <option key={t.originalIndex} value={t.originalIndex}>{t.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {(formData.categorizedResults as any)[catKey].map((entry: LabTestEntry, idx: number) => (
                <div key={idx} className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border shadow-sm group">
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-xs font-bold text-blue-800 uppercase">{entry.testName}</span>
                  </div>
                  <div className="w-32">
                    <input 
                      required
                      type="text" 
                      placeholder="Result" 
                      value={entry.resultValue}
                      onChange={(e) => updateTestResult(catKey, idx, e.target.value)}
                      className="w-full p-1.5 border rounded text-sm text-center font-bold focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="w-20 text-center text-xs text-gray-400 font-medium">
                    {entry.unit}
                  </div>
                  <div className="w-32 text-[10px] text-gray-400 font-bold text-center border-l pl-2">
                    NORMAL: {entry.normalRange}
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeTest(catKey, idx)}
                    className="p-1 text-red-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {(formData.categorizedResults as any)[catKey].length === 0 && (
                <p className="text-center py-4 text-xs text-slate-400 italic font-medium">No tests added to this section yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Review Fields */}
      <div className="space-y-6">
        <div className="col-span-full border-b pb-2">
          <h3 className="font-bold text-blue-800 uppercase text-sm tracking-wider">Clinical Review & Authorization</h3>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z"></path></svg>
            Concise Executive Summary (AI Generated)
          </label>
          <textarea 
            name="conciseSummary"
            value={formData.conciseSummary}
            onChange={handleChange}
            rows={2}
            className="w-full p-4 border rounded-xl text-sm bg-blue-50/50 border-blue-100 focus:ring-blue-500 font-medium italic"
            placeholder="AI Summary will appear here..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detailed Pathologist Remarks & Recommendations</label>
          <textarea 
            name="otherRemarks"
            value={formData.otherRemarks}
            onChange={handleChange}
            rows={5}
            className="w-full p-4 border rounded-xl text-sm bg-gray-50/50 focus:ring-blue-500"
            placeholder="Detailed clinical analysis..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lab Technician Name</label>
            <input type="text" name="labTechnicianName" value={formData.labTechnicianName} onChange={handleChange} className="w-full p-2.5 border rounded-lg" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assistant Director Name</label>
            <input type="text" name="assistantDirector" value={formData.assistantDirector} onChange={handleChange} className="w-full p-2.5 border rounded-lg" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 items-center justify-end border-t pt-8">
        <button 
          type="button" 
          onClick={generateAIInsight}
          disabled={loadingAI}
          className="px-6 py-2 border-2 border-blue-600 text-blue-700 rounded-xl hover:bg-blue-50 font-black flex items-center space-x-2 disabled:opacity-50 transition-all uppercase text-xs tracking-widest"
        >
          {loadingAI ? (
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          <span>Request Expert AI Diagnosis</span>
        </button>
        <button type="submit" className="px-12 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm">
          Generate Final Report
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
