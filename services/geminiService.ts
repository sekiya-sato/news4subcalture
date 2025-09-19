import { GoogleGenAI } from "@google/genai";
import type { Article, FetchNewsResult, GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `コスプレ、アイドル、アニメ、ライトノベルに関する日本の最新の主要なニュースを10件、以下のJSON配列の形式で返してください。各項目にはタイトル、短い要約、元の記事へのURLを含めてください。マークダウンの \`\`\`json ... \`\`\` ブロックで囲んでください。

[
  {
    "title": "ニュースのタイトル",
    "summary": "ニュースの要約（150文字程度）",
    "url": "https://example.com/news-article-1"
  },
  {
    "title": "別のニュースのタイトル",
    "summary": "別のニュースの要約（150文字程度）",
    "url": "https://example.com/news-article-2"
  }
]
`;

const cleanAndParseJson = (rawText: string): Article[] => {
    // Remove markdown fences and trim whitespace
    const jsonString = rawText.replace(/^```json\s*|```$/g, '').trim();
    try {
        const parsed = JSON.parse(jsonString);
        // Basic validation - imageUrl is optional, so we don't check for it here
        if (Array.isArray(parsed) && parsed.every(item => 'title' in item && 'summary' in item && 'url' in item)) {
            return parsed as Article[];
        }
        throw new Error("Parsed JSON does not match expected Article structure.");
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        throw new Error("AIからの応答を解析できませんでした。形式が正しくない可能性があります。");
    }
}

export const fetchJapaneseNews = async (): Promise<FetchNewsResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: PROMPT,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const articles = cleanAndParseJson(response.text);
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        return { articles, sources };
    } catch (error) {
        console.error("Error fetching news from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`ニュースの取得に失敗しました: ${error.message}`);
        }
        throw new Error("ニュースの取得中に不明なエラーが発生しました。");
    }
};