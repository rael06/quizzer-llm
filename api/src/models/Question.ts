import Answer from "./Answer";

export default class Question {
  constructor(
    public id: string,
    public question: string,
    public propositions: string[],
    public answer: Answer | null,
  ) {}
}
