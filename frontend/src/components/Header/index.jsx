import React from "react";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
  <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
    <div className="container">
      <Link className="navbar-brand" to="/">Hexlet Chat</Link>
      <button type="button" className="btn btn-primary">Выйти</button>
    </div>
  </nav>);
};

export default Header
