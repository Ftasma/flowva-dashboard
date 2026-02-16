import React from "react";
import logo from "../../assets/logo.svg";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center mb-2">
      <img src={logo} alt="Logo" className="mb-2 size-16" />
    </div>
  );
};

export default Logo;
