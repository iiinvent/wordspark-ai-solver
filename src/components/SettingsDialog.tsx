
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ModelSelector from "@/components/ModelSelector";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog = ({ isOpen, onClose }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [enableCache, setEnableCache] = useState(true);
  const [maxResults, setMaxResults] = useState(10);
  
  const handleModelSelect = (modelId: string) => {
    toast({
      title: "Model updated",
      description: `You've changed the AI model for WordSpark.`,
    });
  };
  
  const handleCacheToggle = (checked: boolean) => {
    setEnableCache(checked);
    localStorage.setItem("enableCache", String(checked));
    toast({
      title: checked ? "Cache enabled" : "Cache disabled",
      description: checked 
        ? "Common searches will be cached for faster results" 
        : "Search results will always be fresh",
    });
  };
  
  const handleMaxResultsChange = (values: number[]) => {
    const value = values[0];
    setMaxResults(value);
    localStorage.setItem("maxResults", String(value));
    toast({
      title: "Results limit updated",
      description: `Maximum number of results set to ${value}`,
    });
  };
  
  // Load saved settings on first render
  React.useEffect(() => {
    const savedCache = localStorage.getItem("enableCache");
    if (savedCache !== null) {
      setEnableCache(savedCache === "true");
    }
    
    const savedMaxResults = localStorage.getItem("maxResults");
    if (savedMaxResults !== null) {
      setMaxResults(Number(savedMaxResults));
    }
  }, []);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="puzzle-card max-w-md border-stone-800">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Customize your WordSpark experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">AI Model</h3>
            <p className="text-sm text-slate-400">
              Select which AI model to use for word searches
            </p>
            <ModelSelector onModelSelect={handleModelSelect} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cache-toggle">Enable Caching</Label>
                <p className="text-xs text-slate-400">
                  Store common searches for faster results
                </p>
              </div>
              <Switch 
                id="cache-toggle" 
                checked={enableCache}
                onCheckedChange={handleCacheToggle}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-results">Maximum Results</Label>
                <span className="text-sm text-slate-400">{maxResults}</span>
              </div>
              <Slider
                id="max-results"
                min={5}
                max={30}
                step={5}
                value={[maxResults]}
                onValueChange={handleMaxResultsChange}
              />
              <p className="text-xs text-slate-400">
                Adjust how many results to show at once
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
