export type Feedback = {
  value: string;
  isCorrect: boolean;
};

export type Answer = {
  answer: string;
  feedback: Feedback;
};

export type Question = {
  id: string;
  question: string;
  propositions: string[];
  answer: Answer | null;
};

export type Session = {
  id: string;
  language: string;
  instruction: string;
  questions: Question[];
};
