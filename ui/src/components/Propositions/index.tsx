import { Box, Button, useTheme } from "@mui/material";
import { memo, useCallback } from "react";
import classes from "./classes.module.css";
import { Question } from "../../models";

type Props = {
  question: Question;
  onChoose: (proposition: string) => void;
  isLoadingFeedback: boolean;
};

function Propositions({ question, onChoose, isLoadingFeedback }: Props) {
  const theme = useTheme();
  const handleChoose = useCallback(
    (proposition: string) =>
      (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onChoose(proposition);
      },
    [onChoose],
  );

  return (
    <Box className={classes.root}>
      {question.propositions.map((proposition, index) => {
        const isQuestionAnswered = question.answer !== null;
        const isPropositionSelected =
          isQuestionAnswered && question.answer?.answer === proposition;
        const isPropositionCorrect =
          isQuestionAnswered && question.answer?.isCorrect;

        const buttonColor =
          (!isPropositionSelected && "primary") ||
          (isPropositionCorrect && "success") ||
          "error";

        return (
          <Button
            key={index}
            onClick={handleChoose(proposition)}
            variant={isPropositionSelected ? "contained" : "outlined"}
            disabled={isQuestionAnswered || isLoadingFeedback}
            sx={
              isPropositionSelected
                ? {
                    "&:disabled": {
                      backgroundColor: theme.palette[buttonColor].main,
                    },
                  }
                : undefined
            }
          >
            {index + 1}. {proposition}
          </Button>
        );
      })}
    </Box>
  );
}

export default memo(Propositions);
