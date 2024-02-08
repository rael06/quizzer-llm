import { Box, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/lang/context";

function Footer() {
  const { dictionary } = useLang();
  return (
    <Box className={classes.root}>
      <Box className={classes.link}>
        <Typography variant="body2" fontSize={12} fontStyle="italic">
          {dictionary.footer.author}
        </Typography>
        <Link
          to="https://www.linkedin.com/in/rael-calitro-4a519a187/"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2" fontSize={12}>
            LinkedIn
          </Typography>
        </Link>
        -{" "}
        <Link to="https://rael-calitro.ovh" target="_blank" rel="noreferrer">
          <Typography variant="body2" fontSize={12}>
            Website
          </Typography>
        </Link>
      </Box>
      <Box className={classes.link}>
        <Typography variant="body2" fontSize={12} fontStyle="italic">
          {dictionary.footer.license}
        </Typography>
        <Link
          to="https://github.com/rael06/quizzer-llm?tab=readme-ov-file#license"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2" fontSize={12}>
            MIT
          </Typography>
        </Link>
        -{" "}
        <Typography variant="body2" fontSize={12} fontStyle="italic">
          {dictionary.footer.sourceCode}
        </Typography>
        <Link
          to="https://github.com/rael06/quizzer-llm"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2" fontSize={12}>
            Github
          </Typography>
        </Link>
      </Box>
      <Box className={classes.link}>
        <Typography variant="body2" fontSize={12} fontStyle="italic">
          {dictionary.footer.modelSource}
        </Typography>
        <Link to="https://mistral.ai" target="_blank" rel="noreferrer">
          <Typography variant="body2" fontSize={12}>
            MistralAI
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default memo(Footer);
