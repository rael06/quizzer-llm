import { applicationApiUrl } from ".";
import { Session } from "../../models";

export async function createSession({
  thematic,
  language,
}: {
  thematic: string;
  language: string;
}): Promise<void> {
  await fetch(`${applicationApiUrl}/sessions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      thematic,
      language,
    }),
  });
}

export async function fetchSession(): Promise<Session> {
  const response = await fetch(`${applicationApiUrl}/session`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}
