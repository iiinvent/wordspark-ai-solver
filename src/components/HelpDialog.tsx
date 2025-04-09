
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpDialog = ({ isOpen, onClose }: HelpDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="puzzle-card max-w-md border-stone-800">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-slate-400">
            Speed up your workflow with these shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Search</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-puzzle-accent font-mono">Ctrl + Enter</div>
              <div className="text-slate-300">Submit search</div>
              
              <div className="text-puzzle-accent font-mono">Tab</div>
              <div className="text-slate-300">Navigate between fields</div>
              
              <div className="text-puzzle-accent font-mono">↑ / ↓</div>
              <div className="text-slate-300">Adjust word length</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Results</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-puzzle-accent font-mono">Ctrl + S</div>
              <div className="text-slate-300">Toggle saved words</div>
              
              <div className="text-puzzle-accent font-mono">Ctrl + C</div>
              <div className="text-slate-300">Clear results</div>
              
              <div className="text-puzzle-accent font-mono">B</div>
              <div className="text-slate-300">Save/bookmark selected word</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Navigation</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-puzzle-accent font-mono">?</div>
              <div className="text-slate-300">Show this help dialog</div>
              
              <div className="text-puzzle-accent font-mono">Esc</div>
              <div className="text-slate-300">Close any open dialog</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
