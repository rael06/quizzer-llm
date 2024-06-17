import { ModelMessage } from "../../models/ModelMessage";
import ICompletionService from "./ICompletionService";
import OllamaService from "./OllamaService";
import PromptService from "../PromptService";

export default class OllamaModelCompletion implements ICompletionService {
  private static _instance: OllamaModelCompletion;

  private constructor() {}

  public static getInstance(): OllamaModelCompletion {
    if (!this._instance) {
      this._instance = new OllamaModelCompletion();
    }
    return this._instance;
  }

  public async complete(messages: ModelMessage[]): Promise<string> {
    const ollamaInstance = await OllamaService.getInstance();

    const message = await ollamaInstance.chat({
      model: "mistral:7b-instruct-v0.2-q4_0",
      messages,
      stream: true,
      options: { stop: [PromptService.getInstance().endToken] },
    });
    let completeMessage = "";
    for await (const part of message) {
      completeMessage += part.message.content;
      process.stdout.write(part.message.content);
    }
    console.info("\n");

    return completeMessage;
  }
}
