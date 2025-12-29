
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticReport, LabTestEntry } from "../types";

export interface AIAnalysisResponse {
  detailedAnalysis: string;
  conciseSummary: string;
}

/**
 * Generates expert clinical insights using Gemini AI with structured JSON output.
 * Provides a deep-dive analysis and a separate concise summary.
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
      Analyze these laboratory findings for a ${report.species} (${report.breed}, ${report.age}/${report.sex}).
      
      LABORATORY FINDINGS:
      ${findingsText}
      
      Your task is to provide:
      1. DETAILED ANALYSIS: A professional medical breakdown including clinical significance of abnormalities, a prioritized list of differential diagnoses (specifically highlighting endemic diseases in the Andhra Pradesh/Nandyal region), and targeted recommendations for treatment or further testing.
      2. CONCISE SUMMARY: A 1-2 sentence executive summary of the most likely diagnosis and the immediate primary action required.
      
      Tone: Professional, precise, and authoritative.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 10000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedAnalysis: {
              type: Type.STRING,
              description: "Full medical analysis with significance, differentials, and recommendations."
            },
            conciseSummary: {
              type: Type.STRING,
              description: "1-2 sentence high-level clinical summary."
            }
          },
          required: ["detailedAnalysis", "conciseSummary"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      detailedAnalysis: result.detailedAnalysis || "No detailed analysis available.",
      conciseSummary: result.conciseSummary || "No summary available."
    };
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    return {
      detailedAnalysis: "Error generating detailed analysis. Please manual review findings.",
      conciseSummary: "Clinical review required."
    };
  }
};
