import { Ollama } from "ollama";

export const ollamaInstance = (async () => {})();

export class OllamaService {
  private static _instance: Ollama;

  private constructor() {}

  public static async getInstance(): Promise<Ollama> {
    if (!this._instance) {
      const { Ollama } = await import("ollama");
      this._instance = new Ollama({ host: "http://localhost:11434" });
    }
    return this._instance;
  }
}
