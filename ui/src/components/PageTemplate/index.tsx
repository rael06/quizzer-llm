import { memo } from "react";
import { Box, Typography } from "@mui/material";
import classes from "./classes.module.css";
import { Link, Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import { ErrorBoundary } from "react-error-boundary";
import { useLang } from "../../contexts/lang/context";

function PageTemplate() {
  const { dictionary } = useLang();

  return (
    <Box className={classes.root}>
      <header>
        <Header />
      </header>
      <main>
        <ErrorBoundary
          fallback={
            <>
              <Typography mb={2}>{dictionary.global.error}</Typography>
              <Link to="/">
                <Typography>{dictionary.global.home}</Typography>
              </Link>
            </>
          }
        >
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer>
        <Footer />
      </footer>
    </Box>
  );
}

export default memo(PageTemplate);
