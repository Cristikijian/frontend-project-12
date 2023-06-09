import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context';

const Header = () => {
  const context = useContext(UserContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setContext, token } = context;
  const handleSignOut = () => {
    setContext({ ...context, token: null, username: null });
    window.localStorage.clear();
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
