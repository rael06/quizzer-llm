import { Box, Button, TextField, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useRef } from "react";
import classes from "./classes.module.css";
import { useNavigate } from "react-router-dom";
import { clearAllCookies } from "../../utils/cookies";
import { createSession } from "../../api/application/session";
import { useLang } from "../../contexts/lang/context";

function HomePage() {
  const { dictionary } = useLang();
  const navigate = useNavigate();
  const thematicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    clearAllCookies();
  }, []);

  const startQuizz = useCallback(async () => {
    const thematic = thematicInputRef.current?.value ?? "General";
    await createSession(thematic);
    navigate("/quizz", { replace: true });
  }, [navigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        startQuizz();
      }
    },
    [startQuizz],
  );

  return (
    <Box className={classes.root}>
      <TextField
        inputRef={thematicInputRef}
        label={dictionary.home.input.label}
        placeholder={dictionary.home.input.placeholder}
        variant="outlined"
        onKeyDown={handleKeyDown}
      />

      <Button onClick={startQuizz} variant="contained">
        {dictionary.home.startQuizz}
      </Button>

      <Typography variant="body1">{dictionary.home.description1}</Typography>

      <Typography variant="body1">{dictionary.home.description2}</Typography>

      <Typography variant="body1">{dictionary.home.description3}</Typography>

      <Typography variant="body1">{dictionary.home.description4}</Typography>

      <Typography variant="body1">{dictionary.home.description5}</Typography>
    </Box>
  );
}

export default memo(HomePage);
