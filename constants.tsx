import React from 'react';

export const LAB_NAME = "CONSTITUENCY ANIMAL DISEASE DIAGNOSTIC LABORATORY (CADDL)";
export const LAB_LOCATION = "ALLAGADDA, Nandyal Dist., Andhra Pradesh";
export const ISO_CERT = "ISO 9001:2015 CERTIFIED";
export const NABL_CERT = "NABL ACCREDITED LABORATORY";
export const GOVT_NAME = "GOVERNMENT OF ANDHRA PRADESH";
export const DEPT_NAME = "DEPARTMENT OF ANIMAL HUSBANDRY";

export const HOSPITAL_LIST = [
  'VD Peraipalle',
  'VD P. Chinthakunta',
  'VD Dornipadu',
  'VD W. Kothapalli',
  'VD Gundupapala'
];

export const DOCTOR_LIST = [
  'Dr. Y Mahendra (V.A.S.)',
  'Dr. D Srikala (V.A.S.)',
  'Dr. D Chinna Babu (V.A.S.)',
  'Dr. S. Naga Sailaja (V.A.S.)',
  'Dr. M Sreenivasa Reddy (V.A.S.)'
];

export const SPECIES_LIST = [
  'Bovine (Cow/Buffalo)',
  'Caprine (Goat)',
  'Ovine (Sheep)',
  'Equine (Horse)',
  'Avian (Poultry)',
  'Canine (Dog)',
  'Other'
];

export const BREEDS_BY_SPECIES: Record<string, string[]> = {
  'Bovine': ['Murrah Buffalo', 'Ongole Cattle', 'Punganur Cattle', 'Jersey Cross', 'HF Cross', 'Local / Desi'],
  'Caprine': ['Boer', 'Jamunapari', 'Osmanabadi', 'Local Goat'],
  'Ovine': ['Nellore Jodipi', 'Nellore Palla', 'Bellary', 'Local Sheep'],
  'Equine': ['Marwari', 'Kathiawari', 'Thoroughbred'],
  'Avian': ['Desi Poultry', 'Broiler', 'Layer', 'BV 300'],
  'Canine': ['Labrador', 'German Shepherd', 'Golden Retriever', 'Rottweiler', 'Indie / Local'],
  'Other': ['Generic / Other']
};

export interface MasterTest {
  category: string;
  subCategory?: string;
  name: string;
  unit: string;
  normalRange: string;
  method?: string;
}

export const MASTER_TEST_LIST: MasterTest[] = [
  // 1. CLINICAL PATHOLOGY - HEMATOLOGY
  { category: 'clinicalPathology', name: 'Hemoglobin (Hb)', unit: 'g/dL', normalRange: '8.0 - 15.0', method: 'Sahli\'s' },
  { category: 'clinicalPathology', name: 'Packed Cell Volume (PCV)', unit: '%', normalRange: '24 - 46' },
  { category: 'clinicalPathology', name: 'Total RBC Count', unit: 'million/µL', normalRange: '5 - 10' },
  { category: 'clinicalPathology', name: 'Total WBC Count (TLC)', unit: '/µL', normalRange: '4,000 - 12,000' },
  { category: 'clinicalPathology', name: 'ESR', unit: 'mm/hr', normalRange: '0 - 10' },
  { category: 'clinicalPathology', name: 'Platelet Count', unit: '×10³/µL', normalRange: '150 - 400' },
  
  // DLC
  { category: 'clinicalPathology', name: 'Neutrophils', unit: '%', normalRange: '30 - 60' },
  { category: 'clinicalPathology', name: 'Lymphocytes', unit: '%', normalRange: '40 - 70' },
  { category: 'clinicalPathology', name: 'Monocytes', unit: '%', normalRange: '0 - 6' },
  { category: 'clinicalPathology', name: 'Eosinophils', unit: '%', normalRange: '0 - 8' },
  { category: 'clinicalPathology', name: 'Basophils', unit: '%', normalRange: '0 - 1' },
  
  // BLOOD SUGAR
  { category: 'clinicalPathology', name: 'Random Blood Sugar (RBS)', unit: 'mg/dL', normalRange: '70 - 140' },
  { category: 'clinicalPathology', name: 'Fasting Blood Sugar (FBS)', unit: 'mg/dL', normalRange: '70 - 110' },

  // 2. PARASITOLOGY (FECAL EXAM)
  { category: 'parasitology', name: 'Direct Smear (Parasite Eggs)', unit: '-', normalRange: 'Absent' },
  { category: 'parasitology', name: 'Flotation Test (Nematodes)', unit: '-', normalRange: 'Absent' },
  { category: 'parasitology', name: 'Sedimentation (Trematodes)', unit: '-', normalRange: 'Absent' },
  { category: 'parasitology', name: 'Coccidia (Oocysts)', unit: '-', normalRange: 'Absent' },
  { category: 'parasitology', name: 'Fecal Consistency', unit: '-', normalRange: 'Normal' },

  // 3. URINE ANALYSIS
  { category: 'urineAnalysis', name: 'Urine Colour', unit: '-', normalRange: 'Pale yellow' },
  { category: 'urineAnalysis', name: 'Urine Appearance', unit: '-', normalRange: 'Clear' },
  { category: 'urineAnalysis', name: 'Urine pH', unit: 'pH', normalRange: '6.0 - 8.0' },
  { category: 'urineAnalysis', name: 'Urine Sugar', unit: '-', normalRange: 'Nil' },
  { category: 'urineAnalysis', name: 'Urine Protein', unit: '-', normalRange: 'Nil' },
  { category: 'urineAnalysis', name: 'Ketone Bodies', unit: '-', normalRange: 'Nil' },
  { category: 'urineAnalysis', name: 'Urine Blood', unit: '-', normalRange: 'Nil' },
  { category: 'urineAnalysis', name: 'Microscopy (RBC/Pus)', unit: '-', normalRange: 'Nil' },

  // 4. MILK ANALYSIS
  { category: 'milkExamination', name: 'Milk Fat %', unit: '%', normalRange: '3.5 - 6.0' },
  { category: 'milkExamination', name: 'Milk SNF %', unit: '%', normalRange: '≥ 8.5' },
  { category: 'milkExamination', name: 'Lactometer Reading', unit: 'CLR', normalRange: '26 - 32' },
  { category: 'milkExamination', name: 'MBRT', unit: 'Hours', normalRange: '> 2 hrs' },
  { category: 'milkExamination', name: 'Milk Acidity', unit: '-', normalRange: 'Normal' },
  { category: 'milkExamination', name: 'Milk Adulteration', unit: '-', normalRange: 'Absent' },
  { category: 'milkExamination', name: 'Mastitis (CMT)', unit: '-', normalRange: 'Negative' },

  // 5. MICROBIOLOGY
  { category: 'microbiology', name: 'Gram Staining', unit: '-', normalRange: 'Gram +ve / -ve' },
  { category: 'microbiology', name: 'ZN Stain (AFB)', unit: '-', normalRange: 'Absent' },
  { category: 'microbiology', name: 'Culture & Sensitivity', unit: '-', normalRange: 'Organism ID' },
  { category: 'microbiology', name: 'Milk Culture', unit: '-', normalRange: 'No Growth' },
  { category: 'microbiology', name: 'Urine Culture', unit: 'CFU', normalRange: 'CFU Count' },
  { category: 'microbiology', name: 'KOH Mount (Fungal)', unit: '-', normalRange: 'No fungal elements' },
  { category: 'microbiology', name: 'Fungal Culture', unit: '-', normalRange: 'No growth' },

  // 6. BIOCHEMISTRY - LFT
  { category: 'biochemistry', name: 'SGOT (AST)', unit: 'IU/L', normalRange: '20 - 60' },
  { category: 'biochemistry', name: 'SGPT (ALT)', unit: 'IU/L', normalRange: '10 - 50' },
  { category: 'biochemistry', name: 'ALP', unit: 'IU/L', normalRange: '30 - 150' },
  { category: 'biochemistry', name: 'Total Bilirubin', unit: 'mg/dL', normalRange: '0.2 - 1.2' },
  { category: 'biochemistry', name: 'Total Protein', unit: 'g/dL', normalRange: '6.0 - 8.0' },
  { category: 'biochemistry', name: 'Albumin', unit: 'g/dL', normalRange: '3.0 - 4.5' },
  { category: 'biochemistry', name: 'Globulin', unit: 'g/dL', normalRange: '2.5 - 3.5' },

  // BIOCHEMISTRY - KFT
  { category: 'biochemistry', name: 'Blood Urea', unit: 'mg/dL', normalRange: '15 - 45' },
  { category: 'biochemistry', name: 'Serum Creatinine', unit: 'mg/dL', normalRange: '0.6 - 1.5' },
  { category: 'biochemistry', name: 'Uric Acid', unit: 'mg/dL', normalRange: '2.0 - 7.0' },

  // ELECTROLYTES & MINERALS
  { category: 'biochemistry', name: 'Calcium', unit: 'mg/dL', normalRange: '8.5 - 11.5' },
  { category: 'biochemistry', name: 'Phosphorus', unit: 'mg/dL', normalRange: '4.0 - 7.0' },
  { category: 'biochemistry', name: 'Magnesium', unit: 'mg/dL', normalRange: '1.8 - 2.4' },
  { category: 'biochemistry', name: 'Sodium', unit: 'mEq/L', normalRange: '135 - 150' },
  { category: 'biochemistry', name: 'Potassium', unit: 'mEq/L', normalRange: '3.5 - 5.5' },

  // 7. SEROLOGY / RAPID TESTS
  { category: 'serology', name: 'Brucellosis', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'Leptospirosis', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'Theileria', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'Babesia', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'Anaplasma', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'FMD Antibody', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'Canine Distemper', unit: '-', normalRange: 'Negative' },
  { category: 'serology', name: 'CPV (Parvo)', unit: '-', normalRange: 'Negative' }
];

export const CATEGORY_LABELS: Record<string, string> = {
  clinicalPathology: 'HEMATOLOGY & BLOOD SUGAR',
  biochemistry: 'BIOCHEMISTRY (LFT/KFT/MINERALS)',
  milkExamination: 'MILK ANALYSIS',
  parasitology: 'FECAL EXAMINATION',
  urineAnalysis: 'URINE ANALYSIS',
  microbiology: 'MICROBIOLOGY & FUNGAL',
  serology: 'SEROLOGY & RAPID TESTS',
  pathology: 'SKIN & DERMATOLOGY'
};