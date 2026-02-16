import React from "react";
import logo from "../../assets/flowva_logo.png"; 
import "./loader.css"
const FlowvaLoader: React.FC = () => {
  return (
    <div className="logo-loader-container">
      <div className="logo-glow-wrapper animate-pulse">
        <img src={logo} alt="Flowva Logo" className="logo-image" />
        <div className="lightning-sweep"></div>
      </div>
    </div>
  );
};

export default FlowvaLoader;