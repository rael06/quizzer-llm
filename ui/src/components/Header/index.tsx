import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useCallback } from "react";
import classes from "./classes.module.css";
import { Lang, useLang } from "../../contexts/lang/context";
import { z } from "zod";
import { useQuestion } from "../../contexts/question/context";

const selectStyle = { width: 60, fontSize: 12 };

function Header() {
  const { lang, updateLang, dictionary } = useLang();
  const { isLoadingQuestion, isLoadingFeedback } = useQuestion();
  const theme = useTheme();
  const handleLangChange = useCallback(
    (e: SelectChangeEvent<Lang>) => {
      const langValidation = z.nativeEnum(Lang).safeParse(e.target.value);
      if (!langValidation.success) return;

      updateLang(langValidation.data);
    },
    [updateLang],
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.description}>
        <Typography
          variant="h1"
          fontSize={20}
          fontWeight={500}
          color={theme.palette.primary.dark}
        >
          {dictionary.header.title}
        </Typography>
        <Typography variant="body2" fontSize={11}>
          {dictionary.header.description}
        </Typography>
      </Box>

      <Box className={classes.lang}>
        <Select
          disabled={isLoadingQuestion || isLoadingFeedback}
          value={lang}
          onChange={handleLangChange}
          size="small"
          sx={selectStyle}
        >
          <MenuItem value={Lang.En}>{Lang.En}</MenuItem>
          <MenuItem value={Lang.Fr}>{Lang.Fr}</MenuItem>
        </Select>
      </Box>
    </Box>
  );
}

export default memo(Header);
