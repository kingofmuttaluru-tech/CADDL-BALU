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

    const safeName = report.farmerName.trim().replace(/[^a-z0-9]/gi, '_').toUpperCase();
    const fileName = `OFFICIAL_REPORT_${safeName}_${report.animalId}.pdf`;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        backgroundColor: '#FFFFFF',
        scrollY: 0, 
        scrollX: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      const worker = html2pdf().from(element).set(opt);
      await worker.save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF processing error. Please use 'Direct Print' as a stable alternative.");
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

  // Fix: Make children optional to resolve TS error about missing children prop when used in JSX tags.
  // Using React.ReactNode for robust type compatibility.
  const Label = ({ children }: { children?: React.ReactNode }) => (
    <span className="text-[5.5pt] font-black text-black uppercase tracking-widest mr-1 opacity-70">
      [{children}]
    </span>
  );

  return (
    <div className="space-y-4 animate-fadeIn pb-24">
      <div className="flex justify-center sm:justify-end space-x-3 no-print px-4 sticky top-20 z-40">
        <button 
          onClick={handlePrint} 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-2 group border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Direct Print (System Dialog)
        </button>
        <button 
          onClick={handleDownloadPDF} 
          className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-2 border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Generate High-Res PDF
        </button>
      </div>

      <div className="pdf-canvas-wrapper shadow-none">
        <div ref={reportRef} className="pdf-page-content font-bold border-[30pt] border-black">
          {/* Faint Background Watermark - Monochrome */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] w-[140mm] h-[140mm] z-0 flex items-center justify-center grayscale">
             <div className="text-[140pt] font-black text-black rotate-[-45deg] select-none tracking-tighter">CADDL</div>
          </div>

          <div className="pdf-inner-padding z-10 flex flex-col pt-6 px-10 pb-4">
            {/* Header with Color Logo but Grayscale Text */}
            <div className="flex justify-between items-start pb-2 mb-2 border-b-2 border-black flex-shrink-0">
              {/* LOGO IN COLOR */}
              <div className="w-[70px] pt-1 flex flex-col items-center">
                <img src={apGovLogo} alt="Emblem" className="w-14 h-14 object-contain mb-1" />
                <span className="text-[4.5pt] font-black text-black uppercase tracking-tighter">Verified Official</span>
              </div>
              
              {/* THE REST IN B&W (GRAYSCALE) */}
              <div className="text-center flex-1 px-4 pt-0 grayscale">
                <p className="text-[7pt] font-black text-black uppercase tracking-widest leading-none mb-1">{GOVT_NAME}</p>
                <p className="text-[6pt] font-black text-black uppercase tracking-tighter leading-none mb-1.5">{DEPT_NAME}</p>
                <h1 className="text-[10pt] font-black text-black uppercase tracking-tighter leading-tight mb-1">{LAB_NAME}</h1>
                <p className="text-[5pt] font-black text-black uppercase tracking-widest leading-none mb-1.5">{LAB_LOCATION}</p>
                <div className="flex justify-center items-center space-x-2 text-[5pt] font-black uppercase">
                  <span className="text-black border border-black px-1.5 py-0.5 rounded-sm">{ISO_CERT}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <span className="text-black">{NABL_CERT}</span>
                  </div>
                </div>
              </div>

              <div className="w-[120px] flex flex-col items-end pt-1 flex-shrink-0 grayscale">
                <div className="flex gap-2 items-start mb-1">
                  <div className="border border-black p-0.5 bg-white">
                    <img src={qrCodeUrl} alt="Report QR" className="w-10 h-10 grayscale" />
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-black text-white px-2 py-1 text-[4.5pt] font-black uppercase tracking-widest mb-1 w-20 text-center leading-none">OFFICIAL REPORT</div>
                    <p className="text-[6pt] font-black text-black uppercase tracking-tighter leading-none">REF: <span className="text-black">{report.id.split('-').pop()}</span></p>
                    <p className="text-[4.5pt] font-black text-black uppercase tracking-tighter mt-0.5">DATE: {report.dateOfReport}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body - Grayscale & Bold */}
            <div className="grayscale flex flex-col flex-1 min-h-0 font-bold">
              {/* Row 1: Registry & Animal Details */}
              <div className="grid grid-cols-2 gap-2 mb-2 flex-shrink-0">
                <div className="border border-black p-2 bg-white">
                  <h4 className="text-[6pt] font-black text-black uppercase border-b border-black mb-1.5 tracking-widest leading-none pb-1">OWNER REGISTRY</h4>
                  <div className="grid grid-cols-1 gap-y-1 text-[7.5pt] leading-tight font-bold">
                    <div className="flex items-baseline gap-1">
                      <Label>FARMER NAME</Label>
                      <span className="font-black text-black uppercase text-[8pt]">{report.farmerName || 'N/A'}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <Label>S/o OR FORMER</Label>
                      <span className="font-black uppercase text-black truncate text-[7.5pt]">{report.fatherName || 'N/A'}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <Label>MOBILE NO</Label>
                      <span className="font-black text-black text-[7.5pt]">{report.mobileNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <Label>ADDRESS</Label>
                      <span className="font-black uppercase text-black text-[7pt]">
                        {report.village}, {report.mandal}, {report.district}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border border-black p-2 bg-white">
                  <h4 className="text-[6pt] font-black text-black uppercase border-b border-black mb-1.5 tracking-widest leading-none pb-1">ANIMAL IDENTIFICATION</h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[7pt] leading-tight font-bold">
                    <div className="flex items-baseline"><Label>TAG ID</Label> <span className="font-black">{report.animalId || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>SPECIES</Label> <span className="font-black">{report.species || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>BREED</Label> <span className="font-black">{report.breed || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>AGE/SEX</Label> <span className="font-black">{report.age}/{report.sex}</span></div>
                    <div className="flex items-baseline"><Label>WEIGHT</Label> <span className="font-black">{report.bodyWeight || '--'} KG</span></div>
                    <div className="flex items-baseline"><Label>STATUS</Label> <span className="font-black text-[6pt]">{report.pregnancyStatus} / {report.lactationStage}</span></div>
                  </div>
                </div>
              </div>

              {/* Row 2: Reference & History Details */}
              <div className="grid grid-cols-2 gap-2 mb-2 flex-shrink-0">
                <div className="border border-black p-2 bg-white">
                  <h4 className="text-[6pt] font-black text-black uppercase border-b border-black mb-1.5 tracking-widest leading-none pb-1">CLINICAL REFERENCE</h4>
                  <div className="grid grid-cols-1 gap-y-1 text-[7pt] leading-tight font-bold">
                    <div className="flex items-baseline"><Label>DOCTOR</Label> <span className="font-black truncate">{report.referringDoctor || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>HOSPITAL</Label> <span className="font-black truncate">{report.hospitalName || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>CASE SUMMARY</Label> <span className="font-black text-[7pt]">{report.conciseSummary || 'N/A'}</span></div>
                  </div>
                </div>
                <div className="border border-black p-2 bg-white">
                  <h4 className="text-[6pt] font-black text-black uppercase border-b border-black mb-1.5 tracking-widest leading-none pb-1">SAMPLE LOGISTICS</h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[6.5pt] leading-tight font-bold">
                    <div className="flex items-baseline"><Label>SAMPLE ID</Label> <span className="font-black">{report.sampleId || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>TYPE</Label> <span className="font-black truncate">{report.sampleType || 'N/A'}</span></div>
                    <div className="flex items-baseline"><Label>COLLECTION</Label> <span className="font-black">{report.dateOfCollection}</span></div>
                    <div className="flex items-baseline"><Label>CONDITION</Label> <span className="font-black">{report.sampleCondition || 'N/A'}</span></div>
                    <div className="flex items-baseline col-span-2"><Label>COLLECTED BY</Label> <span className="font-black truncate">{report.collectedBy || 'N/A'} ({report.collectionTime})</span></div>
                  </div>
                </div>
              </div>

              {/* Row 3: History Block */}
              <div className="border border-black p-2 bg-slate-50 mb-2 flex-shrink-0">
                <div className="flex items-start gap-1">
                  <Label>CLINICAL HISTORY</Label>
                  <p className="text-[7pt] font-bold text-black italic leading-snug">{report.clinicalHistory || 'None provided.'}</p>
                </div>
              </div>

              {/* Investigation Findings */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <h4 className="text-[7pt] font-black text-black uppercase border-b-2 border-black mb-1 tracking-widest bg-slate-100 px-3 py-1 flex-shrink-0 leading-none">
                  LABORATORY INVESTIGATION FINDINGS
                </h4>
                <div className="space-y-2 overflow-y-auto flex-grow pr-1">
                  {Object.entries(report.categorizedResults).map(([catKey, tests]) => {
                    const testEntries = tests as LabTestEntry[];
                    if (!testEntries || testEntries.length === 0) return null;
                    return (
                      <div key={catKey} className="mb-1 flex flex-col">
                        <div className="bg-black text-white px-2 py-0.5 text-[6pt] font-black uppercase tracking-widest flex-shrink-0 leading-none">
                          {CATEGORY_LABELS[catKey]}
                        </div>
                        <table className="nabl-table font-bold">
                          <thead>
                            <tr className="bg-slate-200">
                              <th className="w-[45%] text-left font-black text-[6.5pt]">PARAMETER</th>
                              <th className="w-[18%] text-center font-black text-[6.5pt]">RESULT</th>
                              <th className="w-[12%] text-center font-black text-[6.5pt]">UNIT</th>
                              <th className="w-[25%] text-center font-black text-[6.5pt]">NORMAL RANGE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testEntries.map((test, idx) => {
                              const isAbnormal = checkAbnormal(test.resultValue, test.normalRange);
                              return (
                                <tr key={idx}>
                                  <td className="font-black uppercase text-black text-[7.5pt]">{test.testName}</td>
                                  <td className={`text-center font-black text-[8.5pt] ${isAbnormal ? 'underline decoration-2' : ''}`}>
                                    {test.resultValue}
                                  </td>
                                  <td className="text-center text-black font-black text-[6.5pt]">{test.unit || '--'}</td>
                                  <td className="text-center italic text-black/60 font-black text-[6.5pt]">{test.normalRange}</td>
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

              {/* Remarks Section */}
              <div className="mt-2 pt-2 border-t-2 border-black flex-shrink-0 font-bold">
                <div className="flex items-center gap-1 mb-1">
                  <Label>INTERPRETATIVE REMARKS</Label>
                </div>
                <div className="bg-white border border-black p-2 text-[7.5pt] font-black text-black leading-tight italic min-h-[40px]">
                  {report.otherRemarks || 'Investigation revealed no detectable abnormalities within current limits.'}
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="mt-auto pt-4 flex-shrink-0 relative">
                <div className="grid grid-cols-2 gap-12 items-end text-center pt-8">
                  
                  {/* Official Seal Watermark */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] opacity-[0.1] pointer-events-none scale-125 transform z-0">
                    <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="#000" strokeWidth="1.5" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#000" strokeWidth="0.5" strokeDasharray="2 1" />
                      <path id="circlePath" d="M 15,50 A 35,35 0 1,1 85,50 A 35,35 0 1,1 15,50" fill="none" />
                      <text fontSize="4.2" fontWeight="900" fill="#000" letterSpacing="0.8">
                        <textPath xlinkHref="#circlePath" startOffset="0%">
                          CONSTITUENCY ANIMAL DISEASE DIAGNOSTIC LABORATORY • ALLAGADDA • 
                        </textPath>
                      </text>
                      <g transform="translate(35,35) scale(1.2)">
                        <path d="M12.5 0 L15 10 L25 12.5 L15 15 L12.5 25 L10 15 L0 12.5 L10 10 Z" fill="#000" />
                        <text x="12.5" y="14" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">OFFICIAL</text>
                      </g>
                    </svg>
                  </div>

                  <div className="flex flex-col items-center z-10 font-black">
                     <div className="w-full border-t border-black pt-1 font-black text-[8pt] uppercase leading-none text-black mb-1">{report.labTechnician || 'S BALARAJU'}</div>
                     <div className="text-[5.5pt] font-black text-black/60 uppercase leading-none">LAB TECHNICIAN</div>
                     <div className="text-[4.5pt] text-black/40 font-black uppercase mt-0.5 italic">CADDL ALLAGADDA</div>
                  </div>
                  
                  <div className="flex flex-col items-center z-10 font-black">
                     <div className="w-full border-t border-black pt-1 font-black text-[8pt] uppercase leading-none text-black mb-1">{report.assistantDirector || 'Dr. C. H. Chandra Mohan Reddy'}</div>
                     <div className="text-[5.5pt] font-black text-black/70 uppercase leading-none">ASSISTANT DIRECTOR</div>
                     <div className="text-[4.5pt] text-black font-black uppercase mt-0.5 tracking-tighter">CADDL ALLAGADDA</div>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-black/10 text-[4.5pt] text-black/40 font-black uppercase tracking-[0.2em] text-center italic leading-none flex-shrink-0">
                DIGITAL COPY GENERATED VIA OFFICIAL CADDL ADMIN HUB. DOCUMENT AUTHENTICATED BY SCANNING QR.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintPreview;