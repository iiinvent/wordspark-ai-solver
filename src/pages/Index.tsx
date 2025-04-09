
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchForm, { SearchParams } from "@/components/SearchForm";
import Results from "@/components/Results";
import Header from "@/components/Header";
import ApiKeyForm from "@/components/ApiKeyForm";
import { WordResult } from "@/components/ResultCard";
import { getApiKey, searchWords } from "@/services/apiService";

const Index = () => {
  const { toast } = useToast();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [results, setResults] = useState<WordResult[]>([]);
  const [savedResults, setSavedResults] = useState<WordResult[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  
  // Load saved words from localStorage on component mount
  useEffect(() => {
    const savedWords = localStorage.getItem("savedWords");
    if (savedWords) {
      try {
        setSavedResults(JSON.parse(savedWords));
      } catch (error) {
        console.error("Error loading saved words:", error);
      }
    }
    
    // Check if API key exists, if not open the modal
    if (!getApiKey()) {
      setIsApiKeyModalOpen(true);
    }
  }, []);
  
  // Save words to localStorage when they change
  useEffect(() => {
    localStorage.setItem("savedWords", JSON.stringify(savedResults));
  }, [savedResults]);
  
  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setSearchParams(params);
    setShowOnlySaved(false);
    
    try {
      // Check for API key
      if (!getApiKey()) {
        setIsApiKeyModalOpen(true);
        setIsLoading(false);
        return;
      }
      
      // Call API service
      const wordResults = await searchWords(params);
      
      // Mark any saved words
      const markedResults = wordResults.map(result => ({
        ...result,
        isSaved: savedResults.some(saved => saved.word === result.word)
      }));
      
      setResults(markedResults);
      
      // Show toast for results
      toast({
        title: `Found ${wordResults.length} words`,
        description: wordResults.length > 0 
          ? `Showing matches for your search` 
          : "No words found matching your criteria",
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveResult = (result: WordResult) => {
    // Toggle saved status
    if (result.isSaved) {
      // Remove from saved
      setSavedResults(prev => prev.filter(item => item.word !== result.word));
      
      // Update in results array
      setResults(prev => 
        prev.map(item => 
          item.word === result.word 
            ? { ...item, isSaved: false } 
            : item
        )
      );
      
      toast({
        title: "Word removed",
        description: `Removed "${result.word}" from saved words`,
      });
    } else {
      // Add to saved
      const savedWord = { ...result, isSaved: true };
      setSavedResults(prev => [...prev, savedWord]);
      
      // Update in results array
      setResults(prev => 
        prev.map(item => 
          item.word === result.word 
            ? { ...item, isSaved: true } 
            : item
        )
      );
      
      toast({
        title: "Word saved",
        description: `Saved "${result.word}" for future reference`,
      });
    }
  };
  
  const handleClearResults = () => {
    setResults([]);
    setSearchParams(undefined);
    setShowOnlySaved(false);
  };
  
  const handleToggleSavedFilter = () => {
    setShowOnlySaved(prev => !prev);
  };
  
  // Determine which results to display
  const displayResults = showOnlySaved 
    ? savedResults 
    : results;
  
  return (
    <div className="min-h-screen bg-puzzle-dark text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <Header onOpenApiKeyForm={() => setIsApiKeyModalOpen(true)} />
        
        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <SearchForm 
                onSearch={handleSearch} 
                isLoading={isLoading} 
              />
            </div>
            
            <div className="lg:col-span-7">
              <Results 
                results={displayResults}
                searchParams={searchParams}
                isLoading={isLoading}
                onSaveResult={handleSaveResult}
                onClearResults={handleClearResults}
                onToggleSavedFilter={handleToggleSavedFilter}
                showOnlySaved={showOnlySaved}
              />
            </div>
          </div>
        </main>
        
        <footer className="py-6 text-center text-sm text-slate-500">
          <p>WordSpark AI Puzzle Solver &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
      
      <ApiKeyForm
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export default Index;
