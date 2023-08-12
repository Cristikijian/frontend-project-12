import React, { useState } from 'react';

const AuthContext = React.createContext({});

const AuthContextProvider = ({ children }) => {
  const [context, setContext] = useState({
    token: window.localStorage.getItem('token'),
    username: window.localStorage.getItem('username'),
  });

  const login = (token, username) => {
    setContext({ token, username });
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('username', username);
  };

  const logout = () => {
    setContext({ token: null, username: null });
    window.localStorage.clear();
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      ...context, setContext, login, logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
