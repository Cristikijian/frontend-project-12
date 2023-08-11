import React from 'react';

const SocketsContext = React.createContext({});

const SocketsContextProvider = ({ children, sockets }) => (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <SocketsContext.Provider value={sockets}>
    {children}
  </SocketsContext.Provider>
);

export { SocketsContext, SocketsContextProvider };
