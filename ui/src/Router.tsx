import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { memo } from "react";
import PageTemplate from "./components/PageTemplate";
import HomePage from "./components/HomePage";
import Page404 from "./components/Page404";
import QuizzPage from "./components/QuizzPage";
import { LangContextProvider } from "./contexts/lang/context";
import { QuestionContextProvider } from "./contexts/question/context";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LangContextProvider>
        <QuestionContextProvider>
          <PageTemplate />
        </QuestionContextProvider>
      </LangContextProvider>
    ),

    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "quizz",
        element: <QuizzPage />,
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
