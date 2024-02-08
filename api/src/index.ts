import "dotenv/config";
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import path from "path";
import staticPlugin from "@fastify/static";
import { createSession, getSession } from "./services/sessionManager";
import { answerQuestion, askQuestion } from "./services/model";
import { z } from "zod";
import { fileURLToPath } from "url";
import fs from "fs";
import assert from "assert";
import { EnvVariables } from "./EnvVariables";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({
  logger: true,
  ...(EnvVariables.Environment === "production" && {
    https: {
      key: fs.readFileSync(path.join(__dirname, "privkey.pem")),
      cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
    },
  }),
});
server.register(fastifyCookie);

server.register(fastifyCors, {
  origin: [
    "http://localhost:3001",
    "http://localhost:3099",
    "http://quizzer-llm.rael-calitro.ovh",
    "https://quizzer-llm.rael-calitro.ovh",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});

const publicPath = path.join(__dirname, "public");

server.register(staticPlugin, {
  root: publicPath,
  prefix: "/",
});

server.post("/api/sessions", async (request, reply) => {
  const { thematic } = z
    .object({
      thematic: z.string(),
    })
    .parse(request.body);

  const session = createSession(thematic);
  reply.setCookie("sessionId", session.id, {
    httpOnly: false,
    path: "/",
    secure: false,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1h
  });

  return reply.send(session);
});

server.get("/api/session", async (request, reply) => {
  const session = getSession(request.cookies.sessionId);
  if (!session) {
    return reply.status(404).send({ error: "Session not found" });
  }

  return reply.send(session);
});

server.get("/api/model/question", async (request, reply) => {
  const sessionId = getSession(request.cookies.sessionId)?.id;
  if (!sessionId) {
    return reply.status(400).send({ error: "Session not found" });
  }

  const language = z
    .object({
      language: z.string(),
    })
    .parse(request.query).language;

  const question = await askQuestion({ sessionId, language });

  assert(question, "Error generating question");

  return reply.send(question);
});

server.post("/api/model/answer", async (request, reply) => {
  const sessionId = getSession(request.cookies.sessionId)?.id;
  if (!sessionId) {
    return reply.status(400).send({ error: "Session not found" });
  }

  const language = z
    .object({
      language: z.string(),
    })
    .parse(request.query).language;

  const answer = z
    .object({
      answer: z.string(),
    })
    .parse(request.body).answer;

  const feedback = await answerQuestion({ sessionId, language, answer });

  assert(feedback, "Error verifying answer");

  return reply.send(feedback);
});

server.get("/api/health", (request, reply) => {
  reply.status(200).send({ status: "ok" });
});

server.setNotFoundHandler((request, reply) => {
  if (request.raw.url?.startsWith("/api")) {
    reply.status(404).send({ error: "API route not found" });
  } else {
    reply.sendFile("index.html");
  }
});

server.listen(
  { host: EnvVariables.Host, port: EnvVariables.Port },
  (err, address) => {
    if (err) throw err;
    server.log.info(`server listening on ${address}`);
  },
);
