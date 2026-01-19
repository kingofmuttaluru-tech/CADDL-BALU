import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticReport, LabTestEntry } from "../types";

export interface AIAnalysisResponse {
  detailedAnalysis: string;
  conciseSummary: string;
}

export interface AIChartData {
  label: string;
  value: number;
  // Fix: Added index signature to satisfy Recharts data requirements (expects objects with string keys)
  [key: string]: string | number | undefined;
}

export interface AIChart {
  title: string;
  type: 'bar' | 'pie' | 'area';
  data: AIChartData[];
}

export interface AIAnalyticsDashboardResponse {
  charts: AIChart[];
  narrativeInsight: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
}

/**
 * Generates expert clinical insights for an individual report.
 */
export const getAIInsights = async (report: Partial<DiagnosticReport>): Promise<AIAnalysisResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const findingsText = report.categorizedResults 
      ? Object.entries(report.categorizedResults)
          .filter(([_, tests]) => tests && tests.length > 0)
          .map(([category, tests]) => {
            const formattedTests = (tests as LabTestEntry[])
              .map(t => `${t.testName}: ${t.resultValue} ${t.unit} (Normal: ${t.normalRange})`)
              .join(', ');
            return `${category.toUpperCase()}: ${formattedTests}`;
          })
          .join('\n')
      : 'No laboratory findings provided.';

    const prompt = `
      Act as a Senior Veterinary Pathologist at the Constituency Animal Disease Diagnostic Laboratory (CADDL), Allagadda.
      Analyze these laboratory findings for a ${report.species} (${report.breed || 'Local/Cross'}, ${report.age}/${report.sex}).
      
      REGIONAL CONTEXT (ALLAGADDA/NANDYAL, ANDHRA PRADESH):
      - High prevalence of Murrah buffaloes and local cross-breed cattle.
      - Endemic diseases include Hemorrhagic Septicemia (HS), Black Quarter (BQ), and Peste des Petits Ruminants (PPR) in sheep/goats.
      - High incidence of Subclinical Mastitis in dairy animals.
      - Gastrointestinal parasitism (Strongyles, Amphistomes) is common due to local grazing patterns near irrigation canals.
      - Mineral deficiencies (Phosphorus, Calcium, Zinc) are frequently observed in the red and black soils of the region.
      
      LABORATORY FINDINGS:
      ${findingsText}
      
      Your task is to provide:
      1. DETAILED ANALYSIS: A professional medical breakdown of the results. Connect findings to possible regional conditions (e.g., if Hb is low, consider parasitic load or nutritional deficiency common in Allagadda). 
      2. CONCISE SUMMARY: A 1-2 sentence executive summary focused on the most likely diagnosis or immediate clinical priority.
      
      Return the response in valid JSON format.
    `;

    // Using gemini-3-pro-preview for complex veterinary diagnostic analysis task
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedAnalysis: { type: Type.STRING },
            conciseSummary: { type: Type.STRING }
          },
          required: ["detailedAnalysis", "conciseSummary"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      detailedAnalysis: `${result.detailedAnalysis}\n\n--- CLINICAL SUMMARY ---\n${result.conciseSummary}`,
      conciseSummary: result.conciseSummary
    };
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    return {
      detailedAnalysis: "Error generating detailed analysis. Please review laboratory findings manually for clinical correlation.",
      conciseSummary: "Manual clinical review required."
    };
  }
};

/**
 * Generates comprehensive dashboard analytics from the entire reports database.
 */
export const getAIDashboardAnalytics = async (reports: DiagnosticReport[]): Promise<AIAnalyticsDashboardResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const simplifiedData = reports.map(r => ({
      species: r.species,
      location: `${r.village}, ${r.mandal}, ${r.district}`,
      summary: r.conciseSummary,
      date: r.dateOfReport,
      remarks: r.otherRemarks?.substring(0, 100)
    }));

    const prompt = `
      Analyze the following veterinary diagnostic dataset from the Allagadda/Nandyal region.
      DATA: ${JSON.stringify(simplifiedData)}

      Instructions:
      1. Synthesize the data to identify common disease patterns specific to the Andhra Pradesh landscape (e.g., seasonal disease outbreaks, mineral deficiency clusters).
      2. Analyze farmer addresses to identify geographical disease hotspots in Allagadda mandal and surrounding areas.
      3. Determine an overall regional Risk Level (Low, Moderate, High) based on the severity of findings.
      4. Provide 3 specific veterinary recommendations for the district veterinary officer (e.g., mass deworming camps, mineral supplement distribution).
      5. Create 3 chart objects for visualization:
         - "Disease Prevalence": Bar chart of found conditions.
         - "Hotspot Analysis": Bar chart of cases per village.
         - "Species Vulnerability": Pie chart of species affected.

      Return as JSON.
    `;

    // Using gemini-3-pro-preview for complex epidemiological synthesis task
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            charts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, description: "bar, pie, or area" },
                  data: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.NUMBER }
                      },
                      required: ["label", "value"]
                    }
                  }
                },
                required: ["title", "type", "data"]
              }
            },
            narrativeInsight: { type: Type.STRING },
            riskLevel: { type: Type.STRING, description: "Low, Moderate, or High" },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["charts", "narrativeInsight", "riskLevel", "recommendations"]
        }
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Dashboard Analytics Error:", error);
    throw error;
  }
};