
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { getApiKey, setApiKey } from "@/services/apiService";

interface ApiKeyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyForm = ({ isOpen, onClose }: ApiKeyFormProps) => {
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");
  const [error, setError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
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
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="puzzle-card max-w-md border-stone-800">
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
              Save API Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyForm;
