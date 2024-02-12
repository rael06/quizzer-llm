import { Dictionary } from "./Dictionary";

export const frDictionary: Dictionary = {
  global: {
    error: "Désolé, une erreur est survenue, veuillez réessayer plus tard.",
    home: "Accueil",
  },
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
      "Attention : les questions sont générées par un modèle de langage dans un langage français ou anglais approximatif et peuvent ne pas être exactes. Elles ne doivent pas être considérées comme une source fiable.",
    description3:
      "La responsabilité de l'utilisation du site et des résultats générés ne peut être engagée.",
    description4:
      "L'efficacité du modèle est remarquable et mérite d'être partagée, cette efficacité est meilleure en anglais qu'en français. D'autres modèles LLM pourraient certainement être meilleurs, mais la machine hébergeant ce projet n'est pas assez puissante pour les supporter, également, la machine n'étant pas toujours disponible, le service peut-être interrompu.",
    description5:
      "J'ai créé ce projet en peu de temps pour apprendre et partager. N'hésitez pas à consulter la documentation du code source. Pour toute question, contactez-moi 😇.",
  },
  quizz: {
    score: "Score : ",
    error:
      "Désolé, la génération de question valide a echoué, veuillez passer à la question suivante.",
    action: {
      home: "Accueil",
      next: "Suivante",
    },
    feedback: {
      introExpectedAnswer: "La réponse attendue était : ",
    },
    answerInput: {
      input: {
        label: "Votre réponse",
        placeholder: "Entrez votre réponse..",
      },
    },
  },
  footer: {
    author: "2024, par Rael CALITRO : ",
    license: "License : ",
    sourceCode: "Code source : ",
    modelSource: "Modèle LLM IA open source utilisé de : ",
  },
};
