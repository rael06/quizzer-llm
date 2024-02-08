import { Box, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box className={classes.root}>
      <Box className={classes.link}>
        <Typography variant="body2">2024, By Rael CALITRO: </Typography>
        <Link
          to="https://www.linkedin.com/in/rael-calitro-4a519a187/"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2">LinkedIn</Typography>
        </Link>
        -{" "}
        <Link to="https://rael-calitro.ovh" target="_blank" rel="noreferrer">
          <Typography variant="body2">Website</Typography>
        </Link>
      </Box>
      <Box className={classes.link}>
        <Typography variant="body2" fontStyle="italic">
          License:{" "}
        </Typography>
        <Link
          to="https://github.com/rael06/quizzer-llm?tab=readme-ov-file#license"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2">MIT</Typography>
        </Link>
        -{" "}
        <Typography variant="body2" fontStyle="italic">
          Source code:{" "}
        </Typography>
        <Link
          to="https://github.com/rael06/quizzer-llm"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2">Github</Typography>
        </Link>
      </Box>
      <Box className={classes.link}>
        <Typography variant="body2" fontStyle="italic">
          Using open source LLM Model from:{" "}
        </Typography>
        <Link to="https://mistral.ai" target="_blank" rel="noreferrer">
          <Typography variant="body2">MistralAI</Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default memo(Footer);
