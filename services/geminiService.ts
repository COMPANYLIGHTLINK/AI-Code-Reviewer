
import { GoogleGenAI, Type } from "@google/genai";
import type { CodeReviewResponse } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const reviewSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, one or two-sentence summary of the code quality and key findings."
    },
    feedback: {
      type: Type.ARRAY,
      description: "A list of detailed feedback items for the code.",
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "The category of the feedback. Must be one of: 'Bug', 'Style', 'Performance', 'Best Practice', 'Security'.",
            enum: ['Bug', 'Style', 'Performance', 'Best Practice', 'Security'],
          },
          line: {
            type: Type.INTEGER,
            description: "The approximate line number in the code to which the feedback applies. Omit if it applies to the whole file."
          },
          comment: {
            type: Type.STRING,
            description: "The detailed feedback, suggestion, or explanation."
          }
        },
        required: ["category", "comment"]
      }
    }
  },
  required: ["summary", "feedback"]
};

export const reviewCode = async (code: string, language: string): Promise<CodeReviewResponse> => {
  const prompt = `
    You are an expert code reviewer with years of experience.
    Please provide a detailed, constructive review of the following ${language} code.
    Focus on identifying potential bugs, security vulnerabilities, performance bottlenecks, and violations of best practices and style guidelines.
    For each piece of feedback, provide the category, the relevant line number, and a clear, concise comment.
    Provide an overall summary of the code quality.
    Format your response as a JSON object that adheres to the provided schema. If there are no issues, return an empty array for the feedback.

    Code to review:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reviewSchema,
      },
    });

    if (!response.text) {
        throw new Error("Received an empty response from the API.");
    }
    
    // The response text is already a guaranteed JSON string due to responseSchema
    const parsedResponse = JSON.parse(response.text);

    // Basic validation to ensure the parsed object matches our expected structure
    if (typeof parsedResponse.summary !== 'string' || !Array.isArray(parsedResponse.feedback)) {
      throw new Error("API response does not match the expected format.");
    }

    return parsedResponse as CodeReviewResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get code review: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing the code.");
  }
};
