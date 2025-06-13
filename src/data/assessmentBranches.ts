import { AssessmentBranch } from '../types/assessment';

export const assessmentBranches: Record<string, AssessmentBranch> = {
  oswestryBack: {
    id: 'oswestryBack',
    questions: [
      {
        id: 'walking',
        question: 'How far can you walk before needing to stop?',
        type: 'multiple_choice',
        options: [
          'More than 1km',
          '500–1000m',
          'Less than 500m',
          'Short distance with aid',
          'Cannot walk at all'
        ]
      },
      {
        id: 'sitting',
        question: 'How long can you sit comfortably?',
        type: 'multiple_choice',
        options: [
          'More than 1 hour',
          '30–60 minutes',
          '15–30 minutes',
          'Less than 15 minutes',
          'Not at all'
        ]
      },
      {
        id: 'sleep',
        question: 'How does pain affect your sleep?',
        type: 'multiple_choice',
        options: [
          'No interference',
          'Occasionally wakes me',
          'Regularly wakes me',
          'Can\'t sleep >2 hours',
          'Can\'t sleep at all'
        ]
      },
      {
        id: 'work',
        question: 'Can you perform your usual work or duties?',
        type: 'multiple_choice',
        options: [
          'Yes, no restrictions',
          'Yes, with some pain',
          'Modified duties',
          'Only light duties',
          'Cannot work'
        ]
      },
      {
        id: 'personalCare',
        question: 'Do you need help with personal care?',
        type: 'multiple_choice',
        options: [
          'No assistance needed',
          'Occasionally need help',
          'Regular help required',
          'Unable to manage without help'
        ]
      },
      {
        id: 'lifting',
        question: 'Do you experience back pain when lifting or bending?',
        type: 'multiple_choice',
        options: [
          'No pain',
          'Pain with heavy lifting',
          'Pain with moderate tasks',
          'Can\'t lift anything',
          'Avoid lifting entirely'
        ]
      }
    ]
  }
};
