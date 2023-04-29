import React, { useEffect } from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../context";
import { useContext } from "react";

const Layout = () => {
  const context = useContext(UserContext);
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if(!context.token && token) {
      context.setContext({...context, token});
    }
  });

  return <div className="h-100">
  <div className="h-100" id="chat">
    <div className="d-flex flex-column h-100">
      <Header />
      <Outlet />
    </div>
  </div>
</div>
};

export default Layout;