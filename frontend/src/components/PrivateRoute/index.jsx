import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context';
import { appRoutes } from '../../routes';

const PrivateRoute = (props) => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate(appRoutes.login);
    }
  });
  return props.children;
};

export default PrivateRoute;
