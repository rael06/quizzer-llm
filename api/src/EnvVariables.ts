import { z } from "zod";

const envSchema = z.object({
  Environment: z.enum(["local", "production"]),
  Host: z.string(),
  Port: z.coerce.number().positive(),
  CorsOrigin: z.array(z.string()),
  HttpsCertificate: z.enum(["local", "managed"]),
  UseBasicAuth: z.boolean(),
  BasicAuthUsername: z.string().optional(),
  BasicAuthPassword: z.string().optional(),
  ModelCommunicationType: z.enum(["api", "ollama"]),
  OllamaApiUrl: z.string().optional(),
  ApiModelSecret: z.string().optional(),
  ApiModelName: z.string().optional(),
  ApiModelUrl: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

export const EnvVariables: Env = envSchema.parse({
  Environment: process.env.ENVIRONMENT,
  Host: process.env.HOST,
  Port: process.env.PORT,
  CorsOrigin: process.env.CORS_ORIGINS?.split(","),
  HttpsCertificate: process.env.HTTPS_CERTIFICATE,
  UseBasicAuth: process.env.USE_BASIC_AUTH === "true",
  BasicAuthUsername: process.env.BASIC_AUTH_USERNAME,
  BasicAuthPassword: process.env.BASIC_AUTH_PASSWORD,
  ModelCommunicationType: process.env.MODEL_COMMUNICATION_TYPE,
  OllamaApiUrl: process.env.OLLAMA_API_URL,
  ApiModelSecret: process.env.API_MODEL_SECRET,
  ApiModelName: process.env.API_MODEL_NAME,
  ApiModelUrl: process.env.API_MODEL_URL,
});
