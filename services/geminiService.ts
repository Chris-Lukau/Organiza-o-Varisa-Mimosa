
import { GoogleGenAI } from "@google/genai";

// Fix: Correct initialization using named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string, brand: string): Promise<string> => {
  // Fix: Removed manual API_KEY check; assumed pre-configured and valid as per guidelines
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Escreva uma descrição profissional e técnica de vendas para uma peça de carro chamada "${productName}" da marca "${brand}" na categoria "${category}". Use no máximo 200 caracteres.`,
    });
    // Fix: Access response.text directly (not as a method)
    return response.text || "Sem descrição disponível.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao gerar descrição inteligente.";
  }
};

export const getStoreInsights = async (salesData: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise estes dados de vendas e forneça 3 dicas rápidas para melhorar o negócio: ${JSON.stringify(salesData)}`,
    });
    // Fix: Access response.text directly (not as a method)
    return response.text || "Análise indisponível.";
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Ocorreu um erro ao processar os insights.";
  }
};
