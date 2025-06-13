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
  // onContinue // Intentionally not used in the JSX below to remove the button
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
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Assessment Complete
        </h2>
        <p className="text-gray-600">
          Thank you for completing the functional assessment
        </p>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Results</h3>
          {getSeverityIcon(data.severityLevel)}
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{data.totalScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
            <div className="text-sm text-gray-600">Impact Level</div>
          </div>
        </div>

        {/* Severity Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getSeverityColor(data.severityLevel)} mb-4`}>
          <span className="font-medium capitalize">{data.severityLevel} Impact</span>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {getSeverityDescription(data.severityLevel)}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Functional Impact</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
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
        <div className="text-xs text-gray-500 text-center">
          Completed on {data.completedAt.toLocaleDateString()} at {data.completedAt.toLocaleTimeString()}
        </div>
      </div>

      {/* Actions Section */}
      <div className="space-y-6 mt-8">
        {/* Start New Assessment Button */}
        <button
          onClick={onRestart} 
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Start New Assessment
        </button>

        {/* Spine IQ Evaluation Section */}
        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-700 mb-4 text-sm leading-relaxed max-w-2xl mx-auto">
            Now that you’ve completed the Oswestry Disability Index quiz, consider taking the next step with Prof. Aaron Buckland’s personalised evaluation—it’s designed to explore potential pathways for your spine health and help you understand the options available to you.
          </p>
          <button
            onClick={() => { window.open('https://app.aaronbuckland.com/', '_blank', 'noopener,noreferrer'); }}
            className="px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 w-full sm:w-auto"
          >
            Spine IQ Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};
