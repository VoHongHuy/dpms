import { takeLatest, all, put, call, select } from 'redux-saga/effects';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchCountries,
  getCountries,
} from '@/redux/ducks/countries.duck';
import { api } from '@/services';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.IDENTITY });

function* onGetCountriesFlow() {
  yield takeLatest(fetchCountries, function* onGetCountries() {
    yield put(setFetching());
    const countries = yield select(getCountries);

    if (countries.length === 0) {
      try {
        const data = yield call(
          api.get,
          // eslint-disable-next-line max-len
          'api/country?$expand=Counties($expand=Municipalities($expand=Settlements($expand=Districts)))',
          undefined,
        );
        yield put(
          requestSuccess({ response: { data: data.value }, dismiss: true }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    }
  });
}

export default function* membersSaga() {
  yield all([onGetCountriesFlow()]);
}
