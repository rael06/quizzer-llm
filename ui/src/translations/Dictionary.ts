export type Dictionary = {
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
  };
  footer: {
    author: string;
    license: string;
    sourceCode: string;
    modelSource: string;
  };
};
