import { Question } from '../types/game';

// Sample questions for Feud.Exe - mix of technical and non-technical
export const sampleQuestions: Question[] = [
  // Round 1 - General Knowledge
  {
    id: 'q1',
    text: 'Name something you do when you wake up in the morning',
    answers: [
      { text: 'Brush teeth', points: 45, revealed: false },
      { text: 'Check phone', points: 35, revealed: false },
      { text: 'Take shower', points: 25, revealed: false },
      { text: 'Drink water/coffee', points: 20, revealed: false },
      { text: 'Get dressed', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q2',
    text: 'Name a popular social media platform',
    answers: [
      { text: 'Instagram', points: 40, revealed: false },
      { text: 'WhatsApp', points: 35, revealed: false },
      { text: 'Facebook', points: 30, revealed: false },
      { text: 'Twitter/X', points: 25, revealed: false },
      { text: 'YouTube', points: 20, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q3',
    text: 'Name something students do during exams',
    answers: [
      { text: 'Study all night', points: 45, revealed: false },
      { text: 'Drink coffee', points: 30, revealed: false },
      { text: 'Pray', points: 25, revealed: false },
      { text: 'Panic', points: 20, revealed: false },
      { text: 'Copy from friends', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  
  // Round 2 - Tech Related
  {
    id: 'q4',
    text: 'Name a popular programming language',
    answers: [
      { text: 'Python', points: 40, revealed: false },
      { text: 'JavaScript', points: 35, revealed: false },
      { text: 'Java', points: 30, revealed: false },
      { text: 'C++', points: 25, revealed: false },
      { text: 'C', points: 20, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q5',
    text: 'Name something you do when your code doesn\'t work',
    answers: [
      { text: 'Google the error', points: 45, revealed: false },
      { text: 'Ask ChatGPT', points: 35, revealed: false },
      { text: 'Debug step by step', points: 25, revealed: false },
      { text: 'Restart the computer', points: 20, revealed: false },
      { text: 'Cry', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q6',
    text: 'Name a popular code editor/IDE',
    answers: [
      { text: 'VS Code', points: 50, revealed: false },
      { text: 'IntelliJ IDEA', points: 25, revealed: false },
      { text: 'Sublime Text', points: 20, revealed: false },
      { text: 'Atom', points: 15, revealed: false },
      { text: 'Notepad++', points: 10, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  
  // Round 3 - College Life
  {
    id: 'q7',
    text: 'Name something students eat during late night study sessions',
    answers: [
      { text: 'Maggi/Instant noodles', points: 45, revealed: false },
      { text: 'Pizza', points: 30, revealed: false },
      { text: 'Chips', points: 25, revealed: false },
      { text: 'Biscuits', points: 20, revealed: false },
      { text: 'Chocolate', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q8',
    text: 'Name a reason students are late to class',
    answers: [
      { text: 'Overslept', points: 40, revealed: false },
      { text: 'Traffic', points: 30, revealed: false },
      { text: 'Couldn\'t find the classroom', points: 25, revealed: false },
      { text: 'Forgot about the class', points: 20, revealed: false },
      { text: 'Bus was late', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q9',
    text: 'Name something students do during boring lectures',
    answers: [
      { text: 'Use phone', points: 45, revealed: false },
      { text: 'Sleep', points: 35, revealed: false },
      { text: 'Doodle', points: 25, revealed: false },
      { text: 'Chat with friends', points: 20, revealed: false },
      { text: 'Daydream', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  }
];

export function getRandomQuestions(): Question[] {
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 9);
}