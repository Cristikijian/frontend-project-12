import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { UserContext } from '../../../../context';
import { apiRoutes } from '../../../../routes';

const SinginForm = () => {
  const { setContext } = useContext(UserContext);
  const [signInError, setError] = useState();
  const { t } = useTranslation();

  const SigninSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('errors.required')),
    password: Yup.string()
      .required(t('errors.required')),
  });
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={SigninSchema}
      onSubmit={async (values) => {
        try {
          const response = await axios.post(apiRoutes.login, values);
          setContext({ token: response.data.token, username: response.data.username });
          console.log(response.data);
          window.localStorage.setItem('token', response.data.token);
          window.localStorage.setItem('username', response.data.username);
        } catch (e) {
          console.error(e);
          if (e.response.status === 401) {
            console.log(e.response.status, 'status');
            setError(true);
            console.log(e);
          }
        }
      }}
    >
      {() => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">{t('signIn')}</h1>
          <div className="form-floating mb-3">
            <Field className={cn('form-control', { 'is-invalid': signInError })} id="username" name="username" placeholder="Ваш ник" required />
            <label htmlFor="username">{t('user.nickname')}</label>
          </div>

          <div className="form-floating mb-4">
            <Field className={cn('form-control', { 'is-invalid': signInError })} id="password" name="password" placeholder="Пароль" required />
            <label htmlFor="password">{t('user.password')}</label>
            <div className="invalid-tooltip">{signInError ? t('errors.auth') : null}</div>
          </div>

          <button className="w-100 mb-3 btn btn-outline-primary" type="submit">{t('buttons.signin')}</button>
        </Form>
      )}
    </Formik>
  );
};

export default SinginForm;
