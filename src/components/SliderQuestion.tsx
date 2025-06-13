import React, { useState, useEffect } from 'react';

interface SliderQuestionProps {
  question: string;
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number) => void;
  labels?: {
    [key: string]: string;
  };
}

export const SliderQuestion: React.FC<SliderQuestionProps> = ({
  question,
  min,
  max,
  value,
  onChange,
  labels = {}
}) => {
  const [localValue, setLocalValue] = useState(value ?? min);

  useEffect(() => {
    if (value !== null) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getColorForValue = (val: number) => {
    const percentage = (val - min) / (max - min);
    if (percentage <= 0.3) return 'bg-green-500';
    if (percentage <= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
        {question}
      </h3>
      
      <div className="space-y-6">
        {/* Current Value Display */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold ${getColorForValue(localValue)}`}>
            {localValue}
          </div>
          <p className="mt-2 text-sm text-gray-600">Current pain level</p>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={localValue}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
            }}
          />
          
          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-1">
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((tick) => (
              <div key={tick} className="flex flex-col items-center">
                <div className="w-0.5 h-2 bg-gray-400"></div>
                <span className="text-xs text-gray-500 mt-1">{tick}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium">{labels[min.toString()] || `${min}`}</span>
          <span className="font-medium">{labels[max.toString()] || `${max}`}</span>
        </div>
      </div>
    </div>
  );
};