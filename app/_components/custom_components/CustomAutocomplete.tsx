"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";

interface AutocompleteProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  theme?: {
    container?: string;
    input?: string;
    suggestionsContainer?: string;
    suggestionsList?: string;
    suggestion?: string;
    suggestionHighlighted?: string;
  };
}

export const CustomAutocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  value,
  onChange,
  onSuggestionSelect,
  placeholder = "Type to search...",
  className = "",
  disabled = false,
  theme = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  const filteredSuggestions = useMemo(() => {
    const inputValue = value.trim().toLowerCase();
    if (!inputValue) return [];
    
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(inputValue) && 
      suggestion.toLowerCase() !== inputValue
    );
  }, [suggestions, value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (value.trim()) {
          onSuggestionSelect(value.trim());
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          onSuggestionSelect(filteredSuggestions[highlightedIndex]);
        } else if (value.trim()) {
          onSuggestionSelect(value.trim());
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle focus
  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update visibility based on filtered suggestions
  useEffect(() => {
    if (filteredSuggestions.length === 0) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [filteredSuggestions.length]);

  const defaultTheme = {
    container: "relative",
    input: "w-full bg-white border rounded-lg py-2 px-4 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none",
    suggestionsContainer: "absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto",
    suggestionsList: "",
    suggestion: "px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700",
    suggestionHighlighted: "px-4 py-2 cursor-pointer bg-orange-100 text-gray-900"
  };

  const finalTheme = { ...defaultTheme, ...theme };

  return (
    <div ref={containerRef} className={`${finalTheme.container} ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={finalTheme.input}
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className={finalTheme.suggestionsContainer}
        >
          <div className={finalTheme.suggestionsList}>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={
                  index === highlightedIndex 
                    ? finalTheme.suggestionHighlighted 
                    : finalTheme.suggestion
                }
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAutocomplete;