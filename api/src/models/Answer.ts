export default class Answer {
  constructor(
    public answer: string,
    public feedback: string,
    public isCorrect: boolean,
    public expectedAnswer: string,
  ) {}
}
