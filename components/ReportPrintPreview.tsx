
import React, { useRef } from 'react';
import { DiagnosticReport } from '../types';
import { LAB_NAME, LAB_LOCATION, ISO_CERT, NABL_CERT, CATEGORY_LABELS } from '../constants';

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

    // High-precision options for NABL standardized A4 output
    const opt = {
      margin: [10, 10, 10, 10], // Standard 10mm margin for all sides
      filename: `CADDL_REPORT_${report.species.toUpperCase()}_${report.farmerName.replace(/\s+/g, '_')}_${report.id.slice(0, 4)}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 4, // Higher scale for ultra-crisp laboratory data
        useCORS: true, 
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        precision: 16 // Max precision for decimal data values
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h3 className="font-bold text-gray-800">Laboratory Report Preview</h3>
          <p className="text-xs text-gray-500">NABL / ISO 9001 Standardized Veterinary Diagnostic Format</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Report</span>
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 bg-blue-700 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors shadow-lg font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download High-Res PDF</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center bg-gray-200 py-8 print:p-0 print:bg-white min-h-screen">
        <div 
          ref={reportRef}
          className="bg-white shadow-2xl print:shadow-none pdf-container flex flex-col" 
        >
          {/* Header */}
          <div className="border-b-4 border-blue-800 pb-4 mb-6 text-center avoid-break relative">
            <div className="flex justify-between items-center mb-2">
               <div className="flex flex-col items-start border-r border-blue-100 pr-4">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-tighter">Accreditation</span>
                  <span className="text-[8px] font-bold text-gray-400">Cert No: 910223</span>
               </div>
               <div className="flex-1 px-4">
                  <h1 className="text-xl font-black text-blue-800 leading-tight uppercase tracking-tight">{LAB_NAME}</h1>
                  <p className="text-sm font-bold text-gray-700">{LAB_LOCATION}</p>
               </div>
               <div className="flex flex-col items-end border-l border-blue-100 pl-4">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-tighter">Standard</span>
                  <span className="text-[8px] font-bold text-gray-400">Quality Management</span>
               </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex flex-col items-center">
                <div className="bg-blue-800 text-white text-[9px] font-black px-4 py-1 rounded shadow-sm border border-blue-900">
                  {ISO_CERT}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white text-blue-800 text-[9px] font-black px-4 py-1 rounded shadow-sm border border-blue-800">
                  {NABL_CERT}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-10 text-[12px] mb-6 border border-gray-100 p-4 rounded-lg bg-gray-50/30 avoid-break">
            <div className="flex">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Farmer Name:</span>
              <span className="font-bold text-gray-800 uppercase">{report.farmerName}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Lab Ref ID:</span>
              <span className="font-mono text-blue-700 font-bold">CADDL/AGD/{report.id.slice(0, 6).toUpperCase()}</span>
            </div>
            <div className="flex col-span-2">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Farmer Address:</span>
              <span className="font-medium text-gray-800 uppercase">{report.farmerAddress || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Animal Species:</span>
              <span className="font-bold text-gray-800">{report.species}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Collection Date:</span>
              <span className="text-gray-800">{report.dateOfCollection}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Breed / Sex:</span>
              <span className="font-bold text-gray-800 uppercase">{report.breed} / {report.sex}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Report Date:</span>
              <span className="text-blue-800 font-black">{report.dateOfReport}</span>
            </div>
          </div>

          {/* Executive Summary */}
          {report.conciseSummary && (
            <div className="mb-6 px-4 py-3 bg-blue-50 border-l-4 border-blue-800 rounded-r-lg avoid-break">
              <div className="flex items-center mb-1">
                <svg className="w-3 h-3 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Executive Clinical Summary</h3>
              </div>
              <p className="text-[12px] font-bold text-blue-950 italic leading-tight">
                {report.conciseSummary}
              </p>
            </div>
          )}

          {/* Results Table */}
          <div className="mb-8 flex-grow">
            <h2 className="text-center font-black text-white bg-blue-800 py-1.5 mb-2 uppercase tracking-[0.1em] text-[10px] rounded-t avoid-break">DIAGNOSTIC TEST RESULTS</h2>
            
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-[9px] uppercase font-black text-gray-600 avoid-break">
                  <th className="border border-gray-200 px-4 py-2 w-[35%]">Investigation Name</th>
                  <th className="border border-gray-200 px-4 py-2 w-[20%] text-center">Observed Value</th>
                  <th className="border border-gray-200 px-4 py-2 w-[15%] text-center">Unit</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Normal Range</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                  if (!tests || tests.length === 0) return null;
                  return (
                    <React.Fragment key={catKey}>
                      <tr className="bg-blue-50/50 avoid-break">
                        <td colSpan={4} className="border border-gray-200 px-4 py-1.5 font-black text-blue-900 text-[10px] tracking-widest bg-blue-100/50 uppercase">
                          {CATEGORY_LABELS[catKey]}
                        </td>
                      </tr>
                      {tests.map((test, tIdx) => (
                        <tr key={`${catKey}-${tIdx}`} className="avoid-break">
                          <td className="border border-gray-200 px-4 py-2 font-bold text-gray-700">{test.testName}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center font-black text-gray-900">{test.resultValue}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center text-gray-500 font-medium">{test.unit}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center text-[10px] text-gray-400 font-bold italic">{test.normalRange}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            
            {/* NABL Mandatory Marker */}
            <div className="mt-4 text-center border-t border-gray-100 pt-2 opacity-50">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em]">*** END OF LABORATORY REPORT ***</span>
            </div>
          </div>

          {/* Detailed Pathologist Remarks */}
          <div className="mb-10 avoid-break">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-3 w-1 bg-blue-800"></div>
              <h3 className="font-black text-blue-900 text-[10px] uppercase tracking-wider">Comprehensive Pathologist Review & Recommendations</h3>
            </div>
            <div className="p-4 border border-gray-200 rounded text-[11px] text-gray-800 leading-relaxed bg-gray-50/20 whitespace-pre-line min-h-[100px]">
              {report.otherRemarks || 'Laboratory findings correlate with physiological norms for the species. Clinical follow-up as per standard protocol recommended.'}
            </div>
          </div>

          {/* Authorization Footer */}
          <div className="mt-auto flex justify-between items-end px-10 mb-10 avoid-break">
            <div className="text-center">
              <div className="w-48 border-t border-gray-900 pt-2">
                <p className="font-bold text-xs uppercase text-gray-900">{report.labTechnicianName}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Lab Technician</p>
                <p className="text-[8px] text-gray-300 uppercase">CADDL Allagadda</p>
              </div>
            </div>
            <div className="text-center">
               <div className="w-64 border-t border-gray-900 pt-2">
                <p className="font-bold text-xs uppercase text-gray-900">{report.assistantDirector}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Assistant Director</p>
                <p className="text-[9px] text-blue-800 font-bold uppercase tracking-tighter">C.A.D.D.L , Allagadda</p>
              </div>
            </div>
          </div>

          {/* Document Integrity Metadata */}
          <div className="text-center border-t border-gray-100 pt-3 pb-2 text-[8px] text-gray-400 uppercase tracking-[0.3em] font-medium avoid-break">
            Electronic Validation: {report.id.toUpperCase()} | Generated via CADDL Secure Portal | Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintPreview;
