import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./ros/RootLayout";
import HomePage from "./pages/homepage";
import SelectPage from "./pages/selectpage";

import "./index.css";

const router = createBrowserRouter([
  {
    element: <RootLayout />, 
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/select", element: <SelectPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
