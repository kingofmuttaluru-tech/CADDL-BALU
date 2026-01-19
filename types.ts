export type Species = 'Bovine' | 'Caprine' | 'Ovine' | 'Equine' | 'Avian' | 'Canine' | 'Other';

export interface LabTestEntry {
  testName: string;
  resultValue: string;
  unit: string;
  normalRange: string;
  method?: string;
}

export interface CategorizedTests {
  clinicalPathology: LabTestEntry[];
  pathology: LabTestEntry[];
  biochemistry: LabTestEntry[];
  microbiology: LabTestEntry[];
  parasitology: LabTestEntry[];
  milkExamination: LabTestEntry[];
  urineAnalysis: LabTestEntry[];
  serology: LabTestEntry[];
}

export interface DiagnosticReport {
  id: string;
  // 2. Farmer / Owner Details
  farmerName: string;
  village: string;
  mandal: string;
  district: string;
  mobileNumber: string;
  farmerId?: string;
  // 3. Animal Details
  animalId: string; // Tag No
  species: Species;
  breed: string;
  age: string;
  sex: 'Male' | 'Female' | 'Unknown';
  bodyWeight: string;
  pregnancyStatus: string;
  lactationStage: string;
  clinicalHistory: string;
  // 4. Sample Details
  sampleType: string;
  sampleId: string;
  dateOfCollection: string;
  collectionTime: string;
  collectedBy: string;
  sampleCondition: string;
  // Lab Info
  dateOfReport: string;
  hospitalName: string;
  referringDoctor: string;
  assistantDirector: string;
  labTechnician: string;
  // 5. Results & 7. Interpretation
  categorizedResults: CategorizedTests;
  conciseSummary: string; // Diagnosis hints
  otherRemarks: string; // Abnormal findings & follow-up advice
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