import { memo } from "react";
import { Box, Typography } from "@mui/material";
import classes from "./classes.module.css";
import { Answer } from "../../../models";

type Props = {
  answer: Answer;
};

function Feedback({ answer }: Props) {
  return (
    <Box className={classes.root}>
      <Typography>{answer.feedback.value}</Typography>
    </Box>
  );
}

export default memo(Feedback);
