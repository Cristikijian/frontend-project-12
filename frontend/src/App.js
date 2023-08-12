import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './authContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import rollbarConfig from './rollbar/rollbarConfig';
import { appRoutes } from './routes';
import { SocketsContextProvider } from './socketsContext';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        ),
      },
      {
        path: appRoutes.login,
        element: <LoginPage />,
      },
      {
        path: appRoutes.signUp,
        element: <SignUpPage />,
      },
    ],
  },
]);

const App = ({ i18n, sockets }) => (
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <AuthContextProvider>
          <SocketsContextProvider sockets={sockets}>
            <RouterProvider router={router} />
          </SocketsContextProvider>
        </AuthContextProvider>
        <ToastContainer />
      </I18nextProvider>
    </ErrorBoundary>
  </RollbarProvider>
);

export default App;
