
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { getApiKey, setApiKey } from "@/services/apiService";
import ModelSelector from "@/components/ModelSelector";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyForm = ({ isOpen, onClose }: ApiKeyFormProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");
  const [verifiedKey, setVerifiedKey] = useState(getApiKey() || "");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"key" | "model">(getApiKey() ? "model" : "key");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }
    
    // Simple validation (this would be more robust in a real app)
    if (apiKey.length < 10) {
      setError("API key appears to be invalid");
      return;
    }
    
    // Save the API key
    setApiKey(apiKey.trim());
    setError("");
    setVerifiedKey(apiKey.trim());
    setStep("model"); // Move to model selection after key validation
  };
  
  const handleModelSelect = (modelId: string) => {
    toast({
      title: "Model selected",
      description: `You've selected a model. You can now use WordSpark!`,
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="puzzle-card max-w-md border-stone-800">
        {step === "key" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-puzzle-accent" />
                <span>OpenRouter API Key</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Enter your OpenRouter API key to enable word searches.
                This will be stored locally in your browser.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  className="puzzle-input"
                  placeholder="sk-or-v1-..."
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              
              <p className="text-sm text-slate-400">
                Don't have an API key?{" "}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-puzzle-accent hover:underline"
                >
                  Get one here
                </a>
              </p>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="submit" className="puzzle-button">
                Verify Key & Continue
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>Select AI Model</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Choose an AI model to use for word searches.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <ModelSelector onModelSelect={handleModelSelect} />
            </div>
            
            <DialogFooter className="mt-6 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep("key")}
                className="border-stone-700 hover:bg-stone-800"
              >
                Back to API Key
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyForm;
