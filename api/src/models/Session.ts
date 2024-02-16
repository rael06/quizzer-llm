import Question from "./Question";

export default class Session {
  public constructor(
    public id: string,
    public thematic: string,
    public questions: Question[],
  ) {}

  public toView() {
    return {
      id: this.id,
      thematic: this.thematic,
      questions: this.questions.map((question) => question.toView()),
    };
  }
}
