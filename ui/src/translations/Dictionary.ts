export type Dictionary = {
  global: {
    error: string;
    home: string;
  };
  header: {
    title: string;
    description: string;
  };
  home: {
    input: { label: string; placeholder: string };
    defaultThematic: string;
    startQuizz: string;
    descriptions: string[];
  };
  quizz: {
    score: string;
    error: {
      question: string;
      feedback: string;
    };
    action: {
      home: string;
      next: string;
    };
    answerInput: {
      input: {
        label: string;
        placeholder: string;
      };
    };
  };
  footer: {
    author: string;
    license: string;
    sourceCode: string;
    modelSource: string;
  };
};
