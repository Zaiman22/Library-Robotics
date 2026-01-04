import { useState } from "react";

export default function HomePage() {
    const [showNav, setShowNav] = useState(false)


  return (
    <>
    {!showNav ? Navigation(): welcome() }
    </>
  );
}

const welcome = () => {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center text-center bg-[#3db8dd] select-none">
      <div className="text-8xl bg-white aspect-square rounded-full flex flex-col justify-center items-center animate-wiggle">
        <span className="text-[#067598]"> Pangil aku</span>
        <span className="text-[#3db8dd]">"RoboBook"</span>
      </div>
    </div>
  );
};




type navBoxProps = {
  subtitle: string
}
const NavBox = ({subtitle}: navBoxProps) =>{
  return (
    <div className="bg-white">
    <h2>{subtitle}</h2>
    </div>
  )
}


const Navigation = () => {
  return (
    <div className="bg-[#3db8dd] min-w-screen min-h-screen">
      <span>Apa yang bisa RoboBook bantu?</span>
      <div>
        <NavBox subtitle="Aku mau MENGAMBAR" />
        <NavBox subtitle="Saya mau mengobrol" />
        <NavBox subtitle="BACAKAN aku buku" />
        <NavBox subtitle="Saya mau CEK BUKU" />
      </div>
    </div>
  )
}