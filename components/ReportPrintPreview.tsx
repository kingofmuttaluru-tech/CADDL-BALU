
import React, { useRef } from 'react';
import { DiagnosticReport, LabTestEntry } from '../types';
import { QRCodeSVG } from 'qrcode.react';
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

    // Standard A4 width in pixels for high-quality capture
    const captureWidth = 800; 

    const filename = `CADDL_REPORT_${report.species.toUpperCase()}_${report.farmerName.replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        width: captureWidth, 
        scrollY: 0,
        scrollX: 0,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['css', 'legacy'], avoid: '.avoid-break' }
    };

    // Use html2pdf
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const checkAbnormal = (value: string, range: string): boolean => {
    if (!value || !range) return false;
    const cleanValue = value.trim().toLowerCase();
    if (['observation', 'normal', 'nil', 'negative'].includes(cleanValue)) return false;

    const rangeMatch = range.trim().toLowerCase().match(/([\d.]+)\s*-\s*([\d.]+)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const numValue = parseFloat(cleanValue.match(/[\d.]+/)?.[0] || '');
      if (!isNaN(numValue)) return numValue < min || numValue > max;
    }

    const positives = ['positive', 'detected', 'seen', 'found', '+', '++', '+++'];
    return positives.some(p => cleanValue.includes(p));
  };

  const ReportHeader = () => (
    <div className="text-center border-b-2 border-black pb-4 mb-4 pt-2">
      <div className="flex flex-col justify-center items-center mb-2">
        <p className="text-[11pt] font-black text-black leading-tight tracking-widest">{GOVT_NAME}</p>
        <p className="text-[11pt] font-black text-black leading-tight tracking-tight">{DEPT_NAME}</p>
      </div>
      <h1 className="text-[14pt] font-black text-white bg-black px-6 py-2 inline-block uppercase tracking-tighter mb-2 shadow-sm">{LAB_NAME}</h1>
      <p className="text-[10pt] font-extrabold text-black uppercase tracking-tight">{LAB_LOCATION}</p>
      
      <div className="flex justify-center space-x-8 mt-2">
        <span className="text-[9pt] font-black uppercase text-slate-800 border-x border-black px-4">{ISO_CERT}</span>
        <span className="text-[9pt] font-black uppercase text-slate-800 border-x border-black px-4">{NABL_CERT}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-6 pb-20">
      {/* Action Header - Screen Only */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 no-print bg-white p-6 rounded-3xl shadow-2xl border-t-4 border-blue-600 sticky top-20 z-20 w-full max-w-5xl">
        <div className="flex-1">
          <h2 className="font-black text-slate-900 text-xl uppercase tracking-tighter">Final Diagnostic Report</h2>
          <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-[0.2em]">Authorized Veterinary Document</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handlePrint} 
            className="flex items-center space-x-3 bg-slate-100 text-slate-800 px-8 py-4 rounded-2xl hover:bg-slate-200 transition-all font-black uppercase text-[11px] tracking-widest border border-slate-300 shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span>Print Report</span>
          </button>
          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center space-x-3 bg-blue-700 text-white px-12 py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl font-black uppercase tracking-widest text-[11px] border-b-4 border-blue-900 active:translate-y-1 active:border-b-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Report Wrapper */}
      <div 
        ref={reportRef} 
        className="pdf-canvas-wrapper print:shadow-none bg-white"
        id="official-report-canvas"
      >
        <table className="w-full h-full border-collapse">
          <thead>
            <tr>
              <td>
                <div className="px-8 pt-4">
                  <ReportHeader />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="report-content-box border-0 px-8 py-0">
                  {/* Demographic Grid */}
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[10pt] border-b border-black pb-4 mb-4">
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Farmer Name:</span>
                      <span className="font-black text-black uppercase truncate">{report.farmerName} <span className="text-slate-400 font-bold italic lowercase">S/o</span> {report.fatherName}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Hospital / VD:</span>
                      <span className="font-black text-black uppercase truncate">{report.hospitalName}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Animal / Former Name:</span>
                      <span className="font-black text-black uppercase truncate underline decoration-dotted">{report.animalName || '-'}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Reference ID:</span>
                      <span className="font-mono font-black text-blue-800 tracking-tighter uppercase">{report.id.slice(0,10)}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Address:</span>
                      <span className="text-black font-bold uppercase truncate">{report.farmerAddress || 'Village Record'}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Referring Doctor:</span>
                      <span className="font-black text-black uppercase">{report.referringDoctor || 'Field VAS'}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Species / Breed:</span>
                      <span className="font-black text-black uppercase">{report.species} ({report.breed})</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Age / Sex:</span>
                      <span className="font-black text-black uppercase">{report.age} / {report.sex}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Sample Date:</span>
                      <span className="font-black text-black">{report.dateOfCollection}</span>
                    </div>
                    <div className="flex items-baseline col-span-2">
                      <span className="font-black w-36 text-slate-400 uppercase text-[7.5pt] shrink-0">Reporting Date:</span>
                      <span className="font-black text-black underline underline-offset-2 font-bold">{report.dateOfReport}</span>
                    </div>
                  </div>

                  {/* Laboratory Test Results */}
                  <div className="flex-1">
                    {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                      const typedTests = tests as LabTestEntry[];
                      if (!typedTests || typedTests.length === 0) return null;
                      return (
                        <div key={catKey} className="mb-6 avoid-break">
                          <h2 className="text-[10pt] font-black bg-slate-100 text-black px-3 py-1.5 border-y border-black mb-2 uppercase tracking-widest">
                            {CATEGORY_LABELS[catKey]}
                          </h2>
                          <table className="nabl-table">
                            <thead>
                              <tr>
                                <th className="text-left w-[55%]">Investigation Parameter</th>
                                <th className="text-center w-28">Result</th>
                                <th className="text-center w-20">Unit</th>
                                <th className="text-center">Reference Interval</th>
                              </tr>
                            </thead>
                            <tbody>
                              {typedTests.map((test, idx) => {
                                const isAbnormal = checkAbnormal(test.resultValue, test.normalRange);
                                return (
                                  <tr key={idx} className={isAbnormal ? 'bg-red-50' : ''}>
                                    <td className="font-black text-black uppercase">{test.testName}</td>
                                    <td className={`text-center font-black ${isAbnormal ? 'text-red-700 font-extrabold' : 'text-black'}`}>
                                      {test.resultValue} {isAbnormal && '*'}
                                    </td>
                                    <td className="text-center text-slate-500 font-bold">{test.unit || '-'}</td>
                                    <td className="text-center text-slate-400 font-bold italic text-[8.5pt]">{test.normalRange}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expert Remarks */}
                  {report.otherRemarks && (
                    <div className="mt-4 border-t-2 border-black pt-3 avoid-break mb-6">
                      <h3 className="text-[10pt] font-black text-black uppercase tracking-widest mb-2 underline underline-offset-4">Pathologist Analysis & Correlation</h3>
                      <div className="text-[10pt] text-black font-medium border-2 border-slate-100 p-4 bg-slate-50 rounded-xl leading-relaxed whitespace-pre-wrap italic">
                        {report.otherRemarks}
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <div className="px-8 pb-8">
                  {/* Signatures & QR */}
                  <div className="border-t-2 border-black pt-8 flex justify-between items-end pb-2 px-2">
                    <div className="text-center">
                      <div className="w-48 border-t-2 border-black mb-2"></div>
                      <p className="text-[10pt] font-black uppercase text-black">{report.labTechnicianName}</p>
                      <p className="text-[8pt] font-black text-slate-500 uppercase tracking-widest">Lab Technician</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="bg-white p-2 border-2 border-black mb-1">
                        <QRCodeSVG value={`https://caddl.ap.gov.in/verify/${report.id}`} size={60} level="H" />
                      </div>
                      <p className="text-[6pt] text-slate-400 uppercase font-black tracking-widest text-center">Scan to Verify Report</p>
                    </div>

                    <div className="text-center">
                      <div className="w-48 border-t-2 border-black mb-2"></div>
                      <p className="text-[10pt] font-black uppercase text-black">{report.assistantDirector}</p>
                      <p className="text-[8pt] font-black text-slate-500 uppercase tracking-widest">Assistant Director</p>
                    </div>
                  </div>

                  <div className="text-center text-[7pt] text-slate-300 font-black uppercase tracking-[0.5em] pt-4">
                    --- END OF OFFICIAL DIAGNOSTIC DOCUMENT ---
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        
        <div className="complete-border absolute inset-0 pointer-events-none border-4 border-black m-4 no-print"></div>
      </div>
    </div>
  );
};

export default ReportPrintPreview;
