
// Use exact import formatting from guidelines
import {GoogleGenAI} from "@google/genai";

// Fix: Moved GoogleGenAI instantiation inside functions to ensure the most up-to-date API key is used
export const generateProductDescription = async (productName: string, category: string, brand: string): Promise<string> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Escreva uma descrição profissional e técnica de vendas para uma peça de carro chamada "${productName}" da marca "${brand}" na categoria "${category}". Use no máximo 200 caracteres.`,
    });
    // Fix: Access response.text directly as a property
    return response.text || "Sem descrição disponível.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao gerar descrição inteligente.";
  }
};

// Fix: Moved GoogleGenAI instantiation inside functions and updated model to pro-preview for complex analysis tasks
export const getStoreInsights = async (salesData: any): Promise<string> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise estes dados de vendas e forneça 3 dicas rápidas para melhorar o negócio: ${JSON.stringify(salesData)}`,
    });
    // Fix: Access response.text directly as a property
    return response.text || "Análise indisponível.";
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Ocorreu um erro ao processar os insights.";
  }
};
