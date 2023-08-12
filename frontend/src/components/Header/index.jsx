import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../authContext';

const Header = () => {
  const { logout, token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/">{t('chat')}</Link>
        {token && <button type="button" className="btn btn-primary" onClick={handleSignOut}>{t('buttons.logout')}</button>}
      </div>
    </nav>
  );
};

export default Header;
