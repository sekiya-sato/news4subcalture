export interface Article {
  title: string;
  summary: string;
  url: string;
}

export interface GroundingChunk {
  web?: {
    // FIX: Made `uri` and `title` optional to match the GroundingChunk type from the @google/genai library.
    uri?: string;
    title?: string;
  };
}

export interface FetchNewsResult {
    articles: Article[];
    sources: GroundingChunk[];
}