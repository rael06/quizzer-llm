import { Box, Button, TextField } from "@mui/material";
import { memo, useCallback, useEffect, useRef } from "react";
import classes from "./classes.module.css";
import { useNavigate } from "react-router-dom";
import { clearAllCookies } from "../../utils/cookies";
import { createSession } from "../../api/application/session";

function HomePage() {
  const navigate = useNavigate();
  const thematicInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    clearAllCookies();
  }, []);

  const startQuizz = useCallback(async () => {
    const thematic = thematicInputRef.current?.value ?? "";
    await createSession({ thematic, language: "french" });
    navigate("/quizz", { replace: true });
  }, [navigate]);

  return (
    <Box className={classes.root}>
      <TextField
        inputRef={thematicInputRef}
        label="Thématique"
        variant="outlined"
      />

      <Button onClick={startQuizz} variant="contained">
        Démarrer le quizz
      </Button>
    </Box>
  );
}

export default memo(HomePage);
