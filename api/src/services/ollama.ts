import { Ollama } from "ollama";
import { EnvVariables } from "../EnvVariables";

export class OllamaService {
  private static _instance: Ollama;

  private constructor() {}

  public static async getInstance(): Promise<Ollama> {
    if (!this._instance) {
      const { Ollama } = await import("ollama");
      this._instance = new Ollama({ host: EnvVariables.OllamaApiUrl });
    }
    return this._instance;
  }
}
