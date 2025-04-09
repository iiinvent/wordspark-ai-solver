
import React, { useState, useEffect } from "react";
import { fetchOpenRouterModels, getSelectedModel, setSelectedModel, OpenRouterModel } from "@/services/apiService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  onModelSelect: (model: string) => void;
}

const ModelSelector = ({ onModelSelect }: ModelSelectorProps) => {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [selectedModel, setSelectedModelState] = useState<string>(getSelectedModel() || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const availableModels = await fetchOpenRouterModels();
        setModels(availableModels);
        
        // If we have a stored model, verify it's still in the list
        const currentModel = getSelectedModel();
        if (currentModel && availableModels.some(model => model.id === currentModel)) {
          setSelectedModelState(currentModel);
        } else if (availableModels.length > 0) {
          // Select the first model by default
          handleModelChange(availableModels[0].id);
        }
      } catch (error) {
        console.error("Failed to load models:", error);
        setError(error instanceof Error ? error.message : "Failed to load models");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModels();
  }, []);
  
  const handleModelChange = (modelId: string) => {
    setSelectedModelState(modelId);
    setSelectedModel(modelId);
    onModelSelect(modelId);
  };
  
  if (isLoading) {
    return <div className="text-sm text-slate-400">Loading models...</div>;
  }
  
  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor="model-selector">Select AI Model</Label>
      <Select 
        value={selectedModel} 
        onValueChange={handleModelChange}
      >
        <SelectTrigger id="model-selector" className="puzzle-input">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-stone-900 border-stone-800">
          {models.map(model => (
            <SelectItem key={model.id} value={model.id} className="text-white hover:bg-stone-800">
              {model.name || model.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedModel && (
        <p className="text-xs text-slate-400">
          {models.find(m => m.id === selectedModel)?.description || "No description available"}
        </p>
      )}
    </div>
  );
};

export default ModelSelector;
