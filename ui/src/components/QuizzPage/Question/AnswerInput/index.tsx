import { Box, IconButton, TextField } from "@mui/material";
import { memo, useCallback, useState } from "react";
import classes from "./classes.module.css";
import { Question } from "../../../../models";
import {
  ArrowCircleRight,
  CancelOutlined,
  CheckCircle,
} from "@mui/icons-material";
import { useLang } from "../../../../contexts/lang/context";

type Props = {
  question: Question;
  onConfirm: (proposition: string) => void;
  isLoadingFeedback: boolean;
};

function AnswerInput({ question, onConfirm, isLoadingFeedback }: Props) {
  const { dictionary } = useLang();
  const [proposition, setProposition] = useState("");

  const handleConfirm = useCallback(() => {
    proposition && onConfirm(proposition);
  }, [onConfirm, proposition]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProposition(e.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleConfirm();
      }
    },
    [handleConfirm],
  );

  const isQuestionAnswered = question.answer !== null;
  const shouldDisableInput = isQuestionAnswered || isLoadingFeedback;
  const shouldDisableButton =
    isQuestionAnswered || isLoadingFeedback || !proposition;
  const isPropositionCorrect = isQuestionAnswered && question.answer?.isCorrect;

  return (
    <Box className={classes.root}>
      <TextField
        label={dictionary.quizz.answerInput.input.label}
        placeholder={dictionary.quizz.answerInput.input.placeholder}
        variant="outlined"
        size="small"
        fullWidth
        disabled={shouldDisableInput}
        value={proposition}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {!isQuestionAnswered && (
        <IconButton onClick={handleConfirm} disabled={shouldDisableButton}>
          <ArrowCircleRight
            color={shouldDisableButton ? "disabled" : "primary"}
            fontSize="large"
          />
        </IconButton>
      )}

      {isQuestionAnswered && !isPropositionCorrect && (
        <IconButton disabled>
          <CancelOutlined color="error" fontSize="large" />
        </IconButton>
      )}

      {isQuestionAnswered && isPropositionCorrect && (
        <IconButton disabled>
          <CheckCircle color="success" fontSize="large" />
        </IconButton>
      )}
    </Box>
  );
}

export default memo(AnswerInput);
