import {
  takeLatest,
  all,
  put,
  call,
} from 'redux-saga/effects';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchDuplicateOibMembers,
} from '@/redux/ducks/duplicate-oibs.duck';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { api } from '@/services';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.MANAGEMENT });

function* onGetDuplicateOibMembersFlow() {
  yield takeLatest(fetchDuplicateOibMembers, function* onGetDuplicateOibMembers() {
    yield put(setFetching());
    try {
      const data = yield call(api.get, 'api/DuplicateOibMember');
      yield put(
        requestSuccess({
          response: { data },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

export default function* duplicateOibsSaga() {
  yield all([
    onGetDuplicateOibMembersFlow(),
  ]);
}
