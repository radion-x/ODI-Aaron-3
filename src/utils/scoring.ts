import { AssessmentResponse, FunctionalIndexData, PrimaryCondition } from '../types/assessment';

export const calculateScore = (responses: AssessmentResponse[]): number => {
  return responses.reduce((total, response) => total + response.score, 0);
};

export const calculateMaxScore = (condition: PrimaryCondition): number => {
  // Since the condition is always 'Back' now
  if (condition === 'Back') {
    return 24; // 6 questions × 4 points max (assuming 0-4 scale for each)
  }
  // Fallback, though theoretically unreachable if PrimaryCondition is strictly 'Back'
  return 24; 
};

export const getSeverityLevel = (score: number, maxScore: number): 'mild' | 'moderate' | 'severe' => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage <= 33) return 'mild';
  if (percentage <= 66) return 'moderate';
  return 'severe';
};

export const getScoreForResponse = (questionIndex: number, optionIndex: number, questionType: string): number => {
  if (questionType === 'slider') {
    // For slider questions, optionIndex is the actual value (0-10)
    return optionIndex;
  }
  
  // For multiple choice, reverse scoring (worst option = highest score)
  return optionIndex;
};

export const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe'): string => {
  switch (severity) {
    case 'mild':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'moderate':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'severe':
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

export const getSeverityDescription = (severity: 'mild' | 'moderate' | 'severe'): string => {
  switch (severity) {
    case 'mild':
      return 'Minimal functional limitation';
    case 'moderate':
      return 'Moderate functional limitation';
    case 'severe':
      return 'Significant functional limitation';
  }
};
