
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ModelSelector from "@/components/ModelSelector";
import { useToast } from "@/components/ui/use-toast";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog = ({ isOpen, onClose }: SettingsDialogProps) => {
  const { toast } = useToast();
  
  const handleModelSelect = (modelId: string) => {
    toast({
      title: "Model updated",
      description: `You've changed the AI model for WordSpark.`,
    });
  };
  
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
