import React from "react";
import logo from "../assets/media/logo.webp";

function Maintenance() {
  return (
    <div className="maintenance-container">
      <img src={logo} alt="logo"/>
      <h1>Site em Manutenção</h1>
      <h2>Em breve voltaremos com muitas novidades.</h2>
      <p>Agradecemos sua paciência!</p>
    </div>
  );
}

export default Maintenance;