import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../../context';
import { useNavigate } from "react-router-dom";

const SigninSchema = Yup.object().shape({
   username: Yup.string()
     .required('Required'),
   password: Yup.string()
     .required('Required'),
 });

const SinginForm = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
    return <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={SigninSchema}
      onSubmit={async (values) => {
        try {
          const response = await axios.post('/api/v1/login', values);
          context.setContext({token: response.data.token, username: response.data.username});
          console.log(context);
          window.localStorage.setItem('token', response.data.token);
          console.log(response.data);
          navigate('/');
        }
        catch (e) {
          console.error(e);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className='col-12 col-md-6 mt-3 mt-mb-0'>
          <h1 className='text-center mb-4'>Войти</h1>
            <div className='form-floating mb-3'>
              <Field className="form-control" id="username" name="username" placeholder="Ваш ник" />
              <label htmlFor="username">Ваш ник</label>
            </div>
            
            <div className='form-floating mb-4'>
              <Field className="form-control" id="password" name="password" placeholder="Пароль"/>
              <label htmlFor="password">Пароль</label>
            </div>
            
            <button className='w-100 mb-3 btn btn-outline-primary' type="submit">Войти</button>
        </Form>
      )}
    </Formik>
};

export default SinginForm;
