import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uiRouteTopic } from "./ros";

export default function RouteFromRos() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (message: unknown) => {
      const msg = message as { data: string };

      if (["home", "select"].includes(msg.data)) {
        navigate(msg.data === "home" ? "/" : `/${msg.data}`);
      }
    };

    uiRouteTopic.subscribe(handler);
    return () => uiRouteTopic.unsubscribe(handler);
  }, [navigate]);

  return null;
}
