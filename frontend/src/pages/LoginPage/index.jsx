import SinginForm from "./components/SinginForm";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context";

const LoginPage = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if(context.token) {
      navigate('/');
    }
  }, [context.token, navigate])
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
                <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
