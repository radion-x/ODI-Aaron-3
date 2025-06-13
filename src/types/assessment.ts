export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'slider';
  options?: string[];
  min?: number;
  max?: number;
  labels?: {
    [key: string]: string;
  };
}

export interface AssessmentBranch {
  id: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentResponse {
  questionId: string;
  value: string | number;
  score: number;
}

export interface FunctionalIndexData {
  branchId: string;
  responses: AssessmentResponse[];
  totalScore: number;
  maxScore: number;
  severityLevel: 'mild' | 'moderate' | 'severe';
  completedAt: Date;
}

export type PrimaryCondition = 'Back';
