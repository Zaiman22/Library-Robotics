import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/homepage";
import NewBookPage from "./pages/newbook";
import BookManagerPage from "./pages/managebook";

import "./index.css";

const router = createBrowserRouter([
  {
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />

          </ProtectedRoute>
        ),
      },
      {
        path: "/books/new",
        element: (
          <ProtectedRoute>
            <NewBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/manage",
        element: (
          <ProtectedRoute>
            <BookManagerPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
