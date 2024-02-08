import { Session } from "../models";
import { v4 as uuidv4 } from "uuid";

const sessions = new Map<string, Session>();

export function createSession(thematic: string): Session {
  const id = uuidv4();
  const session: Session = {
    id,
    thematic,
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
