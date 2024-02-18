import assert from "assert";
import Question from "../models/Question";
import PromptService from "./PromptService";
import SessionManager from "./SessionManager";
import Answer from "../models/Answer";
import Feedback from "../models/Feedback";
import ICompletionService from "./modelCompletions/ICompletionService";
import OllamaModelCompletion from "./modelCompletions/OllamaModelCompletion";
import { EnvVariables } from "../EnvVariables";
import ApiModelCompletion from "./modelCompletions/ApiModelCompletion";
import { ModelMessage } from "../models/ModelMessage";

export default class AiService {
  private static _instance: AiService;
  private constructor() {}
  public static getInstance(): AiService {
    if (!this._instance) {
      this._instance = new AiService();
    }
    return this._instance;
  }

  private readonly completionService: ICompletionService =
    EnvVariables.ModelCommunicationType === "api"
      ? ApiModelCompletion.getInstance()
      : OllamaModelCompletion.getInstance();

  private readonly sessionManager = SessionManager.getInstance();
  private readonly promptService = PromptService.getInstance();
  private readonly maxRetries = 2;

  public async askQuestion({
    sessionId,
    language,
  }: {
    sessionId: string;
    language: string;
  }) {
    const session = this.sessionManager.getSession(sessionId);
    assert(session, "Session not found");

    const messages = this.promptService.buildQuestionInstructions({
      session,
      language,
    });

    // Retry until the model gives a correct question or the max retries is reached
    let tries = 0;
    let question: Question | null = null;
    do {
      tries++;
      try {
        question = await this.fetchQuestionOrThrow(messages);
        break;
      } catch (e) {
        console.error(e);
      }
    } while (tries <= this.maxRetries);
    if (!question) return null;

    session.questions.push(question);
    this.sessionManager.updateSession(session);

    return question;
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

    const messages = this.promptService.buildFeedbackInstructions({
      question,
      answer,
      language,
    });

    // Retry until the model gives a correct feedback or the max retries is reached
    let tries = 0;
    let answeredQuestion: Question | null = null;
    do {
      tries++;
      try {
        const feedback = await this.fetchAnswerFeedbackOrThrow(messages);
        question.answer = Answer.build(answer, feedback);
        answeredQuestion = question;
        break;
      } catch (e) {
        console.error(e);
      }
    } while (tries <= this.maxRetries);
    if (!answeredQuestion) return null;

    session.questions[session.questions.length - 1] = answeredQuestion;
    this.sessionManager.updateSession(session);

    return answeredQuestion;
  }

  private async fetchQuestionOrThrow(instructions: ModelMessage[]) {
    const completeModelQuestion =
      await this.completionService.complete(instructions);

    return Question.build(completeModelQuestion);
  }

  private async fetchAnswerFeedbackOrThrow(instructions: ModelMessage[]) {
    const completeFeedback =
      await this.completionService.complete(instructions);

    return Feedback.parseFromAi(completeFeedback);
  }
}
