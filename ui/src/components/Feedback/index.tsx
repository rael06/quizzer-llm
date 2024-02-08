import { memo } from "react";
import { Box, Typography } from "@mui/material";
import classes from "./classes.module.css";
import { Answer } from "../../models";
import { useLang } from "../../contexts/lang/context";

type Props = {
  answer: Answer;
};
function Feedback({ answer }: Props) {
  const { dictionary } = useLang();
  return (
    <Box className={classes.root}>
      <Typography fontSize={14}>{answer.feedback}</Typography>
      {!answer.isCorrect && (
        <Typography>
          {dictionary.quizz.feedback.introExpectedAnswer}
          {answer.expectedAnswer}
        </Typography>
      )}
    </Box>
  );
}

export default memo(Feedback);
