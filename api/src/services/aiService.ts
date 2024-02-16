import { z } from "zod";
import { OllamaService } from "./ollama";
import { getSession, updateSession } from "./sessionManager";
import assert from "assert";
import { v4 as uuidV4 } from "uuid";
import { Ollama } from "ollama";
import {
  buildQuestionInstructions,
  buildFeedbackInstructions,
} from "./promptService";
import Question from "../models/Question";

async function tryAskQuestion(
  ollamaInstance: Ollama,
  instructions: { role: "user" | "assistant" | "system"; content: string }[],
) {
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

  const jsonStr = transformQuestionToJsonStr(completeModelQuestion);

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

const MAX_RETRIES = 4;

export async function askQuestion({
  sessionId,
  language,
}: {
  sessionId: string;
  language: string;
}) {
  const session = getSession(sessionId);
  assert(session, "Session not found");

  const ollamaInstance = await OllamaService.getInstance();

  let tries = 0;
  let question: Question | null = null;
  do {
    tries++;
    try {
      question = await tryAskQuestion(
        ollamaInstance,
        buildQuestionInstructions({ session, language }),
      );
      break;
    } catch (e) {
      console.error(e);
    }
  } while (tries <= MAX_RETRIES);
  if (!question) return null;

  session.questions.push(question);
  updateSession(session);

  return question;
}

async function tryAnswerQuestion({
  ollamaInstance,
  retryPrompt = "",
  question,
  answer,
  language,
}: {
  ollamaInstance: Ollama;
  retryPrompt: string;
  question: Question;
  answer: string;
  language: string;
}) {
  const feedback = await ollamaInstance.chat({
    model: "mistral:instruct",
    messages: buildFeedbackInstructions({
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

  const jsonStr = transformFeedbackToJsonStr(completeFeedback);

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

export async function answerQuestion({
  sessionId,
  language,
  answer,
}: {
  sessionId: string;
  language: string;
  answer: string;
}) {
  const session = getSession(sessionId);
  assert(session, "Session not found");

  let question = session.questions[session.questions.length - 1];
  assert(question, "Question not found");

  const ollamaInstance = await OllamaService.getInstance();

  let tries = 0;
  let answeredQuestion: Question | null = null;
  do {
    tries++;
    try {
      answeredQuestion = await tryAnswerQuestion({
        ollamaInstance,
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
  } while (tries <= MAX_RETRIES);
  if (!answeredQuestion) return null;

  session.questions[session.questions.length - 1] = answeredQuestion;
  updateSession(session);

  return answeredQuestion;
}

function transformQuestionToJsonStr(completeModelQuestion: string) {
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

function transformFeedbackToJsonStr(completeFeedback: string) {
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
