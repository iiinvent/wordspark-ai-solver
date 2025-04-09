
import { SearchParams } from "@/components/SearchForm";
import { WordResult } from "@/components/ResultCard";

// In a real app, this would be in an environment variable
// For now, we'll assume we'd get it from a form or localStorage
let OPENROUTER_API_KEY = "";
let SELECTED_MODEL = "";
let ENABLE_CACHE = true;
let MAX_RESULTS = 10;

// Cache for storing search results
const searchCache = new Map<string, { timestamp: number, results: WordResult[] }>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const setApiKey = (key: string) => {
  OPENROUTER_API_KEY = key;
  localStorage.setItem("openrouter_api_key", key);
};

export const getApiKey = () => {
  if (!OPENROUTER_API_KEY) {
    OPENROUTER_API_KEY = localStorage.getItem("openrouter_api_key") || "";
  }
  return OPENROUTER_API_KEY;
};

export const setSelectedModel = (model: string) => {
  SELECTED_MODEL = model;
  localStorage.setItem("selected_model", model);
};

export const getSelectedModel = () => {
  if (!SELECTED_MODEL) {
    SELECTED_MODEL = localStorage.getItem("selected_model") || "";
  }
  return SELECTED_MODEL;
};

// Performance settings
export const setEnableCache = (enable: boolean) => {
  ENABLE_CACHE = enable;
  localStorage.setItem("enableCache", String(enable));
  
  // Clear cache if disabling
  if (!enable) {
    clearCache();
  }
};

export const getEnableCache = () => {
  const savedValue = localStorage.getItem("enableCache");
  if (savedValue !== null) {
    ENABLE_CACHE = savedValue === "true";
  }
  return ENABLE_CACHE;
};

export const setMaxResults = (value: number) => {
  MAX_RESULTS = value;
  localStorage.setItem("maxResults", String(value));
};

export const getMaxResults = () => {
  const savedValue = localStorage.getItem("maxResults");
  if (savedValue !== null) {
    MAX_RESULTS = Number(savedValue);
  }
  return MAX_RESULTS;
};

// Cache management
export const clearCache = () => {
  searchCache.clear();
};

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

// Fetch available models from OpenRouter
export const fetchOpenRouterModels = async (): Promise<OpenRouterModel[]> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching models: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

// Generate a cache key based on search parameters
const generateCacheKey = (params: SearchParams): string => {
  return JSON.stringify({
    wordLength: params.wordLength,
    letters: params.letters,
    clue: params.clue.toLowerCase().trim(),
    puzzleType: params.puzzleType,
    difficulty: params.difficulty,
    category: params.category
  });
};

// Check if cached results are valid
const getCachedResults = (params: SearchParams): WordResult[] | null => {
  if (!getEnableCache()) return null;
  
  const cacheKey = generateCacheKey(params);
  const cachedData = searchCache.get(cacheKey);
  
  if (cachedData) {
    const now = Date.now();
    if (now - cachedData.timestamp < CACHE_EXPIRY) {
      console.log("✅ Cache hit for:", params);
      return cachedData.results;
    } else {
      // Cache expired, remove it
      searchCache.delete(cacheKey);
    }
  }
  
  return null;
};

// Save results to cache
const cacheResults = (params: SearchParams, results: WordResult[]): void => {
  if (!getEnableCache()) return;
  
  const cacheKey = generateCacheKey(params);
  searchCache.set(cacheKey, {
    timestamp: Date.now(),
    results
  });
  console.log("💾 Cached results for:", params);
};

// Generate a prompt for the AI model
const generatePrompt = (params: SearchParams): string => {
  const { wordLength, letters, clue, puzzleType, difficulty, category } = params;
  
  // Create a pattern string from the letters
  const pattern = letters
    .map((letter) => (letter || "?"))
    .join("")
    .toLowerCase();
  
  let prompt = `As a word puzzle expert, I need to find a ${wordLength}-letter word `;
  
  // Add pattern constraints
  if (letters.some(letter => letter !== "")) {
    prompt += `that matches the pattern "${pattern}" where "?" represents any letter. `;
  }
  
  // Add clue information
  if (clue) {
    prompt += `The clue is: "${clue}". `;
  }
  
  // Add puzzle type
  prompt += `This is for a ${puzzleType} puzzle. `;
  
  // Add difficulty if specified
  if (difficulty !== "any") {
    prompt += `The difficulty level is ${difficulty}. `;
  }
  
  // Add category if specified
  if (category !== "any") {
    prompt += `The word should be a ${category === "proper-names" ? "proper name" : category.slice(0, -1)}. `;
  }
  
  prompt += `Provide a JSON array of the most likely ${wordLength}-letter words that match all these criteria, `;
  prompt += `with each object containing "word" (in UPPERCASE), "definition", "example" (a sentence using the word), and "confidence" (decimal from 0-1). `;
  prompt += `Sort them by relevance. Ensure factual accuracy and prioritize precise matches for factual queries (e.g., capitals). `;
  prompt += `Format the response as a valid JSON array without explanations or markdown.`;
  
  return prompt;
};

// Parse the AI response into WordResult objects
const parseAiResponse = (responseText: string): WordResult[] => {
  try {
    // Try to extract JSON if the response isn't pure JSON
    let jsonText = responseText.trim();
    
    // Look for JSON array in the response
    const jsonMatch = jsonText.match(/\[\s*{[\s\S]*}\s*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    // Parse the JSON
    const results = JSON.parse(jsonText);
    
    if (!Array.isArray(results)) {
      console.error("AI response is not an array:", results);
      return [];
    }
    
    // Map to WordResult format and validate
    return results.map((item, index) => ({
      id: `result-${index}-${Date.now()}`,
      word: typeof item.word === 'string' ? item.word.toUpperCase() : `UNKNOWN-${index}`,
      definition: typeof item.definition === 'string' ? item.definition : "No definition provided",
      example: typeof item.example === 'string' ? item.example : undefined,
      confidence: typeof item.confidence === 'number' && !isNaN(item.confidence) ? 
        Math.min(Math.max(item.confidence, 0), 1) : // Clamp between 0 and 1
        0.5, // Default confidence
      isSaved: false
    }));
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return [];
  }
};

// Implement the real word search using OpenRouter API
export const searchWords = async (params: SearchParams): Promise<WordResult[]> => {
  console.log("Searching with params:", params);
  
  // Check cache first
  const cachedResults = getCachedResults(params);
  if (cachedResults) {
    return cachedResults;
  }
  
  const apiKey = getApiKey();
  const selectedModel = getSelectedModel();
  
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  if (!selectedModel) {
    throw new Error("Please select an AI model first");
  }
  
  console.log("Using model:", selectedModel);
  
  try {
    const prompt = generatePrompt(params);
    console.log("Prompt:", prompt);
    
    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "WordSpark Puzzle Solver" // App name for OpenRouter
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are a word puzzle expert assistant that helps users find words matching specific patterns and clues. Always respond with accurate, factual information in the requested format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2, // Lower temperature for more precise answers
        max_tokens: 800,
        response_format: { type: "json_object" } // Request JSON format
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error (${response.status}): ${
          errorData.error?.message || response.statusText
        }`
      );
    }
    
    const data = await response.json();
    console.log("OpenRouter response:", data);
    
    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Unexpected API response format");
    }
    
    // Parse the response into WordResult objects
    const wordResults = parseAiResponse(content);
    
    // Apply max results limit
    const limitedResults = wordResults.slice(0, getMaxResults());
    
    // Cache the results
    cacheResults(params, limitedResults);
    
    return limitedResults;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw error;
  }
};
