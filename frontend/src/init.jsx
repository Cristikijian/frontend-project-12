import 'bootstrap/dist/css/bootstrap.css';
import i18next from 'i18next';
import leoProfanity from 'leo-profanity';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import resources from './locales/index.js';
import store from './slices';

const init = () => {
  const ruDict = leoProfanity.getDictionary('ru');
  leoProfanity.add(ruDict);

  const i18n = i18next.createInstance();
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <App i18n={i18n} />
    </Provider>,
  );
};

export default init;
