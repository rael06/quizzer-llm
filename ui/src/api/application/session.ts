import assert from "assert";
import { applicationApiUrl } from ".";
import { Session } from "../../models";

export async function createSession(thematic: string): Promise<void> {
  const response = await fetch(`${applicationApiUrl}/sessions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      thematic,
    }),
  });
  const json = await response.json();
  assert(response.ok, json.error);
}

export async function fetchSession(): Promise<Session> {
  const response = await fetch(`${applicationApiUrl}/session`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  assert(response.ok, json.error);

  return json;
}
