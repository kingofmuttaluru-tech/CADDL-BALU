import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticReport, LabTestEntry } from "../types";

export interface AIAnalysisResponse {
  detailedAnalysis: string;
  conciseSummary: string;
  recommendations: string[];
}

export interface AIChartData {
  label: string;
  value: number;
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

    const prompt = `Act as a Senior Veterinary Pathologist at CADDL, Allagadda. Analyze findings for a ${report.species} (${report.breed}, ${report.age}). 
    Context: Allagadda/Nandyal endemic diseases include Hemorrhagic Septicemia (HS), Black Quarter (BQ), Peste des Petits Ruminants (PPR), and regional mineral deficiencies.
    FINDINGS: ${findingsText}
    Task: 
    1. Provide a detailed clinical analysis of the laboratory findings.
    2. Provide a concise summary of the primary diagnosis or differential diagnosis.
    3. Provide evidence-based treatment or management recommendations specifically tailored to the ${report.species} species and the identified pathological findings.
    Return JSON: {detailedAnalysis: string, conciseSummary: string, recommendations: string[]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedAnalysis: { type: Type.STRING },
            conciseSummary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Evidence-based veterinary treatment or management steps."
            }
          },
          required: ["detailedAnalysis", "conciseSummary", "recommendations"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    const formattedRecommendations = (result.recommendations || [])
      .map((r: string) => `• ${r}`)
      .join('\n');

    return {
      detailedAnalysis: `${result.detailedAnalysis}\n\n--- CLINICAL SUMMARY ---\n${result.conciseSummary}\n\n--- TREATMENT & MANAGEMENT ---\n${formattedRecommendations || 'Follow standard clinical protocols.'}`,
      conciseSummary: result.conciseSummary,
      recommendations: result.recommendations || []
    };
  } catch (error) {
    return { 
      detailedAnalysis: "Error generating analysis.", 
      conciseSummary: "Manual review required.",
      recommendations: ["Consult with senior veterinarian immediately."]
    };
  }
};

export const getAIDashboardAnalytics = async (reports: DiagnosticReport[]): Promise<AIAnalyticsDashboardResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const simplifiedData = reports.map(r => ({ species: r.species, summary: r.conciseSummary, date: r.dateOfReport }));
    const prompt = `Analyze regional data for Allagadda: ${JSON.stringify(simplifiedData)}. Return JSON dashboard stats.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            charts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type:Type.STRING}, type:{type:Type.STRING}, data:{type:Type.ARRAY, items:{type:Type.OBJECT, properties:{label:{type:Type.STRING}, value:{type:Type.NUMBER}}}}}}},
            narrativeInsight: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw error;
  }
};

/**
 * AI Image Captioning for Gallery
 */
export const getImageDescription = async (base64Data: string): Promise<{ caption: string, category: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Data.split(',')[1] } };
    const textPart = { text: "Act as a veterinary laboratory expert. Describe this clinical image (parasite, sample, equipment, or symptom) in one professional sentence. Also categorize it into one of these: Parasitology, Pathology, Equipment, Clinical Site, or Other. Return JSON: { caption: string, category: string }" };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["caption", "category"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Gallery Error:", error);
    return { caption: "Clinical image uploaded to CADDL gallery.", category: "Uncategorized" };
  }
};