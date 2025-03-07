import {
  takeLatest,
  all,
  put,
  call,
  select,
  delay,
  throttle,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import moment from 'moment';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchAccounts,
  fetchAccount,
  addAccount,
  updateAccount,
  deleteAccount,
  setAccountStatus,
  setPasswordChangeStatus,
  fecthTemporaryPassword,
  resetTemporaryPassword,
  getAccountSelected,
  softDeleteAccount,
} from '@/redux/ducks/accounts.duck';
import { api } from '@/services';
import { PATHS, USER_ACCOUNTS } from '@/constants';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { PATHS as DASHBOARD_PATHS } from '@/containers/Dashboard/constants';
import { odataFilter } from '@/utils';
import { STATUSES } from '@/constants/userAccounts';

import { getCurrentUser } from '../ducks/auth.duck';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.IDENTITY });

function* onGetAccountsFlow() {
  yield takeLatest(fetchAccounts, function* onGetAccounts({
    payload: { page, rowPerPage, filters },
  }) {
    yield put(setFetching());
    try {
      const newFilters = {
        ...filters,
        ignoredStatus: STATUSES.DELETED.alias,
      };
      const filtersOdata = odataFilter.compile(newFilters, {
        role: odataFilter.types.equal,
        status: odataFilter.types.equal,
        email: odataFilter.types.containsCaseInsensitive,
        name: odataFilter.types.containsCaseInsensitive,
        surname: odataFilter.types.containsCaseInsensitive,
        ignoredStatus: odataFilter.types.notEqual,
      }, {
        ignoredStatus: 'status',
      });
      const data = yield call(api.identity.get, 'odata/UserQuery', {
        ...filtersOdata,
        $orderby: 'name',
        $skip: (page - 1) * rowPerPage,
        $top: rowPerPage,
        $count: true,
      });
      yield put(
        requestSuccess({
          response: { data: data.value, total: data['@odata.count'] },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onGetAccountFlow() {
  yield takeLatest(fetchAccount, function* onGetAccount({
    payload: { id, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const account = yield call(api.identity.get, `api/user/${id}`);
      const currentUser = yield select(getCurrentUser);
      // Not allow edit Administrator
      // Not allow ROLE MANAGER edit account MANAGER
      if (
        account.role === USER_ACCOUNTS.ROLES.ADMIN.alias ||
        (currentUser &&
          currentUser.role === USER_ACCOUNTS.ROLES.MANAGER.alias &&
          account.role === USER_ACCOUNTS.ROLES.MANAGER.alias)
      ) {
        throw new Error('Can not access this page');
      }
      const author = yield call(
        api.identity.get,
        `api/user/${account.createdByUserId}`,
      );
      yield callback(true);
      yield put(
        requestSuccess({
          response: {
            selectedAccount: { ...account, id, createdBy: { ...author } },
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error, dismiss: true }));
      yield put(replace(PATHS.NOT_FOUND));
    }
  });
}

function* onAddNewAccountFlow() {
  yield takeLatest(addAccount, function* onAddNewAccout({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const id = yield call(api.identity.post, 'api/user', {
        ...data,
        fullName: `${data.name} ${data.surname}`,
      });
      yield callback(true);
      yield put(requestSuccess());
      yield delay(1000);
      yield put(replace(DASHBOARD_PATHS.USER_ACCOUNTS_EDIT.replace(':id', id)));
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onUpdateAccountFlow() {
  yield takeLatest(updateAccount, function* onUpdateAccount({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const { id, ...updatedData } = data;
      yield call(api.identity.post, `api/user/${id}`, updatedData);
      yield callback(true);
      yield put(requestSuccess());
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onDeleteAccountFlow() {
  yield throttle(5000, deleteAccount, function* onDeleteAccount({
    payload: { id, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.identity.delete, `api/user/${id}`);
      yield callback(true);
      yield put(requestSuccess());
      yield delay(1000);
      yield put(replace(DASHBOARD_PATHS.USER_ACCOUNTS));
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onSoftDeleteAccountFlow() {
  yield throttle(5000, softDeleteAccount, function* onSoftDeleteAccount({
    payload: { id, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.identity.post, `api/user/softDelete/${id}`);
      yield callback(true);
      yield put(requestSuccess());
      yield delay(1000);
      yield put(replace(DASHBOARD_PATHS.USER_ACCOUNTS));
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onSetAccountStatusFlow() {
  yield throttle(5000, setAccountStatus, function* onSetAccountStatus({
    payload: { id, active, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.identity.post, `api/user/${id}/active`, { active });
      const selectedAccount = yield select(getAccountSelected);
      yield callback(true);
      yield put(
        requestSuccess({
          response: {
            selectedAccount: {
              ...selectedAccount,
              status: active
                ? USER_ACCOUNTS.STATUSES.ACTIVE.alias
                : USER_ACCOUNTS.STATUSES.DEACTIVATED.alias,
            },
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield callback(false);
      yield put(requestFailed({ error }));
    }
  });
}

function* onGetTemporaryPasswordFlow() {
  yield takeLatest(fecthTemporaryPassword, function* onGetTemporaryPassword({
    payload: { id, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      const temporaryPasswordData = yield call(
        api.identity.get,
        `api/user/${id}/temporaryPassword`,
      );
      yield callback(true);
      yield put(
        requestSuccess({ response: { temporaryPasswordData }, dismiss: true }),
      );
    } catch (error) {
      yield callback(false);
      yield put(
        requestFailed({
          error,
          response: { temporaryPasswordData: null },
          dismiss: true,
        }),
      );
    }
  });
}

function* onResetTemporaryPasswordFlow() {
  yield throttle(
    5000,
    resetTemporaryPassword,
    function* onResetTemporaryPassword({
      payload: { id, callback = () => {} },
    }) {
      yield put(setFetching());
      try {
        const data = yield call(api.identity.post, `api/user/${id}/reset`);
        yield callback(true);
        yield put(
          requestSuccess({
            response: {
              temporaryPasswordData: {
                ...data,
                expirationDate: moment(Date.now()).add(4, 'hours'),
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield callback(false);
        yield put(requestFailed({ error }));
      }
    },
  );
}

function* onSetPasswordChangeStatusFlow() {
  yield throttle(
    5000,
    setPasswordChangeStatus,
    function* onSetPasswordChangeStatus({
      payload: { id, active, callback = () => {} },
    }) {
      yield put(setFetching());
      try {
        yield call(api.identity.post, `api/user/${id}/passwordChangeRequired`, {
          passwordChangeRequired: active,
        });
        const selectedAccount = yield select(getAccountSelected);
        yield callback(true);
        yield put(
          requestSuccess({
            response: {
              selectedAccount: {
                ...selectedAccount,
                passwordChangeRequired: active,
              },
            },
          }),
        );
      } catch (error) {
        yield callback(false);
        yield put(requestFailed({ error }));
      }
    },
  );
}

export default function* accountsSaga() {
  yield all([
    onGetAccountsFlow(),
    onGetAccountFlow(),
    onAddNewAccountFlow(),
    onUpdateAccountFlow(),
    onDeleteAccountFlow(),
    onSoftDeleteAccountFlow(),
    onSetAccountStatusFlow(),
    onGetTemporaryPasswordFlow(),
    onResetTemporaryPasswordFlow(),
    onSetPasswordChangeStatusFlow(),
  ]);
}
