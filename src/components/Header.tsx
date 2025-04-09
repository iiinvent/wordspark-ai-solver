
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Settings } from "lucide-react";

interface HeaderProps {
  onOpenApiKeyForm: () => void;
}

const Header = ({ onOpenApiKeyForm }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-0">
      <div className="flex items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-puzzle-accent">Word</span>Spark
          </h1>
          <p className="text-xs text-slate-400">AI-Powered Puzzle Solver</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-puzzle-hover"
          onClick={onOpenApiKeyForm}
        >
          <Key className="h-5 w-5" />
          <span className="sr-only">API Key</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
