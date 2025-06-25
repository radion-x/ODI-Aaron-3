import { AssessmentBranch } from '../types/assessment';

export const assessmentBranches: Record<string, AssessmentBranch> = {
  oswestryBack: {
    id: 'oswestryBack',
    questions: [
      {
        id: 'painIntensity',
        question: 'Pain Intensity',
        type: 'multiple_choice',
        options: [
          'I have no pain at the moment.',
          'The pain is very mild at the moment.',
          'The pain is moderate at the moment.',
          'The pain is fairly severe at the moment.',
          'The pain is very severe at the moment.',
          'The pain is the worst imaginable at the moment.'
        ]
      },
      {
        id: 'personalCare',
        question: 'Personal Care (Washing, Dressing, etc.)',
        type: 'multiple_choice',
        options: [
          'I can look after myself normally without causing extra pain.',
          'I can look after myself normally but it causes extra pain.',
          'It is painful to look after myself and I am slow and careful.',
          'I need some help but manage most of my personal care.',
          'I need help every day in most aspects of self-care.',
          'I do not get dressed, wash with difficulty, and stay in bed.'
        ]
      },
      {
        id: 'lifting',
        question: 'Lifting',
        type: 'multiple_choice',
        options: [
          'I can lift heavy weights without extra pain.',
          'I can lift heavy weights but it gives extra pain.',
          'Pain prevents me from lifting heavy weights off the floor, but I can manage if they are conveniently positioned (e.g., on a table).',
          'Pain prevents me from lifting heavy weights, but I can manage light to medium weights if they are conveniently positioned.',
          'I can lift very light weights.',
          'I cannot lift or carry anything at all.'
        ]
      },
      {
        id: 'walking',
        question: 'Walking',
        type: 'multiple_choice',
        options: [
          'Pain does not prevent me from walking any distance.',
          'Pain prevents me from walking more than 1 mile.',
          'Pain prevents me from walking more than 1/2 mile.',
          'Pain prevents me from walking more than 1/4 mile.',
          'I can only walk using a stick or crutches.',
          'I am in bed most of the time and have to crawl to the toilet.'
        ]
      },
      {
        id: 'sitting',
        question: 'Sitting',
        type: 'multiple_choice',
        options: [
          'I can sit in any chair as long as I like.',
          'I can only sit in my favorite chair as long as I like.',
          'Pain prevents me from sitting for more than 1 hour.',
          'Pain prevents me from sitting for more than 1/2 hour.',
          'Pain prevents me from sitting for more than 10 minutes.',
          'Pain prevents me from sitting at all.'
        ]
      },
      {
        id: 'standing',
        question: 'Standing',
        type: 'multiple_choice',
        options: [
          'I can stand as long as I want without extra pain.',
          'I can stand as long as I want but it gives me extra pain.',
          'Pain prevents me from standing for more than 1 hour.',
          'Pain prevents me from standing for more than 1/2 hour.',
          'Pain prevents me from standing for more than 10 minutes.',
          'Pain prevents me from standing at all.'
        ]
      },
      {
        id: 'sleeping',
        question: 'Sleeping',
        type: 'multiple_choice',
        options: [
          'My sleep is never disturbed by pain.',
          'My sleep is occasionally disturbed by pain.',
          'Because of pain, I have less than 6 hours of sleep.',
          'Because of pain, I have less than 4 hours of sleep.',
          'Because of pain, I have less than 2 hours of sleep.',
          'Pain prevents me from sleeping at all.'
        ]
      },
      {
        id: 'sexLife',
        question: 'Sex Life (if applicable)',
        type: 'multiple_choice',
        options: [
          'My sex life is normal and causes no extra pain.',
          'My sex life is normal but causes some extra pain.',
          'My sex life is nearly normal but is very painful.',
          'My sex life is severely restricted by pain.',
          'My sex life is nearly absent because of pain.',
          'Pain prevents any sex life at all.'
        ]
      },
      {
        id: 'socialLife',
        question: 'Social Life',
        type: 'multiple_choice',
        options: [
          'My social life is normal and gives me no extra pain.',
          'My social life is normal but increases the degree of pain.',
          'Pain has no significant effect on my social life apart from limiting energetic activities (e.g., dancing).',
          'Pain has restricted my social life and I do not go out as often.',
          'Pain has restricted my social life to my home.',
          'I have no social life because of pain.'
        ]
      },
      {
        id: 'traveling',
        question: 'Traveling',
        type: 'multiple_choice',
        options: [
          'I can travel anywhere without pain.',
          'I can travel anywhere but it gives extra pain.',
          'Pain is bad but I manage journeys over 2 hours.',
          'Pain restricts me to journeys of less than 1 hour.',
          'Pain restricts me to short necessary journeys under 30 minutes.',
          'Pain prevents me from traveling except to receive treatment.'
        ]
      }
    ]
  }
};
