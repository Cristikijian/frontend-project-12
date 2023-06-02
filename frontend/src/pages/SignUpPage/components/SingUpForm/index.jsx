import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const SignUpSchema = Yup.object().shape({
   username: Yup.string()
     .required('Required')
     .min(3, 'Имя должно быть не короче 3 символов')
     .max(20, 'Имя должно быть не длиннее 20 символов'),
   password: Yup.string()
     .required('Required')
     .min(6, 'Не короче 6 символов'),
   confirmPassword: Yup.string()
     .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
 });

const SignUpForm = () => {
  const [ userCreationError, setError ] = useState();
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
          if (response.status === 409) {
            setError('Такой пользователь уже существует');
          }
        }
        catch (e) {
          console.error(e);
        }
      }}
    >
      {({ errors, touched }) => (
       <Form className="w-50">
       <h1 className="text-center mb-4">Регистрация</h1>
       <div className="form-floating mb-3">
          <Field placeholder="От 3 до 20 символов" name="username" autocomplete="username" required="" id="username" className="form-control is-invalid"/><label className="form-label" for="username">Имя пользователя</label>
          <div placement="right" className="invalid-tooltip">Обязательное поле</div>
       </div>
       <div className="form-floating mb-3">
          <Field placeholder="Не менее 6 символов" name="password" aria-describedby="passwordHelpBlock" required="" autocomplete="new-password" type="password" id="password" className="form-control" />
          <div className="invalid-tooltip">Обязательное поле</div>
          <label className="form-label" for="password">Пароль</label>
       </div>
       <div class="form-floating mb-4">
          <Field placeholder="Пароли должны совпадать" name="confirmPassword" required="" autocomplete="new-password" type="password" id="confirmPassword" className="form-control"/>
          <div className="invalid-tooltip"></div>
          <label className="form-label" for="confirmPassword">Подтвердите пароль</label>
       </div>
       <button type="submit" className="w-100 btn btn-outline-primary">Зарегистрироваться</button>
    </Form>
      )}
    </Formik>
};

export default SignUpForm;
