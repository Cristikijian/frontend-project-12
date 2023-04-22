import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
 
 const SigninSchema = Yup.object().shape({
   name: Yup.string()
     .required('Required'),
   password: Yup.string()
     .required('Required'),
 });

const SinginForm = () => (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={SigninSchema}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form className='col-12 col-md-6 mt-3 mt-mb-0'>
      <h1 className='text-center mb-4'>Войти</h1>
        <div className='form-floating mb-3'>
          <Field className="form-control" id="username" name="username" required placeholder="Ваш ник" />
          <label htmlFor="username">Ваш ник</label>
        </div>
        
        <div className='form-floating mb-4'>
          <Field className="form-control" id="password" name="password" required placeholder="Пароль"/>
          <label htmlFor="password">Пароль</label>
        </div>
        
        <button className='w-100 mb-3 btn btn-outline-primary' type="submit">Войти</button>
      </Form>
    </Formik>
);

export default SinginForm;
