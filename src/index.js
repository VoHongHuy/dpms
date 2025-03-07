import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-datepicker/dist/react-datepicker.css';
import '@/assets/font-icons/style.css';
import './styles';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'react-intl-redux';

import App from './App';
import history from './history';
import { store } from './redux';
import { NotificationProvider } from './providers';
import OidcProvider, { loadUser } from './providers/OidcProvider';
import * as serviceWorker from './serviceWorker';

loadUser(store);

/**
 * both Provider and ConnectedRouter to make sure that the ConnectedRouter
 * doesn't pick up a different ReactReduxContext from
 * a different node_modules folder.
 * https://github.com/supasate/connected-react-router#development
 */
ReactDOM.render(
  <Provider store={store} context={ReactReduxContext}>
    <ConnectedRouter history={history} context={ReactReduxContext}>
      <OidcProvider store={store}>
        <IntlProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </IntlProvider>
      </OidcProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
