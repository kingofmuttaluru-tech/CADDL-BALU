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

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    // Sanitize farmer name for filename
    const safeName = report.farmerName.trim().replace(/[^a-z0-9]/gi, '_').toUpperCase();
    const fileName = `CADDL_REPORT_${safeName}_${report.animalId}_${report.id.split('-').pop()}.pdf`;

    // Robust PDF configuration for full A4 single page capture
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // 2 is stable and high-quality for A4
        useCORS: true, 
        logging: false,
        letterRendering: true,
        backgroundColor: '#FFFFFF',
        scrollY: -window.scrollY // Fixes half-page issues by accounting for current scroll
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Use html2pdf with the standard flow to ensure full content capture
      // @ts-ignore
      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation error. Please try clicking 'Direct Print' and choosing 'Save as PDF' in the browser print dialog.");
    }
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

  const apGovLogo = "https://upload.wikimedia.org/wikipedia/commons/3/37/Emblem_of_Andhra_Pradesh.svg";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${report.id}`;

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
          Download PDF (A4 Single Page)
        </button>
      </div>

      <div className="pdf-canvas-wrapper shadow-none no-print overflow-hidden">
        <div ref={reportRef} className="pdf-page-content">
          {/* Watermark */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] w-[140mm] h-[140mm] z-0 flex items-center justify-center">
             <div className="text-[140pt] font-black text-slate-400 rotate-[-45deg] select-none tracking-tighter">CADDL</div>
          </div>

          <div className="pdf-inner-padding z-10">
            {/* Header Section */}
            <div className="flex justify-between items-start pb-3 mb-2 border-b border-slate-100 flex-shrink-0">
              <div className="w-[80px] pt-1 flex flex-col items-center">
                <img src={apGovLogo} alt="Emblem" className="w-14 h-14 object-contain mb-1" />
                <span className="text-[5pt] font-black text-slate-300 uppercase tracking-tighter">Verified Official</span>
              </div>
              
              <div className="text-center flex-1 px-4 pt-1">
                <p className="text-[7.5pt] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">{GOVT_NAME}</p>
                <p className="text-[6.5pt] font-black text-blue-800 uppercase tracking-tighter leading-none mb-2">{DEPT_NAME}</p>
                <h1 className="text-[10.5pt] font-black text-green-800 uppercase tracking-tighter leading-tight mb-1.5">CONSTITUENCY ANIMAL DISEASE DIAGNOSTIC LABORATORY (CADDL)</h1>
                <p className="text-[5.5pt] font-black text-black uppercase tracking-widest leading-none mb-2">{LAB_LOCATION}</p>
                <div className="flex justify-center items-center space-x-3 text-[5.5pt] font-black uppercase">
                  <span className="text-slate-500 border border-slate-300 px-2 py-0.5 rounded-sm">{ISO_CERT}</span>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-green-800">{NABL_CERT}</span>
                  </div>
                </div>
              </div>

              <div className="w-[130px] flex flex-col items-end pt-1 flex-shrink-0">
                <div className="flex gap-2 items-start mb-2">
                  <div className="border border-slate-200 p-0.5 bg-white shadow-sm">
                    <img src={qrCodeUrl} alt="Report QR" className="w-12 h-12" />
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-black text-white px-2 py-1 text-[5pt] font-black uppercase tracking-widest mb-1.5 w-20 text-center">OFFICIAL REPORT</div>
                    <p className="text-[6.5pt] font-black text-slate-800 uppercase tracking-tighter leading-none">REF: <span className="text-slate-900">{report.id.split('-').pop()}</span></p>
                    <p className="text-[5pt] font-black text-slate-400 uppercase tracking-tighter mt-1">DATE: {report.dateOfReport}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registry Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">
              <div className="border border-black p-3 bg-slate-50/20">
                <h4 className="text-[7pt] font-black text-blue-900 uppercase border-b border-black mb-2 tracking-widest leading-none pb-1">REGISTRY DETAILS</h4>
                <div className="grid grid-cols-1 gap-y-1.5 text-[8.5pt] leading-tight">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">OWNER:</span> 
                    <div className="text-right">
                      <div className="font-black text-black uppercase">{report.farmerName || 'N/A'}</div>
                      <div className="text-[7.5pt] font-bold text-blue-700">{report.mobileNumber || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline gap-2 border-t border-slate-100 pt-1">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">S/o OR FORMER:</span> 
                    <span className="font-black uppercase text-slate-900 truncate text-right text-[8pt]">{report.fatherName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-start gap-2 border-t border-slate-100 pt-1">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">ADDRESS:</span> 
                    <span className="font-bold uppercase text-slate-700 text-right text-[7.5pt]">
                      {report.village}, {report.mandal}, {report.district}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 border-t-2 border-slate-200 pt-2 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[5.5pt] font-black text-slate-400 uppercase leading-none mb-1">TAG ID</span> 
                      <span className="font-black text-blue-900 text-[8pt]">{report.animalId || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-2">
                      <span className="text-[5.5pt] font-black text-slate-400 uppercase leading-none mb-1">SPECIES</span> 
                      <span className="font-bold uppercase text-slate-700 text-[8pt]">{report.species || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-2">
                      <span className="text-[5.5pt] font-black text-slate-400 uppercase leading-none mb-1">AGE</span> 
                      <span className="font-bold uppercase text-slate-900 text-[8pt]">{report.age || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-black p-3 bg-slate-50/20">
                <h4 className="text-[7pt] font-black text-slate-700 uppercase border-b border-black mb-2 tracking-widest leading-none pb-1">REFERENCE INFO</h4>
                <div className="grid grid-cols-1 gap-y-2 text-[8.5pt] leading-tight">
                  <p className="flex justify-between items-baseline border-b border-slate-100 pb-1 gap-2">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">DOCTOR:</span> 
                    <span className="font-black uppercase text-slate-900 truncate text-right text-[8pt]">{report.referringDoctor || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between items-baseline border-b border-slate-100 pb-1 gap-2">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">HOSPITAL:</span> 
                    <span className="font-bold uppercase text-slate-800 truncate text-right text-[7.5pt]">{report.hospitalName || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between items-baseline gap-2">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">SAMPLE TYPE:</span> 
                    <span className="font-black uppercase text-emerald-700 truncate text-right text-[8pt]">{report.sampleType || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between items-baseline gap-2 border-t border-slate-100 pt-1">
                    <span className="text-[6.5pt] font-black text-slate-400 uppercase whitespace-nowrap">COLLECTION:</span> 
                    <span className="font-bold uppercase text-slate-600 truncate text-right text-[7.5pt]">{report.dateOfCollection || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Main Investigation Section */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <h4 className="text-[8pt] font-black text-black uppercase border-b border-black mb-2 tracking-widest bg-slate-50 px-3 py-1.5 flex-shrink-0 leading-none">
                LABORATORY INVESTIGATION FINDINGS
              </h4>
              <div className="space-y-3 overflow-hidden flex-grow">
                {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                  const testEntries = tests as LabTestEntry[];
                  if (!testEntries || testEntries.length === 0) return null;
                  return (
                    <div key={catKey} className="mb-2 flex flex-col">
                      <div className="bg-slate-900 text-white px-3 py-1 text-[6.5pt] font-black uppercase tracking-widest flex-shrink-0">
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
                          {testEntries.map((test, idx) => (
                            <tr key={idx}>
                              <td className="font-bold uppercase text-slate-700 text-[8pt]">{test.testName}</td>
                              <td className={`text-center font-black text-[8.5pt] ${checkAbnormal(test.resultValue, test.normalRange) ? 'text-red-700' : 'text-slate-900'}`}>
                                {test.resultValue}
                              </td>
                              <td className="text-center text-slate-500 text-[7pt]">{test.unit || '--'}</td>
                              <td className="text-center italic text-slate-400 font-medium text-[7pt]">{test.normalRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Remarks Section */}
            <div className="mt-4 pt-3 border-t border-black flex-shrink-0">
              <h4 className="text-[8.5pt] font-black uppercase mb-1 tracking-widest text-slate-900 leading-none">INTERPRETATIVE REMARKS</h4>
              <div className="bg-white border border-slate-200 p-3 text-[8pt] font-medium text-slate-800 leading-tight italic shadow-inner mb-2 min-h-[60px]">
                {report.otherRemarks || 'Investigation revealed no detectable abnormalities within current limits.'}
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 flex-shrink-0">
                 <p className="text-[8.5pt] font-black text-emerald-900 uppercase tracking-tight leading-none">
                   SUMMARY: [{report.conciseSummary || 'NORMAL FINDINGS'}]
                 </p>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="mt-auto pb-2 border-t border-black flex-shrink-0">
              <div className="grid grid-cols-2 gap-8 items-end text-center relative pt-5">
                <div className="flex flex-col items-center">
                   <div className="w-4/5 border-t border-slate-300 pt-2 font-black text-[9pt] uppercase leading-none text-slate-900 mb-1">{report.labTechnician || 'S BALA RAJU'}</div>
                   <div className="text-[6.5pt] font-bold text-slate-400 uppercase leading-none">LAB TECHNICIAN</div>
                   <div className="text-[5.5pt] text-slate-300 font-bold uppercase mt-1">C.A.D.D.L ,ALLAGADDA</div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 opacity-[0.2] pointer-events-none">
                  <div className="w-16 h-16 border-2 border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center text-center">
                    <span className="text-[5pt] font-black text-slate-500 leading-none uppercase">CADDL</span>
                    <span className="text-[4pt] font-bold text-slate-400 leading-none uppercase">OFFICIAL SEAL</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                   <div className="w-4/5 border-t border-slate-300 pt-2 font-black text-[9pt] uppercase leading-none text-slate-900 mb-1">{report.assistantDirector || 'Dr. C. H. Chandra Mohan Reddy'}</div>
                   <div className="text-[6.5pt] font-bold text-slate-600 uppercase leading-none">ASSISTANT DIRECTOR</div>
                   <div className="text-[5.5pt] text-blue-900 font-black uppercase mt-1 tracking-tighter">CADDL ALLAGADDA</div>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-1 border-t border-slate-100 text-[5pt] text-slate-400 font-bold uppercase tracking-[0.2em] text-center italic leading-none flex-shrink-0">
              DIGITAL COPY GENERATED VIA CADDL ADMIN HUB. SINGLE PAGE OFFICIAL REPORT.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintPreview;