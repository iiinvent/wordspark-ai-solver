
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WordLengthSelector from "./WordLengthSelector";
import LetterInput from "./LetterInput";
import { Search } from "lucide-react";

export type PuzzleType = "crossword" | "anagram" | "word-game";
export type DifficultyLevel = "easy" | "medium" | "hard" | "any";
export type CategoryType = "any" | "nouns" | "verbs" | "adjectives" | "proper-names";

export interface SearchParams {
  wordLength: number;
  letters: string[];
  clue: string;
  puzzleType: PuzzleType;
  difficulty: DifficultyLevel;
  category: CategoryType;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

const SearchForm = ({ onSearch, isLoading = false }: SearchFormProps) => {
  const { toast } = useToast();
  const [wordLength, setWordLength] = useState<number>(5);
  const [letters, setLetters] = useState<string[]>(Array(wordLength).fill(""));
  const [clue, setClue] = useState<string>("");
  const [puzzleType, setPuzzleType] = useState<PuzzleType>("crossword");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("any");
  const [category, setCategory] = useState<CategoryType>("any");

  // Update letters array when word length changes
  React.useEffect(() => {
    setLetters(Array(wordLength).fill(""));
  }, [wordLength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that we have either some letters or a clue
    const hasLetters = letters.some(letter => letter !== "");
    if (!hasLetters && clue.trim() === "") {
      toast({
        title: "Missing input",
        description: "Please enter some known letters or a clue to search.",
        variant: "destructive",
      });
      return;
    }
    
    onSearch({
      wordLength,
      letters,
      clue,
      puzzleType,
      difficulty,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 puzzle-card p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Word Pattern</h2>
        
        <div className="space-y-2">
          <Label htmlFor="word-length">Word Length</Label>
          <WordLengthSelector 
            value={wordLength} 
            onChange={setWordLength} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="letter-input">Known Letters</Label>
          <p className="text-sm text-slate-400">
            Enter known letters or use "?" for unknown positions
          </p>
          <LetterInput
            length={wordLength}
            onChange={setLetters}
            className="pt-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clue">Clue or Hint</Label>
          <Input
            id="clue"
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            className="puzzle-input"
            placeholder="Enter a clue or description"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Search Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="puzzle-type">Puzzle Type</Label>
            <Select 
              value={puzzleType} 
              onValueChange={(value) => setPuzzleType(value as PuzzleType)}
            >
              <SelectTrigger className="puzzle-input">
                <SelectValue placeholder="Puzzle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crossword">Crossword</SelectItem>
                <SelectItem value="anagram">Anagram</SelectItem>
                <SelectItem value="word-game">Word Game</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select 
              value={difficulty} 
              onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
            >
              <SelectTrigger className="puzzle-input">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as CategoryType)}
            >
              <SelectTrigger className="puzzle-input">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Category</SelectItem>
                <SelectItem value="nouns">Nouns</SelectItem>
                <SelectItem value="verbs">Verbs</SelectItem>
                <SelectItem value="adjectives">Adjectives</SelectItem>
                <SelectItem value="proper-names">Proper Names</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="puzzle-button w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
            Searching...
          </span>
        ) : (
          <span className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Find Word Solutions
          </span>
        )}
      </Button>
    </form>
  );
};

export default SearchForm;
