import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import { memo } from "react";
import PageTemplate from "./components/PageTemplate";
import HomePage from "./components/HomePage";
import Page404 from "./components/Page404";
import QuizzPage from "./components/QuizzPage";
import { ErrorBoundary } from "react-error-boundary";
import { Typography } from "@mui/material";
import { LangContextProvider } from "./contexts/lang/context";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LangContextProvider>
        <PageTemplate />
      </LangContextProvider>
    ),

    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "quizz",
        element: (
          <ErrorBoundary
            fallback={
              <>
                <Typography mb={2}>
                  Désolé, quelque chose s'est mal passé, revenez plus tard.
                </Typography>
                <Link to="/">
                  <Typography>Accueil</Typography>
                </Link>
              </>
            }
          >
            <QuizzPage />
          </ErrorBoundary>
        ),
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default memo(Router);
