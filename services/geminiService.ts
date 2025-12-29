
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticReport, LabTestEntry } from "../types";

export interface AIAnalysisResponse {
  detailedAnalysis: string;
  conciseSummary: string;
}

/**
 * Generates expert clinical insights using Gemini AI with structured JSON output.
 * Provides a deep-dive analysis and a separate concise summary.
 * The detailed analysis is augmented with the concise summary at the end to ensure long-term preservation in report remarks.
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
      1. DETAILED ANALYSIS: A professional medical breakdown including clinical significance of abnormalities. 
         Provide a prioritized list of differential diagnoses, specifically incorporating regional epidemiology of Andhra Pradesh and the Nandyal region. 
         Consider the high prevalence of endemic diseases such as:
         - Foot and Mouth Disease (FMD)
         - Hemorrhagic Septicemia (HS)
         - Black Quarter (BQ)
         - Blue Tongue (specifically in Ovine/Caprine species)
         - Peste des Petits Ruminants (PPR)
         - Anthrax (regional hotspots)
         - Trypanosomiasis and other Hemoprotozoan diseases.
         Include targeted recommendations for treatment or further confirmatory testing based on regional diagnostic protocols.

      2. CONCISE SUMMARY: A 1-2 sentence executive summary of the most likely diagnosis and the immediate primary action required.
      
      Tone: Professional, precise, and authoritative. Ensure the analysis is localized to the veterinary health landscape of South India.
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
              description: "Full medical analysis with significance, regional differentials, and recommendations."
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
    const detailed = result.detailedAnalysis || "No detailed analysis available.";
    const summary = result.conciseSummary || "No summary available.";

    return {
      // Appending the summary to the detailed analysis as requested to ensure it's captured in the report's remarks
      detailedAnalysis: `${detailed}\n\n--- CLINICAL SUMMARY ---\n${summary}`,
      conciseSummary: summary
    };
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    return {
      detailedAnalysis: "Error generating detailed analysis. Please manual review findings.",
      conciseSummary: "Clinical review required."
    };
  }
};
