import { Dictionary } from "./Dictionary";

export const enDictionary: Dictionary = {
  global: {
    error: "Sorry, an error has occurred, please try again later.",
    home: "Home",
  },
  header: {
    title: "Quizzer-llm",
    description:
      "A game using a self-hosted version of LLM Mistral AI 7B Instruct",
  },
  home: {
    input: {
      label: "Thematic",
      placeholder: "Enter a thematic",
    },
    startQuizz: "Start the quiz",
    description1:
      "Passionate about quizzes? Explore various themes here. In the absence of a thematic, a general quiz will be offered. Happy Quizzing! 🎉",
    description2:
      "Beware: questions are generated by a language model in approximate English and may not be accurate. They should not be considered a reliable source.",
    description3:
      "Responsibility for the use of the site and the results generated cannot be engaged.",
    description4:
      "The efficiency of the model is remarkable and deserves to be shared. For any questions, contact me.",
  },
  quizz: {
    score: "Score: ",
    error:
      "Sorry, the generation of a valid question has failed, please proceed to the next question.",
    action: {
      home: "Home",
      next: "Next",
    },
    feedback: {
      introExpectedAnswer: "The expected answer was: ",
    },
  },
  footer: {
    author: "2024, by Rael CALITRO: ",
    license: "License: ",
    sourceCode: "Source code: ",
    modelSource: "Open source LLM AI model used from: ",
  },
};
