import { Outlet } from "react-router-dom";
import RouteFromRos from "./RouteFromRos";

export default function RootLayout() {
  return (
    <>
      <RouteFromRos />
      <Outlet />
    </>
  );
}
