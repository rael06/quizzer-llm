import Question from "./Question";

export default class Session {
  constructor(
    public id: string,
    public thematic: string,
    public questions: Question[],
  ) {}
}
