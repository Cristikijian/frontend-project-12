import React, { useState } from "react";

const UserContext = React.createContext({});

const UserContextProvider = ({ children }) => {
  const [ context, setContext ] = useState({
    token: window.localStorage.getItem('token'),
    username: '',
  });

  return (
    <UserContext.Provider value={{ ...context, setContext }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider};