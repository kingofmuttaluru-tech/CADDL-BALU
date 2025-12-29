
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

    // Optimized configuration for strict single-page A4 PDF output
    const opt = {
      margin: 0, // No margin for the html2pdf engine because we handle padding in CSS
      filename: `CADDL_Report_${report.farmerName.replace(/\s+/g, '_')}_${report.id.slice(0, 4)}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, // High resolution scaling
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // Standard A4 pixel width at 96 DPI
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: 'avoid-all' } // Force single page by avoiding breaks
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
        <div>
          <h3 className="font-bold text-gray-800">Laboratory Report Preview</h3>
          <p className="text-xs text-gray-500 text-blue-600 font-semibold">Ready for Single-Page A4 Export</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print</span>
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 bg-blue-800 text-white px-8 py-2.5 rounded-lg hover:bg-blue-900 transition-all shadow-xl font-black uppercase tracking-widest text-xs"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Single-Page PDF</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center bg-gray-300 py-10 print:p-0 print:bg-white overflow-x-auto">
        <div 
          ref={reportRef}
          className="bg-white shadow-2xl print:shadow-none pdf-container flex flex-col relative" 
          id="report-capture-area"
        >
          {/* TOP SECTION: OFFICIAL HEADER - Unified Letter Size Format */}
          <div className="border-b-4 border-blue-900 pb-4 mb-6 text-center avoid-break relative z-10">
            <div className="flex flex-col items-center mb-3">
               <p className="text-[22px] font-black text-green-700 uppercase tracking-[0.1em] mb-1 leading-tight">Government of Andhra Pradesh</p>
               <p className="text-[22px] font-black text-green-700 uppercase tracking-[0.05em] mb-2 leading-tight">Department of Animal Husbandry</p>
               <h1 className="text-[22px] font-black text-blue-900 uppercase leading-tight tracking-tight mb-3">{LAB_NAME}</h1>
               <p className="text-[14px] font-bold text-gray-800 border-t border-gray-100 pt-1 w-full">{LAB_LOCATION}</p>
            </div>
            
            <div className="flex justify-between items-center mt-2 px-8">
               <div className="bg-blue-900 text-white text-[9px] font-black px-4 py-1 rounded-full shadow-sm">
                  {ISO_CERT}
               </div>
               <div className="bg-white text-blue-900 text-[9px] font-black px-4 py-1 rounded-full border-2 border-blue-900 shadow-sm">
                  {NABL_CERT}
               </div>
            </div>
          </div>

          {/* METADATA SECTION */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-12 text-[12px] mb-6 border-2 border-gray-100 p-5 rounded-xl bg-white/50 backdrop-blur-sm avoid-break relative z-10">
            <div className="flex border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Farmer Name:</span>
              <span className="font-bold text-gray-900 uppercase">{report.farmerName}</span>
            </div>
            <div className="flex border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Lab Ref ID:</span>
              <span className="font-mono text-blue-800 font-bold uppercase">CADDL/AGD/{report.id.slice(0, 6)}</span>
            </div>
            <div className="flex col-span-2 border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Farmer Address:</span>
              <span className="font-medium text-gray-800 uppercase text-[11px]">{report.farmerAddress || 'Not Provided'}</span>
            </div>
            <div className="flex border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Species:</span>
              <span className="font-black text-blue-900">{report.species} ({report.breed})</span>
            </div>
            <div className="flex border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Age / Sex:</span>
              <span className="font-bold text-gray-800 uppercase">{report.age} / {report.sex}</span>
            </div>
            <div className="flex border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Collection Date:</span>
              <span className="text-gray-800">{report.dateOfCollection}</span>
            </div>
            <div className="flex border-b border-gray-50 pb-1">
              <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Report Date:</span>
              <span className="text-blue-900 font-black">{report.dateOfReport}</span>
            </div>
            <div className="flex border-b border-gray-50 pb-1 col-span-2">
               <span className="font-bold w-36 text-gray-400 uppercase tracking-tighter text-[10px]">Referring Doctor:</span>
               <span className="font-bold text-gray-800 uppercase">{report.referringDoctor || 'Field VAS'}</span>
            </div>
          </div>

          {/* LABORATORY INVESTIGATIONS */}
          <div className="flex-1 relative z-10 px-1 overflow-hidden">
            {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
              if (!tests || tests.length === 0) return null;
              return (
                <div key={catKey} className="mb-4 avoid-break">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.15em] bg-blue-50 p-2 mb-2 border-l-4 border-blue-900 rounded-sm">
                    {CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS]}
                  </h4>
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b-2 border-blue-900 text-blue-950 text-left">
                        <th className="py-1 px-2 font-black uppercase text-[9px]">Investigation Parameter</th>
                        <th className="py-1 px-2 font-black uppercase text-[9px] text-center">Observed Value</th>
                        <th className="py-1 px-2 font-black uppercase text-[9px] text-center">Unit</th>
                        <th className="py-1 px-2 font-black uppercase text-[9px] text-center">Reference Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tests.map((test, idx) => (
                        <tr key={idx} className="text-gray-800">
                          <td className="py-2 px-2 font-bold uppercase text-[11px]">{test.testName}</td>
                          <td className="py-2 px-2 text-center font-black text-blue-900 text-[12px]">{test.resultValue}</td>
                          <td className="py-2 px-2 text-center text-gray-500">{test.unit}</td>
                          <td className="py-2 px-2 text-center text-gray-400 font-bold italic">{test.normalRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* Pathologist Remarks */}
            {report.otherRemarks && (
              <div className="mt-6 avoid-break">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 border-b pb-1">Pathologist Remarks & Clinical Recommendations</h4>
                <div className="text-[11px] text-gray-700 whitespace-pre-wrap font-medium leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  {report.otherRemarks}
                </div>
              </div>
            )}
          </div>

          {/* SIGNATURE SECTION */}
          <div className="mt-8 grid grid-cols-2 gap-16 avoid-break pt-8 relative z-10 border-t border-gray-100">
            <div className="text-center flex flex-col items-center">
              <div className="w-40 h-0.5 bg-gray-300 mb-2"></div>
              <p className="text-[10px] font-black text-gray-900 uppercase">{report.labTechnicianName}</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Lab Technician (CADDL)</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-40 h-0.5 bg-gray-300 mb-2"></div>
              <p className="text-[10px] font-black text-gray-900 uppercase">{report.assistantDirector}</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Assistant Director (Admin)</p>
            </div>
          </div>
          
          {/* BOTTOM SECTION */}
          <div className="mt-12 flex flex-col items-center avoid-break relative z-10 pb-4 pt-6">
            <div className="text-center text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] w-full mt-2 border-t border-gray-50 pt-4">
                *** End of Official Diagnostic Report ***
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .pdf-container { 
            width: 210mm !important;
            height: 297mm !important;
            padding: 15mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
          }
          .avoid-break { page-break-inside: avoid; }
        }
        .pdf-container {
          width: 210mm;
          min-height: 297mm;
          padding: 18mm;
          margin: 0 auto;
          background-color: white;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default ReportPrintPreview;
