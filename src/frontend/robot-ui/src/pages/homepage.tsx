import { useState } from "react";
import { Link } from "react-router";
import ros from "../ros/ros"
import * as ROSLIB from "roslib";


// First, we create a Topic object with details of the topic's name and message type.
var cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: "/cmd_vel",
  messageType: "geometry_msgs/Twist",
});

// Then we create the payload to be published. The object we pass in to ros.Message matches the
// fields defined in the geometry_msgs/Twist.msg definition.
var twist = {
  linear: {
    x: 0.1,
    y: 0.2,
    z: 0.3,
  },
  angular: {
    x: -0.1,
    y: -0.2,
    z: -0.3,
  },
};



export default function HomePage() {


  const welcome = () => {

    function StartClick() {
      console.log("Pindah")
      // And finally, publish.
      cmdVel.publish(twist);
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






