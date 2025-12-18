
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "./types";

export const getFinancialInsights = async (transactions: Transaction[], partnerA: string, partnerB: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API Key missing");
    return "Configure a API Key para receber insights financeiros.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const summary = transactions.slice(0, 20).map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    member: t.member,
    description: t.description,
    date: t.date
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise estas transações recentes de ${partnerA} e ${partnerB} e forneça 3 dicas práticas em português brasil: ${JSON.stringify(summary)}`,
      config: {
        systemInstruction: "Você é um consultor financeiro de casais focado em economia doméstica e harmonia financeira. Seja direto, motivador e use uma linguagem amigável.",
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Não foi possível analisar os dados no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao processar os insights. Tente novamente em alguns instantes.";
  }
};
