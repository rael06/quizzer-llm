import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./classes.module.css";
import { Session } from "../../models";
import Feedback from "./Feedback";
import { fetchSession } from "../../api/application/session";
import { useLang } from "../../contexts/lang/context";
import { useQuestion } from "../../contexts/question/context";
import Question from "./Question";
import { ErrorBoundary } from "react-error-boundary";

function QuizzPage() {
  const { dictionary } = useLang();
  const navigate = useNavigate();
  const { question, askQuestion, isLoadingQuestion } = useQuestion();

  const [session, setSession] = useState<Session | null>(null);

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    askQuestion();
  }, [askQuestion]);

  useEffect(() => {
    fetchSession()
      .then((data) => setSession(data))
      .catch(() => goHome());
  }, [question, goHome]);

  const score = useMemo(() => {
    return {
      current: session?.questions.filter((q) => q.answer?.isCorrect).length,
      max: session?.questions.filter((q) => q.answer).length,
    };
  }, [session?.questions]);

  return (
    <Box className={classes.root}>
      <Box className={classes.question}>
        <Typography>
          {dictionary.quizz.score}
          {score.current ?? 0}/{score.max ?? 0}
        </Typography>

        <ErrorBoundary
          fallback={<Typography>{dictionary.quizz.error}</Typography>}
        >
          <Question />
        </ErrorBoundary>
        {question?.answer && (
          <Box mt={4}>
            <Feedback answer={question.answer} />
          </Box>
        )}
      </Box>

      <Box className={classes.actions}>
        <Button
          onClick={goHome}
          color="secondary"
          variant="contained"
          disabled={isLoadingQuestion}
        >
          {dictionary.quizz.action.home}
        </Button>
        <Button
          onClick={askQuestion}
          variant="contained"
          disabled={isLoadingQuestion}
        >
          {dictionary.quizz.action.next}
        </Button>
      </Box>
    </Box>
  );
}

export default memo(QuizzPage);
