import { CONFIG } from '@common';
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_GENERATIVEAI_API_KEY);
// const genAI = new GoogleGenerativeAI(GOOGLE_GENERATIVEAI_API_KEY);

export const generateContent = async (prompt: string) => {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
};
