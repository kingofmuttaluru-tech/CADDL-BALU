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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;

    // Critical configuration for single page A4
    const opt = {
      margin: 0, 
      filename: `CADDL_Report_${report.animalId}_${report.id.split('-').pop()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        width: 794, // Standard A4 width in pixels at 96 DPI
        height: 1123, // Standard A4 height in pixels at 96 DPI
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
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

    const flags = ['+', '++', '+++', 'positive', 'detected', 'seen', 'found', 'present', 'high', 'low', 'reactive'];
    return flags.some(f => cleanValue.includes(f));
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CADDL-VERIFY-${report.id}`;

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      <div className="flex justify-end space-x-4 no-print px-4">
        <button onClick={handlePrint} className="bg-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          Print
        </button>
        <button onClick={handleDownloadPDF} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          Download Completed A4 PDF
        </button>
      </div>

      {/* Strict A4 Pixel-Perfect Wrapper */}
      <div ref={reportRef} className="pdf-canvas-wrapper bg-white">
        <div className="pdf-inner-content">
          
          {/* Double Boundary Frame */}
          <div className="flex-1 border-[2.5px] border-double border-black p-3 flex flex-col overflow-hidden">
            
            {/* COMPACT HEADER */}
            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
              <div className="w-16 h-16">
                <img src={qrCodeUrl} alt="QR" className="w-full h-full object-contain" />
              </div>
              <div className="text-center flex-1">
                {/* Updated GOVT_NAME and DEPT_NAME to be same size and font-black */}
                <p className="text-[8pt] font-black text-blue-900 uppercase tracking-[0.15em] leading-none mb-1">{GOVT_NAME}</p>
                <p className="text-[8pt] font-black text-blue-900 uppercase tracking-[0.15em] leading-none mb-1">{DEPT_NAME}</p>
                <h1 className="text-[12pt] font-black text-green-800 uppercase tracking-tighter leading-none mb-1">{LAB_NAME}</h1>
                <p className="text-[6.5pt] font-bold text-black uppercase tracking-widest leading-none">{LAB_LOCATION}</p>
                <div className="flex justify-center space-x-4 mt-1 text-[6pt] font-black text-slate-400 uppercase">
                  <span>{ISO_CERT}</span>
                  <span className="text-green-700">{NABL_CERT}</span>
                </div>
              </div>
              <div className="w-16 text-right">
                <div className="text-[6pt] font-black bg-black text-white px-1 py-0.5 inline-block uppercase mb-1">OFFICIAL</div>
                <div className="text-[7pt] font-mono font-bold leading-tight uppercase">S/N: {report.id.split('-').pop()}</div>
              </div>
            </div>

            {/* INFO GRID - COMPRESSED */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="border border-black p-2 bg-slate-50">
                <h4 className="text-[7pt] font-black text-blue-900 uppercase border-b border-black mb-1 tracking-widest">FARMER & PATIENT IDENTIFICATION</h4>
                <div className="grid grid-cols-2 gap-x-2 text-[8pt] leading-tight">
                  <p className="col-span-2"><span className="font-black">FARMER NAME:</span> <span className="font-bold uppercase">{report.farmerName}</span></p>
                  <p><span className="font-black">TAG ID:</span> <span className="font-black">[{report.animalId}]</span></p>
                  <p><span className="font-black">SPECIES:</span> <span className="uppercase">{report.species}</span></p>
                  <p><span className="font-black">AGE:</span> <span className="uppercase">{report.age || 'N/A'}</span></p>
                  <p><span className="font-black">SEX:</span> <span className="uppercase">{report.sex}</span></p>
                  <p className="col-span-2"><span className="font-black">VILLAGE:</span> <span className="uppercase">{report.village || 'N/A'}</span></p>
                  <p className="col-span-2"><span className="font-black">BREED:</span> <span className="uppercase font-bold">{report.breed || 'UNDISCLOSED'}</span></p>
                </div>
              </div>
              <div className="border border-black p-2 bg-slate-100">
                <h4 className="text-[7pt] font-black text-slate-700 uppercase border-b border-black mb-1 tracking-widest">DIAGNOSTIC REFERENCE DATA</h4>
                <div className="grid grid-cols-1 gap-y-0.5 text-[7.5pt] leading-tight">
                  <p><span className="font-black w-24 inline-block">REF DOCTOR:</span> <span className="uppercase font-bold">{report.referringDoctor || 'N/A'}</span></p>
                  <p><span className="font-black w-24 inline-block">HOSPITAL:</span> <span className="uppercase">{report.hospitalName || 'N/A'}</span></p>
                  <p><span className="font-black w-24 inline-block">SAMPLE TYPE:</span> <span className="uppercase">{report.sampleType}</span></p>
                  <p><span className="font-black w-24 inline-block">REPORT DATE:</span> <span className="font-bold text-blue-900">{report.dateOfReport}</span></p>
                </div>
              </div>
            </div>

            {/* LABORATORY FINDINGS - SCALABLE SPACE */}
            <div className="flex-1 min-h-0">
              <h4 className="text-[8pt] font-black text-black uppercase border-b-2 border-black mb-1 tracking-widest">LABORATORY INVESTIGATION RESULTS</h4>
              <div className="space-y-1">
                {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                  const testEntries = tests as LabTestEntry[];
                  if (!testEntries || testEntries.length === 0) return null;
                  return (
                    <div key={catKey} className="avoid-break">
                      <div className="bg-slate-900 text-white p-0.5 px-2 text-[6.5pt] font-black uppercase tracking-widest">
                        {CATEGORY_LABELS[catKey]}
                      </div>
                      <table className="nabl-table">
                        <thead>
                          <tr>
                            <th className="w-[45%] text-left">PARAMETER</th>
                            <th className="w-[20%] text-center">RESULT</th>
                            <th className="w-[15%] text-center">UNIT</th>
                            <th className="w-[20%] text-center">REF RANGE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testEntries.map((test, idx) => {
                            const abnormal = checkAbnormal(test.resultValue, test.normalRange);
                            return (
                              <tr key={idx}>
                                <td className="font-bold uppercase">{test.testName}</td>
                                <td className={`text-center font-black ${abnormal ? 'text-red-700 underline decoration-double' : ''}`}>{test.resultValue}</td>
                                <td className="text-center">{test.unit || '--'}</td>
                                <td className="text-center italic text-slate-500 font-medium">{test.normalRange}</td>
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

            {/* REMARKS - COMPACT FIXED HEIGHT */}
            <div className="mt-2 border-t border-black pt-2">
              <h4 className="text-[8pt] font-black uppercase mb-1 tracking-widest">CLINICAL OBSERVATIONS & ADVICE</h4>
              <div className="bg-slate-50 border border-slate-300 p-2 text-[8pt] font-medium text-slate-800 leading-snug min-h-[45px] max-h-[85px] overflow-hidden">
                {report.otherRemarks || 'No diagnostic abnormalities detected in the submitted sample for the parameters investigated.'}
              </div>
              <div className="mt-1 p-1 bg-green-50 border border-green-200">
                 <p className="text-[7.5pt] font-black text-green-900 uppercase">
                   SUMMARY: [{report.conciseSummary || 'NORMAL FINDINGS'}]
                 </p>
              </div>
            </div>

            {/* SIGNATURES - LOCKED AT BOTTOM */}
            <div className="mt-auto grid grid-cols-3 gap-2 items-end text-center pt-4">
              <div className="space-y-3">
                 <div className="border-t border-black pt-1 font-black text-[7.5pt] uppercase leading-none">LAB TECHNICIAN</div>
                 <div className="text-[6.5pt] font-bold text-slate-500 uppercase leading-none">{report.labTechnician}</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-10 h-10 border border-slate-300 border-dashed rounded-full flex items-center justify-center text-[4pt] text-slate-300 font-black mb-1 uppercase rotate-[-15deg]">SEAL</div>
                 <div className="text-[5pt] font-bold text-slate-400 uppercase tracking-widest leading-none">AUTHENTIC COPY</div>
              </div>
              <div className="space-y-3">
                 <div className="border-t border-black pt-1 font-black text-[7.5pt] uppercase leading-none">{report.assistantDirector}</div>
                 <div className="text-[7pt] font-bold text-slate-600 uppercase leading-none">ASSISTANT DIRECTOR</div>
                 <div className="text-[6.5pt] font-black uppercase text-blue-900 mt-0.5 leading-none">CADDL ALLAGADDA</div>
              </div>
            </div>

            <div className="mt-2 pt-1 border-t border-slate-200 text-[5pt] text-slate-400 font-bold uppercase tracking-widest text-center italic">
              Disclaimer: Diagnostic assistance only. Clinical correlation by a Registered Veterinarian is mandatory.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintPreview;