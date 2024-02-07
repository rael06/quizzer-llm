// import "dotenv/config";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, "privkey.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
  },
});
server.register(fastifyCookie);

server.register(fastifyCors, {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
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
  const { language, thematic } = z
    .object({
      language: z.string(),
      thematic: z.string(),
    })
    .parse(request.body);

  const session = createSession({ language, thematic });
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

  const question = await askQuestion({ sessionId });

  if (!question) return reply.status(500).send("Error generating question");

  return reply.send(question);
});

server.post("/api/model/answer", async (request, reply) => {
  const sessionId = getSession(request.cookies.sessionId)?.id;
  if (!sessionId) {
    return reply.status(400).send({ error: "Session not found" });
  }

  const answer = z
    .object({
      answer: z.string(),
    })
    .parse(request.body).answer;

  const feedback = await answerQuestion({ sessionId, answer });

  if (!feedback) return reply.status(500).send("Error verifying answer");

  return reply.send(feedback);
});

server.get("/api/health", (request, reply) => {
  reply.status(200).send({ status: "ok" });
});

server.setNotFoundHandler((request, reply) => {
  // Vérifie si l'URL commence par /api
  if (request.raw.url?.startsWith("/api")) {
    // Si c'est une route API non trouvée, vous pouvez choisir de renvoyer une erreur JSON par exemple
    reply.status(404).send({ error: "API route not found" });
  } else {
    // Pour toutes les autres routes, servir index.html
    reply.sendFile("index.html");
  }
});

server.listen({ host: "0.0.0.0", port: 3099 }, (err, address) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});
