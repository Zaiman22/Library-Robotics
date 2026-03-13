import ros, { uiKWSInput } from "../ros/ros"
import { useEffect, useRef, useState } from "react";
import * as ROSLIB from "roslib";
import { Link, useNavigate} from "react-router";

import backButton from "@/components/backButton";

export default function SelectPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!uiKWSInput) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const callback = (msg: any) => {
      console.log("Received message on /ui/kws:", msg);

      if (msg.data == "kembali") {
        navigate(-1);
      }
      else if(msg.data == "carikan buku"){
        navigate("/book");
      }

    };

    uiKWSInput.subscribe(callback);

    return () => {
      uiKWSInput.unsubscribe(callback);
      if (timeout) clearTimeout(timeout);
    };
  }, [uiKWSInput, navigate]);

  const Navigation = () => {
    return (
      <div className="bg-[#3db8dd] min-w-screen min-h-screen p-10 content-center">
        {backButton()}
        <h1 className="text-8xl font-extrabold text-center m-20">
          Apa yang bisa RoboBook bantu?
        </h1>
        <div className="grid grid-cols-2 gap-4 m-5">
          <NavBox subtitle="Aku mau BERMAIN" />
          <NavBox subtitle="Saya mau CEK BUKU" go_to="/book"/>
        </div>
      </div>
    );
  };

  type NavBoxProps = {
    subtitle: string;
    go_to: string
  };

  const NavBox = ({ subtitle, go_to }: NavBoxProps) => {
    return (
      <Link to={go_to}>
      <div className="bg-white p-10 text-center rounded-2xl text-4xl">
        <h2>{subtitle}</h2>
      </div>
      </Link>
    );
  };

  return <>{Navigation()}</>;
}
