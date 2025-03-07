import { fork } from 'redux-saga/effects';

import auth from './auth.saga';
import members from './members.saga';
import accounts from './accounts.saga';
import countries from './countries.saga';
import notification from './notification.saga';
import structure from './structure.saga';
import organization from './organization.saga';
import results from './results.saga';
import duplicateOibs from './duplicate-oibs.saga';
import payments from './payments.saga';
import bulkMails from './bulkMails.saga';

export default function* rootSagas() {
  yield fork(auth);
  yield fork(members);
  yield fork(accounts);
  yield fork(countries);
  yield fork(notification);
  yield fork(structure);
  yield fork(organization);
  yield fork(results);
  yield fork(duplicateOibs);
  yield fork(payments);
  yield fork(bulkMails);
}
