
import React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface WordLengthSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const WordLengthSelector = ({
  value,
  onChange,
  min = 2,
  max = 15,
  className,
}: WordLengthSelectorProps) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleButtonClick = (newValue: number) => {
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleButtonClick(value - 1)}
          disabled={value <= min}
          className="puzzle-button-secondary w-10 h-10 p-0 flex items-center justify-center"
          aria-label="Decrease length"
        >
          -
        </button>
        <div className="text-center">
          <span className="text-lg font-medium">{value}</span>
          <span className="text-slate-400 ml-2">letters</span>
        </div>
        <button
          onClick={() => handleButtonClick(value + 1)}
          disabled={value >= max}
          className="puzzle-button-secondary w-10 h-10 p-0 flex items-center justify-center"
          aria-label="Increase length"
        >
          +
        </button>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
    </div>
  );
};

export default WordLengthSelector;
