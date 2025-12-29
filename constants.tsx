
import React from 'react';

export const LAB_NAME = "CONSTITUENCY ANIMAL DISEASE DIAGNOSTIC LABORATORY (CADDL)";
export const LAB_LOCATION = "ALLAGADDA, Nandyal Dist., Andhra Pradesh";
export const ISO_CERT = "ISO 9001:2015 CERTIFIED";
export const NABL_CERT = "NABL ACCREDITED LABORATORY";

export const SPECIES_LIST = [
  'Bovine (Cow/Buffalo)',
  'Caprine (Goat)',
  'Ovine (Sheep)',
  'Equine (Horse)',
  'Avian (Poultry)',
  'Canine (Dog)',
  'Other'
];

export interface MasterTest {
  category: string;
  subCategory?: string;
  name: string;
  unit: string;
  normalRange: string;
}

export const MASTER_TEST_LIST: MasterTest[] = [
  // COMPLETE BLOOD PICTURE (CBP) - NABL Style
  { category: 'clinicalPathology', name: 'Hemoglobin (Hb)', unit: 'g/dL', normalRange: '8.0 - 15.0' },
  { category: 'clinicalPathology', name: 'Total Leukocyte Count (TLC)', unit: 'cells/µL', normalRange: '4,000 - 12,000' },
  { category: 'clinicalPathology', name: 'Neutrophils', unit: '%', normalRange: '15 - 45' },
  { category: 'clinicalPathology', name: 'Lymphocytes', unit: '%', normalRange: '45 - 75' },
  { category: 'clinicalPathology', name: 'Monocytes', unit: '%', normalRange: '2 - 7' },
  { category: 'clinicalPathology', name: 'Eosinophils', unit: '%', normalRange: '2 - 10' },
  { category: 'clinicalPathology', name: 'Basophils', unit: '%', normalRange: '0 - 2' },
  { category: 'clinicalPathology', name: 'Platelet Count', unit: '/µL', normalRange: '1,00,000 - 8,00,000' },
  { category: 'clinicalPathology', name: 'Packed Cell Volume (PCV)', unit: '%', normalRange: '24 - 46' },
  { category: 'clinicalPathology', name: 'Total Erythrocyte Count (TEC)', unit: 'x10^6/µL', normalRange: '5.0 - 10.0' },
  
  // BIOCHEMISTRY - LFT
  { category: 'biochemistry', subCategory: 'LFT', name: 'SGOT/AST', unit: 'U/L', normalRange: '70 - 280' },
  { category: 'biochemistry', subCategory: 'LFT', name: 'SGPT/ALT', unit: 'U/L', normalRange: '11 - 40' },
  { category: 'biochemistry', subCategory: 'LFT', name: 'ALP (Alkaline Phosphatase)', unit: 'U/L', normalRange: '0 - 400' },
  { category: 'biochemistry', subCategory: 'LFT', name: 'Total Bilirubin', unit: 'mg/dL', normalRange: '0.1 - 0.5' },
  { category: 'biochemistry', subCategory: 'LFT', name: 'Total Protein', unit: 'g/dL', normalRange: '6.7 - 7.5' },
  { category: 'biochemistry', subCategory: 'LFT', name: 'Albumin', unit: 'g/dL', normalRange: '3.0 - 3.5' },
  { category: 'biochemistry', subCategory: 'LFT', name: 'Globulin', unit: 'g/dL', normalRange: '3.0 - 4.5' },
  
  // BIOCHEMISTRY - RFT
  { category: 'biochemistry', subCategory: 'RFT', name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', normalRange: '10 - 25' },
  { category: 'biochemistry', subCategory: 'RFT', name: 'Serum Creatinine', unit: 'mg/dL', normalRange: '1.0 - 2.0' },
  { category: 'biochemistry', subCategory: 'RFT', name: 'Uric Acid', unit: 'mg/dL', normalRange: '0.5 - 2.0' },
  
  // BIOCHEMISTRY - ELECTROLYTES
  { category: 'biochemistry', subCategory: 'ELECTROLYTES', name: 'Sodium (Na+)', unit: 'mmol/L', normalRange: '135 - 150' },
  { category: 'biochemistry', subCategory: 'ELECTROLYTES', name: 'Potassium (K+)', unit: 'mmol/L', normalRange: '3.5 - 5.5' },
  { category: 'biochemistry', subCategory: 'ELECTROLYTES', name: 'Chloride (Cl-)', unit: 'mmol/L', normalRange: '95 - 110' },

  // BIOCHEMISTRY - MINERALS
  { category: 'biochemistry', subCategory: 'MINERALS', name: 'Calcium (Ca++)', unit: 'mg/dL', normalRange: '8.0 - 10.5' },
  { category: 'biochemistry', subCategory: 'MINERALS', name: 'Phosphorus (P)', unit: 'mg/dL', normalRange: '4.5 - 7.0' },
  { category: 'biochemistry', subCategory: 'MINERALS', name: 'Magnesium (Mg++)', unit: 'mg/dL', normalRange: '1.8 - 3.0' },

  // Other Biochemistry
  { category: 'biochemistry', name: 'Blood Glucose', unit: 'mg/dL', normalRange: '45 - 75' },
  
  // Microbiology
  { category: 'microbiology', name: 'Gram Stain', unit: '-', normalRange: 'Observation' },
  { category: 'microbiology', name: 'Culture & Sensitivity', unit: '-', normalRange: 'Observation' },
  { category: 'microbiology', name: 'Acid Fast Staining (AFB)', unit: '-', normalRange: 'Negative' },
  { category: 'microbiology', name: 'California Mastitis Test (CMT)', unit: '-', normalRange: 'Negative' },
  
  // Parasitology
  { category: 'parasitology', name: 'Fecal Exam (Direct)', unit: '-', normalRange: 'Nil' },
  { category: 'parasitology', name: 'Fecal Exam (Sedimentation)', unit: '-', normalRange: 'Nil' },
  { category: 'parasitology', name: 'Blood Smear (Hemoprotozoa)', unit: '-', normalRange: 'Negative' },
  { category: 'parasitology', name: 'Skin Scraping (Mites)', unit: '-', normalRange: 'Nil' }
];

export const CATEGORY_LABELS: Record<string, string> = {
  clinicalPathology: 'COMPLETE BLOOD PICTURE (CBP) / CLINICAL PATHOLOGY',
  pathology: 'PATHOLOGY (GROSS/HISTO)',
  biochemistry: 'BIOCHEMISTRY',
  microbiology: 'MICROBIOLOGY',
  parasitology: 'PARASITOLOGY'
};
