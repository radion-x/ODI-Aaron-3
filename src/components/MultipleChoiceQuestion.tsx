import React from 'react';
import { Check } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  options,
  selectedOption,
  onSelect
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-brand-text-heading leading-relaxed"> {/* Text color */}
        {question}
      </h3>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-150 ease-in-out group ${
              selectedOption === index
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-md' // Selected style
                : 'border-gray-300 bg-white hover:border-brand-primary/70 hover:bg-brand-primary/5 text-brand-text-body' // Default style
            } focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1`} // Focus style
            aria-pressed={selectedOption === index}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium ${selectedOption === index ? 'text-brand-primary' : 'text-brand-text-body group-hover:text-brand-text-heading'}`}>{option}</span> {/* Text color */}
              {selectedOption === index && (
                <Check className="w-5 h-5 text-brand-primary flex-shrink-0" /> // Icon color
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
