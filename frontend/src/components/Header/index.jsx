import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context";

const Header = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const handleSignOut = () => {
    context.setContext({...context, token: null, username: null});
    window.localStorage.clear();
    navigate('/login');
  }
  return (
  <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
    <div className="container">
      <Link className="navbar-brand" to="/">Hexlet Chat</Link>
      {context.token && <button type="button" className="btn btn-primary" onClick={handleSignOut}>Выйти</button>}
    </div>
  </nav>);
};

export default Header;
