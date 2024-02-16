import { z } from "zod";
import OllamaService from "./OllamaService";

import assert from "assert";
import { v4 as uuidV4 } from "uuid";
import Question from "../models/Question";
import PromptService from "./PromptService";
import SessionManager from "./SessionManager";

export default class AiService {
  private static _instance: AiService;
  private constructor() {}
  public static getInstance(): AiService {
    if (!this._instance) {
      this._instance = new AiService();
    }
    return this._instance;
  }

  private readonly sessionManager = SessionManager.getInstance();
  private readonly promptService = PromptService.getInstance();
  private readonly MAX_RETRIES = 4;

  private async tryAskQuestion(
    instructions: { role: "user" | "assistant" | "system"; content: string }[],
  ) {
    const ollamaInstance = await OllamaService.getInstance();

    const modelQuestion = await ollamaInstance.chat({
      model: "mistral:instruct",
      messages: instructions,
      stream: true,
    });
    let completeModelQuestion = "";
    for await (const part of modelQuestion) {
      completeModelQuestion += part.message.content;
      process.stdout.write(part.message.content);
    }
    console.info("\n");

    const jsonStr = this.transformQuestionToJsonStr(completeModelQuestion);

    const question: Question = {
      ...z
        .preprocess(
          (v) => (typeof v === "string" ? JSON.parse(v) : v),
          z.object({ question: z.string(), propositions: z.array(z.string()) }),
        )
        .parse(jsonStr),
      id: uuidV4(),
      answer: null,
    };

    return question;
  }

  public async askQuestion({
    sessionId,
    language,
  }: {
    sessionId: string;
    language: string;
  }) {
    const session = this.sessionManager.getSession(sessionId);
    assert(session, "Session not found");

    // Retry until the model gives a correct question or the max retries is reached
    let tries = 0;
    let question: Question | null = null;
    do {
      tries++;
      try {
        question = await this.tryAskQuestion(
          this.promptService.buildQuestionInstructions({ session, language }),
        );
        break;
      } catch (e) {
        console.error(e);
      }
    } while (tries <= this.MAX_RETRIES);
    if (!question) return null;

    session.questions.push(question);
    this.sessionManager.updateSession(session);

    return question;
  }

  private async tryAnswerQuestion({
    retryPrompt = "",
    question,
    answer,
    language,
  }: {
    retryPrompt: string;
    question: Question;
    answer: string;
    language: string;
  }) {
    const ollamaInstance = await OllamaService.getInstance();
    const feedback = await ollamaInstance.chat({
      model: "mistral:instruct",
      messages: this.promptService.buildFeedbackInstructions({
        retryInstruction: retryPrompt,
        question,
        answer,
        language,
      }),
      stream: true,
    });
    let completeFeedback = "";
    for await (const part of feedback) {
      completeFeedback += part.message.content;
      process.stdout.write(part.message.content);
    }
    console.info("\n");

    const jsonStr = this.transformFeedbackToJsonStr(completeFeedback);

    const answeredQuestion: Question = {
      ...question,
      answer: {
        ...z
          .preprocess(
            (v) => JSON.parse(String(v)),
            z.object({
              feedback: z.string(),
              isCorrect: z.boolean(),
              expectedAnswer: z.string(),
            }),
          )
          .parse(jsonStr),
        answer,
      },
    };

    assert(answeredQuestion.answer, "Answer not found");

    if (
      !answeredQuestion.answer.isCorrect &&
      answeredQuestion.answer.expectedAnswer.toLowerCase() ===
        answer.toLowerCase()
    ) {
      throw new Error("Model gave an incorrect expectedAnswer");
    }

    return answeredQuestion;
  }

  public async answerQuestion({
    sessionId,
    language,
    answer,
  }: {
    sessionId: string;
    language: string;
    answer: string;
  }) {
    const session = this.sessionManager.getSession(sessionId);
    assert(session, "Session not found");

    let question = session.questions[session.questions.length - 1];
    assert(question, "Question not found");

    // Retry until the model gives a correct feedback or the max retries is reached
    let tries = 0;
    let answeredQuestion: Question | null = null;
    do {
      tries++;
      try {
        answeredQuestion = await this.tryAnswerQuestion({
          retryPrompt:
            tries > 1
              ? "Retry, ensuring your response format, and your EXPECTED_ANSWER. "
              : "",
          question,
          answer,
          language,
        });
        break;
      } catch (e) {
        console.error(e);
      }
    } while (tries <= this.MAX_RETRIES);
    if (!answeredQuestion) return null;

    session.questions[session.questions.length - 1] = answeredQuestion;
    this.sessionManager.updateSession(session);

    return answeredQuestion;
  }

  private transformQuestionToJsonStr(completeModelQuestion: string) {
    // Extract question and propositions from the raw question generated by the model
    const regexp = /<=>(.+)<\+>(.+)\|(.+)\|(.+)\|(.+)<=>/m;
    const match = completeModelQuestion.match(regexp);
    assert(match, "Invalid question format");

    const [_, question, ...propositions] = match;

    const validatedJson = z
      .object({
        question: z.string(),
        propositions: z.array(z.string()),
      })
      .parse({ question, propositions });

    const jsonStr = JSON.stringify(validatedJson);

    return jsonStr;
  }

  private transformFeedbackToJsonStr(completeFeedback: string) {
    // Extract feedback, expectedAnswer and isCorrect from the raw feedback generated by the model
    const regex = /<=>(.+)<\+>(.+)<\+>(.+)<=>/m;
    const match = completeFeedback.match(regex);
    assert(match, "Invalid feedback format");

    const [_, feedback, expectedAnswer, isCorrectStr] = match;

    const json = {
      feedback,
      expectedAnswer,
      isCorrectStr: isCorrectStr,
    };

    const validatedJson = z
      .object({
        feedback: z.string(),
        isCorrectStr: z.enum(["CORRECT", "INCORRECT"]),
        expectedAnswer: z.string(),
      })
      .parse(json);

    const jsonStr = JSON.stringify({
      ...validatedJson,
      isCorrect: validatedJson.isCorrectStr === "CORRECT",
    });
    return jsonStr;
  }
}
