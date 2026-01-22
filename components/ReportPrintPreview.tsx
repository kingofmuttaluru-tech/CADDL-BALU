import React, { useRef } from 'react';
import { DiagnosticReport, LabTestEntry } from '../types';
import { 
  LAB_NAME, 
  LAB_LOCATION, 
  ISO_CERT, 
  NABL_CERT, 
  CATEGORY_LABELS, 
  GOVT_NAME, 
  DEPT_NAME
} from '../constants';

interface ReportPrintPreviewProps {
  report: DiagnosticReport;
}

const ReportPrintPreview: React.FC<ReportPrintPreviewProps> = ({ report }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;

    // Use html2pdf with auto-scaling to fit content to A4
    const opt = {
      margin: 0, 
      filename: `CADDL_Report_${report.animalId}_${report.id.split('-').pop()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 3, // Higher scale for better text resolution
        useCORS: true, 
        letterRendering: true,
        logging: false,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  const checkAbnormal = (value: string, range: string): boolean => {
    if (!value || !range || range === 'Observation' || range === 'Nil' || range === 'Negative') return false;
    const cleanValue = value.trim().toLowerCase();
    
    const rangeMatch = range.trim().toLowerCase().match(/([\d.]+)\s*-\s*([\d.]+)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const numValue = parseFloat(cleanValue.replace(/[^\d.]/g, ''));
      if (!isNaN(numValue)) return numValue < min || numValue > max;
    }

    const flags = ['+', '++', '+++', 'positive', 'detected', 'seen', 'found', 'present', 'high', 'low', 'reactive', 'abnormal'];
    return flags.some(f => cleanValue.includes(f));
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=CADDL-AGD-VERIFY-${report.id}`;

  return (
    <div className="space-y-4 animate-fadeIn pb-24">
      <div className="flex justify-center sm:justify-end space-x-3 no-print px-4 sticky top-20 z-40">
        <button 
          onClick={handlePrint} 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-2 group border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Direct Print (A4)
        </button>
        <button 
          onClick={handleDownloadPDF} 
          className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl hover:bg-blue-800 transition-all flex items-center gap-2 border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download PDF Report
        </button>
      </div>

      {/* A4 Report Wrapper */}
      <div ref={reportRef} className="pdf-canvas-wrapper">
        <div className="pdf-inner-content">
          <div className="flex-1 border-[1.5px] border-black p-5 flex flex-col relative overflow-hidden">
            
            {/* Header branding */}
            <div className="flex justify-between items-start border-b-[1.5px] border-black pb-3 mb-4">
              <div className="flex flex-col items-center">
                <img src={qrCodeUrl} alt="QR" className="w-16 h-16 border border-slate-100 p-0.5" />
                <span className="text-[4pt] font-black text-slate-400 mt-1 uppercase tracking-tighter">SECURE VERIFY</span>
              </div>
              
              <div className="text-center flex-1 px-4">
                <p className="text-[7.5pt] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">{GOVT_NAME}</p>
                <p className="text-[7.5pt] font-black text-blue-800 uppercase tracking-tighter leading-none mb-2">{DEPT_NAME}</p>
                <h1 className="text-[12pt] font-black text-green-800 uppercase tracking-tighter leading-tight mb-1">{LAB_NAME}</h1>
                <p className="text-[6pt] font-bold text-black uppercase tracking-widest leading-none mb-2">{LAB_LOCATION}</p>
                
                <div className="flex justify-center items-center space-x-3 text-[5.5pt] font-black uppercase">
                  <span className="text-slate-500 border border-slate-300 px-1.5 py-0.5 rounded-sm">{ISO_CERT}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-green-800">{NABL_CERT}</span>
                  </div>
                </div>
              </div>

              <div className="w-24 text-right flex flex-col items-end">
                <div className="bg-black text-white px-2 py-0.5 text-[5.5pt] font-black uppercase tracking-widest mb-1.5">OFFICIAL REPORT</div>
                <div className="text-[8.5pt] font-mono font-black text-slate-900 leading-none">REF: {report.id.split('-').pop()}</div>
                <div className="text-[6pt] font-bold text-slate-400 mt-1 uppercase">DATE: {report.dateOfReport}</div>
              </div>
            </div>

            {/* Registry Info Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border border-black p-3 bg-[#fcfdfe]">
                <h4 className="text-[7pt] font-black text-blue-900 uppercase border-b border-black mb-2 tracking-widest leading-none pb-1">REGISTRY DETAILS</h4>
                <div className="grid grid-cols-2 gap-y-1.5 text-[9.5pt] leading-none">
                  <p className="col-span-2 flex justify-between"><span className="font-black text-slate-400">OWNER:</span> <span className="font-black text-black uppercase">{report.farmerName}</span></p>
                  <p className="col-span-2 flex justify-between border-b border-slate-50 pb-1"><span className="font-black text-slate-400">LOCATION:</span> <span className="font-bold uppercase text-slate-700">{report.village || 'ALLAGADDA'}</span></p>
                  <p className="flex justify-between pr-3"><span className="font-black text-slate-400">TAG ID:</span> <span className="font-black text-blue-900">{report.animalId}</span></p>
                  <p className="flex justify-between pl-3 border-l border-slate-200"><span className="font-black text-slate-400">SPECIES:</span> <span className="font-bold uppercase text-slate-700">{report.species}</span></p>
                  <p className="flex justify-between pr-3"><span className="font-black text-slate-400">BREED:</span> <span className="font-bold uppercase text-slate-700 truncate">{report.breed || 'N/A'}</span></p>
                  <p className="flex justify-between pl-3 border-l border-slate-200"><span className="font-black text-slate-400">AGE/SEX:</span> <span className="font-bold uppercase text-slate-700">{report.age || 'N/A'} / {report.sex.toUpperCase()}</span></p>
                </div>
              </div>

              <div className="border border-black p-3 bg-[#f8fafc]">
                <h4 className="text-[7pt] font-black text-slate-700 uppercase border-b border-black mb-2 tracking-widest leading-none pb-1">REFERENCE INFO</h4>
                <div className="grid grid-cols-1 gap-y-1.5 text-[9.5pt] leading-none">
                  <p className="flex justify-between"><span className="font-black text-slate-400">DOCTOR:</span> <span className="font-black uppercase text-slate-900 truncate max-w-[130px]">{report.referringDoctor || 'N/A'}</span></p>
                  <p className="flex justify-between"><span className="font-black text-slate-400">HOSPITAL:</span> <span className="font-bold uppercase text-slate-800 truncate max-w-[130px]">{report.hospitalName || 'N/A'}</span></p>
                  <p className="flex justify-between border-t border-slate-100 pt-1 mt-1"><span className="font-black text-slate-400">SAMPLE:</span> <span className="font-bold uppercase text-emerald-700">{report.sampleType}</span></p>
                  <p className="flex justify-between"><span className="font-black text-slate-400">COLLECTED:</span> <span className="font-bold uppercase text-slate-800">{report.dateOfCollection}</span></p>
                </div>
              </div>
            </div>

            {/* Test Results Table Block */}
            <div className="flex-1 min-h-0">
              <h4 className="text-[8pt] font-black text-black uppercase border-b-[1.5px] border-black mb-2 tracking-widest bg-slate-50 px-2 py-1 leading-none">
                LABORATORY INVESTIGATION FINDINGS
              </h4>
              <div className="space-y-4">
                {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                  const testEntries = tests as LabTestEntry[];
                  if (!testEntries || testEntries.length === 0) return null;
                  return (
                    <div key={catKey} className="mb-4">
                      <div className="bg-slate-900 text-white px-3 py-1 text-[7pt] font-black uppercase tracking-widest">
                        {CATEGORY_LABELS[catKey]}
                      </div>
                      <table className="nabl-table">
                        <thead>
                          <tr>
                            <th className="w-[45%] text-left">PARAMETER</th>
                            <th className="w-[18%] text-center">RESULT</th>
                            <th className="w-[12%] text-center">UNIT</th>
                            <th className="w-[25%] text-center">NORMAL RANGE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testEntries.map((test, idx) => {
                            const abnormal = checkAbnormal(test.resultValue, test.normalRange);
                            return (
                              <tr key={idx}>
                                <td className="font-bold uppercase text-slate-700">{test.testName}</td>
                                <td className={`text-center font-black ${abnormal ? 'text-red-700 bg-red-50' : 'text-slate-900'}`}>
                                  {test.resultValue}
                                </td>
                                <td className="text-center text-slate-500">{test.unit || '--'}</td>
                                <td className="text-center italic text-slate-400 font-medium">{test.normalRange}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pathologist Interpretation Area */}
            <div className="mt-4 border-t-[1.5px] border-black pt-4">
              <h4 className="text-[8.5pt] font-black uppercase mb-1.5 tracking-widest text-slate-900 leading-none">INTERPRETATIVE REMARKS</h4>
              <div className="bg-[#fefefe] border border-slate-300 p-3 text-[9.5pt] font-medium text-slate-800 leading-snug italic shadow-inner">
                {report.otherRemarks || 'Laboratory investigation revealed no detectable abnormalities within investigation limits.'}
              </div>
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100">
                 <p className="text-[9pt] font-black text-emerald-900 uppercase tracking-tight leading-none">
                   SUMMARY: [{report.conciseSummary || 'NORMAL FINDINGS'}]
                 </p>
              </div>
            </div>

            {/* Footer Signatures Area */}
            <div className="mt-auto pt-8 pb-2 flex justify-between items-end border-t border-slate-100">
              <div className="w-[240px] text-center">
                 <div className="w-full border-t border-black pt-2">
                   <div className="font-black text-[9pt] uppercase leading-none text-slate-900">S BALA RAJU</div>
                   <div className="text-[7pt] font-black text-slate-400 uppercase leading-none mt-1 tracking-widest">LAB TECHNICIAN</div>
                   <div className="text-[6.5pt] font-bold text-slate-400 uppercase leading-none mt-1">C.A.D.D.L ,ALLAGADDA</div>
                 </div>
              </div>
              
              <div className="flex flex-col items-center justify-center opacity-30">
                 <div className="w-14 h-14 border border-slate-300 border-dashed rounded-full flex items-center justify-center text-[4pt] text-slate-400 font-black uppercase rotate-[-15deg] leading-none text-center">
                    CADDL<br/>OFFICIAL<br/>SEAL
                 </div>
              </div>
              
              <div className="w-[240px] text-center">
                 <div className="w-full border-t border-black pt-2">
                   <div className="font-black text-[9pt] uppercase leading-none text-slate-900">DR. M. Y. VARA PRASAD</div>
                   <div className="text-[7pt] font-black text-slate-600 uppercase leading-none mt-1 tracking-widest">ASSISTANT DIRECTOR</div>
                   <div className="text-[7.5pt] font-black uppercase text-blue-900 mt-1 leading-none tracking-tighter">CADDL ALLAGADDA</div>
                 </div>
              </div>
            </div>

            {/* Final Footnote */}
            <div className="mt-4 pt-2 border-t border-slate-100 text-[5pt] text-slate-400 font-bold uppercase tracking-[0.2em] text-center italic leading-none">
              DIGITAL COPY GENERATED VIA CADDL ADMIN HUB. SINGLE PAGE OFFICIAL REPORT.
            </div>
            
            {/* Authenticity Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] rotate-[-45deg] whitespace-nowrap text-[80pt] font-black text-slate-900 select-none uppercase tracking-[0.4em]">
              CADDL ALLAGADDA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintPreview;