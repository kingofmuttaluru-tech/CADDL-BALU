
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

  // Official AP Government Logo Base64
  const apGovtLogo = "data:image/png;base64,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f+r/uP6k/zX9v6h/Xf2/Uv/L9f9K/Yvqv6D+X9f/pP4v6v+6/qf1f1H/T9W/qP6f6l9S/9/U/0n9P1H/E/qfpn9x/V+v/09S/5P6v67/T9T/A/U/Xf9Z9f9A/Z+u/2n1v1v9z9T/PPU/oP5r9X9P/Qfof6n+v6r/YPUfrv8f6r9F/S9Y/631/6T/B+p/uP636/9U/0vW/7X6v6L+r6p/Sf1P178n6X/O+u9S/3v6v9T/O/V/Wv/79P+r/h3176p/Xf2v6P9N/f+v/p/p/7n+X+n/Tf1f1f9z9f9S/wvWv6z+pfW/ov/H6v+K/t+s/1n979L/bf2v6f8P9f9I/c/W/8z6P6/+M+p/Wv/n0v97/X+S/uf0v09/uv6r+v+5/uepf7v6v6r/v+p/uf6z6l9U/3v0+6D/G/2vVf+v6n9X/Y9S/+fVf0H9/67/Wf0/Vf+T+r+u/kX1f17/O/V/W/9L6t+z/nfVv6P+XfXvXf89679L/V+v/67636L/u+u/Vf89679f/Xerf3v9P+jfd/3v1L9p/V9S/z3676p/R/1v6f+v9T+h/9fqf0T/X6f/Of3/Xv+L9P9O/bvV/776L9W/Wv3vVv9N/W/Vf3X9N9d/tv4f9H9b/9X1/1T9v6D/i/qfrf9u/df7f6f/v6n/Lfrvrv/T6v+u/m/pP67/F/2X1v8z/R7p/zX9HtP/Pv2fUf8j+v+B+h+p/6P6X6z/efrvUf9C9X9Z/Uv759S/q/6d9XutX9u/oP799L+if1v9W+ufS/+6+vfSv67+PfWvo98v/f6ZfudUvz76vdXvun5N/f7q96vO71v9T6v+R+of9O9A/S/Uf5P+X+p+R++9GvveKPeuP2K3f6Sj7+8X/63of77/+7l/Xef7i/9Y7f0j9h97f//1/v7l4ev9XOP/8fXv778O/3W97znW8f8u+p9S/4P+Z6Y/3T+m32f93unXUf976t9Rf47+9vRvUv/m9Of0Z9Z/u35t/fH60/Xf6p9Vf7P6N9W/uH79Xf1L69fXv6H+fP0v6t9W/7b6f6L+L+nPV/+f/X8B8yXpSrePgwAAAABJRU5ErkJggg==";

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
               {/* AP GOVT LOGO replaces previous Accreditation block */}
               <div className="flex items-center border-r border-blue-100 pr-4">
                  <img src={apGovtLogo} alt="Government of Andhra Pradesh Logo" className="h-14 w-auto object-contain" />
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
                <p className="font-bold text-xs uppercase text-black">{report.labTechnicianName}</p>
                <p className="text-[9px] text-black font-bold uppercase tracking-widest">Lab Technician</p>
                <p className="text-[8px] text-black uppercase">CADDL Allagadda</p>
              </div>
            </div>
            <div className="text-center">
               <div className="w-64 border-t border-gray-900 pt-2">
                <p className="font-bold text-xs uppercase text-black">{report.assistantDirector}</p>
                <p className="text-[9px] text-black font-bold uppercase tracking-widest">Assistant Director</p>
                <p className="text-[9px] text-black font-bold uppercase tracking-tighter">C.A.D.D.L , Allagadda</p>
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
