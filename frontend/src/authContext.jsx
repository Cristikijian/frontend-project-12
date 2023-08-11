import React, { useState } from 'react';

const UserContext = React.createContext({});

const UserContextProvider = ({ children }) => {
  const [context, setContext] = useState({
    token: window.localStorage.getItem('token'),
    username: window.localStorage.getItem('username'),
  });

  const updateUser = (token, username) => {
    setContext({ token, username });
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('username', username);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ ...context, setContext, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
