import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";


import HomePage from './pages/homepage';

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
