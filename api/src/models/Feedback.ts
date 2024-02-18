import assert from "assert";
import { z } from "zod";
import PromptService from "../services/PromptService";

export default class Feedback {
  private _modelMessage: string;
  private _value: string;
  private _isCorrect: boolean;

  private constructor(modelMessage: string, value: string, isCorrect: boolean) {
    this._modelMessage = modelMessage;
    this._value = value;
    this._isCorrect = isCorrect;
  }

  public static parseFromAi(message: string): Feedback {
    const regex = new RegExp(
      `${PromptService.getInstance().startToken}(.+)<\\+>(.+)`,
      "m",
    );
    const match = message.match(regex);
    assert(match, "Invalid feedback format");

    const [_, feedbackMessage, isCorrectStr] = match;

    const validatedMatch = z
      .object({
        feedbackMessage: z.string(),
        isCorrectStr: z.enum(["CORRECT", "INCORRECT"]),
      })
      .parse({
        feedbackMessage,
        isCorrectStr,
      });

    const validatedFeedback = validatedMatch.feedbackMessage;
    const validatedIsCorrect = validatedMatch.isCorrectStr === "CORRECT";

    return new Feedback(message, validatedFeedback, validatedIsCorrect);
  }

  public toView() {
    return {
      value: this._value,
      isCorrect: this._isCorrect,
    };
  }

  public get modelMessage(): string {
    return this._modelMessage;
  }

  public get feedback(): string {
    return this._value;
  }

  public get isCorrect(): boolean {
    return this._isCorrect;
  }
}
