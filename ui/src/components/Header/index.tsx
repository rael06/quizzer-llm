import { Box, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";

function Header() {
  return (
    <Box className={classes.root}>
      <Typography variant="h1" fontSize={22} fontWeight={20}>
        Quizzer-llm
      </Typography>
      <Typography variant="body2" fontSize={11}>
        A game using a self hosted version of LLM Mistral AI 7B Instruct
      </Typography>
    </Box>
  );
}

export default memo(Header);
