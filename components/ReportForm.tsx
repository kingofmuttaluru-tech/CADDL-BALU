import React, { useState, useMemo } from 'react';
import { 
  DiagnosticReport, 
  LabTestEntry, 
  CategorizedTests, 
  Species 
} from '../types';
import { 
  MASTER_TEST_LIST, 
  CATEGORY_LABELS, 
  HOSPITAL_LIST, 
  DOCTOR_LIST, 
  SPECIES_LIST,
  BREEDS_BY_SPECIES
} from '../constants';
import { getAIInsights } from '../services/geminiService';

interface ReportFormProps {
  onSave: (report: DiagnosticReport) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSave }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [testSearch, setTestSearch] = useState('');
  const [activeTab, setActiveTab] = useState<keyof CategorizedTests>('clinicalPathology');
  
  const [formData, setFormData] = useState<Partial<DiagnosticReport>>({
    id: `AGD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    farmerName: '',
    village: '',
    mobileNumber: '',
    animalId: '',
    species: 'Bovine',
    breed: '',
    age: '',
    sex: 'Female',
    referringDoctor: DOCTOR_LIST[0],
    hospitalName: HOSPITAL_LIST[0],
    sampleType: 'Blood',
    labTechnician: 'C.A.D.D.L ,ALLAGADDA',
    assistantDirector: 'DR.M.Y.VARAPRASAD',
    mandal: 'Allagadda',
    district: 'Nandyal',
    dateOfCollection: new Date().toISOString().split('T')[0],
    dateOfReport: new Date().toISOString().split('T')[0],
    status: 'Pending',
    conciseSummary: '',
    otherRemarks: '',
    categorizedResults: {
      clinicalPathology: [],
      pathology: [],
      biochemistry: [],
      microbiology: [],
      parasitology: [],
      milkExamination: [],
      urineAnalysis: [],
      serology: []
    }
  });

  const [currentTestEntry, setCurrentTestEntry] = useState<LabTestEntry>({
    testName: '',
    resultValue: '',
    unit: '',
    normalRange: '',
    method: ''
  });

  const isMasterSelected = useMemo(() => 
    MASTER_TEST_LIST.some(t => t.name.toLowerCase() === currentTestEntry.testName.toLowerCase()),
    [currentTestEntry.testName]
  );

  const filteredMasterTests = useMemo(() => {
    return MASTER_TEST_LIST.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(testSearch.toLowerCase()) || 
                            test.category.toLowerCase().includes(testSearch.toLowerCase());
      const matchesCategory = activeCategoryFilter === 'All' || test.category === activeCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [testSearch, activeCategoryFilter]);

  const handleQuickAdd = (test: typeof MASTER_TEST_LIST[0]) => {
    setCurrentTestEntry({
      testName: test.name,
      resultValue: '',
      unit: test.unit,
      normalRange: test.normalRange,
      method: test.method || ''
    });
    setActiveTab(test.category as keyof CategorizedTests);
  };

  const handleAddTest = () => {
    if (!currentTestEntry.testName || !currentTestEntry.resultValue) return;
    const updatedResults = { ...formData.categorizedResults } as CategorizedTests;
    updatedResults[activeTab] = [...updatedResults[activeTab], currentTestEntry];
    setFormData({ ...formData, categorizedResults: updatedResults });
    setCurrentTestEntry({ testName: '', resultValue: '', unit: '', normalRange: '', method: '' });
  };

  const handleRemoveTest = (category: keyof CategorizedTests, index: number) => {
    const updatedResults = { ...formData.categorizedResults } as CategorizedTests;
    updatedResults[category] = updatedResults[category].filter((_, i) => i !== index);
    setFormData({ ...formData, categorizedResults: updatedResults });
  };

  const handleAIAnalyze = async () => {
    if (!formData.categorizedResults || Object.values(formData.categorizedResults).every(t => (t as any[]).length === 0)) {
      return alert("Add laboratory findings first for AI analysis.");
    }
    setLoadingAI(true);
    try {
      const insights = await getAIInsights(formData);
      setFormData({
        ...formData,
        otherRemarks: insights.detailedAnalysis,
        conciseSummary: insights.conciseSummary,
        status: 'Completed'
      });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("AI analysis engine timed out. Please enter remarks manually.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.animalId) return alert("Farmer Name and Animal Tag ID are mandatory.");
    onSave(formData as DiagnosticReport);
  };

  const availableBreeds = BREEDS_BY_SPECIES[formData.species || 'Bovine'] || [];

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4">
      <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
        
        {/* OFFICIAL ANIMAL REGISTRATION PORTAL */}
        <section className="bg-white rounded-[2rem] shadow-2xl border-4 border-black overflow-hidden">
          <div className="bg-blue-900 px-8 py-5 flex justify-between items-center border-b-4 border-black">
            <h2 className="text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center">
              <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </span>
              Official Animal Registration Portal
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest hidden md:block">Case ID: {formData.id}</span>
              <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 border-white/20 shadow-lg">
                Status: {formData.status}
              </div>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-slate-50/30">
            {/* Farmer & Location Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-1.5 bg-blue-900 rounded-full"></div>
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-widest">Farmer & Owner Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Farmer Name *</label>
                  <input required type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold uppercase transition-all shadow-sm"
                    placeholder="FULL NAME" value={formData.farmerName} onChange={e => setFormData({...formData, farmerName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cell Number</label>
                  <input type="tel" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    placeholder="10-DIGIT MOBILE" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Address / Village</label>
                  <input type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold uppercase transition-all shadow-sm"
                    placeholder="VILLAGE NAME" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Animal Patient Profile */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-1.5 bg-emerald-700 rounded-full"></div>
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Animal Patient Profile</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest ml-1">Animal Tag ID *</label>
                  <input required type="text" className="w-full p-4 bg-emerald-50/30 border-2 border-emerald-200 rounded-2xl focus:border-emerald-600 outline-none font-black uppercase transition-all shadow-sm"
                    placeholder="TAG NUMBER" value={formData.animalId} onChange={e => setFormData({...formData, animalId: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Species</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.species} onChange={e => setFormData({...formData, species: e.target.value as Species})}>
                    {SPECIES_LIST.map(s => <option key={s} value={s.split(' ')[0]}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Breed Name</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})}>
                    <option value="">Select Breed</option>
                    {availableBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                    <option value="Other">Other / Unknown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Age</label>
                  <input type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold uppercase transition-all shadow-sm"
                    placeholder="e.g. 3Y 4M" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Animal Sex</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value as any})}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Diagnostic & Sample Data */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-1.5 bg-slate-600 rounded-full"></div>
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Sample & Referral Data</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sample Type</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.sampleType} onChange={e => setFormData({...formData, sampleType: e.target.value})}>
                    <option value="Blood">Blood (EDTA/Serum)</option>
                    <option value="Milk">Milk Sample</option>
                    <option value="Fecal">Fecal Sample</option>
                    <option value="Urine">Urine Sample</option>
                    <option value="Skin Scraping">Skin Scraping</option>
                    <option value="Swab">Swab / Tissue</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Collection Date</label>
                  <input type="date" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.dateOfCollection} onChange={e => setFormData({...formData, dateOfCollection: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hospital Name</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.hospitalName} onChange={e => setFormData({...formData, hospitalName: e.target.value})}>
                    {HOSPITAL_LIST.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Referring Doctor Name</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-900 outline-none font-bold transition-all shadow-sm"
                    value={formData.referringDoctor} onChange={e => setFormData({...formData, referringDoctor: e.target.value})}>
                    {DOCTOR_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ADVANCED TEST SEARCH & SELECTION PANEL */}
        <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-emerald-800 px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-white text-[10px] font-black uppercase tracking-[0.25em] flex items-center">
              <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              Diagnostic Selection Hub
            </h2>
            
            <div className="relative w-full md:w-96 group">
              <input 
                type="text" 
                placeholder="Search Laboratory Master Tests..." 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-xs font-bold placeholder:text-emerald-200/50 focus:bg-white focus:text-slate-900 focus:outline-none transition-all shadow-inner"
                value={testSearch}
                onChange={e => setTestSearch(e.target.value)}
              />
              {testSearch && (
                <button 
                  type="button"
                  onClick={() => setTestSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white group-focus-within:text-slate-400"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-slate-100">
              {['All', ...Object.keys(CATEGORY_LABELS)].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                    activeCategoryFilter === cat 
                      ? 'bg-emerald-800 text-white border-black shadow-lg scale-105' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-800'
                  }`}
                >
                  {cat === 'All' ? 'View All Tests' : CATEGORY_LABELS[cat].split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Filtered Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-12 min-h-[120px]">
              {filteredMasterTests.map((test, i) => (
                <button 
                  key={i}
                  type="button"
                  onClick={() => handleQuickAdd(test)}
                  className="group relative flex flex-col p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:bg-white hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                >
                  <span className="text-[10px] font-black text-slate-900 uppercase leading-tight mb-2 group-hover:text-emerald-800">{test.name}</span>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-auto group-hover:text-emerald-600/50">
                    {test.category.slice(0, 10)}...
                  </span>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                  </div>
                </button>
              ))}
              {filteredMasterTests.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-300">
                  <p className="text-xs font-black uppercase tracking-[0.2em]">No Master Tests Matching Your Query</p>
                </div>
              )}
            </div>

            {/* Test Value Entry Form */}
            <div className="bg-slate-900 p-8 rounded-[1.5rem] border-b-4 border-emerald-600 mb-10 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Value Entry Layer:</span>
                <span className="text-[10px] font-black text-white uppercase flex items-center">
                  {currentTestEntry.testName || 'Select a test above'}
                  {isMasterSelected && (
                    <svg className="w-3 h-3 ml-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  )}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Laboratory Parameter</label>
                  <input type="text" className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white outline-none font-black uppercase focus:border-emerald-500"
                    placeholder="TEST NAME" value={currentTestEntry.testName} onChange={e => setCurrentTestEntry({...currentTestEntry, testName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Result Finding</label>
                  <input type="text" className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white outline-none font-black uppercase focus:border-emerald-500"
                    placeholder="RESULT" value={currentTestEntry.resultValue} onChange={e => setCurrentTestEntry({...currentTestEntry, resultValue: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Units / Ref Range</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly={isMasterSelected}
                      className={`w-1/2 p-4 border-2 rounded-2xl outline-none font-bold text-xs transition-all ${
                        isMasterSelected 
                          ? 'bg-slate-700/50 border-slate-700 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                      placeholder="UNIT" 
                      value={currentTestEntry.unit} 
                      onChange={e => !isMasterSelected && setCurrentTestEntry({...currentTestEntry, unit: e.target.value})} 
                    />
                    <input 
                      type="text" 
                      readOnly={isMasterSelected}
                      className={`w-1/2 p-4 border-2 rounded-2xl outline-none font-bold text-xs uppercase transition-all ${
                        isMasterSelected 
                          ? 'bg-slate-700/50 border-slate-700 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                      placeholder="RANGE" 
                      value={currentTestEntry.normalRange} 
                      onChange={e => !isMasterSelected && setCurrentTestEntry({...currentTestEntry, normalRange: e.target.value})} 
                    />
                  </div>
                </div>
                <button type="button" onClick={handleAddTest} className="h-[60px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95">
                  Append to Report
                </button>
              </div>
            </div>

            {/* Added Tests Visualization */}
            <div className="space-y-8">
              {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                const tests = formData.categorizedResults?.[catKey as keyof CategorizedTests] || [];
                if (tests.length === 0) return null;
                return (
                  <div key={catKey} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{catLabel}</span>
                      <span className="text-[9px] font-black bg-white px-2 py-1 rounded-lg border border-slate-200">{tests.length} Parameters</span>
                    </div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white border-b border-slate-50 text-[9px] text-slate-300 font-black uppercase tracking-widest">
                          <th className="px-6 py-4">Parameter Name</th>
                          <th className="px-6 py-4">Observed Finding</th>
                          <th className="px-6 py-4">Reference Standards</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {tests.map((t, i) => (
                          <tr key={i} className="hover:bg-emerald-50/50 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold uppercase text-slate-700">{t.testName}</td>
                            <td className="px-6 py-4 text-xs font-black uppercase text-blue-900">{t.resultValue} {t.unit}</td>
                            <td className="px-6 py-4 text-[10px] font-medium text-slate-400 italic">{t.normalRange}</td>
                            <td className="px-6 py-4 text-right">
                              <button type="button" onClick={() => handleRemoveTest(catKey as keyof CategorizedTests, i)} className="text-red-200 hover:text-red-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. CLINICAL REMARKS */}
        <section className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl border-l-[12px] border-emerald-600">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Pathologist Review Area</h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mt-1">Diagnosis & Clinical Assistance</p>
              </div>
              <button type="button" disabled={loadingAI} onClick={handleAIAnalyze}
                className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center space-x-3 shadow-2xl border-2 ${
                  loadingAI ? 'bg-slate-800 border-slate-700' : 'bg-emerald-700 border-emerald-500 hover:bg-emerald-600'
                }`}>
                {loadingAI ? 'Processing Findings...' : 'Synthesize AI Insights'}
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Executive Summary (Diagnosis Hint)</label>
                <input type="text" className="w-full p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-xs font-black text-emerald-400 outline-none focus:border-emerald-600"
                  placeholder="EXECUTIVE SUMMARY" value={formData.conciseSummary} onChange={e => setFormData({...formData, conciseSummary: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clinical Remarks & Professional Advice</label>
                <textarea rows={6} className="w-full p-8 bg-slate-800 border-2 border-slate-700 rounded-[1.5rem] text-sm font-medium leading-relaxed outline-none focus:border-emerald-600"
                  placeholder="Detailed findings and advice..."
                  value={formData.otherRemarks} onChange={e => setFormData({...formData, otherRemarks: e.target.value})} />
              </div>
           </div>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end pt-10 border-t-2 border-slate-200">
           <button type="submit" className="px-24 py-6 bg-blue-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-black hover:translate-y-[-4px] transition-all">
            Lock & Finalize Official Report
           </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;