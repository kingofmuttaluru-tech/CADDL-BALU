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
  farmerName: string;
  fatherName?: string;
  village: string;
  mandal: string;
  district: string;
  mobileNumber: string;
  farmerId?: string;
  animalId: string;
  species: Species;
  breed: string;
  age: string;
  sex: 'Male' | 'Female' | 'Unknown';
  bodyWeight: string;
  pregnancyStatus: string;
  lactationStage: string;
  clinicalHistory: string;
  sampleType: string;
  sampleId: string;
  dateOfCollection: string;
  collectionTime: string;
  collectedBy: string;
  sampleCondition: string;
  dateOfReport: string;
  hospitalName: string;
  referringDoctor: string;
  assistantDirector: string;
  labTechnician: string;
  categorizedResults: CategorizedTests;
  conciseSummary: string;
  otherRemarks: string;
  status: 'Pending' | 'Completed';
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string; // e.g., 'Parasite', 'Equipment', 'Sample'
  date: string;
  aiAnalyzed: boolean;
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

export type View = 'dashboard' | 'new-report' | 'reports-list' | 'consultations' | 'gallery' | 'settings';
