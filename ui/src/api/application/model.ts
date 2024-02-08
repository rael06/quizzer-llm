import { applicationApiUrl } from ".";
import { Lang } from "../../contexts/lang/context";
import { Question } from "../../models";

const englishLangTranslation = {
  [Lang.En]: "english",
  [Lang.Fr]: "french",
} as const;

export async function fetchQuestion(lang: Lang): Promise<Question> {
  const response = await fetch(
    `${applicationApiUrl}/model/question?language=${englishLangTranslation[lang]}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return await response.json();
}

export async function postAnswer(
  lang: Lang,
  answer: string,
): Promise<Question> {
  const response = await fetch(
    `${applicationApiUrl}/model/answer?language=${englishLangTranslation[lang]}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    },
  );
  return await response.json();
}
