import { Box, Button, TextField, Typography } from "@mui/material";
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
    const thematic = thematicInputRef.current?.value ?? "Générale";
    await createSession({ thematic, language: "french" });
    navigate("/quizz", { replace: true });
  }, [navigate]);

  return (
    <Box className={classes.root}>
      <TextField
        inputRef={thematicInputRef}
        label="Thématique"
        placeholder="Générale"
        variant="outlined"
      />

      <Button onClick={startQuizz} variant="contained">
        Démarrer le quizz
      </Button>

      <Typography variant="body1">
        Passionné de quizz ? Explorez diverses thématiques ici. En l'absence de
        choix, un quizz général sera proposé. Bon Quizz ! 🎉
      </Typography>

      <Typography variant="body1">
        Attention : les questions sont générées par un modèle de langage dans un
        langage français approximatif et peuvent ne pas être exactes. Elles ne
        doivent pas être considérées comme une source fiable.
      </Typography>

      <Typography variant="body1">
        La responsabilité de l'utilisation du site et des résultats générés ne
        peut être engagée.
      </Typography>

      <Typography variant="body1">
        L'efficacité du modèle est remarquable et mérite d'être partagée. Pour
        toute question, contactez-moi.
      </Typography>
    </Box>
  );
}

export default memo(HomePage);
