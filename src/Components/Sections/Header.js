import React from "react";
import "./Header.css";

function Header(props) {
  return (
    <header className="header pad">
      <img className="header__logo" src={process.env.PUBLIC_URL + "/International_Pokemon_logo.svg"}/><h1 className="header__title">Build your ultimate team</h1>
    </header>
  );
}

export default Header;
