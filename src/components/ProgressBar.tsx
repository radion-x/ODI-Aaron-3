import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-brand-text-body">Question {current} of {total}</span> {/* Text color */}
        <span className="text-sm text-gray-500">{Math.round(percentage)}%</span> {/* Muted text color */}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2"> {/* Bar height and bg color */}
        <div 
          className="bg-brand-primary h-2 rounded-full transition-all duration-500 ease-out" /* Bar fill color */
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
