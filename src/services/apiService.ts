
import { SearchParams } from "@/components/SearchForm";
import { WordResult } from "@/components/ResultCard";

// In a real app, this would be in an environment variable
// For now, we'll assume we'd get it from a form or localStorage
let OPENROUTER_API_KEY = "";

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

// This function simulates searching for words using AI
// In a real application, this would call the OpenRouter API
export const searchWords = async (params: SearchParams): Promise<WordResult[]> => {
  console.log("Searching with params:", params);
  
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  // For demo purposes, we'll simulate an API call and return mock data
  // In a real application, we would call the OpenRouter API here
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a pattern from the letters
      const pattern = params.letters
        .map((letter) => (letter || "?"))
        .join("")
        .toLowerCase();
      
      // Simulate API response based on the pattern and clue
      const mockResults = generateMockResults(pattern, params);
      resolve(mockResults);
    }, 1500); // Simulate network delay
  });
};

// Helper function to generate mock results
const generateMockResults = (pattern: string, params: SearchParams): WordResult[] => {
  const { wordLength, clue, puzzleType, difficulty, category } = params;
  
  // Common 5-letter words for demo purposes
  const wordBank = {
    5: [
      { word: "ABOUT", def: "On the subject of; concerning.", example: "They were talking about you." },
      { word: "ABOVE", def: "In or to a higher place.", example: "The clouds above were dark and threatening." },
      { word: "ACTOR", def: "A person who performs in a play, film, etc.", example: "The actor won an award for his performance." },
      { word: "ADAPT", def: "To adjust or modify to suit new conditions.", example: "The company had to adapt to the changing market." },
      { word: "ADMIT", def: "To acknowledge or confess something.", example: "She admitted her mistake." },
      { word: "ADOPT", def: "To legally take another's child as one's own.", example: "They decided to adopt a baby from overseas." },
      { word: "ADULT", def: "A person who is fully grown or developed.", example: "The movie is intended for adult audiences." },
      { word: "AFTER", def: "Later in time than; following.", example: "We'll meet after dinner." },
      { word: "AGAIN", def: "Once more; another time.", example: "Can you say that again?" },
      { word: "AGENT", def: "A person who acts on behalf of another.", example: "He's a real estate agent." },
      { word: "AGREE", def: "To have the same opinion.", example: "We all agree on the plan." },
      { word: "AHEAD", def: "In front; in advance.", example: "The team is ahead by two points." },
      { word: "ALARM", def: "A warning of danger.", example: "The fire alarm went off." }
    ],
    4: [
      { word: "ABLE", def: "Having the power, skill, means, or opportunity to do something.", example: "She was able to solve the puzzle quickly." },
      { word: "ACID", def: "A chemical substance with a pH less than 7.", example: "Citric acid gives lemons their sour taste." },
      { word: "AGED", def: "Having lived or existed for a specified length of time.", example: "The aged cheese had a strong flavor." },
      { word: "ALSO", def: "In addition; too; besides.", example: "She sings and also plays guitar." },
      { word: "AREA", def: "A particular part of a place, piece of land, or country.", example: "This area of the city is known for its restaurants." },
      { word: "ARMY", def: "A large organized body of armed personnel trained for war.", example: "He joined the army after college." },
      { word: "AWAY", def: "To or at a distance from a particular place or person.", example: "She walked away without saying goodbye." },
      { word: "BABY", def: "A very young child.", example: "The baby smiled at its mother." },
      { word: "BACK", def: "The rear surface of the human body.", example: "He hurt his back lifting the heavy box." },
      { word: "BALL", def: "A solid or hollow spherical object used in games.", example: "They played with a beach ball." }
    ],
    6: [
      { word: "ACTION", def: "The process of doing something.", example: "The government took action on climate change." },
      { word: "ACTIVE", def: "Engaging or ready to engage in physically energetic pursuits.", example: "He leads an active lifestyle." },
      { word: "ACTUAL", def: "Existing in fact, real.", example: "The actual cost was higher than expected." },
      { word: "ADJUST", def: "To alter or move something slightly to achieve the desired fit or appearance.", example: "You need to adjust your posture when sitting." },
      { word: "ADMIRE", def: "To regard with respect or warm approval.", example: "I admire your courage." },
      { word: "ADVICE", def: "Guidance or recommendations offered with regard to future action.", example: "She gave me some good advice." },
      { word: "AFFORD", def: "To have enough money to pay for something.", example: "We can't afford a new car right now." },
      { word: "AFRAID", def: "Feeling fear or anxiety; frightened.", example: "She's afraid of spiders." },
      { word: "AGENCY", def: "A business or organization providing a particular service.", example: "They hired an advertising agency." },
      { word: "AGENDA", def: "A list of items to be discussed at a meeting.", example: "The first item on the agenda is the budget." }
    ]
  };
  
  // Get words that match the word length
  let availableWords = wordBank[wordLength as keyof typeof wordBank] || [];
  
  // Filter by pattern (if any non-? characters exist)
  if (pattern.includes("?") && pattern.length === wordLength) {
    availableWords = availableWords.filter(item => {
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== "?" && pattern[i].toUpperCase() !== item.word[i]) {
          return false;
        }
      }
      return true;
    });
  }
  
  // Filter by clue (if provided)
  if (clue) {
    const clueWords = clue.toLowerCase().split(/\s+/);
    availableWords = availableWords.filter(item => {
      const combinedText = (item.def + " " + (item.example || "")).toLowerCase();
      return clueWords.some(word => combinedText.includes(word));
    });
  }
  
  // If no matching words, return some default ones
  if (availableWords.length === 0) {
    availableWords = (wordBank[wordLength as keyof typeof wordBank] || []).slice(0, 5);
  }
  
  // Limit to 10 results
  availableWords = availableWords.slice(0, 10);
  
  // Convert to WordResult format with confidence scores
  return availableWords.map((item, index) => ({
    id: `result-${index}-${Date.now()}`,
    word: item.word,
    definition: item.def,
    example: item.example,
    confidence: 0.95 - (index * 0.07), // Decreasing confidence for demo
    isSaved: false
  }));
};
