
import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, BookmarkCheck, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WordResult {
  id: string;
  word: string;
  definition: string;
  example?: string;
  confidence: number;
  isSaved?: boolean;
}

interface ResultCardProps {
  result: WordResult;
  onSave: (result: WordResult) => void;
  className?: string;
}

const ResultCard = ({ result, onSave, className }: ResultCardProps) => {
  const confidenceColor = React.useMemo(() => {
    if (result.confidence >= 0.8) return "text-puzzle-success";
    if (result.confidence >= 0.5) return "text-yellow-400";
    return "text-slate-400";
  }, [result.confidence]);

  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <div 
      className={cn(
        "puzzle-card p-4 animate-fade-in",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{result.word}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-transparent"
          onClick={() => onSave(result)}
          aria-label={result.isSaved ? "Remove from saved" : "Save word"}
        >
          {result.isSaved ? (
            <BookmarkCheck className="h-5 w-5 text-puzzle-accent" />
          ) : (
            <BookmarkPlus className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="mt-1 flex items-center">
        <div 
          className={cn(
            "text-sm font-medium",
            confidenceColor
          )}
        >
          {confidencePercentage}% match
        </div>
        <div className="ml-3 flex space-x-1">
          {result.confidence >= 0.7 ? (
            <ThumbsUp className="h-4 w-4 text-puzzle-success" />
          ) : result.confidence <= 0.3 ? (
            <ThumbsDown className="h-4 w-4 text-red-400" />
          ) : null}
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-slate-300">{result.definition}</p>
        {result.example && (
          <p className="mt-2 text-sm text-slate-400 italic">
            "{result.example}"
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
