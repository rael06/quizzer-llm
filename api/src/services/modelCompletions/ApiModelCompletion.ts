import assert from "assert";
import { EnvVariables } from "../../EnvVariables";
import ICompletionService from "./ICompletionService";
import PromptService from "../PromptService";
import { ModelMessage } from "../../models/ModelMessage";
import fetch from "node-fetch";

export default class ApiModelCompletion implements ICompletionService {
  private static _instance: ApiModelCompletion;
  private readonly apiModelUrl: string;
  private readonly apiModelName: string;
  private readonly apiModelSecret: string;

  private constructor() {
    assert(EnvVariables.ApiModelUrl, "ApiModelUrl is not set");
    assert(EnvVariables.ApiModelName, "ApiModelName is not set");
    assert(EnvVariables.ApiModelSecret, "ApiModelSecret is not set");

    this.apiModelUrl = EnvVariables.ApiModelUrl;
    this.apiModelName = EnvVariables.ApiModelName;
    this.apiModelSecret = EnvVariables.ApiModelSecret;
  }

  public static getInstance(): ApiModelCompletion {
    if (!this._instance) {
      this._instance = new ApiModelCompletion();
    }
    return this._instance;
  }

  public async complete(messages: ModelMessage[]): Promise<string> {
    const modelMessageResponse = await fetch(this.apiModelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiModelSecret}`,
      },
      body: JSON.stringify({
        model: this.apiModelName,
        messages,
        stream: false,
        stop: [PromptService.getInstance().endToken],
      }),
    });
    const modelMessage: any = await modelMessageResponse.json();

    return modelMessage.choices[0].message.content;
  }
}
