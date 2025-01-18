// // src/services/aiService.js

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export const analyzeDocument = async (documentContent) => {
//   try {
//     const prompt = `Analyze this document and provide:
//     1. A brief summary
//     2. Key points
//     3. Risk assessment (if any)
//     4. Suggested actions
    
//     Document content:
//     ${documentContent}`;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Error analyzing document:", error);
//     throw error;
//   }
// };

// export const suggestImprovements = async (documentContent) => {
//   try {
//     const prompt = `Review this document and suggest improvements for:
//     1. Clarity
//     2. Completeness
//     3. Legal compliance (if applicable)
//     4. Risk mitigation
    
//     Document content:
//     ${documentContent}`;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Error generating suggestions:", error);
//     throw error;
//   }
// };








import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

if (!process.env.VITE_GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeDocument = async (documentContent: string): Promise<string> => {
  try {
    const prompt = `Analyze this document and provide:
    1. A brief summary
    2. Key points
    3. Risk assessment (if any)
    4. Suggested actions
    
    Document content:
    ${documentContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
};

export const suggestImprovements = async (documentContent: string): Promise<string> => {
  try {
    const prompt = `Review this document and suggest improvements for:
    1. Clarity
    2. Completeness
    3. Legal compliance (if applicable)
    4. Risk mitigation
    
    Document content:
    ${documentContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw error;
  }
};