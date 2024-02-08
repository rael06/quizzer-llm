export type Answer = {
  answer: string;
  feedback: string;
  isCorrect: boolean;
  expectedAnswer: string;
};

export type Question = {
  id: string;
  question: string;
  propositions: string[];
  answer: Answer | null;
};

export type Session = {
  id: string;
  thematic: string;
  questions: Question[];
};
