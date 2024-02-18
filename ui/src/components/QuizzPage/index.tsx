import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./classes.module.css";
import { Session } from "../../models";
import Feedback from "./Feedback";
import { fetchSession } from "../../api/application/session";
import { useLang } from "../../contexts/lang/context";
import { useQuestion } from "../../contexts/question/context";
import Question from "./Question";

function QuizzPage() {
  const { dictionary } = useLang();
  const navigate = useNavigate();
  const { question, askQuestion, isLoadingQuestion, isLoadingFeedback } =
    useQuestion();

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
      current: session?.questions.filter((q) => q.answer?.feedback.isCorrect)
        .length,
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

        <Box className={classes.actions}>
          <Button
            onClick={goHome}
            color="secondary"
            variant="contained"
            disabled={isLoadingQuestion || isLoadingFeedback}
          >
            {dictionary.quizz.action.home}
          </Button>
          <Button
            onClick={askQuestion}
            variant="contained"
            disabled={isLoadingQuestion || isLoadingFeedback}
          >
            {dictionary.quizz.action.next}
          </Button>
        </Box>

        <LinearProgress
          sx={{
            marginY: 1,
            visibility:
              isLoadingQuestion || isLoadingFeedback ? "visible" : "hidden",
          }}
        />

        <Question />

        {question?.answer && (
          <Box mt={4}>
            <Feedback answer={question.answer} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default memo(QuizzPage);
