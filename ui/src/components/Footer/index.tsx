import { Box, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";

function Footer() {
  return (
    <Box className={classes.root}>
      <Box className={classes.link}>
        <Typography variant="body2">2024, By Rael CALITRO: </Typography>
        <a
          href="https://www.linkedin.com/in/rael-calitro-4a519a187/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        -{" "}
        <a href="https://rael-calitro.ovh" target="_blank" rel="noreferrer">
          Website
        </a>
      </Box>
      <Box className={classes.link}>
        <Typography variant="body2" fontStyle="italic">
          License:{" "}
        </Typography>
        <a
          href="https://github.com/rael06/quizzer-llm?tab=readme-ov-file#license"
          target="_blank"
          rel="noreferrer"
        >
          MIT
        </a>
        -{" "}
        <Typography variant="body2" fontStyle="italic">
          Source code:{" "}
        </Typography>
        <a
          href="https://github.com/rael06/quizzer-llm"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </Box>
      <Box className={classes.link}>
        <Typography variant="body2" fontStyle="italic">
          Using open source LLM Model from:{" "}
        </Typography>
        <a href="https://mistral.ai" target="_blank" rel="noreferrer">
          Mistral AI
        </a>
      </Box>
    </Box>
  );
}

export default memo(Footer);
