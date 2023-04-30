import React from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";

const Layout = () => {


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