import { Session } from "../models";
import { buildQuestionInstructions } from "./model";
import { v4 as uuidv4 } from "uuid";

const sessions = new Map<string, Session>();

export function createSession({
  language,
  thematic,
}: Parameters<typeof buildQuestionInstructions>[0]): Session {
  const id = uuidv4();
  const session: Session = {
    id,
    language,
    instructions: buildQuestionInstructions({ language, thematic }),
    questions: [],
  };

  sessions.set(id, session);
  return session;
}

export function getSession(id: string): Session | null {
  return sessions.get(id) ?? null;
}

export function updateSession(session: Session) {
  sessions.set(session.id, session);
}
