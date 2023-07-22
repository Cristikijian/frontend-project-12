import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserContext } from '../../../../context';
import { apiRoutes } from '../../../../routes';

const SignUpForm = () => {
  const [userCreationError, setError] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const SignUpSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('errors.required'))
      .trim()
      .min(3, t('errors.min3'))
      .max(20, t('errors.max')),
    password: Yup.string()
      .required(t('errors.required'))
      .trim()
      .min(6, t('errors.min6')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('errors.match')),
  });

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={SignUpSchema}
      onSubmit={async (values) => {
        try {
          const response = await axios.post(
            apiRoutes.signUp,
            { username: values.username, password: values.password },
          );
          updateUser(response.data.token, response.data.username);
          navigate('/');
        } catch (e) {
          setError(true);
        }
      }}
    >
      {({ errors }) => {
        console.log(errors);
        return (
          <Form className="w-50">
            <h1 className="text-center mb-4">{t('registration')}</h1>
            <div className="form-floating mb-3">
              <Field placeholder={t('errors.min3')} name="username" autoComplete="username" id="username" className={cn('form-control', { 'is-invalid': errors.username })} />
              <label className="form-label" htmlFor="username">{t('user.username')}</label>
              <div className="invalid-tooltip">{errors.username}</div>
            </div>
            <div className="form-floating mb-3">
              <Field placeholder={t('errors.min6')} name="password" aria-describedby="passwordHelpBlock" autoComplete="new-password" type="password" id="password" className={cn('form-control', { 'is-invalid': errors.password })} />
              <div className="invalid-tooltip">{errors.password}</div>
              <label className="form-label" htmlFor="password">{t('user.password')}</label>
            </div>
            <div className="form-floating mb-4">
              <Field placeholder={t('match')} name="confirmPassword" autoComplete="new-password" type="password" id="confirmPassword" className={cn('form-control', { 'is-invalid': errors.confirmPassword || userCreationError })} />
              <div className="invalid-tooltip">
                {userCreationError ? t('errors.exists') : null}
                {errors.confirmPassword}
              </div>
              <label className="form-label" htmlFor="confirmPassword">{t('user.confirmPassword')}</label>
            </div>
            <Button variant="outline-primary" type="submit" className="w-100">{t('buttons.registration')}</Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SignUpForm;
