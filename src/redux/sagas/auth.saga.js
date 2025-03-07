import { takeLatest, all, put, call, delay, select } from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchUserInfo,
  changePassword,
} from '@/redux/ducks/auth.duck';
import { getOidcUser } from '@/redux/ducks/oidc.duck';
import { api } from '@/services';
import { userManager } from '@/providers/OidcProvider';
import { MANAGEMENT_PERMISSIONS } from '@/constants/claimTypes';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.IDENTITY });

function* onFetchUserInfoFlow() {
  yield takeLatest(fetchUserInfo, function* onFetchUserInfo() {
    yield put(setFetching());
    try {
      const user = yield call(api.identity.get, 'connect/userinfo');
      const oidcUser = yield select(getOidcUser);
      const tokenDecode = jwtDecode(oidcUser.access_token);
      yield put(
        requestSuccess({
          response: {
            user: {
              ...user,
              [MANAGEMENT_PERMISSIONS]:
                (tokenDecode[MANAGEMENT_PERMISSIONS] &&
                  tokenDecode[MANAGEMENT_PERMISSIONS].split('|').map(Number)) ||
                [],
            },
            success: false,
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error, dismiss: true }));
    }
  });
}

function* onChangePasswordFlow() {
  yield takeLatest(changePassword, function* onChangePassword({
    payload: { data },
  }) {
    yield put(setFetching());
    try {
      yield call(api.identity.post, 'api/Account/ChangePassword', data);
      yield put(requestSuccess({ user: null }));
      yield delay(1500);
      const user = yield select(getOidcUser);
      userManager.removeUser();
      userManager.signoutRedirect({ id_token_hint: user && user.id_token });
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

export default function* authSaga() {
  yield all([onFetchUserInfoFlow(), onChangePasswordFlow()]);
}
