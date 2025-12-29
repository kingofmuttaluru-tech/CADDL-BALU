
export type Species = 'Bovine' | 'Caprine' | 'Ovine' | 'Equine' | 'Avian' | 'Canine' | 'Other';

export interface LabTestEntry {
  testName: string;
  resultValue: string;
  unit: string;
  normalRange: string;
}

export interface CategorizedTests {
  clinicalPathology: LabTestEntry[];
  pathology: LabTestEntry[];
  biochemistry: LabTestEntry[];
  microbiology: LabTestEntry[];
  parasitology: LabTestEntry[];
}

export interface DiagnosticReport {
  id: string;
  farmerName: string;
  farmerAddress: string;
  dateOfCollection: string;
  dateOfReport: string;
  species: Species;
  age: string;
  sex: 'Male' | 'Female' | 'Unknown';
  breed: string;
  referringDoctor: string;
  labTechnicianName: string;
  assistantDirector: string;
  categorizedResults: CategorizedTests;
  conciseSummary: string;
  otherRemarks: string;
  status: 'Pending' | 'Completed';
}

export interface ConsultationRequest {
  id: string;
  reportId: string;
  farmerName: string;
  species: string;
  requestNote: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Submitted' | 'Reviewed' | 'Closed';
  createdAt: string;
}

export type View = 'dashboard' | 'new-report' | 'reports-list' | 'consultations' | 'settings';
