import { z } from "zod";

const envSchema = z.object({
  Environment: z.enum(["local", "production"]),
  Host: z.string(),
  Port: z.coerce.number().positive(),
});

type Env = z.infer<typeof envSchema>;

export const EnvVariables: Env = envSchema.parse({
  Environment: process.env.ENVIRONMENT,
  Host: process.env.HOST,
  Port: process.env.PORT,
});
