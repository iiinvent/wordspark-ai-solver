
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface LetterInputProps {
  length: number;
  onChange: (letters: string[]) => void;
  className?: string;
}

const LetterInput = ({ length, onChange, className }: LetterInputProps) => {
  const [letters, setLetters] = useState<string[]>(Array(length).fill(""));

  const handleInputChange = (index: number, value: string) => {
    const newLetters = [...letters];
    
    // Only allow single letters or "?" for wildcards
    if (value === "" || value === "?" || /^[a-zA-Z]$/.test(value)) {
      newLetters[index] = value.toUpperCase();
      setLetters(newLetters);
      onChange(newLetters);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && letters[index] === "" && index > 0) {
      // Move to previous input when backspacing an empty field
      const prevInput = document.getElementById(`letter-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    } else if (
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab" &&
      e.key !== "Shift" &&
      letters[index] !== "" &&
      index < length - 1
    ) {
      // Move to next input after entering a character
      const nextInput = document.getElementById(`letter-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          id={`letter-${index}`}
          type="text"
          maxLength={1}
          value={letters[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-10 h-10 text-center font-medium text-lg puzzle-input uppercase"
          placeholder="?"
          aria-label={`Letter position ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default LetterInput;
