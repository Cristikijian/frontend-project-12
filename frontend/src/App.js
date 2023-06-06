import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { ToastContainer } from "react-toastify";
import resources from './locales/index.js';
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { UserContextProvider } from "./context";
import MainPage from "./pages/MainPage";
import Layout from "./components/Layout";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
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
  ]}
]);

function App() {

  const i18n = i18next.createInstance();
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  
  return (
    <I18nextProvider i18n={i18n}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
      <ToastContainer
            autoClose={5000}
            closeOnClick
            draggable
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnFocusLoss
            pauseOnHover
            position="top-right"
            rtl={false}
          />
    </I18nextProvider>
  );
}

export default App;
