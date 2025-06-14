import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { PrimaryCondition, AssessmentResponse, FunctionalIndexData, AssessmentQuestion } from '../types/assessment';
import { assessmentBranches } from '../data/assessmentBranches';
import { calculateScore, calculateMaxScore, getSeverityLevel, getScoreForResponse } from '../utils/scoring';
import { ProgressBar } from './ProgressBar';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { CompletionSummary } from './CompletionSummary';

interface FunctionalIndexStepProps {
  primaryCondition: PrimaryCondition;
  onComplete: (data: FunctionalIndexData) => void;
  onBack?: () => void;
}

// Since PrimaryCondition is now only 'Back', this map is simplified.
// We can even remove it and directly use 'oswestryBack' for branchId.
const conditionBranchMap: Record<PrimaryCondition, string> = {
  'Back': 'oswestryBack'
};

export const FunctionalIndexStep: React.FC<FunctionalIndexStepProps> = ({
  primaryCondition,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [completionData, setCompletionData] = useState<FunctionalIndexData | null>(null);

  // As primaryCondition is always 'Back', branchId is always 'oswestryBack'.
  const branchId = 'oswestryBack'; 
  const branch = assessmentBranches[branchId];
  const currentQuestion = branch?.questions[currentQuestionIndex];
  const totalQuestions = branch?.questions.length || 0;

  const getCurrentResponse = () => {
    return responses.find(r => r.questionId === currentQuestion?.id);
  };

  const handleResponse = (value: string | number) => {
    if (!currentQuestion) return;

    const score = getScoreForResponse(
      currentQuestionIndex,
      typeof value === 'string' ? parseInt(value) : value,
      currentQuestion.type
    );

    const newResponse: AssessmentResponse = {
      questionId: currentQuestion.id,
      value,
      score
    };

    setResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== currentQuestion.id);
      return [...filtered, newResponse];
    });
  };

  const canGoNext = () => {
    const currentResponse = getCurrentResponse();
    return currentResponse !== undefined;
  };

  const goNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const goPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    const totalScore = calculateScore(responses);
    const maxScore = calculateMaxScore(primaryCondition);
    const severityLevel = getSeverityLevel(totalScore, maxScore);

    const data: FunctionalIndexData = {
      branchId,
      responses,
      totalScore,
      maxScore,
      severityLevel,
      completedAt: new Date()
    };

    setCompletionData(data);
    setIsComplete(true);
  };

  const restartAssessment = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsComplete(false);
    setCompletionData(null);
  };

  const handleContinue = () => {
    if (completionData) {
      onComplete(completionData);
    }
  };

  if (isComplete && completionData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <CompletionSummary
          data={completionData}
          onRestart={restartAssessment}
          onContinue={handleContinue}
        />
      </div>
    );
  }

  if (!branch || !currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-800">Assessment not available for the selected condition.</p>
        </div>
      </div>
    );
  }

  const currentResponse = getCurrentResponse();

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8"> {/* Adjusted padding */}
      {/* Header */}
      <div className="mb-10"> {/* Increased margin */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-heading"> {/* Title color */}
            Function & Daily Activity Impact
          </h1>
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-brand-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1" // Styled back button
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <p className="text-brand-text-body text-base mb-8"> {/* Text color and size, increased margin */}
          Tell us how your {primaryCondition.toLowerCase()} condition is affecting your ability to move and complete daily activities.
        </p>

        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={totalQuestions}
          className="mb-2" 
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 mb-10"> {/* Consistent card style, increased margin */}
        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
          <MultipleChoiceQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedOption={typeof currentResponse?.value === 'number' ? currentResponse.value : null}
            onSelect={(optionIndex) => handleResponse(optionIndex)}
          />
        )}

        {currentQuestion.type === 'slider' && (
          <SliderQuestion
            question={currentQuestion.question}
            min={currentQuestion.min || 0}
            max={currentQuestion.max || 10}
            value={typeof currentResponse?.value === 'number' ? currentResponse.value : null}
            onChange={(value) => handleResponse(value)}
            labels={currentQuestion.labels}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={goPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 text-brand-text-body hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md border border-gray-300 hover:border-brand-primary disabled:border-gray-200" // Styled Previous button
        >
          <ChevronLeft className="w-5 h-5 mr-1.5" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={restartAssessment}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1" // Styled Restart button
            aria-label="Restart assessment"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex items-center px-6 py-3 bg-brand-primary text-white rounded-md shadow-sm font-medium hover:bg-brand-primary-dark disabled:bg-brand-primary/70 disabled:cursor-not-allowed transition-colors" // Styled Next/Complete button
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Complete Assessment' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Response Summary (for debugging/testing) - Styled to be less prominent */}
      {responses.length > 0 && (
        <div className="mt-10 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs"> {/* Consistent muted bg/border */}
          <h4 className="font-semibold text-brand-text-heading mb-2">Responses Log:</h4> {/* Text color */}
          <div className="text-brand-text-body space-y-1"> {/* Text color */}
            {responses.map((response, index) => (
              <div key={response.questionId}>
                Q{index + 1}: {response.value} (Score: {response.score})
              </div>
            ))}
            <div className="font-semibold pt-2 border-t border-gray-300 mt-2"> {/* Border color */}
              Current Total Score: {calculateScore(responses)} / {calculateMaxScore(primaryCondition)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
