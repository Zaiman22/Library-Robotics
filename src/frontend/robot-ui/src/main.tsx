import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ros from "./ros/ros";
import HomePage from "./pages/homepage";
import SelectPage from "./pages/selectpage";
import BookTable from "./pages/book";
import BookInfo from "./pages/bookInfo";
import AudiobookPlayer from "./pages/audioBook";
import LocalizingPage from "./pages/localizing";
import PianoPage from "./pages/piano";

import "./index.css";

const router = createBrowserRouter([
  {
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/select", element: <SelectPage /> },
      { path: "/book", element: <BookTable /> },
      { path: "/book/:id", element: <BookInfo /> },
      { path: "/book/audio", element: <AudiobookPlayer /> },
      { path: "/localizing", element: <LocalizingPage /> },
      { path: "/piano", element: <PianoPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
