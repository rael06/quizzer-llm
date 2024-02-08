import { Dictionary } from "./Dictionary";

export const frDictionary: Dictionary = {
  header: {
    title: "Quizzer-llm",
    description:
      "Un jeu utilisant une version auto-hébergée de LLM Mistral AI 7B Instruct",
  },
  home: {
    input: {
      label: "Thématique",
      placeholder: "Entrez une thématique",
    },
    startQuizz: "Commencer le quizz",
    description1:
      "Passionné de quizz ? Explorez diverses thématiques ici. En l'absence de choix, un quizz général sera proposé. Bon Quizz ! 🎉",
    description2:
      "Attention : les questions sont générées par un modèle de langage dans un langage français approximatif et peuvent ne pas être exactes. Elles ne doivent pas être considérées comme une source fiable.",
    description3:
      "La responsabilité de l'utilisation du site et des résultats générés ne peut être engagée.",
    description4:
      "L'efficacité du modèle est remarquable et mérite d'être partagée. Pour toute question, contactez-moi.",
  },
  quizz: {
    score: "Score : ",
    error:
      "Désolé, une erreur est survenue, veuillez passer à la question suivante.",
    action: {
      home: "Accueil",
      next: "Suivante",
    },
    feedback: {
      introExpectedAnswer: "La réponse attendue était : ",
    },
  },
  footer: {
    author: "2024, par Rael CALITRO : ",
    license: "License : ",
    sourceCode: "Code source : ",
    modelSource: "Modèle LLM IA open source utilisé de : ",
  },
};
