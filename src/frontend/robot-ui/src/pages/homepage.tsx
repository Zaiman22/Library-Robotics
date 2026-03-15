import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import ros, { uiKWSInput, POIState } from "../ros/ros"
import * as ROSLIB from "roslib";

export default function HomePage() {
  const navigate = useNavigate();


  useEffect(() => {
    if (!uiKWSInput) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    // KWS callback
    const kwsCallback = (msg: any) => {
      console.log("Received message on /ui/kws:", msg);

      setOpen(true);

      if (msg.data === "robobook") {
        timeout = setTimeout(() => {
          navigate("/select");
        }, 900);
      }
    };

    uiKWSInput.subscribe(kwsCallback);

    // POI callback
    const poiCallback = (msg: any) => {
      console.log("POI state:", msg);

      if (msg.exsistance == true) {
        console.log("Person of interest detected");
        setOpen(true);
      } else {
        console.log("No person detected");
      }
    };

    POIState.subscribe(poiCallback);

    // Cleanup when component unmounts
    return () => {
      uiKWSInput.unsubscribe(kwsCallback);
      POIState.unsubscribe(poiCallback);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [uiKWSInput]);




  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [debounce, setDebounce] = useState(0); // debounce for kws

  const lockoutSeconds = 3;


  // countdown
  useEffect(() => {
    if (!open) return;

    setCountdown(lockoutSeconds);

    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
      console.log(interval)
    }, 1000);

    const timeout = setTimeout(() => {
      setOpen(false);       // close gate
      setCountdown(0);
    }, lockoutSeconds * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open]);

  return (
    <div className="relative min-w-screen min-h-screen overflow-hidden bg-[#3db8dd] select-none">

      {/* LEFT GATE */}
      <div
        className={`
          absolute z-10 top-0 left-0 w-1/2 h-full bg-[#067598]
          transition-transform duration-700 ease-in-out
          ${open ? "-translate-x-full" : "translate-x-0"}
        `}
        onClick={() => setOpen(true)}
      />

      {/* RIGHT GATE */}
      <div
        className={`
          absolute z-10 top-0 right-0 w-1/2 h-full bg-[#067598]
          transition-transform duration-700 ease-in-out
          ${open ? "translate-x-full" : "translate-x-0"}
        `}
        onClick={() => setOpen(true)}
      />

      {/* CENTER CONTENT */}
      <Link to="/select">
        <div
          className="relative z-1 min-h-screen flex justify-center items-center text-center">
          <div className="text-8xl bg-white aspect-square rounded-full flex flex-col justify-center items-center animate-wiggle cursor-pointer">
            <span className="text-[#067598]">Panggil aku</span>
            <span className="text-[#3db8dd]">"RoboBook"</span>
          </div>
        </div>
      </Link>
    </div>
  );
}