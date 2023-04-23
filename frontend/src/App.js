import './App.css';
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import { UserContextProvider } from './context';

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect('/login')
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}

export default App;
