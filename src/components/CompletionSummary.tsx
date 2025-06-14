import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Activity } from 'lucide-react';
import { FunctionalIndexData } from '../types/assessment';
import { getSeverityColor, getSeverityDescription } from '../utils/scoring';

interface CompletionSummaryProps {
  data: FunctionalIndexData;
  onRestart: () => void;
  onContinue: () => void; // Kept in props in case it's used elsewhere or needed later
}

export const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  data,
  onRestart,
  onContinue // Now we will use this
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'moderate':
        return <AlertCircle className="w-8 h-8 text-yellow-600" />;
      case 'severe':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Activity className="w-8 h-8 text-gray-600" />;
    }
  };

  const percentage = Math.round((data.totalScore / data.maxScore) * 100);

  return (
    <div className="space-y-8 py-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4"> {/* Updated icon bg and color */}
          <CheckCircle className="w-8 h-8 text-brand-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-heading mb-2"> {/* Updated text color */}
          Assessment Results
        </h2>
        <p className="text-brand-text-body text-base"> {/* Updated text color */}
          Please review your results below before proceeding.
        </p>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8"> {/* Consistent card style */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-brand-text-heading">Your Results</h3> {/* Updated text color */}
          {getSeverityIcon(data.severityLevel)}
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg"> {/* Updated bg and text colors */}
            <div className="text-2xl font-bold text-brand-text-heading">{data.totalScore}</div>
            <div className="text-sm text-brand-text-body">Total Score</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg"> {/* Updated bg and text colors */}
            <div className="text-2xl font-bold text-brand-text-heading">{percentage}%</div>
            <div className="text-sm text-brand-text-body">Impact Level</div>
          </div>
        </div>

        {/* Severity Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getSeverityColor(data.severityLevel)} mb-4`}>
          <span className="font-medium capitalize text-brand-text-body">{data.severityLevel} Impact</span> {/* Ensure text color for badge */}
        </div>

        <p className="text-sm text-brand-text-body mb-6"> {/* Updated text color */}
          {getSeverityDescription(data.severityLevel)}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-brand-text-body mb-2"> {/* Updated text color */}
            <span>Functional Impact</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3"> {/* Updated bg color */}
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                data.severityLevel === 'mild' ? 'bg-green-500' :
                data.severityLevel === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Completion Time */}
        <div className="text-xs text-gray-500 text-center"> {/* Updated text color */}
          Completed on {data.completedAt.toLocaleDateString()} at {data.completedAt.toLocaleTimeString()}
        </div>
      </div>

      {/* Actions Section */}
      <div className="space-y-4 mt-8"> {/* Adjusted spacing */}
        {/* Continue to Summary Button (Primary Action) */}
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-brand-primary text-white rounded-md shadow-sm font-semibold hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-dark transition-colors duration-150"
        >
          Continue to Summary
        </button>

        {/* Start New Assessment Button (Secondary Action) */}
        <button
          onClick={onRestart} 
          className="w-full px-6 py-3 text-brand-primary bg-transparent hover:bg-brand-primary/10 border border-brand-primary rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-dark transition-colors duration-150"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};
