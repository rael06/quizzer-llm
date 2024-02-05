import { applicationApiUrl } from ".";
import { Question } from "../../models";

export async function fetchQuestion(): Promise<Question> {
  const response = await fetch(`${applicationApiUrl}/model/question`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function postAnswer(answer: string): Promise<Question> {
  const response = await fetch(`${applicationApiUrl}/model/answer`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer,
    }),
  });
  return await response.json();
}
