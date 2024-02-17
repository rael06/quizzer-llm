import { v4 as uuidv4 } from "uuid";
import Cache from "node-cache";
import Session from "../models/Session";

export default class SessionManager {
  private static _instance: SessionManager;
  private constructor() {}
  public static getInstance(): SessionManager {
    if (!this._instance) {
      this._instance = new SessionManager();
    }
    return this._instance;
  }

  private readonly cache = new Cache({ stdTTL: 60 * 10, checkperiod: 60 * 1 });

  public createSession(thematic: string): Session {
    const id = uuidv4();
    const session = new Session(id, thematic, []);

    this.cache.set(id, session);
    return session;
  }

  public getSession(id: string): Session | null {
    const session = this.cache.get<Session>(id) ?? null;
    this.cache.set(id, session);

    return session;
  }

  public updateSession(session: Session) {
    this.cache.set(session.id, session);
  }
}
