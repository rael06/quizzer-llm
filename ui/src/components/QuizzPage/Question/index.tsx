import { Box, LinearProgress, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";
import { useQuestion } from "../../../contexts/question/context";
import Propositions from "../../Propositions";
import assert from "assert";

function Question() {
  const { isLoadingQuestion, question, isLoadingFeedback, answerQuestion } =
    useQuestion();

  assert(isLoadingQuestion || !!question, "Error retrieving question");

  return (
    <Box className={classes.root}>
      <LinearProgress
        sx={{ visibility: isLoadingQuestion ? "visible" : "hidden" }}
      />

      {question && (
        <>
          <Typography>{question.question}</Typography>

          <LinearProgress
            sx={{ visibility: isLoadingFeedback ? "visible" : "hidden" }}
          />

          <Propositions
            question={question}
            onChoose={answerQuestion}
            isLoadingFeedback={isLoadingFeedback}
          />
        </>
      )}
    </Box>
  );
}

export default memo(Question);
