import assert from "assert";
import { createContext, memo, useCallback, useContext, useState } from "react";
import { Question } from "../../models";
import { useLang } from "../lang/context";
import { fetchQuestion, postAnswer } from "../../api/application/model";
import { useNavigate } from "react-router-dom";

export type QuestionContextType = {
  question: Question | null;
  isLoadingQuestion: boolean;
  isLoadingFeedback: boolean;
  askQuestion: () => void;
  answerQuestion: (proposition: string) => void;
  isAnswered: boolean;
};

const QuestionContext = createContext<QuestionContextType | null>(null);

function Provider({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

  const askQuestion = useCallback(async () => {
    setIsLoadingQuestion(true);
    setQuestion(null);

    fetchQuestion(lang)
      .then((data) => setQuestion(data))
      .catch((error) => error.message === "Session not found" && navigate("/"))
      .finally(() => setIsLoadingQuestion(false));
  }, [lang, navigate]);

  const answerQuestion = useCallback(
    (proposition: string) => {
      setIsLoadingFeedback(true);
      postAnswer(lang, proposition)
        .then(setQuestion)
        .then(() => setIsLoadingFeedback(false));
    },
    [lang],
  );

  return (
    <QuestionContext.Provider
      value={{
        question,
        isLoadingQuestion,
        isLoadingFeedback,
        askQuestion,
        answerQuestion,
        isAnswered: !!question?.answer,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  assert(context, "useQuestion must be used within a QuestionContextProvider");

  return context;
}

export const QuestionContextProvider = memo(Provider);
