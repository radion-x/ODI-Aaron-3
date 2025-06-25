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

export type SeverityLevel =
  | 'Minimal disability'
  | 'Moderate disability'
  | 'Severe disability'
  | 'Crippled'
  | 'Bed-bound or exaggerating symptoms';

export interface FunctionalIndexData {
  branchId: string;
  responses: AssessmentResponse[];
  totalScore: number;
  maxScore: number;
  severityLevel: SeverityLevel;
  completedAt: Date;
}

export type PrimaryCondition = 'Back';
