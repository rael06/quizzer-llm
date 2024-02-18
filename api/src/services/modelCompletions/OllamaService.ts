import { Ollama } from "ollama";
import { EnvVariables } from "../../EnvVariables";
import assert from "assert";

export default class OllamaService {
  private static _instance: Ollama;

  private constructor() {}

  public static async getInstance(): Promise<Ollama> {
    const url = EnvVariables.OllamaApiUrl;
    assert(url, "OllamaApiUrl is not set");

    if (!this._instance) {
      const { Ollama } = await import("ollama");
      this._instance = new Ollama({ host: url });
    }
    return this._instance;
  }
}
