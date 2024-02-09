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
  } = useQuestion();

  if (isRetrievingQuestionError) {
    return <Typography>{dictionary.quizz.error}</Typography>;
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
