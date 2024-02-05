import { Box, Typography } from "@mui/material";
import { memo } from "react";
import classes from "./classes.module.css";

function Footer() {
  return (
    <Box className={classes.root}>
      <Typography variant="body2" fontStyle="italic">
        Developper:{" "}
      </Typography>
      <a href="https://rael-calitro.ovh" target="_blank" rel="noreferrer">
        Rael CALITRO
      </a>
    </Box>
  );
}

export default memo(Footer);
