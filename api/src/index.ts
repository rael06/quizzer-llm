import "dotenv/config";
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import path from "path";
import staticPlugin from "@fastify/static";
import fastifyBasicAuth from "@fastify/basic-auth";

import { z } from "zod";
import { fileURLToPath } from "url";
import fs from "fs";
import assert from "assert";
import { EnvVariables } from "./EnvVariables";
import AiService from "./services/AiService";
import SessionManager from "./services/SessionManager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({
  logger: true,
  ...(EnvVariables.Environment === "production" &&
    EnvVariables.HttpsCertificate === "local" && {
      https: {
        key: fs.readFileSync(path.join(__dirname, "privkey.pem")),
        cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
      },
    }),
});
server.register(fastifyCookie);

server.register(fastifyCors, {
  origin: EnvVariables.CorsOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});

if (EnvVariables.UseBasicAuth) {
  server.register(fastifyBasicAuth, {
    validate: async (username, password, req, reply) => {
      if (
        username !== EnvVariables.BasicAuthUsername ||
        password !== EnvVariables.BasicAuthPassword
      ) {
        return new Error("Authentication error");
      }
      return;
    },
    authenticate: { realm: "Restricted Area" },
  });

  server.after(() => {
    server.addHook("onRequest", server.basicAuth);
  });
}

const publicPath = path.join(__dirname, "public");
console.info("publicPath: ", publicPath);

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

  const session = SessionManager.getInstance().createSession(thematic);
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
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(400).send({ error: "SessionId is missing" });
  }

  const session = SessionManager.getInstance().getSession(
    request.cookies.sessionId,
  );
  if (!session) {
    return reply.status(404).send({ error: "Session not found" });
  }

  return reply.send(session.toView());
});

server.get("/api/model/question", async (request, reply) => {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(400).send({ error: "SessionId is missing" });
  }

  const session = SessionManager.getInstance().getSession(
    request.cookies.sessionId,
  );
  if (!session) {
    return reply.status(400).send({ error: "Session not found" });
  }

  const language = z
    .object({
      language: z.string(),
    })
    .parse(request.query).language;

  const question = await AiService.getInstance().askQuestion({
    sessionId: session.id,
    language,
  });

  assert(question, "Error generating question");

  return reply.send(question.toView());
});

server.post("/api/model/answer", async (request, reply) => {
  const sessionId = SessionManager.getInstance().getSession(
    request.cookies.sessionId,
  )?.id;
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

  const answeredQuestion = await AiService.getInstance().answerQuestion({
    sessionId,
    language,
    answer,
  });

  assert(answeredQuestion, "Error verifying answer");

  return reply.send(answeredQuestion.toView());
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
