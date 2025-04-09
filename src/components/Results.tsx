
import React from "react";
import ResultCard, { WordResult } from "./ResultCard";
import ResultSkeleton from "./ResultSkeleton";
import { SearchParams } from "./SearchForm";
import { Button } from "@/components/ui/button";
import { FilterX, SortAsc, BookmarkCheck } from "lucide-react";

interface ResultsProps {
  results: WordResult[];
  searchParams?: SearchParams;
  isLoading: boolean;
  onSaveResult: (result: WordResult) => void;
  onClearResults: () => void;
  onToggleSavedFilter: () => void;
  showOnlySaved: boolean;
}

const Results = ({
  results,
  searchParams,
  isLoading,
  onSaveResult,
  onClearResults,
  onToggleSavedFilter,
  showOnlySaved,
}: ResultsProps) => {
  const hasResults = results.length > 0;
  const hasSearchParams = !!searchParams;
  
  // Show skeletons while loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Searching...</h2>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <ResultSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  // No results yet
  if (!hasResults && !hasSearchParams) {
    return null;
  }
  
  // No results after search
  if (!hasResults && hasSearchParams) {
    return (
      <div className="puzzle-card p-6 text-center">
        <h3 className="text-xl font-bold">No Results Found</h3>
        <p className="text-slate-400 mt-2">
          Try adjusting your search parameters or using fewer constraints.
        </p>
        <Button 
          onClick={onClearResults}
          className="puzzle-button-secondary mt-4"
        >
          <FilterX className="mr-2 h-4 w-4" />
          Clear Search
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">
          {showOnlySaved ? "Saved Words" : "Results"}
          <span className="text-sm font-normal text-slate-400 ml-2">
            {results.length} {results.length === 1 ? "word" : "words"}
          </span>
        </h2>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className={`text-sm ${
              showOnlySaved ? "bg-puzzle-accent text-white border-puzzle-accent" : "puzzle-button-secondary"
            }`}
            onClick={onToggleSavedFilter}
          >
            <BookmarkCheck className="mr-2 h-4 w-4" />
            {showOnlySaved ? "Show All" : "Saved Only"}
          </Button>
          
          {hasSearchParams && (
            <Button
              variant="outline"
              className="puzzle-button-secondary text-sm"
              onClick={onClearResults}
            >
              <FilterX className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {results.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            onSave={onSaveResult}
          />
        ))}
      </div>
    </div>
  );
};

export default Results;
