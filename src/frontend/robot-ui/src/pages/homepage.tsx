import { useState } from "react";
import { Link } from "react-router";

export default function HomePage() {


    const welcome = () => {

      function StartClick() {
        console.log("Pindah")
      }
    
      return (
        <Link to="/select">
        <div className="min-w-screen min-h-screen flex justify-center items-center text-center bg-[#3db8dd] select-none" onClick={StartClick}>
          <div className="text-8xl bg-white aspect-square rounded-full flex flex-col justify-center items-center animate-wiggle">
            <span className="text-[#067598]"> Pangil aku</span>
            <span className="text-[#3db8dd]">"RoboBook"</span>
          </div>
        </div>
        </Link>
      );
    };




  return (
    <>
    {welcome()}
    </>
  );
}






