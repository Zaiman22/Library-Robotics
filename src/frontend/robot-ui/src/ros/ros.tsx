import * as ROSLIB from "roslib";



const ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

ros.on("connection", () => {
  console.log("Connected to rosbridge");
});

ros.on("error", (error) => {
  console.error("ROS connection error:", error);
});

ros.on("close", () => {
  console.log("ROS connection closed");
});

export const uiRouteTopic = new ROSLIB.Topic({
  ros,
  name: "/ui/route",
  messageType: "std_msgs/String",
});


export const uiSTTInput = new ROSLIB.Topic({
  ros,
  name: "/ui/stt",
  messageType: "std_msgs/String",
});


export const uiKWSInput = new ROSLIB.Topic({
  ros,
  name: "/ui/kws",
  messageType: "std_msgs/String",
});

export const POIState = new ROSLIB.Topic({
  ros,
  name: "/POI/existance",
  messageType: "person_of_interest_msgs/msg/PersonOfInterestState",
});

export default ros;
