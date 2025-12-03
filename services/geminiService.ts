import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Format product catalog for the AI context
const catalogContext = PRODUCTS.map(p => 
  `ID: ${p.id}, Artist: ${p.artist}, Album: ${p.album}, Genre: ${p.genre}, Price: $${p.price}, Condition: ${p.condition}, Rarity: ${p.rarity}`
).join('\n');

const systemPrompt = `
You are "Spin", the expert vinyl assistant for TEHRAN RECORDS. 
You have deep knowledge of music history, genres, artists, and specifically the products we sell.

Our Brand:
- Name: TEHRAN RECORDS
- Slogan: FIND YOUR MUSIC IN SPIN CITY TEHRAN
- Vibe: Vintage, High-End, Audiophile.

Your Capabilities:
1. Answer questions about music history, artist facts, and genre recommendations.
2. Help users find records in our inventory (provided below).
3. If a user asks for a product we have, provide the details and suggest they "Click the WhatsApp button" to buy.
4. Keep responses concise, stylish, and helpful. Use music emojis (🎵, 💿, 🎹) sparingly.

Current Inventory:
${catalogContext}

If a user asks to buy something, instruct them to use the green WhatsApp button on the product card or the bottom of the screen.
`;

export const generateChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      console.error("API Key is missing");
      return "I'm currently offline (API Key missing). Please browse our collection manually.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Convert internal message format to Gemini history format
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
      },
      history: chatHistory
    });

    const response = await chat.sendMessage({ message: userMessage });

    return response.text || "I'm scratching the record... could you repeat that?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My needle skipped. Please try again later.";
  }
};