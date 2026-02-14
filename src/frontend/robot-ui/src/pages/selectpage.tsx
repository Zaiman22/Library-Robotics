import micIcon from "../assets/mic-icon.png";
import * as ROSLIB from "roslib";
import ros from "../ros/ros"

export default function SelectPage() {


  const Navigation = () => {
    return (
      <div className="bg-[#3db8dd] min-w-screen min-h-screen p-10 content-center">
        <h1 className="text-8xl font-extrabold text-center m-20">
          Apa yang bisa RoboBook bantu?
        </h1>
        <div className="grid grid-cols-2 gap-4 m-5">
          <NavBox subtitle="Aku mau MENGAMBAR" />
          <NavBox subtitle="Saya mau mengobrol" />
          <NavBox subtitle="BACAKAN aku buku" />
          <NavBox subtitle="Saya mau CEK BUKU" />
        </div>
        <img
          src={micIcon}
          alt="Mic Icon"
          className="box size-80 my-35 bg-white rounded-full p-10 mx-auto"
        />
      </div>
    );
  };

  type NavBoxProps = {
    subtitle: string;
  };

  const NavBox = ({ subtitle }: NavBoxProps) => {
    return (
      <div className="bg-white p-10 text-center rounded-2xl text-4xl">
        <h2>{subtitle}</h2>
      </div>
    );
  };

  return <>{Navigation()}</>;
}
