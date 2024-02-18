import { ModelMessage } from "../../models/ModelMessage";

export default interface ICompletionService {
  complete(messages: ModelMessage[]): Promise<string>;
}
