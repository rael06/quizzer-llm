import { z } from "zod";

const envSchema = z.object({
  ApiUrl: z.string(),
});

type Env = z.infer<typeof envSchema>;

export const EnvVariables: Env = envSchema.parse({
  ApiUrl: process.env.REACT_APP_API_URL,
});
