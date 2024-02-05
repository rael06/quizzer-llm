import { memo } from "react";
import { Box } from "@mui/material";
import classes from "./classes.module.css";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";

function PageTemplate() {
  return (
    <Box id="page-template" className={classes.root}>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </Box>
  );
}

export default memo(PageTemplate);
