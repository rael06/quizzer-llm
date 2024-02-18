import assert from "assert";
import { z } from "zod";
import PromptService from "../services/PromptService";

export default class Feedback {
  private _message: string;
  private _feedback: string;
  private _isCorrect: boolean;

  private constructor(
    modelMessage: string,
    feedback: string,
    isCorrect: boolean,
  ) {
    this._message = modelMessage;
    this._feedback = feedback;
    this._isCorrect = isCorrect;
  }

  public static parseFromAi(message: string): Feedback {
    const regex = new RegExp(
      `${PromptService.getInstance().startToken}(.+)<\\+>(.+)`,
      "m",
    );
    const match = message.match(regex);
    assert(match, "Invalid feedback format");

    const [_, feedback, isCorrectStr] = match;

    const validatedMatch = z
      .object({
        feedback: z.string(),
        isCorrectStr: z.enum(["CORRECT", "INCORRECT"]),
      })
      .parse({
        feedback,
        isCorrectStr,
      });

    const validatedFeedback = validatedMatch.feedback;
    const validatedIsCorrect = validatedMatch.isCorrectStr === "CORRECT";

    return new Feedback(message, validatedFeedback, validatedIsCorrect);
  }

  public toView() {
    return {
      feedback: this._feedback,
      isCorrect: this._isCorrect,
    };
  }

  public get message(): string {
    return this._message;
  }

  public get feedback(): string {
    return this._feedback;
  }

  public get isCorrect(): boolean {
    return this._isCorrect;
  }
}
