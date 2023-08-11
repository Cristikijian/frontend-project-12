import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../authContext';
import SinginForm from './components/SinginForm';

const LoginPage = () => {
  const { token } = useContext(UserContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="/LoginPage.jpg" className="rounded-circle" alt="Войти" />
              </div>
              <SinginForm />
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('questions.noAccount')}</span>
                {' '}
                <a href="/signup">{t('registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
