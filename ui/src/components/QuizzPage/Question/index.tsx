import { Box, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";
import { useQuestion } from "../../../contexts/question/context";
import Propositions from "./Propositions";
import AnswerInput from "./AnswerInput";
import { useLang } from "../../../contexts/lang/context";

function Question() {
  const { dictionary } = useLang();
  const {
    question,
    isLoadingFeedback,
    answerQuestion,
    isRetrievingQuestionError,
    isRetrievingFeedbackError,
  } = useQuestion();

  if (isRetrievingQuestionError) {
    return <Typography>{dictionary.quizz.error.question}</Typography>;
  }

  if (isRetrievingFeedbackError) {
    return <Typography>{dictionary.quizz.error.feedback}</Typography>;
  }

  return (
    <Box className={classes.root}>
      {question && (
        <>
          <Typography>{question.question}</Typography>

          <Propositions
            question={question}
            onChoose={answerQuestion}
            isLoadingFeedback={isLoadingFeedback}
          />

          <AnswerInput
            question={question}
            onConfirm={answerQuestion}
            isLoadingFeedback={isLoadingFeedback}
          />
        </>
      )}
    </Box>
  );
}

export default memo(Question);
