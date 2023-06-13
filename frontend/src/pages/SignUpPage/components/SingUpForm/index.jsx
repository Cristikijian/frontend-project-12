import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { UserContext } from '../../../../context';


const SignUpForm = () => {
  const [ userCreationError, setError ] = useState(false);
  const context = useContext(UserContext);
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
     .oneOf([Yup.ref('password'), null],  t('errors.match'))
 });
 
    return <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={SignUpSchema}
      onSubmit={async (values) => {
        try {
          const response = await axios.post('/api/v1/signup', { username: values.username, password: values.password });
          context.setContext({token: response.data.token, username: response.data.username});
          console.log(context);
          window.localStorage.setItem('token', response.data.token);
          window.localStorage.setItem('username', response.data.username);
          if(response.statusText === 'Created') {
            navigate('/');
          }
          console.log(response);
        }
        catch (e) {
          console.log(e, 'err');
          if(e.response.status === 409) {
            setError(true);
            console.log(e);
          }
        }
      }}
    >
      {({ errors, touched }) => { 
        console.log(errors); 
        return (
       <Form className="w-50">
       <h1 className="text-center mb-4">{t('registration')}</h1>
       <div className="form-floating mb-3">
          <Field placeholder="От 3 до 20 символов" name="username" autoComplete="username" id="username" className={cn('form-control', {'is-invalid': errors.username})}/>
          <label className="form-label" htmlFor="username">{t('user.username')}</label>
          <div className="invalid-tooltip">{errors.username}</div>
       </div>
       <div className="form-floating mb-3">
          <Field placeholder="Не менее 6 символов" name="password" aria-describedby="passwordHelpBlock" autoComplete="new-password" type="password" id="password" className={cn('form-control', {'is-invalid': errors.password})} />
          <div className="invalid-tooltip">{errors.password}</div>
          <label className="form-label" htmlFor="password">{t('user.password')}</label>
       </div>
       <div className="form-floating mb-4">
          <Field placeholder="Пароли должны совпадать" name="confirmPassword" autoComplete="new-password" type="password" id="confirmPassword" className={cn('form-control', {'is-invalid': errors.confirmPassword || userCreationError})}/>
          <div className="invalid-tooltip">{userCreationError ? t('errors.exists') : null}{errors.confirmPassword}</div>
          <label className="form-label" htmlFor="confirmPassword">{t('user.confirmPassword')}</label>
       </div>
       <Button variant="outline-primary" type="submit"className="w-100">{t('buttons.registration')}</Button>
    </Form>
      )}}
    </Formik>
};

export default SignUpForm;
