import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./classes.module.css";
import { Question, Session } from "../../models";
import Propositions from "../Propositions";
import { ErrorBoundary } from "react-error-boundary";
import Feedback from "../Feedback";
import { fetchSession } from "../../api/application/session";
import { fetchQuestion, postAnswer } from "../../api/application/model";

function QuizzPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

  const restart = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const askQuestion = useCallback(async () => {
    setIsLoadingQuestion(true);
    setQuestion(null);
    try {
      const data = await fetchQuestion();
      setQuestion(data);
    } finally {
      setIsLoadingQuestion(false);
    }
  }, []);

  useEffect(() => {
    (async () => await askQuestion())();
  }, [askQuestion]);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchSession();
      setSession(data);
    })();
  }, [question]);

  const score = useMemo(() => {
    return {
      current: session?.questions.filter((q) => q.answer?.isCorrect).length,
      max: session?.questions.filter((q) => q.answer).length,
    };
  }, [session?.questions]);

  const answerQuestion = useCallback(async (proposition: string) => {
    setIsLoadingFeedback(true);
    const data = await postAnswer(proposition);
    setQuestion(data);
    setIsLoadingFeedback(false);
  }, []);

  return (
    <Box className={classes.root}>
      <Box className={classes.question}>
        <Typography>
          Score : {score.current}/{score.max}
        </Typography>
        <LinearProgress
          sx={{ visibility: isLoadingQuestion ? "visible" : "hidden" }}
        />
        {question !== null && (
          <>
            <Typography>{question.question}</Typography>
            <LinearProgress
              sx={{ visibility: isLoadingFeedback ? "visible" : "hidden" }}
            />
            <ErrorBoundary
              fallback={
                <Typography>
                  Désolé, une erreur est survenue, veuillez passer à la question
                  suivante.
                </Typography>
              }
            >
              <Propositions
                question={question}
                onChoose={answerQuestion}
                isLoadingFeedback={isLoadingFeedback}
              />
            </ErrorBoundary>
          </>
        )}
      </Box>

      {question?.answer && <Feedback answer={question.answer} />}

      <Box className={classes.actions}>
        <Button
          onClick={restart}
          color="secondary"
          variant="contained"
          disabled={isLoadingQuestion}
        >
          Redémarrer
        </Button>
        <Button
          onClick={askQuestion}
          variant="contained"
          disabled={isLoadingQuestion}
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );
}

export default memo(QuizzPage);
