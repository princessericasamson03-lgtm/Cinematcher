
import { GoogleGenAI, Type } from "@google/genai";
import { CineMatcherResponse, TimeOption } from "../types";

// Always use the latest API_KEY from the environment and initialize right before the call
export const getCineMatch = async (time: TimeOption, elements: string[]): Promise<CineMatcherResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Sei "CineMatcher AI", un esperto mondiale di cinema. 
    L'utente ha a disposizione il seguente tempo: "${time}".
    Ecco i 10 elementi di interesse dell'utente: ${elements.join(", ")}.

    Fornisci 3 raccomandazioni perfette seguendo rigorosamente queste istruzioni:
    - Adatta il formato (film, miniserie, serie) alla disponibilità di tempo.
    - Spiega SPECIFICAMENTE come gli elementi forniti si collegano alla scelta.
    - Sii preciso con le durate e suggerisci un ritmo di visione realistico.
    - Includi dettagli tecnici, trama evocativa e link a trailer reali.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                originalTitle: { type: Type.STRING },
                year: { type: Type.STRING },
                type: { type: Type.STRING },
                country: { type: Type.STRING },
                genre: { type: Type.STRING },
                totalDuration: { type: Type.STRING },
                timeNeeded: { type: Type.STRING },
                suggestedPacing: { type: Type.STRING },
                reason: { type: Type.STRING },
                plot: { type: Type.STRING },
                technicalDetails: {
                  type: Type.OBJECT,
                  properties: {
                    director: { type: Type.STRING },
                    cast: { type: Type.ARRAY, items: { type: Type.STRING } },
                    durationOrSeasons: { type: Type.STRING },
                    rating: { type: Type.STRING }
                  },
                  required: ["director", "cast", "durationOrSeasons", "rating"]
                },
                whereToWatch: { type: Type.STRING },
                trailerUrl: { type: Type.STRING },
                posterUrl: { type: Type.STRING }
              },
              required: ["title", "year", "type", "country", "genre", "totalDuration", "timeNeeded", "suggestedPacing", "reason", "plot", "technicalDetails", "whereToWatch", "trailerUrl", "posterUrl"]
            }
          },
          comparativeExplanation: { type: Type.STRING },
          timeManagement: { type: Type.STRING }
        },
        required: ["recommendations", "comparativeExplanation", "timeManagement"]
      }
    }
  });

  try {
    // Directly access .text property of the response
    const data = JSON.parse(response.text || "{}");
    return data as CineMatcherResponse;
  } catch (error) {
    console.error("Errore nel parsing della risposta Gemini", error);
    throw new Error("Impossibile processare le raccomandazioni cinematografiche.");
  }
};
