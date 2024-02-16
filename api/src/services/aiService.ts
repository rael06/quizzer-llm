import OllamaService from "./OllamaService";
import assert from "assert";
import Question from "../models/Question";
import PromptService from "./PromptService";
import SessionManager from "./SessionManager";
import Answer from "../models/Answer";

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
  private readonly maxRetries = 4;

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
          userAnswer: answer,
          language,
        });
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

    return Question.parseFromAi(completeModelQuestion);
  }

  private async tryAnswerQuestion({
    retryPrompt = "",
    question,
    userAnswer,
    language,
  }: {
    retryPrompt: string;
    question: Question;
    userAnswer: string;
    language: string;
  }) {
    const ollamaInstance = await OllamaService.getInstance();
    const feedback = await ollamaInstance.chat({
      model: "mistral:instruct",
      messages: this.promptService.buildFeedbackInstructions({
        retryInstruction: retryPrompt,
        question,
        answer: userAnswer,
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

    const answer = Answer.parseFeedbackFromAi(userAnswer, completeFeedback);

    question.answer = answer;
    return question;
  }
}
