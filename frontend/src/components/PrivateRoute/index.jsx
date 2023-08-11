import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../authContext';
import { appRoutes } from '../../routes';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate(appRoutes.login);
    }
  });
  return token ? children : null;
};

export default PrivateRoute;
