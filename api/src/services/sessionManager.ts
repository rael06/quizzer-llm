import { Session } from "../models";
import { v4 as uuidv4 } from "uuid";
import Cache from "node-cache";

const cache = new Cache({ stdTTL: 60 * 10, checkperiod: 60 * 1 });

export function createSession(thematic: string): Session {
  const id = uuidv4();
  const session: Session = {
    id,
    thematic,
    questions: [],
  };

  cache.set(id, session);
  return session;
}

export function getSession(id: string): Session | null {
  const session = cache.get<Session>(id) ?? null;
  cache.set(id, session);

  return session;
}

export function updateSession(session: Session) {
  cache.set(session.id, session);
}
