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
    startQuizz: string;
    description1: string;
    description2: string;
    description3: string;
    description4: string;
    description5: string;
  };
  quizz: {
    score: string;
    error: string;
    action: {
      home: string;
      next: string;
    };
    feedback: {
      introExpectedAnswer: string;
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
