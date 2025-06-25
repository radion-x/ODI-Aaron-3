import { AssessmentResponse, PrimaryCondition, SeverityLevel } from '../types/assessment';

export const calculateScore = (responses: AssessmentResponse[]): number => {
  return responses.reduce((total, response) => total + response.score, 0);
};

export const calculateMaxScore = (condition: PrimaryCondition): number => {
  // Since the condition is always 'Back' now
  if (condition === 'Back') {
    // 10 questions, each with a max score of 5 (0-5)
    return 50;
  }
  // Fallback, though theoretically unreachable if PrimaryCondition is strictly 'Back'
  return 50;
};

export const getSeverityLevel = (score: number, maxScore: number): SeverityLevel => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage <= 20) return 'Minimal disability';
  if (percentage <= 40) return 'Moderate disability';
  if (percentage <= 60) return 'Severe disability';
  if (percentage <= 80) return 'Crippled';
  return 'Bed-bound or exaggerating symptoms';
};

export const getScoreForResponse = (questionIndex: number, optionIndex: number, questionType: string): number => {
  if (questionType === 'slider') {
    // For slider questions, optionIndex is the actual value (0-10)
    return optionIndex;
  }
  
  // For multiple choice, reverse scoring (worst option = highest score)
  return optionIndex;
};

export const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'Minimal disability':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Moderate disability':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Severe disability':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Crippled':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Bed-bound or exaggerating symptoms':
      return 'text-red-800 bg-red-100 border-red-300';
  }
};

export const getSeverityDescription = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'Minimal disability':
      return 'The patient can cope with most daily living activities; usually no treatment needed other than advice on lifting, sitting, posture, physical fitness, and diet.';
    case 'Moderate disability':
      return 'The patient experiences more pain and difficulty with sitting, lifting, and standing; may benefit from conservative treatment.';
    case 'Severe disability':
      return 'Pain significantly impedes daily activities; requires detailed investigation and intensive treatment.';
    case 'Crippled':
      return 'Pain impinges on all aspects of life; may require intervention (e.g. surgery).';
    case 'Bed-bound or exaggerating symptoms':
      return 'The patient may be either truly incapacitated or possibly exaggerating their symptoms.';
  }
};
