import { routerMiddleware, connectRouter } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux';
import { reducer as odicReducer } from 'redux-oidc';
import { reducer as formReducer } from 'redux-form';
import { INTL_LOCALE, SUPPORTED_LANGUAGES } from 'AppConfigs';
import history from '@/history';
import message from '@/intl';
import { localStorage } from '@/services';
import { STORAGE } from '@/constants';

import rootSagas from './sagas';
import rootDucks from './ducks';
import { loggerMiddleware } from './middlewares';

const storageLanguage = localStorage.getItem(STORAGE.LOCALE);
const locale =
  storageLanguage && SUPPORTED_LANGUAGES.includes(storageLanguage)
    ? storageLanguage
    : INTL_LOCALE;

/**
 * Initial redux saga state
 */
const initialState = {
  intl: { locale, messages: message[locale] },
};
/**
 * More infomation read here
 * https://redux-saga.js.org/docs/api/#createsagamiddlewareoptions
 */
const sagaMiddleware = createSagaMiddleware();
/**
 * Using Redux DevTools Extension to debug Redux's state on browser
 * https://github.com/zalmoxisus/redux-devtools-extension
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/**
 * Add external middlewares connect to Redux store
 */
const middlewares = [
  loggerMiddleware,
  routerMiddleware(history),
  sagaMiddleware,
];
const rootReducers = combineReducers({
  router: connectRouter(history),
  intl: intlReducer,
  oidc: odicReducer,
  form: formReducer,
  ...rootDucks,
});
/**
 * Redux store
 */
const store = createStore(
  rootReducers,
  initialState,
  composeEnhancers(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(rootSagas);
export default store;
