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
      <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
        {question}
      </h3>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              selectedOption === index
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-pressed={selectedOption === index}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option}</span>
              {selectedOption === index && (
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};