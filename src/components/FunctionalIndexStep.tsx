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
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Function & Daily Activity Impact
          </h1>
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Tell us how your {primaryCondition.toLowerCase()} condition is affecting your ability to move and complete daily activities.
        </p>

        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={totalQuestions}
          className="mb-2"
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
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
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={restartAssessment}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Restart assessment"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Complete Assessment' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Response Summary (for debugging/testing) */}
      {responses.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Responses So Far:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {responses.map((response, index) => (
              <div key={response.questionId}>
                Q{index + 1}: {response.value} (Score: {response.score})
              </div>
            ))}
            <div className="font-medium pt-2 border-t border-gray-200">
              Total Score: {calculateScore(responses)} / {calculateMaxScore(primaryCondition)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
