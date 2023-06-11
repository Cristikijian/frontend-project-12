import { ErrorBoundary, Provider as RollbarProvider } from "@rollbar/react";
import i18next from "i18next";
import leoProfanity from "leo-profanity";
import React from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import { UserContextProvider } from "./context";
import resources from "./locales/index.js";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import rollbarConfig from "./rollbar/rollbarConfig";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFoundPage />,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  },
]);

const ruDict = leoProfanity.getDictionary("ru");
leoProfanity.add(ruDict);

function App() {
  const i18n = i18next.createInstance();
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "ru",
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <UserContextProvider>
            <RouterProvider router={router} />
          </UserContextProvider>
          <ToastContainer />
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
}

export default App;
