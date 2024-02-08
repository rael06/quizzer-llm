import { z } from "zod";

const envSchema = z.object({
  Environment: z.enum(["local", "production"]),
});

type Env = z.infer<typeof envSchema>;

export const EnvVariables: Env = envSchema.parse({
  Environment: process.env.REACT_APP_ENV,
});
