import { EnvVariables } from "../../EnvVariables";

const url = {
  local: "http://localhost:3099/api",
  production: "https://quizzer-llm.rael-calitro.ovh/api",
};

export const applicationApiUrl = url[EnvVariables.Environment];
