import React, { useState } from "react";
const contextData = {
  token: null,
  username: '',
};

const UserContext = React.createContext(contextData);

const UserContextProvider = ({ children }) => {
  const [ context, setContext ] = useState(contextData);

  return (
    <UserContext.Provider value={{ ...context, setContext }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, contextData, UserContextProvider};