
import React, { useRef, useState } from 'react';
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

/**
 * Standalone dynamic header component to handle multi-page repetition and scaling.
 */
const RepeatingHeader: React.FC<{ report: DiagnosticReport }> = ({ report }) => {
  return (
    <div className="pb-2 mb-4 text-center w-full bg-white flex flex-col items-center border-b border-dashed border-gray-300">
      <div className="flex flex-col items-center w-full pt-4">
        <p className="text-[16pt] md:text-[22px] font-black text-black uppercase tracking-[0.05em] mb-1 leading-tight">
          {GOVT_NAME}
        </p>
        <p className="text-[16pt] md:text-[22px] font-black text-black uppercase tracking-[0.05em] mb-1 leading-tight">
          {DEPT_NAME}
        </p>
        <h1 className="text-[16pt] md:text-[20px] font-black text-black uppercase leading-tight tracking-tight mb-2">
          {LAB_NAME}
        </h1>
        <p className="text-[10pt] md:text-[14px] font-bold text-gray-800 border-t border-gray-200 pt-1 w-full max-w-2xl">
          {LAB_LOCATION}
        </p>
      </div>
      
      <div className="flex justify-between items-center mt-4 mb-4 px-8 w-full max-w-4xl">
        <div className="bg-black text-white text-[9px] font-black px-4 py-1 rounded-full shadow-sm">{ISO_CERT}</div>
        <div className="bg-white text-black text-[9px] font-black px-4 py-1 rounded-full border-2 border-black shadow-sm">{NABL_CERT}</div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-[11px] border-t border-b-4 border-black py-3 text-left w-full bg-slate-50/50 px-4 mb-2">
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Farmer Name:</span>
          <span className="font-bold text-gray-900 uppercase">{report.farmerName}</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Lab Ref ID:</span>
          <span className="font-mono text-black font-bold uppercase tracking-tighter">CADDL/AGD/{report.id.slice(0, 6)}</span>
        </div>
        <div className="flex items-start col-span-1">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Farmer Address:</span>
          <span className="font-medium text-gray-700 uppercase leading-tight">{report.farmerAddress || 'Not Provided'}</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Referring Doctor:</span>
          <span className="font-bold text-black uppercase tracking-tight">{report.referringDoctor || 'Field VAS'}</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Species/Breed:</span>
          <span className="font-bold text-gray-900">{report.species} ({report.breed})</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Age / Sex:</span>
          <span className="font-bold text-gray-900 uppercase">{report.age} / {report.sex}</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Collection Date:</span>
          <span className="text-gray-800 font-medium">{report.dateOfCollection}</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold w-32 text-gray-500 uppercase text-[9px]">Report Date:</span>
          <span className="text-black font-black">{report.dateOfReport}</span>
        </div>
      </div>
    </div>
  );
};

const ReportPrintPreview: React.FC<ReportPrintPreviewProps> = ({ report }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `Report_${report.species}_${report.farmerName.replace(/\s+/g, '_')}_${report.id.slice(0, 4)}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2.5,
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  /**
   * Enhanced abnormal detection logic.
   * Handles numeric ranges, inequalities, and categorical results (Negative/Positive).
   */
  const checkAbnormal = (value: string, range: string): boolean => {
    if (!value || !range) return false;
    
    const cleanValue = value.trim().toLowerCase();
    const cleanRange = range.trim().toLowerCase();

    // Skip if range is purely descriptive or generic
    if (['observation', 'normal', 'variable', 'nil', '-'].includes(cleanRange) && cleanValue === cleanRange) return false;
    if (cleanRange === 'observation' || cleanRange === 'normal') return false;

    // Define categorical markers
    const negatives = ['nil', 'negative', 'no growth', 'not detected', 'absent'];
    const positives = ['positive', 'detected', 'found', 'seen', 'presence', '+', '++'];

    // 1. Handle Categorical Ranges (Expected Negative)
    const rangeIsNegative = negatives.some(n => cleanRange.includes(n));
    if (rangeIsNegative) {
      // Flag as abnormal if result contains any positive indicator
      if (positives.some(p => cleanValue.includes(p))) return true;
      // If result is not a recognized negative and contains numbers (like "1-2 / hpf"), flag as abnormal
      if (!negatives.some(n => cleanValue.includes(n)) && /\d/.test(cleanValue)) return true;
      return false;
    }

    // 2. Handle Numeric Ranges (e.g., "8.0 - 15.0")
    const rangeMatch = cleanRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const valMatch = cleanValue.match(/[\d.]+/);
      if (valMatch) {
        const numValue = parseFloat(valMatch[0]);
        if (!isNaN(numValue)) return numValue < min || numValue > max;
      }
    }

    // 3. Handle Inequalities (e.g., "< 200000", "> 50")
    const ineqMatch = cleanRange.match(/([<>]=?)\s*([\d,.]+)/);
    if (ineqMatch) {
      const op = ineqMatch[1];
      const threshold = parseFloat(ineqMatch[2].replace(/,/g, ''));
      const valMatch = cleanValue.match(/[\d.]+/);
      if (valMatch) {
        const numValue = parseFloat(valMatch[0].replace(/,/g, ''));
        if (!isNaN(numValue)) {
          if (op === '<') return numValue >= threshold;
          if (op === '<=') return numValue > threshold;
          if (op === '>') return numValue <= threshold;
          if (op === '>=') return numValue < threshold;
        }
      }
    }

    return false;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
        <div>
          <h3 className="font-bold text-gray-800">Laboratory Report Preview</h3>
          <p className="text-xs text-gray-500 text-black font-semibold italic">Official Page Border & Header Repetition Enabled</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handlePrint} className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span>Print</span>
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center space-x-2 bg-black text-white px-8 py-2.5 rounded-lg hover:bg-gray-900 transition-all shadow-xl font-black uppercase tracking-widest text-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Download PDF ({report.species})</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center bg-gray-300 py-10 print:p-0 print:bg-white overflow-x-auto">
        <div ref={reportRef} className="bg-white shadow-2xl print:shadow-none pdf-container flex flex-col relative overflow-visible official-border" id="report-capture-area">
          <table className="w-full border-collapse">
            <thead className="display-table-header-group">
              <tr>
                <td>
                  <RepeatingHeader report={report} />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pt-2 px-2">
                  <div className="px-1">
                    {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                      if (!tests || tests.length === 0) return null;
                      return (
                        <div key={catKey} className="mb-6 avoid-break">
                          <h4 className="text-[10px] font-black text-black uppercase tracking-[0.15em] bg-gray-50 p-2 mb-2 border-l-4 border-black rounded-sm">
                            {CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS]}
                          </h4>
                          <table className="w-full text-[11px] border-collapse">
                            <thead>
                              <tr className="border-b-2 border-black text-gray-950 text-left">
                                <th className="py-1.5 px-2 font-black uppercase text-[9px]">Investigation Parameter</th>
                                <th className="py-1.5 px-2 font-black uppercase text-[9px] text-center">Observed Value</th>
                                <th className="py-1.5 px-2 font-black uppercase text-[9px] text-center">Unit</th>
                                <th className="py-1.5 px-2 font-black uppercase text-[9px] text-center">Reference Range</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {tests.map((test, idx) => {
                                const isAbnormal = checkAbnormal(test.resultValue, test.normalRange);
                                return (
                                  <tr key={idx} className={`text-gray-800 ${isAbnormal ? 'bg-red-50/20 print:bg-red-50/20' : ''}`}>
                                    <td className="py-2 px-2 font-bold uppercase text-[11px]">{test.testName}</td>
                                    <td className={`py-2 px-2 text-center font-black text-[12px] relative ${isAbnormal ? 'text-red-700 font-black' : 'text-black'}`}>
                                      {test.resultValue}
                                      {isAbnormal && <span className="ml-1 text-[9px] text-red-600 font-black italic align-top">*</span>}
                                    </td>
                                    <td className="py-2 px-2 text-center text-gray-500 font-medium">{test.unit}</td>
                                    <td className="py-2 px-2 text-center text-gray-400 font-bold italic tracking-tighter">{test.normalRange}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}

                    {report.otherRemarks && (
                      <div className="mt-8 avoid-break">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 border-b pb-1">Pathologist Remarks & Clinical Recommendations</h4>
                        <div className="text-[11px] text-gray-700 whitespace-pre-wrap font-medium leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100 italic">
                          {report.otherRemarks}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-16 avoid-break pt-10 border-t border-gray-100 pb-10 px-4">
                    <div className="text-center flex flex-col items-center">
                      <div className="w-40 h-0.5 bg-gray-300 mb-2"></div>
                      <p className="text-[10px] font-black text-gray-900 uppercase">{report.labTechnicianName}</p>
                      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Lab Technician<br/>(CADDL Allagadda)</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="w-40 h-0.5 bg-gray-300 mb-2"></div>
                      <p className="text-[10px] font-black text-gray-900 uppercase">{report.assistantDirector}</p>
                      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Assistant Director (Admin)<br/>(CADDL Allagadda)</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center avoid-break pt-4 pb-4">
                    <div className="text-center text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] w-full mt-2 border-t border-gray-50 pt-4 px-4">
                      *** End of Official Veterinary Diagnostic Report ***
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .pdf-container { 
            width: 210mm !important;
            padding: 10mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
          }
          .avoid-break { page-break-inside: avoid; }
          thead { display: table-header-group; }
          .official-border {
             border: 5px double #000000 !important;
             box-sizing: border-box !important;
          }
        }
        .pdf-container {
          width: 210mm;
          min-height: 297mm;
          padding: 12mm;
          margin: 0 auto;
          background-color: white;
          box-sizing: border-box;
          position: relative;
        }
        .official-border {
          border: 4px double #000000;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #000000;
        }
        .display-table-header-group {
          display: table-header-group;
        }
      `}</style>
    </div>
  );
};

export default ReportPrintPreview;
